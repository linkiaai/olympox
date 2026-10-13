/** Read an ASCII API secret from a real terminal without echoing its bytes. */
export function readSecret({ input = process.stdin, outputStream = process.stdout, prompt = 'API key (hidden): ', maxLength = 4096 } = {}) {
  if (!input?.isTTY || !outputStream?.isTTY || typeof input.setRawMode !== 'function') return Promise.reject(new Error('Hidden credential input requires a private interactive terminal.'));
  if (input.listenerCount?.('data')) return Promise.reject(new Error('Hidden credential input requires exclusive private terminal input.'));
  if (!Number.isSafeInteger(maxLength) || maxLength < 1 || maxLength > 4096) return Promise.reject(new Error('Invalid hidden input limit.'));
  return new Promise((resolve, reject) => {
    const bytes = [], wasRaw = Boolean(input.isRaw), wasPaused = input.isPaused?.() ?? false, wasFlowing = input.readableFlowing === true;
    let finished = false;
    function finish(value, error = null) {
      if (finished) return; finished = true;
      input.removeListener('data', data); input.removeListener('end', end); input.removeListener('error', failed); process.removeListener('SIGINT', interrupted);
      bytes.fill(0); bytes.length = 0;
      try { input.setRawMode(wasRaw); if (wasPaused || !wasFlowing) input.pause(); else input.resume(); outputStream.write('\n'); }
      catch { if (!error) error = new Error('Hidden credential input could not restore its terminal.'); }
      if (error) reject(error); else resolve(value);
    }
    function interrupted() { finish(null); }
    function end() { finish(null); }
    function failed() { finish(null, new Error('Hidden credential input was interrupted.')); }
    function data(chunk) {
      const incoming = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8');
      for (let index = 0; index < incoming.length; index++) {
        const byte = incoming[index];
        if (byte === 3 || byte === 4) { finish(null); return; }
        if (byte === 10 || byte === 13) {
          if (incoming.subarray(index + 1).some(value => value !== 10 && value !== 13)) { finish(null, new Error('Hidden credential input must contain one line.')); return; }
          finish(Buffer.from(bytes).toString('ascii')); return;
        }
        if (byte === 8 || byte === 127) { bytes.pop(); continue; }
        if (byte < 33 || byte > 126) { finish(null, new Error('Hidden credential input contains unsupported characters.')); return; }
        if (bytes.length >= maxLength) { finish(null, new Error('Hidden credential input exceeds its bounded limit.')); return; }
        bytes.push(byte);
      }
    }
    try {
      // Keep pending terminal input stopped until protected mode and handlers exist.
      input.pause(); input.setRawMode(true);
      input.on('data', data); if (finished) return;
      input.once('end', end); if (finished) return;
      input.once('error', failed); if (finished) return;
      process.once('SIGINT', interrupted); if (finished) return;
      outputStream.write(prompt);
      if (!finished) input.resume();
    } catch { finish(null, new Error('Hidden credential input could not start.')); }
  });
}

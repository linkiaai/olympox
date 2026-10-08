/* Explicit locale selection. Browser language never changes the English default. */
(() => {
  const storageKey = 'olympox.manual.locale';
  const supported = ['en', 'pt-BR'];
  function readStored(storage) {
    // Preserve the user's explicit choice from the manual's previous name.
    try { return storage.getItem(storageKey) ?? storage.getItem('ai-influencers.manual.locale'); }
    catch { return null; }
  }
  function select(search = '', stored = null) {
    const requested = new URLSearchParams(search).get('lang');
    if (requested !== null) return supported.includes(requested) ? requested : 'en';
    return supported.includes(stored) ? stored : 'en';
  }
  function message(messages, key, values = {}) {
    if (typeof messages[key] !== 'string') throw new Error(`Missing manual UI message: ${key}`);
    return messages[key].replace(/\{([a-zA-Z]+)\}/g, (_, variable) => String(values[variable] ?? `{${variable}}`));
  }
  function routeMap(data) {
    const entries = [];
    for (const guide of data.guides) {
      const route = guide.section ?? `guide/${encodeURIComponent(guide.path)}`;
      entries.push([guide.path, route]);
      for (const translatedPath of Object.values(guide.translations ?? {})) entries.push([translatedPath, route]);
    }
    for (const [collection, prefix] of [['roles', 'agent'], ['tasks', 'task'], ['workflows', 'workflow']]) for (const item of data[collection]) entries.push([item.path, `${prefix}/${item.id}`]);
    for (const template of data.templates) {
      const route = `source/${encodeURIComponent(template.path)}`;
      entries.push([template.path, route]);
      for (const [locale, translated] of Object.entries(data.locales ?? {})) {
        const candidate = translated.templates.find(item => item.path === template.path);
        if (candidate?.sourcePath) entries.push([candidate.sourcePath, route]);
      }
    }
    return Object.fromEntries(entries);
  }
  globalThis.StudioLocale = { storageKey, supported, readStored, select, message, routeMap };
})();

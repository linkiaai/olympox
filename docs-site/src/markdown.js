/* Markdown subset for local guides. Raw HTML always remains text. */
(() => {
  let labels = { copy: 'Copy', codeText: 'text', table: 'Table', localReference: 'Local reference outside this manual' };
  const setLabels = next => { labels = { ...labels, ...next }; };
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const slug = value => value.replace(/[`*]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function resolveLink(target, source, routes) {
    if (/^https?:\/\//i.test(target)) return { href: target, external: true };
    if (!target || /[\\\u0000-\u0020]/.test(target) || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/')) return null;
    const [file, anchor] = target.split('#');
    const parts = source.split('/').slice(0, -1);
    if (file) for (const part of file.split('/')) {
      if (part === '..') { if (!parts.length) return null; parts.pop(); }
      else if (part && part !== '.') parts.push(part);
    }
    const normalized = file ? parts.join('/') : source;
    const route = routes[normalized];
    if (!route) return null;
    const sourceLocale = /^(?:docs|templates)\/locales\/pt-BR\//.test(source) ? 'pt-BR' : 'en';
    const targetLocale = /^(?:docs|templates)\/locales\/pt-BR\//.test(normalized) ? 'pt-BR' : 'en';
    const fragment = `#${route}${anchor ? `~${slug(anchor)}` : ''}`;
    return file && sourceLocale !== targetLocale
      ? { href: `?lang=${targetLocale}${fragment}`, external: false, locale: targetLocale }
      : { href: fragment, external: false };
  }
  function inline(text, source, routes) {
    const expression = /`([^`]+)`|!?\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let output = '', previous = 0;
    for (const match of text.matchAll(expression)) {
      output += escape(text.slice(previous, match.index));
      if (match[1]) output += `<code>${escape(match[1])}</code>`;
      else if (match[2]) {
        const link = resolveLink(match[3], source, routes);
        const label = escape(match[2]);
        output += link ? `<a href="${escape(link.href)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}${link.locale ? ` data-locale="${escape(link.locale)}"` : ''}>${label}</a>` : `<span class="local-reference" title="${escape(labels.localReference)}">${label}</span>`;
      } else if (match[4]) output += `<strong>${inline(match[4], source, routes)}</strong>`;
      else if (match[5]) output += `<em>${escape(match[5])}</em>`;
      previous = match.index + match[0].length;
    }
    return output + escape(text.slice(previous));
  }
  function render(markdown, source = '', routes = {}) {
    const lines = markdown.replace(/\r/g, '').split('\n');
    const html = [], headings = [], duplicates = new Map();
    const cell = line => line.trim().replace(/^\||\|$/g, '').split('|').map(value => value.trim());
    for (let i = 0; i < lines.length;) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (/^```/.test(line)) {
        const language = line.slice(3).trim(); const code = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
        i++;
        html.push(`<div class="code-block"><div class="code-header"><span>${escape(language || labels.codeText)}</span><button type="button" class="copy-code">${escape(labels.copy)}</button></div><pre><code>${escape(code.join('\n'))}</code></pre></div>`); continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        const base = slug(heading[2]); const count = duplicates.get(base) ?? 0; duplicates.set(base, count + 1);
        const id = `heading-${base}${count ? `-${count}` : ''}`;
        html.push(`<h${heading[1].length} id="${id}">${inline(heading[2], source, routes)}</h${heading[1].length}>`);
        headings.push({ id, text: heading[2].replace(/[`*]/g, ''), level: heading[1].length }); i++; continue;
      }
      if (/^\s*\|/.test(line) && /^\s*\|?[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) {
        const headers = cell(line); i += 2; const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cell(lines[i++]));
        html.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="${escape(labels.table)}"><table><thead><tr>${headers.map(value => `<th>${inline(value, source, routes)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map((_, index) => `<td>${inline(row[index] ?? '', source, routes)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
      }
      if (/^\s*(?:[-*]|\d+\.)\s/.test(line)) {
        const ordered = /^\s*\d+\./.test(line), items = [];
        while (i < lines.length && /^\s*(?:[-*]|\d+\.)\s/.test(lines[i])) {
          let item = lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/, '');
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*(?:[-*]|\d+\.)\s/.test(lines[i])) item += ` ${lines[i++].trim()}`;
          items.push(`<li>${inline(item, source, routes)}</li>`);
        }
        html.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`); continue;
      }
      if (/^>\s?/.test(line)) {
        const quote = []; while (i < lines.length && /^>/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''));
        html.push(`<blockquote>${inline(quote.join(' '), source, routes)}</blockquote>`); continue;
      }
      if (/^---+$/.test(line)) { html.push('<hr>'); i++; continue; }
      const paragraph = [lines[i++]];
      while (i < lines.length && lines[i].trim() && !/^(?:#|```|>|\s*[-*]\s|\s*\d+\.\s|\s*\|)/.test(lines[i])) paragraph.push(lines[i++]);
      html.push(`<p>${inline(paragraph.join(' '), source, routes)}</p>`);
    }
    return { html: html.join('\n'), headings };
  }
  globalThis.StudioMarkdown = { escape, slug, resolveLink, inline, render, setLabels };
})();

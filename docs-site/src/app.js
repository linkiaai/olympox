(() => {
  const canonical = globalThis.STUDIO_DOCS;
  const { escape: e, render, setLabels } = globalThis.StudioMarkdown;
  const { storageKey, readStored, select, message, routeMap } = globalThis.StudioLocale;
  const main = document.querySelector('main');
  const routes = routeMap(canonical);
  const storedLocale = readStored(localStorage);
  let locale = select(location.search, storedLocale);
  let data, roles, tasks, coordinator, summaries, searchable, liveStatus;
  const t = (key, values) => message(data.ui, key, values);
  const guide = section => data.guides.find(item => item.section === section);
  const routeLink = (route, text, className = '') => `<a class="${className}" href="#${e(route)}">${e(text)}</a>`;
  const labels = { document: 'labelDocument', media: 'labelMedia', review: 'labelReview', generation: 'labelGeneration', inspection: 'labelInspection', 'human-decision': 'labelHumanDecision', delivery: 'labelDelivery', prepared: 'labelPrepared', generated: 'labelGenerated', reviewed: 'labelReviewed', delivered: 'labelDelivered', 'human-approved': 'labelHumanApproved' };
  const label = value => labels[value] ? t(labels[value]) : value;
  const chips = task => `<span class="chip">${e(label(task.deliverable))}</span>${task.requiresApprovedCanon ? `<span class="chip">${e(t('approvedCanon'))}</span>` : ''}${task.capability ? `<span class="chip">${e(task.capability)}</span>` : ''}`;
  const pageHeader = (title, description, eyebrow = t('eyebrow')) => `<div class="page-heading"><div class="eyebrow">${e(eyebrow)}</div><h1>${e(title)}</h1>${description ? `<p class="lead">${e(description)}</p>` : ''}</div>`;
  const codeBlock = (text, language = 'json') => `<div class="code-block"><div class="code-header"><span>${e(language)}</span><button type="button" class="copy-code">${e(t('copy'))}</button></div><pre><code>${e(text)}</code></pre></div>`;
  const sourceNote = item => `<div class="source-note">${e(t('source'))} <code>${e(item.sourcePath ?? item.path)}</code></div>`;

  function activateLocale(next) {
    locale = next;
    data = locale === 'en' ? canonical : { ...canonical, ...canonical.locales[locale] };
    roles = Object.fromEntries(data.roles.map(role => [role.id, role]));
    tasks = Object.fromEntries(data.tasks.map(task => [task.id, task]));
    coordinator = roles.master;
    summaries = Object.fromEntries(['overview', 'start', 'team', 'workflows', 'tasks', 'commands', 'sync', 'constitution'].map(key => [key, t(key)]));
    setLabels(data.ui);
    document.documentElement.lang = locale;
    document.querySelector('meta[name="description"]').content = t('metadataDescription');
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
    document.querySelector('#search').placeholder = t('searchPlaceholder');
    document.querySelector('#locale-select').value = locale;
    document.querySelector('#version-label').textContent = t('core', { version: data.version });
    document.querySelector('#revision').textContent = t('revision', { revision: data.fingerprint.slice(0, 12) });
    document.querySelector('#navigation').innerHTML = `<div class="nav-heading">${e(t('navStudio'))}</div>${[
      ['overview', '01'], ['start', '02'], ['team', data.roles.length], ['workflows', data.workflows.length], ['tasks', data.tasks.length], ['commands', data.commands.length]
    ].map(([route, count]) => `<a href="#${route}" data-route="${route}"><span>${e(t(route))}</span><small>${count}</small></a>`).join('')}<div class="nav-heading">${e(t('navGuides'))}</div>${data.guides.filter(item => !item.section).map(item => `<a href="#${routes[item.path]}" data-route="${routes[item.path]}">${e(item.label)}</a>`).join('')}<div class="nav-heading">${e(t('navPrinciples'))}</div><a href="#constitution" data-route="constitution">${e(t('constitution'))}</a><a href="#sync" data-route="sync">${e(t('sync'))}</a>`;
    searchable = [
      ...data.guides.map(item => ({ title: item.label, text: item.markdown, route: routes[item.path], kind: t('guideKind') })),
      ...data.roles.map(item => ({ title: item.name, text: `${item.title} ${item.markdown}`, route: `agent/${item.id}`, kind: t('teamKind') })),
      ...data.tasks.map(item => ({ title: item.name, text: `${item.id} ${item.criteria.join(' ')} ${roles[item.owner].name}`, route: `task/${item.id}`, kind: t('contractKind') })),
      ...data.workflows.map(item => ({ title: item.name, text: `${item.id} ${item.steps.map(step => tasks[step.task].name).join(' ')}`, route: `workflow/${item.id}`, kind: t('workflowKind') })),
      ...data.commands.map(item => ({ title: item.id, text: item.description, route: `commands~command-${item.id}`, kind: t('commandKind') }))
    ];
    updateStatus();
  }

  function prosePage(item) {
    const rendered = render(item.markdown, item.sourcePath ?? item.path, routes);
    const toc = rendered.headings.filter(heading => heading.level === 2);
    return `<div class="article-layout"><article class="prose">${rendered.html}${sourceNote(item)}</article>${toc.length > 1 ? `<aside class="toc" aria-label="${e(t('onPage'))}"><div class="nav-heading">${e(t('onPageHeading'))}</div>${toc.map(heading => `<a href="#${routes[item.path]}~${heading.id.slice(8)}">${e(heading.text)}</a>`).join('')}</aside>` : ''}</div>`;
  }
  function overview() {
    const item = guide('overview');
    const title = item.markdown.match(/^# (.+)$/m)?.[1] ?? item.label;
    const markdown = item.markdown.replace(/^# .+\r?\n/, '');
    const split = markdown.search(/^## /m);
    const introduction = (split < 0 ? markdown : markdown.slice(0, split)).trim();
    const rest = split < 0 ? '' : markdown.slice(split).trim();
    return `<section class="overview-hero"><div class="eyebrow">OLYMPOX / ${e(t('core', { version: data.version }))}</div><h1>${e(title)}</h1><p class="lead">${e(introduction)}</p><div class="hero-actions">${routeLink('start', t('getStarted'), 'button primary')}${routeLink('workflows', t('exploreWorkflows'), 'button secondary')}</div></section>
      <div class="metrics">${[[data.roles.length, 'profilesMetric', 'team'], [data.tasks.length, 'tasksMetric', 'tasks'], [data.workflows.length, 'flowsMetric', 'workflows']].map(([count, description, route]) => `<a href="#${route}"><strong>${count.toString().padStart(2, '0')}</strong><span>${e(t(description))}</span></a>`).join('')}</div>
      <section class="process-section"><div class="section-caption">${e(t('requestDelivery'))}</div><div class="process-strip" aria-label="${e(t('processDescription', { name: coordinator.name }))}"><div class="coordinator"><span class="avatar">${e(coordinator.name[0])}</span><div><strong>${e(coordinator.name)}</strong><small>${e(t('coordinates'))}</small></div></div><div class="process-phases">${['phaseStrategy', 'phaseIdentity', 'phaseProduction', 'phaseReview'].map((name, index) => `<div><small>0${index + 1}</small><strong>${e(t(name))}</strong></div>`).join('')}</div></div></section>
      <article class="prose overview-prose">${render(rest, item.sourcePath ?? item.path, routes).html}</article>`;
  }
  function team() {
    return pageHeader(t('teamTitle'), t('teamDescription', { name: coordinator.name }), t('teamEyebrow')) + `<div class="team-grid">${data.roles.map((role, index) => {
      const count = data.tasks.filter(task => task.owner === role.id).length;
      return `<a class="agent-card ${role.id === 'master' ? 'master-card' : ''}" href="#agent/${role.id}"><div class="agent-card-top"><span class="avatar avatar-${index % 4}">${e(role.name[0])}</span><span class="card-id">${e(t(role.id === 'master' ? 'direction' : 'specialist'))}</span></div><h2>${e(role.name)}</h2><p>${e(role.title)}</p><small>${e(t('contractCount', { count, contracts: t(count === 1 ? 'contractSingular' : 'contractPlural') }))}</small></a>`;
    }).join('')}</div><div class="note">${e(t('teamNote', { name: coordinator.name }))}</div>`;
  }
  function agentPage(id) {
    const role = roles[id]; if (!role) return missing();
    const assigned = data.tasks.filter(task => task.owner === id);
    const teamGuide = data.guides.find(item => item.path === 'docs/studio-team.md');
    const section = teamGuide?.markdown.split(/\r?\n(?=#{2,3} )/).find(part => part.split(/\r?\n/, 1)[0] === `### ${role.name}`);
    const detail = id === 'master' ? null : section?.replace(/^### [^\r\n]+\r?\n/, '').trim();
    return pageHeader(role.name, role.title, t(id === 'master' ? 'directionEyebrow' : 'specialist')) + `<div class="article-layout"><article class="prose">${detail ? render(detail, teamGuide.sourcePath ?? teamGuide.path, routes).html : ''}${render(role.markdown.replace(/^# .+\r?\n/, ''), role.path, routes).html}<h2>${e(t('assignedContracts'))}</h2><div class="related-list">${assigned.map(task => `<a href="#task/${task.id}"><strong>${e(task.name)}</strong><code>${e(task.id)}</code></a>`).join('')}</div><div class="source-note">${e(t('profile'))} <code>${e(locale === 'en' ? role.path : 'docs-site/locales/pt-BR.json')}</code></div></article><aside class="toc"><div class="nav-heading">${e(t('context'))}</div>${routeLink('team', t('viewTeam'))}${routeLink(routes['docs/studio-team.md'], t('inputsOutputsLimits'))}${routeLink('tasks', t('viewContracts'))}</aside></div>`;
  }
  function flowCard(workflow) {
    return `<section class="flow-panel" id="flow-${e(workflow.id)}"><div class="flow-heading"><div><div class="eyebrow">${e(workflow.id)}</div><h2>${routeLink(`workflow/${workflow.id}`, workflow.name)}</h2></div><span class="chip">${e(t(workflow.requiresPersona ? 'requiresCharacter' : 'noCharacterStart'))}</span></div><ol class="timeline">${workflow.steps.map((step, index) => {
      const task = tasks[step.task], role = roles[task.owner];
      return `<li><span class="step-number">${String(index + 1).padStart(2, '0')}</span><div class="step-content"><a href="#task/${task.id}"><strong>${e(task.name)}</strong></a><div class="step-meta">${routeLink(`agent/${role.id}`, role.name)}<span>·</span><span>${e(label(task.deliverable))}</span>${step.optional ? `<span class="optional">${e(t('optional'))}</span>` : ''}</div></div></li>`;
    }).join('')}</ol>${sourceNote(workflow)}</section>`;
  }
  function workflows(id) {
    const selection = id ? data.workflows.filter(workflow => workflow.id === id) : data.workflows;
    if (!selection.length) return missing();
    return pageHeader(id ? selection[0].name : t('flowsTitle'), t('flowsDescription'), t('flowsEyebrow')) + selection.map(flowCard).join('') + `<div class="note">${e(t('runNoteBefore'))} ${routeLink(routes['docs/framework-02.md'], t('coreGuide'))} ${e(t('runNoteAfter'))}</div>`;
  }
  function taskPage(id) {
    const task = tasks[id]; if (!task) return missing();
    const contract = canonical.tasks.find(item => item.id === id);
    return pageHeader(task.name, t('owner', { name: roles[task.owner].name }), t('taskEyebrow')) + `<div class="task-facts"><div><small>${e(t('deliverable'))}</small><strong>${e(label(task.deliverable))}</strong></div><div><small>${e(t('evidence'))}</small><strong>${e(label(task.evidenceType))}</strong></div><div><small>${e(t('minimumOutputs'))}</small><strong>${task.minimumOutputs}</strong></div></div><article class="prose"><h2>${e(t('prerequisites'))}</h2><ul><li>${e(t('character'))}: ${e(t(task.requiresPersona ? 'required' : 'notRequiredStart'))}.</li><li>${e(t('approvedCanon'))}: ${e(t(task.requiresApprovedCanon ? 'required' : 'notRequiredContract'))}.</li><li>${e(t('capability'))}: ${e(task.capability ? label(task.capability) : t('noExternalCapability'))}.</li></ul>${task.capability ? `<p>${e(t('capabilityNoteBefore'))} <code>image-${e(task.capability)}</code> ${e(t('capabilityNoteMiddle'))} <code>video-${e(task.capability)}</code>. ${e(t('capabilityNoteAfter'))}</p>` : ''}<h2>${e(t('completionCriteria'))}</h2><ul>${task.criteria.map(criterion => `<li>${e(criterion)}</li>`).join('')}</ul><h2>${e(t('appearsIn'))}</h2><div class="related-list">${data.workflows.filter(workflow => workflow.steps.some(step => step.task === id)).map(workflow => `<a href="#workflow/${workflow.id}">${e(workflow.name)}</a>`).join('')}</div><h2>${e(t('fullContract'))}</h2>${codeBlock(JSON.stringify(Object.fromEntries(Object.entries(contract).filter(([key]) => key !== 'path')), null, 2))}${sourceNote(task)}</article>`;
  }
  function contracts() {
    return pageHeader(t('contractsTitle'), t('contractsDescription'), t('contractsEyebrow')) + `<div class="contract-list">${data.tasks.map(task => `<a href="#task/${task.id}" class="contract-row"><div><code>${e(task.id)}</code><h2>${e(task.name)}</h2><p>${e(roles[task.owner].name)} · ${e(label(task.evidenceType))}</p></div><div class="chips">${chips(task)}</div></a>`).join('')}</div>`;
  }
  function commands() {
    return pageHeader(t('commandsTitle'), t('commandsDescription'), t('commandsEyebrow')) + `<div class="command-list">${data.commands.map(command => `<section class="command-item" id="command-${e(command.id)}"><h2>${e(command.id)}</h2><p>${e(command.description)}</p>${codeBlock(command.syntax, 'powershell')}</section>`).join('')}</div>`;
  }
  function sync() {
    return prosePage(guide('sync')) + `<details class="source-inventory"><summary>${e(t('sourceInventory', { count: data.sources.length }))}</summary><p class="inventory-note">${e(t('hashNote'))}</p><div class="source-list">${data.sources.map(source => `<div><code>${e(source.path)}</code><small>${e(source.sha256.slice(0, 16))}</small></div>`).join('')}</div></details>`;
  }
  function missing() { return pageHeader(t('missingTitle'), t('missingDescription')) + routeLink('overview', t('backOverview'), 'button primary'); }
  function paint() {
    const [route = 'overview', anchor] = (location.hash.slice(1) || 'overview').split('~');
    let html, title = summaries[route];
    if (route === 'overview') html = overview();
    else if (route === 'start') html = prosePage(guide('start'));
    else if (route === 'team') html = team();
    else if (route === 'workflows') html = workflows();
    else if (route === 'tasks') html = contracts();
    else if (route === 'commands') html = commands();
    else if (route === 'sync') html = sync();
    else if (route === 'constitution') html = prosePage(guide('constitution'));
    else if (route.startsWith('agent/')) { title = roles[route.slice(6)]?.name; html = agentPage(route.slice(6)); }
    else if (route.startsWith('task/')) { title = tasks[route.slice(5)]?.name; html = taskPage(route.slice(5)); }
    else if (route.startsWith('workflow/')) { title = data.workflows.find(item => item.id === route.slice(9))?.name; html = workflows(route.slice(9)); }
    else if (route.startsWith('guide/')) { const item = data.guides.find(item => routes[item.path] === route); title = item?.label; html = item ? prosePage(item) : missing(); }
    else if (route.startsWith('source/')) { const item = data.templates.find(item => routes[item.path] === route); title = item?.path; html = item ? pageHeader(item.path, t('templateDescription'), t('templateEyebrow')) + codeBlock(item.text, 'template') + sourceNote(item) : missing(); }
    else html = missing();
    main.innerHTML = html;
    document.querySelector('#breadcrumb').textContent = title ?? t('reference');
    document.title = `${title ?? t('manualTitle')} · OLYMPOX - AI Influencer framework`;
    const currentCategory = route.startsWith('agent/') ? 'team' : route.startsWith('task/') ? 'tasks' : route.startsWith('workflow/') ? 'workflows' : route;
    document.querySelectorAll('[data-route]').forEach(link => { const active = link.dataset.route === currentCategory; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    closeMenu();
    if (anchor) (document.getElementById(`heading-${anchor}`) ?? document.getElementById(anchor))?.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const search = document.querySelector('#search');
  function searchManual() {
    const query = normalize(search.value.trim()), results = document.querySelector('#search-results');
    results.classList.toggle('visible', !!query);
    if (!query) { results.innerHTML = ''; return; }
    const matches = searchable.filter(item => normalize(`${item.title} ${item.text}`).includes(query)).sort((a, b) => Number(normalize(b.title).includes(query)) - Number(normalize(a.title).includes(query))).slice(0, 14);
    results.innerHTML = matches.length ? matches.map(item => `<a href="#${item.route}"><small>${e(item.kind)}</small><strong>${e(item.title)}</strong></a>`).join('') : `<p>${e(t('noResults'))}</p>`;
  }
  search.addEventListener('input', searchManual);
  document.querySelector('#search-results').addEventListener('click', event => { if (event.target.closest('a')) { search.value = ''; searchManual(); } });
  function closeMenu() { const opened = document.body.classList.contains('menu-open'); document.body.classList.remove('menu-open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false'); if (opened) document.querySelector('#menu-toggle').focus(); }
  document.querySelector('#menu-toggle').addEventListener('click', () => { const opened = document.body.classList.toggle('menu-open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded', String(opened)); if (opened) search.focus(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); if (matchMedia('(max-width: 900px)').matches) { document.body.classList.add('menu-open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'true'); } search.focus(); }
    if (event.key === 'Escape') { search.value = ''; searchManual(); closeMenu(); }
  });
  let toastTimer;
  function toast(text) { const element = document.querySelector('#toast'); element.textContent = text; element.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { element.hidden = true; }, 2500); }
  main.addEventListener('click', async event => {
    const editionLink = event.target.closest('a[data-locale]');
    if (editionLink) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      changeLocale(editionLink.dataset.locale, new URL(editionLink.getAttribute('href'), location.href).hash);
      return;
    }
    const button = event.target.closest('.copy-code'); if (!button) return;
    const text = button.closest('.code-block').querySelector('code').textContent;
    try { await navigator.clipboard.writeText(text); toast(t('copied')); }
    catch { const range = document.createRange(); range.selectNodeContents(button.closest('.code-block').querySelector('code')); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); toast(t('copyFallback')); }
  });
  function changeLocale(value, fragment) {
    const next = select(`?lang=${encodeURIComponent(value)}`);
    try { localStorage.setItem(storageKey, next); } catch { /* The URL still records the explicit choice. */ }
    const url = new URL(location.href); url.searchParams.set('lang', next);
    if (fragment !== undefined) url.hash = fragment;
    try { history.replaceState(null, '', url.href); } catch { location.href = url.href; return; }
    activateLocale(next); paint(); searchManual();
  }
  document.querySelector('#locale-select').addEventListener('change', event => { changeLocale(event.target.value); });
  window.addEventListener('hashchange', paint);
  window.addEventListener('popstate', () => { activateLocale(select(location.search, locale)); paint(); searchManual(); });
  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); main.scrollIntoView({ block: 'start' }); });
  function updateStatus() {
    const notice = document.querySelector('#update-error'); notice.hidden = !liveStatus?.error;
    notice.textContent = liveStatus?.error ? t('updateError') : '';
    const key = location.protocol === 'file:' ? 'portableVersion' : liveStatus?.error ? 'updatePending' : liveStatus?.watching ? 'liveUpdate' : 'savedVersion';
    document.querySelector('#sync-status').textContent = t(key);
  }
  activateLocale(locale); paint();
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    let checking = false;
    setInterval(async () => {
      if (document.hidden || checking) return;
      checking = true;
      try {
        const response = await fetch('__docs-status', { cache: 'no-store' }); if (!response.ok) return;
        const status = await response.json(); if (!status.watching) return;
        liveStatus = status; updateStatus();
        if (!status.error && status.fingerprint !== canonical.fingerprint) location.reload();
      } catch { liveStatus = null; updateStatus(); }
      finally { checking = false; }
    }, 1500);
  }
})();

(() => {
  const en = {
    skip:'Skip to content',navigation:'Main navigation',language:'Language',navFramework:'The framework',navAgents:'Agents',navFlows:'Workflows',documentation:'Documentation',
    heroOne:'Characters',heroTwo:'with identity.',heroThree:'Creation',heroFour:'with direction.',heroDescription:'Turn an idea into an original character. OLYMPOX brings strategy, identity, content, and review together in a studio with memory, inside Codex.',start:'Start with OLYMPOX',meetAgents:'Meet the agents',
    mapLabel:'Atena coordinates strategy, identity, content, and review',mapCaption:'FROM IDEA TO CONTINUITY',coordination:'STUDIO DIRECTION',mapStrategy:'Strategy',mapIdentity:'Identity',mapContent:'Content',mapReview:'Review',mapFoot:'Each decision builds the next step.',factAgents:'work profiles',factTasks:'task contracts',factFlows:'creative workflows',factPlatform:'Your creative environment.',
    frameworkEyebrow:'01 / THE FRAMEWORK',frameworkTitle:'The idea evolves.\nThe identity remains.',frameworkIntro:'Creating an image is one step. Building a character takes references, decisions, and continuity. OLYMPOX organizes that work so you can move forward with context.',principleOne:'Identity with history.',principleOneText:'Approved references, versioned canon, and preserved production context. Every new piece starts from a defined identity.',principleTwo:'A process you can continue.',principleTwoText:'Tasks have owners, deliverables, and criteria. Resume a workflow with previous attempts and pending work in view.',principleThree:'Your studio. Your files.',principleThreeText:'Work in an independent local studio with your own records and verifiable backups. The core runs without external dependencies.',
    agentsEyebrow:'02 / THE CREATIVE OLYMPUS',agentsTitle:'One direction.\nNine perspectives.',agentsIntro:'Atena coordinates eight specialists. Each profile has a clear role, from research to character continuity.',agentDetail:'Explore the profile',agentsNote:'Profiles guide work in Codex. Execution and delegation use the tools available in your session.',
    flowsEyebrow:'03 / FROM THE FIRST BRIEF TO THE NEXT CHAPTER',flowsTitle:'Know where to start.\nAnd what comes next.',flowsIntro:'Choose where your project stands and explore the framework steps. Identity decisions and review remain explicit.',flowTabs:'Framework workflows',flowCreate:'Create a character',flowProduce:'Produce a piece',flowReview:'Review and correct',steps:'steps',optional:'· optional',flowDetail:'See the full workflow in the documentation',
    startEyebrow:'04 / BUILD YOUR STUDIO',startTitle:'Your next creation\nstarts with direction.',startText:'Open your studio in Codex, invoke OLYMPOX, and start with an idea. The documentation guides you through installation, agents, and every workflow.',installation:'Open installation guide',copy:'Copy commands',requirements:'Requires Node 22+, Codex, and access to the GitHub repository. Generation tools and media providers are set up separately.',footerText:'Identity preserved. Creativity in motion.',
    title:'OLYMPOX — Identity, direction, and AI creation',description:'Create original AI influencers with direction, identity, and memory. Meet OLYMPOX, your creative framework inside Codex.',copied:'Commands copied',copyError:'Select and copy the commands above.'
  };
  const pt = Object.fromEntries([...document.querySelectorAll('[data-l]')].map(node => [node.dataset.l,node.innerText]));
  document.querySelectorAll('[data-l-aria]').forEach(node => { pt[node.dataset.lAria]=node.getAttribute('aria-label'); });
  pt.title=document.title; pt.description=document.querySelector('meta[name="description"]').content; pt.copied='Comandos copiados';pt.copyError='Selecione e copie os comandos acima.';
  let locale = new URL(location.href).searchParams.get('lang') === 'en' ? 'en' : 'pt-BR';
  const select=document.querySelector('#site-locale'), tabs=[...document.querySelectorAll('[data-flow]')];
  function translate() {
    const copy=locale==='en'?en:pt;
    document.documentElement.lang=locale;document.title=copy.title;document.querySelector('meta[name="description"]').content=copy.description;select.value=locale;
    document.querySelectorAll('[data-l]').forEach(node=>{node.textContent=copy[node.dataset.l];});
    document.querySelectorAll('[data-l-aria]').forEach(node=>{node.setAttribute('aria-label',copy[node.dataset.lAria]);});
    document.querySelectorAll('[data-localized]').forEach(node=>{node.textContent=node.dataset[locale==='en'?'en':'pt'];});
    document.querySelectorAll('[data-doc]').forEach(node=>{node.href=`/doc/?lang=${locale}#${node.dataset.doc}`;});
  }
  select.addEventListener('change',()=>{locale=select.value;const url=new URL(location.href);url.searchParams.set('lang',locale);history.replaceState(null,'',url);translate();});
  function activate(tab,focus=false){tabs.forEach(node=>{const active=node===tab;node.setAttribute('aria-selected',String(active));node.tabIndex=active?0:-1;document.querySelector(`#panel-${node.dataset.flow}`).hidden=!active;});if(focus)tab.focus();}
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();activate(tabs[next],true);});});
  document.querySelector('#copy-install').addEventListener('click',async()=>{const copy=locale==='en'?en:pt,status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(document.querySelector('#install-command').textContent);status.textContent=copy.copied;document.querySelector('#copy-install').textContent=copy.copied;}catch{status.textContent=copy.copyError;document.querySelector('#copy-install').textContent=copy.copyError;}});
  translate();
})();

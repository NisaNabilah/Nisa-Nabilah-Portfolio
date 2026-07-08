/*
  Page behaviour: navigation, theme persistence, reveal observer, project filters,
  accessible project detail dialog, and a mailto contact-form fallback.
*/
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const metaTheme = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem('nisa-theme');
const initialTheme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  metaTheme.content = theme === 'light' ? '#FFF4EB' : '#3D1534';
}
setTheme(initialTheme);
themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(next);
  localStorage.setItem('nisa-theme', next);
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.addEventListener('click', event => {
  if (event.target.matches('a')) { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.focus();
  }
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: .08, rootMargin: '0px 0px -35px' });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-25% 0px -65%', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', selected);
  });
  projectCards.forEach(card => {
    const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
    card.hidden = !match;
    if (match) requestAnimationFrame(() => card.classList.add('visible'));
  });
}));

const projectData = {
  aml:{label:'P/01 · AI & DATA',title:'AML Detection via Graph Neural Networks',summary:'An explainable graph-learning system for identifying illicit cryptocurrency transactions in the Elliptic Bitcoin network.',brief:'Classify highly imbalanced, time-dependent transaction data while preserving enough interpretability for investigators to understand why a transaction was flagged.',built:'Trained GraphSAGE on 203K nodes and 234K edges, achieving test F1 0.7845 and AUC-PR 0.9857. Analysed stability across all 49 time steps, added GNNExplainer subgraph insights, and built a Streamlit/PyVis exploration dashboard.',chips:['Python','PyTorch Geometric','GraphSAGE','GNNExplainer','Streamlit','PyVis']},
  cleardesk:{label:'P/02 · WEB APP',title:'ClearDesk',summary:'A calm, browser-based system that helps employees document boundaries, decisions and incidents.',brief:'Create a privacy-minded workplace record without requiring a backend, while protecting the integrity of past entries.',built:'Designed Scope Guard, Decision Sign-offs, Incident Log and an append-only audit trail. SHA-256 seals via SubtleCrypto reveal tampering; Web Storage keeps the tool portable, with light and dark modes.',chips:['Vue.js','Tailwind CSS','SubtleCrypto API','Web Storage API']},
  portal:{label:'P/03 · WEB + AUTOMATION',title:'STDC Unified Staff Portal',summary:'A single-file portal joining a formal HR complaint workflow with a self-protection ledger.',brief:'Make a six-stage Bahasa Malaysia complaint process understandable to staff while giving HR Officers and Managers the right controls at each stage.',built:'Implemented staff, HR Officer and HR Manager access; six complaint states; decision records; and SHA-256 digital seals in a portable Vue application.',chips:['Vue.js','Role-based access','SHA-256','Bahasa Malaysia']},
  extraction:{label:'P/04 · DOCUMENT AI',title:'Participant Data Extraction Module',summary:'AI-assisted intake that turns mixed-format participant documents into structured booking data.',brief:'Reduce repetitive typing and errors when names, identity numbers and emails arrive across inconsistent documents and scans.',built:'Created multi-format upload and OCR flows, a Node.js/Express backend proxy, and Gemini API integration to extract and review name, IC/passport and email fields.',chips:['Node.js','Express','Gemini API','OCR','REST API']},
  behaviour:{label:'P/05 · AI PROTOTYPE',title:'AI Human Behaviour Simulator',summary:'A modular tool for creating personas, simulating conversations and examining behavioural scenarios.',brief:'Give users a structured way to test how different personas may respond to the same prompt or situation.',built:'Developed Persona Builder & Chat and Scenario Analyser modules with Claude API integration, plus a system architecture view and interactive technology explorer.',chips:['Claude API','Persona systems','Prompt design','Interactive architecture']},
  telegram:{label:'P/06 · AUTOMATION',title:'Telegram Intern Attendance Bot',summary:'A chat-first attendance workflow built around the tool interns and administrators already use.',brief:'Replace fragmented manual tracking for a 20-person cohort without adding a new app or complicated training.',built:'Added location-based clock-in/out, leave requests, daily reminders, multi-admin controls and Excel export. Integrated Google Sheets and deployed the Python service on Koyeb, saving about three hours weekly.',chips:['Python','python-telegram-bot','gspread','Koyeb','openpyxl']},
  lung:{label:'P/07 · PUBLISHED RESEARCH',title:'Lung Cancer Prognosis Prediction',summary:'A multi-stage deep-learning approach to imaging biomarkers, prognosis and treatment stratification.',brief:'Translate rich CT imaging into quantitative signals that can support prognosis research and treatment planning.',built:'Designed a multi-modal pipeline for DICOM imaging and quantitative biomarker extraction. Published and presented the work as first author at IEEE ICT4M 2025.',chips:['Python','PyTorch','DICOM','Multi-modal fusion','Deep learning']},
  finance:{label:'P/08 · ANALYTICS',title:'Financial Transaction Analytics',summary:'Operational dashboards that make patterns and anomalies in large transaction datasets visible.',brief:'Help a client monitor customer spending, refund anomalies and merchant-category performance without repeated manual analysis.',built:'Queried and analysed more than 100,000 records using SQL and Excel, then delivered interactive Power BI dashboards adopted for ongoing monitoring and reporting.',chips:['SQL','Excel','Power BI','Data visualisation']}
};
const modal = document.querySelector('.project-modal');
document.querySelectorAll('.open-project').forEach(button => button.addEventListener('click', () => {
  const data = projectData[button.closest('.project-card').dataset.project];
  document.querySelector('#modal-label').textContent = data.label;
  document.querySelector('#modal-title').textContent = data.title;
  document.querySelector('#modal-summary').textContent = data.summary;
  document.querySelector('#modal-brief').textContent = data.brief;
  document.querySelector('#modal-built').textContent = data.built;
  document.querySelector('#modal-chips').innerHTML = data.chips.map(chip => `<span>${chip}</span>`).join('');
  modal.showModal();
}));
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`);
  window.location.href = `mailto:nisanabilahwork25@gmail.com?subject=${subject}&body=${body}`;
});

/*
  Portfolio v3 behaviour: mobile navigation, active-section highlighting,
  IntersectionObserver reveal animations, and accessible expandable project
  details through a native dialog. Vanilla JavaScript only.
*/

const nav = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

nav.addEventListener('click', event => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.focus();
  }
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.hash === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-30% 0px -58% 0px', threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

const projects = {
  aml: {
    label: 'Self-initiated internship project',
    title: 'AML Detection via Graph Neural Networks',
    summary: 'GraphSAGE on the Elliptic Bitcoin Dataset with 203K nodes and 234K edges, achieving Test F1 0.7845 and AUC-PR 0.9857.',
    role: 'Built the AML graph-learning pipeline with Streamlit + PyVis dashboarding, GNNExplainer interpretability, and temporal analysis across 49 time steps.',
    impact: 'Surpassed the Weber et al. benchmark of 0.88 AUC-PR and demonstrates applied graph ML, explainability, and research-grade evaluation.',
    tags: ['Python', 'PyTorch Geometric', 'GraphSAGE', 'GNNExplainer', 'Streamlit', 'PyVis']
  },
  lung: {
    label: 'Research / IEEE paper',
    title: 'Lung Cancer Prognosis Prediction Pipeline',
    summary: 'Multi-stage deep learning pipeline extracting quantitative imaging biomarkers from CT/histology imaging for prognosis prediction and treatment stratification.',
    role: 'Developed the medical imaging pipeline and translated the experimental workflow into a peer-reviewed research contribution.',
    impact: 'Published at IEEE ICT4M 2025 as first author; modular late-fusion extension submitted to ICAIIA 2026.',
    tags: ['Python', 'PyTorch', 'CNN', 'DICOM imaging']
  },
  cleardesk: {
    label: 'Built at STDCx for a supervisor',
    title: 'ClearDesk',
    summary: 'Standalone browser-based workplace protection tool with SHA-256-sealed decision audit trails, AI-powered scope-creep analysis, and append-only incident logging.',
    role: 'Designed and built the browser tool as a practical workplace documentation system.',
    impact: 'Shows enterprise-facing prototyping, integrity-focused audit design, and supervisor-driven utility.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SHA-256']
  },
  'stdc-portal': {
    label: 'Full-stack internship project',
    title: 'STDC HR Portal',
    summary: 'Role-based internal staff complaint management system with a high-fidelity HTML prototype completed and Node/Express + SQLite backend planned.',
    role: 'Mapped the complaint workflow, role access needs, and prototype interface for internal staff use.',
    impact: 'Demonstrates workflow design, role-based access planning, and transition from prototype to backend architecture.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'SQLite']
  },
  'second-brain': {
    label: 'Side project',
    title: 'Connect With Second Brain',
    summary: 'AI-powered personal knowledge management system using Firebase + Gemini API with Capture, Memory, and Connection layers.',
    role: 'Designed the three-layer architecture for capturing notes, storing memory, and connecting related ideas.',
    impact: 'Explores practical AI assistance for personal context, idea retrieval, and knowledge synthesis.',
    tags: ['Firebase', 'Gemini API']
  },
  telegram: {
    label: 'Built at STDCx',
    title: 'Telegram Attendance Bot',
    summary: 'Automated intern attendance system integrated with Google Sheets, eliminating ~3 hours/week of manual tracking across a 20-person cohort.',
    role: 'Built the Telegram workflow and Sheets integration for intern attendance tracking.',
    impact: 'Turns a repetitive admin process into a lightweight, chat-first automation that fits the team’s existing workflow.',
    tags: ['Python', 'Telegram API', 'Google Sheets API']
  },
  'code-switch': {
    label: 'Malaysian English–Malay NLP',
    title: 'Code-Switch NLP Classifier',
    summary: 'Code-switching detector built from a synthetic dataset that captures authentic bilingual Malaysian English–Malay patterns.',
    role: 'Benchmarked TF-IDF + Logistic Regression, TF-IDF + SVM, and fine-tuned mBERT.',
    impact: 'mBERT consistently outperformed classical baselines, showing applied cross-lingual modeling for an underrepresented NLP problem.',
    tags: ['Python', 'Scikit-learn', 'HuggingFace Transformers', 'mBERT']
  },
  moodify: {
    label: 'Recommendation system',
    title: 'Moodify — Weather-Based Music Recommendation Engine',
    summary: 'End-to-end recommendation system predicting real-time weather with a Random Forest classifier and mapping weather conditions to mood-based genres.',
    role: 'Integrated Spotify API data, OpenWeatherMap data, and fuzzy matching for more robust user input.',
    impact: 'Demonstrates product-minded ML with live APIs, recommendation logic, and user-facing interaction.',
    tags: ['Python', 'Scikit-learn', 'Spotify API', 'OpenWeatherMap API']
  },
  diabetes: {
    label: 'Healthcare classification',
    title: 'Diabetes Prediction Model',
    summary: 'Random Forest classification model predicting diabetes risk from patient health indicators.',
    role: 'Applied feature engineering and model evaluation best practices to a healthcare prediction workflow.',
    impact: 'Shows reproducible classification methodology and practical health-data modeling.',
    tags: ['Python', 'Scikit-learn', 'Random Forest']
  },
  xray: {
    label: 'Medical imaging classification',
    title: 'X-Ray Deep Learning Classifier',
    summary: 'Deep learning image classification model for X-ray diagnostic imaging.',
    role: 'Applied convolutional architectures to a medical imaging domain distinct from the lung cancer research track.',
    impact: 'Broadens applied imaging experience across CT, histology, and X-ray modalities.',
    tags: ['Python', 'PyTorch', 'Deep Learning']
  },
  birds: {
    label: 'Geospatial & time-series analysis',
    title: 'Bird Migration Analysis',
    summary: 'Exploratory analysis of bird migration patterns using geospatial and time-series techniques.',
    role: 'Wrangled movement data and visualized migration patterns to uncover trends.',
    impact: 'Shows ability to turn raw tracking data into interpretable movement insights.',
    tags: ['Python', 'Pandas', 'Data Visualization']
  },
  'nn-fundamentals': {
    label: 'Applied neural network modeling',
    title: 'Neural Network Fundamentals with Scikit-learn',
    summary: 'Implemented neural network architectures from foundational principles using Scikit-learn.',
    role: 'Reinforced core deep learning theory through hands-on model construction.',
    impact: 'Demonstrates conceptual fluency, not just library-level usage.',
    tags: ['Python', 'Scikit-learn']
  },
  viterbi: {
    label: 'Sequence modeling & dynamic programming',
    title: 'Viterbi Algorithm Implementation',
    summary: 'Implementation of the Viterbi algorithm for optimal sequence decoding in probabilistic sequence models.',
    role: 'Applied dynamic programming to Hidden Markov Model-style decoding relevant to NLP tagging tasks.',
    impact: 'Shows mathematical grounding for sequence modeling and NLP systems.',
    tags: ['Python']
  },
  eda: {
    label: 'Reusable data tooling',
    title: 'EDA Engine',
    summary: 'Reusable exploratory data analysis tool for automated data profiling, distribution analysis, and visualization.',
    role: 'Built a standardized EDA workflow to reduce repetitive setup across datasets.',
    impact: 'Improves speed and consistency in early-stage data understanding.',
    tags: ['Python', 'Pandas', 'Data Visualization']
  },
  sales: {
    label: 'Independent stakeholder analysis',
    title: 'Ad-Hoc Data Analysis — Sales Computation',
    summary: 'Independent sales data computation and analysis for an external stakeholder.',
    role: 'Applied data cleaning and aggregation techniques to deliver actionable business figures.',
    impact: 'Demonstrates practical, stakeholder-facing analysis under real-world constraints.',
    tags: ['Python', 'Pandas']
  },
  finance: {
    label: 'Analytics dashboard',
    title: 'Financial Transaction Analytics Dashboard',
    summary: '100K+ transaction records analysed in SQL and Excel with interactive Power BI dashboards.',
    role: 'Built dashboards for spending patterns, refund trends, and merchant category insights.',
    impact: 'Shows analytics delivery from raw transaction data to usable monitoring and reporting.',
    tags: ['SQL', 'Excel', 'Power BI']
  }
};

const modal = document.querySelector('.project-modal');
const closeModal = document.querySelector('.modal-close');
const modalLabel = document.querySelector('#modal-label');
const modalTitle = document.querySelector('#modal-title');
const modalSummary = document.querySelector('#modal-summary');
const modalRole = document.querySelector('#modal-role');
const modalImpact = document.querySelector('#modal-impact');
const modalTags = document.querySelector('#modal-tags');

document.querySelectorAll('.project-card').forEach(card => {
  card.querySelector('.card-button').addEventListener('click', () => {
    const project = projects[card.dataset.project];
    modalLabel.textContent = project.label;
    modalTitle.textContent = project.title;
    modalSummary.textContent = project.summary;
    modalRole.textContent = project.role;
    modalImpact.textContent = project.impact;
    modalTags.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');
    modal.showModal();
  });
});

closeModal.addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  if (event.target === modal) modal.close();
});

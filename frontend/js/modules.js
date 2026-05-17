/**
 * PRISM7 // PROFESSIONAL DEMO SUITE
 * Version: 10.2.3
 * UI: Internal CSS Animations + Demo Data Engine + Simplified Language
 */

const MODULES = {
  acquisition: {
    id: 'acquisition',
    nodeId: 'ACQ-01',
    title: 'ACQUISITION',
    analogy: 'Anchoring forensic truth in a flash of light.',
    description: 'Evidence Custody & Blockchain Registry',
    type: 'scanner-bitstream',
    endpoint: '/api/acquisition',
    fields: [
      { name: 'device_path', label: 'SOURCE_NODE', type: 'text', required: true, placeholder: '/dev/prism7_target' },
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true, placeholder: 'PRISM_DEMO_01' },
      { name: 'acquisition_type', label: 'CAPTURE_MODE', type: 'select', options: ['physical', 'logical'] },
    ],
    demo: { device_path: 'C:/Users/Thiyanesh/OneDrive/Documents/prism7/PRISM7/PRISM7/prism7_forensic_sample_datasets/blacklock_case/disk_image.dd' }
  },
  parser: {
    id: 'parser',
    nodeId: 'PRS-02',
    title: 'PARSER',
    analogy: 'Refracting raw bits into structural metadata.',
    description: 'Structural file-system analysis',
    type: 'scanner-prism',
    endpoint: '/api/parse',
    fields: [
      { name: 'filepath', label: 'TARGET_PATH', type: 'text', required: true },
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
    demo: { filepath: 'C:/Users/Thiyanesh/OneDrive/Documents/prism7/PRISM7/PRISM7/prism7_forensic_sample_datasets/blacklock_case/disk_image.dd' }
  },
  recovery: {
    id: 'recovery',
    nodeId: 'REC-03',
    title: 'FILES_RECOVERY',
    analogy: 'Rescuing data fragments from the dark void.',
    description: 'Deleted file carving & restoration',
    type: 'scanner-void',
    endpoint: '/api/recover',
    fields: [
      { name: 'filepath', label: 'RECOVERY_ZONE', type: 'text', required: true },
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
    demo: { filepath: 'C:/Users/Thiyanesh/OneDrive/Documents/prism7/PRISM7/PRISM7/prism7_forensic_sample_datasets/blacklock_case/disk_image.dd' }
  },
  search: {
    id: 'search',
    nodeId: 'SRH-04',
    title: 'KEYWORD_SEARCH',
    analogy: 'Detecting hidden chromatic patterns within.',
    description: 'Deep pattern and keyword analysis',
    type: 'scanner-pulse',
    endpoint: '/api/search',
    fields: [
      { name: 'q', label: 'QUERY_KEYWORD', type: 'text', required: true },
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
    demo: { q: 'RANSOMWARE' }
  },
  timeline: {
    id: 'timeline',
    nodeId: 'TIM-05',
    title: 'TIMELINE',
    analogy: 'Stitching temporal fragments into truth.',
    description: 'Forensic event reconstruction',
    type: 'scanner-chrono',
    endpoint: '/api/timeline',
    fields: [
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
  },
  integrity: {
    id: 'integrity',
    nodeId: 'INT-06',
    title: 'INTEGRITY_CHECK',
    analogy: 'Locking evidence beyond any shadow of doubt.',
    description: 'Blockchain-based hash verification',
    type: 'scanner-shield',
    endpoint: '/api/integrity',
    fields: [
      { name: 'filepath', label: 'EXHIBIT_PATH', type: 'text', required: true },
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
    demo: { filepath: 'C:/Users/Thiyanesh/OneDrive/Documents/prism7/PRISM7/PRISM7/prism7_forensic_sample_datasets/blacklock_case/apache.log' }
  },
  reporting: {
    id: 'reporting',
    nodeId: 'REP-07',
    title: 'REPORT_GENERATION',
    analogy: 'Constructing final spectrum of analysis.',
    description: 'Generate comprehensive PDF report',
    type: 'scanner-spectrum',
    endpoint: '/api/report',
    fields: [
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
  },
  vault: {
    id: 'vault',
    nodeId: 'VLT-08',
    title: 'VAULT',
    analogy: 'Auditing the chain of custody spectrum.',
    description: 'Review on-chain evidence ledger',
    type: 'scanner-vault',
    endpoint: '/api/vault/chain/',
    fields: [
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true },
    ],
  },
  log_analysis: {
    id: 'log_analysis',
    nodeId: 'INTEL-09',
    title: 'THREAT_ANALYTICS',
    analogy: 'Projecting high-fidelity attack intelligence from raw signal.',
    description: 'Log forensics & Intrusion detection',
    type: 'scanner-pulse', // Reusing pulse for sync
    endpoint: '/api/log-analysis',
    fields: [
      { name: 'filepath', label: 'LOG_SOURCE_NODE', type: 'text', required: true, placeholder: 'C:/logs/apache.log' },
      { name: 'case_id', label: 'CASE_ID', type: 'text', required: true, placeholder: 'PRISM_ALPHA_001' },
      { name: 'threshold', label: 'ATTACK_BURST_THRESHOLD', type: 'text', required: true, placeholder: '10' },
    ],
    demo: {
      filepath: 'C:/Users/Thiyanesh/OneDrive/Documents/prism7/PRISM7/PRISM7/prism7_forensic_sample_datasets/blacklock_case/apache.log',
      threshold: '10'
    }
  },
};

const ModuleRenderer = {
  renderModuleCards: () => {
    return Object.values(MODULES).map((module) => `
      <div class="module-card" data-id="${module.id}">
        <div class="holo-popup">
            <div class="popup-text">>> ${module.analogy.toUpperCase()}</div>
        </div>
        <div class="module-visual-area ${module.type}">
            <div class="scanner-anim"></div>
            <div class="data-grid"></div>
        </div>
        <div class="module-meta">
            <span class="module-node-id">${module.nodeId}</span>
            <h3 class="module-title">${module.title}</h3>
        </div>
        <p class="module-description">${module.description}</p>
      </div>
    `).join('');
  },

  renderModuleHero: (moduleId) => {
    const module = MODULES[moduleId];
    return `
      <div class="module-visual-area ${module.type}" style="height: 120px; margin-bottom: 3rem;">
        <div class="scanner-anim"></div>
        <div class="data-grid"></div>
      </div>
    `;
  },

  renderModuleForm: (moduleId) => {
    const module = MODULES[moduleId];
    if (!module) return '';

    return `
      <div class="result-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h4 style="font-family: var(--font-heading); color: var(--text-main); font-size: 1.1rem; letter-spacing: 1px;">
                [ ${module.nodeId} // ${module.title} ]
            </h4>
            ${module.demo ? `
                <button onclick="window.ModuleRenderer.autoFill('${moduleId}')" class="badge-blended" style="cursor: pointer; border: 1px solid var(--c2); color: var(--c2);">FILL_DATA</button>
            ` : ''}
        </div>
        <form id="module-form" class="module-form">
          ${module.fields.map(field => `
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label" style="display: block; color: var(--text-sub); font-size: 0.65rem; margin-bottom: 0.5rem; font-family: var(--font-heading); font-weight:700; letter-spacing:1px;">${field.label}</label>
              ${field.type === 'select' ? `
                <select name="${field.name}" class="form-input">
                  ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              ` : `
                <input type="${field.type}" name="${field.name}" class="form-input" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
              `}
            </div>
          `).join('')}
          <button type="submit" class="btn-rainbow" style="width: 100%;">INITIATE_FORENSIC_PROTOCOL</button>
        </form>
      </div>
    `;
  },

  autoFill: (moduleId) => {
    const module = MODULES[moduleId];
    if (!module || !module.demo) return;

    const form = document.getElementById('module-form');
    Object.keys(module.demo).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = module.demo[key];
    });

    const caseInput = form.querySelector('[name="case_id"]');
    if (caseInput) caseInput.value = sessionStorage.getItem('current_case') || 'PRISM_ALPHA_001';

    console.log(`PRISM7 // [${module.nodeId}] AUTO-FILLED WITH DEMO DATASET.`);
  },

  loadDemoData: async () => {
    const demoCases = ['PRISM_ALPHA_001', 'PRISM_BETA_002', 'PRISM_GAMMA_003'];
    console.log("PRISM7 // LOADING BLOCKCHAIN DEMO SUITE...");
    for (const id of demoCases) {
      try {
        await ApiClient.post('/api/blockchain/register', { case_id: id });
        console.log(`[OK] Registered Case: ${id}`);
      } catch (e) {
        console.warn(`[WARN] Case ${id} already exists or registration failed.`);
      }
    }
    sessionStorage.setItem('current_case', demoCases[0]);
    alert("BLOCKCHAIN DEMO SUITE LOADED.\n3 Cases Registered on Ledger.\nActive Session set to: " + demoCases[0]);
    window.location.reload();
  }
};

window.MODULES = MODULES;
window.ModuleRenderer = ModuleRenderer;

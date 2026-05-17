export const MODULES_CONFIG = {
    acquisition: {
        id: 'acquisition',
        title: 'Acquisition & Vault',
        description: 'Acquire evidence from devices and store in blockchain vault',
        icon: '🔒',
        fields: [
            { name: 'device_path', label: 'Device/Source Path', type: 'text', required: true },
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
            { name: 'acquisition_type', label: 'Acquisition Type', type: 'select', options: ['physical', 'logical'] },
            { name: 'hash_algorithm', label: 'Hash Algorithm', type: 'select', options: ['SHA256', 'MD5', 'SHA1'] },
        ],
    },
    vault: {
        id: 'vault',
        title: 'Evidence Vault',
        description: 'Secure Chain-of-Custody Ledger',
        icon: '🛡️',
        fields: [
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
        ],
    },
    parser: {
        id: 'parser',
        title: 'Parser',
        description: 'Parse file systems and extract metadata',
        icon: '📁',
        fields: [
            { name: 'filepath', label: 'Evidence Path', type: 'text', required: true }, // Will be auto-converted to FileUploader
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
        ],
    },
    recovery: {
        id: 'recovery',
        title: 'Recovery',
        description: 'Recover deleted files and carved data',
        icon: '♻️',
        fields: [
            { name: 'filepath', label: 'Evidence Path', type: 'text', required: true },
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
        ],
    },
    search: {
        id: 'search',
        title: 'Search',
        description: 'Keyword search with regex support',
        icon: '🔍',
        fields: [
            { name: 'q', label: 'Search Query', type: 'text', required: true },
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
        ],
    },
    timeline: {
        id: 'timeline',
        title: 'Timeline',
        description: 'Construct forensic timeline',
        icon: '⏱️',
        fields: [
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
        ],
    },
    reporting: {
        id: 'reporting',
        title: 'Reporting',
        description: 'Generate forensic reports',
        icon: '📄',
        fields: [
            { name: 'case_id', label: 'Case ID', type: 'text', required: true },
        ],
    },
};

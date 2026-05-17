/**
 * PRISM7 - UI Utilities
 * User interface helpers and interactions
 */

/**
 * Modal Management
 */
class Modal {
    constructor(id) {
        this.modal = document.getElementById(id);
        this.overlay = this.modal?.closest('.modal-overlay');
        this.init();
    }

    init() {
        if (!this.overlay) return;

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    isOpen() {
        return this.overlay?.classList.contains('active');
    }

    setContent(html) {
        const content = this.modal?.querySelector('.modal-body');
        if (content) {
            content.innerHTML = html;
        }
    }
}

/**
 * Command Palette
 */
class CommandPalette {
    constructor() {
        this.palette = null;
        this.searchInput = null;
        this.commandList = null;
        this.commands = [];
        this.selectedIndex = 0;
        this.init();
    }

    init() {
        // Create command palette if it doesn't exist
        if (!document.getElementById('command-palette')) {
            this.createPalette();
        }

        this.palette = document.getElementById('command-palette');
        this.searchInput = document.getElementById('command-search');
        this.commandList = document.getElementById('command-list');

        // Keyboard shortcut (Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }

            if (this.isOpen()) {
                this.handleKeyboard(e);
            }
        });

        // Register default commands
        this.registerDefaultCommands();
    }

    createPalette() {
        const html = `
      <div id="command-palette" class="command-palette">
        <input 
          type="text" 
          id="command-search" 
          class="command-search" 
          placeholder="Type a command..."
          autocomplete="off"
        />
        <div id="command-list" class="command-list"></div>
      </div>
      <div id="command-overlay" class="modal-overlay"></div>
    `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Close on overlay click
        document.getElementById('command-overlay').addEventListener('click', () => {
            this.close();
        });
    }

    registerDefaultCommands() {
        this.addCommand({
            title: 'Go to Dashboard',
            description: 'Navigate to main dashboard',
            action: () => router.navigate('/dashboard'),
        });

        this.addCommand({
            title: 'Open Evidence Vault',
            description: 'View evidence storage',
            action: () => router.navigate('/vault'),
        });

        this.addCommand({
            title: 'View Timeline',
            description: 'Forensic timeline reconstruction',
            action: () => router.navigate('/timeline'),
        });

        this.addCommand({
            title: 'Generate Report',
            description: 'Create forensic report',
            action: () => router.navigate('/report'),
        });

        this.addCommand({
            title: 'New Case',
            description: 'Start a new investigation',
            action: () => this.promptNewCase(),
        });
    }

    addCommand(command) {
        this.commands.push(command);
    }

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.palette.classList.add('active');
        document.getElementById('command-overlay').classList.add('active');
        this.searchInput.focus();
        this.renderCommands();
    }

    close() {
        this.palette.classList.remove('active');
        document.getElementById('command-overlay').classList.remove('active');
        this.searchInput.value = '';
        this.selectedIndex = 0;
    }

    isOpen() {
        return this.palette.classList.contains('active');
    }

    renderCommands(filter = '') {
        const filtered = this.commands.filter(cmd =>
            cmd.title.toLowerCase().includes(filter.toLowerCase()) ||
            cmd.description.toLowerCase().includes(filter.toLowerCase())
        );

        this.commandList.innerHTML = filtered.map((cmd, index) => `
      <div class="command-item ${index === this.selectedIndex ? 'selected' : ''}" data-index="${index}">
        <div class="command-item-title">${cmd.title}</div>
        <div class="command-item-description">${cmd.description}</div>
      </div>
    `).join('');

        // Add click handlers
        this.commandList.querySelectorAll('.command-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                filtered[index].action();
                this.close();
            });
        });
    }

    handleKeyboard(e) {
        const items = this.commandList.querySelectorAll('.command-item');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateSelection();
                break;

            case 'Enter':
                e.preventDefault();
                const selected = items[this.selectedIndex];
                if (selected) {
                    selected.click();
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.close();
                break;
        }
    }

    updateSelection() {
        const items = this.commandList.querySelectorAll('.command-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }

    promptNewCase() {
        const caseId = prompt('Enter Case ID:');
        if (caseId) {
            session.setCase(caseId);
            showToast(`Case ${caseId} activated`, 'success');
            router.navigate('/dashboard');
        }
    }
}

/**
 * Form Validation
 */
class FormValidator {
    static validate(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        const inputs = form.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--color-danger)';

                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });

        if (!isValid) {
            showToast('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    static getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }
}

/**
 * File Upload Handler
 */
class FileUpload {
    constructor(inputId, options = {}) {
        this.input = document.getElementById(inputId);
        this.options = {
            maxSize: 100 * 1024 * 1024, // 100MB default
            allowedTypes: [],
            ...options,
        };
        this.file = null;
        this.init();
    }

    init() {
        if (!this.input) return;

        this.input.addEventListener('change', (e) => {
            this.handleFile(e.target.files[0]);
        });
    }

    handleFile(file) {
        if (!file) return;

        // Validate file size
        if (file.size > this.options.maxSize) {
            showToast(`File too large. Max size: ${this.options.maxSize / 1024 / 1024}MB`, 'error');
            return;
        }

        // Validate file type
        if (this.options.allowedTypes.length > 0) {
            const fileType = file.type || file.name.split('.').pop();
            if (!this.options.allowedTypes.includes(fileType)) {
                showToast('Invalid file type', 'error');
                return;
            }
        }

        this.file = file;

        if (this.options.onSelect) {
            this.options.onSelect(file);
        }
    }

    getFile() {
        return this.file;
    }

    reset() {
        this.file = null;
        if (this.input) {
            this.input.value = '';
        }
    }
}

/**
 * Keyboard Shortcuts
 */
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombo(e);
            const handler = this.shortcuts.get(key);

            if (handler) {
                e.preventDefault();
                handler();
            }
        });
    }

    register(combo, handler) {
        this.shortcuts.set(combo, handler);
    }

    getKeyCombo(e) {
        const parts = [];

        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');
        if (e.metaKey) parts.push('Meta');

        parts.push(e.key.toUpperCase());

        return parts.join('+');
    }
}

/**
 * Utility Functions
 */

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleString();
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard', 'success');
    } catch (error) {
        showToast('Failed to copy', 'error');
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize global UI components
let commandPalette;
let shortcuts;

document.addEventListener('DOMContentLoaded', () => {
    commandPalette = new CommandPalette();
    shortcuts = new KeyboardShortcuts();

    // Register global shortcuts
    shortcuts.register('Ctrl+K', () => commandPalette.toggle());
    shortcuts.register('Escape', () => {
        // Close any open modals
        document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
            overlay.classList.remove('active');
        });
    });
});

/**
 * Export utilities
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Modal,
        CommandPalette,
        FormValidator,
        FileUpload,
        KeyboardShortcuts,
        formatFileSize,
        formatDate,
        copyToClipboard,
        debounce,
        throttle,
        generateId,
    };
}

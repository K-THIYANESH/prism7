import { MODULES_CONFIG } from './modules-config.js';
import { ModulePage } from '../pages/ModulePage.js';
import { VaultPage } from '../pages/VaultPage.js';

export class Router {
    constructor() {
        this.appContainer = document.getElementById('app-content');
        this.currentModule = null;
    }

    init() {
        // Handle navigation clicks
        document.querySelectorAll('[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.target.closest('[data-link]').dataset.link;
                this.navigate(route);
            });
        });

        // Default route
        this.navigate('dashboard');
    }

    navigate(route) {
        this.appContainer.innerHTML = ''; // Clear current view

        if (route === 'dashboard') {
            this.renderDashboard();
        } else if (MODULES_CONFIG[route]) {
            this.renderModule(route);
        } else {
            this.appContainer.innerHTML = '<h1>404 Not Found</h1>';
        }

        // Update active sidebar state (if we had a sidebar)
    }

    renderDashboard() {
        this.appContainer.innerHTML = `
            <h1 class="text-cyan mb-2">Command Center</h1>
            <p class="text-dim mb-4">Select a module to begin investigation</p>
            <div class="dashboard-grid">
                ${Object.values(MODULES_CONFIG).map(mod => `
                    <div class="glass-card module-card-link" data-id="${mod.id}">
                        <div class="text-3xl mb-2">${mod.icon}</div>
                        <h3 class="text-cyan">${mod.title}</h3>
                        <p class="text-dim text-sm">${mod.description}</p>
                    </div>
                `).join('')}
            </div>
        `;

        // Attach clicks to dashboard cards
        this.appContainer.querySelectorAll('.module-card-link').forEach(card => {
            card.addEventListener('click', () => {
                this.navigate(card.dataset.id);
            });
        });
    }

    renderModule(moduleId) {
        const config = MODULES_CONFIG[moduleId];
        let page;

        if (moduleId === 'vault') {
            page = new VaultPage(moduleId, config);
        } else {
            page = new ModulePage(moduleId, config);
        }

        page.render(this.appContainer);
    }
}

import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if boot sequence has run this session
    if (!sessionStorage.getItem('booted')) {
        runBootSequence();
    } else {
        initApp();
    }
});

function runBootSequence() {
    const bootContainer = document.createElement('div');
    bootContainer.style.position = 'fixed';
    bootContainer.style.top = '0';
    bootContainer.style.left = '0';
    bootContainer.style.width = '100vw';
    bootContainer.style.height = '100vh';
    bootContainer.style.background = '#000';
    bootContainer.style.zIndex = '99999';
    bootContainer.style.display = 'flex';
    bootContainer.style.flexDirection = 'column';
    bootContainer.style.justifyContent = 'center';
    bootContainer.style.alignItems = 'center';
    bootContainer.style.color = '#0aff99';
    bootContainer.style.fontFamily = 'monospace';
    bootContainer.innerHTML = `
        <div class="typewriter" style="font-size: 1.5rem; margin-bottom: 1rem;">INITIALIZING PRISM7 PROTOCOL...</div>
        <div id="boot-status" style="color: #00f3ff; font-size: 0.9rem; opacity: 0; transition: opacity 0.5s;"></div>
    `;

    document.body.appendChild(bootContainer);

    setTimeout(() => {
        const status = document.getElementById('boot-status');
        status.style.opacity = '1';
        status.innerHTML = `
            > LOADING CORE MODULES... OK<br>
            > ESTABLISHING SECURE CONNECTION... OK<br>
            > VERIFYING INTEGRITY... OK
        `;
    }, 2000);

    setTimeout(() => {
        bootContainer.style.transition = 'opacity 1s ease';
        bootContainer.style.opacity = '0';
        setTimeout(() => {
            bootContainer.remove();
            sessionStorage.setItem('booted', 'true');
            initApp();
        }, 1000);
    }, 4500);
}

function initApp() {
    const router = new Router();
    router.init();
}

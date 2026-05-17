/**
 * PRISM7 Visual Engine
 * Handles 3D Cursor, Particles, and Background Effects
 */

class VisualEngine {
    constructor() {
        this.initCursor();
        this.initParticles();
        this.addSoundEffects();
    }

    initCursor() {
        // Native cursor restored by user request
    }

    initParticles() {
        const container = document.getElementById('particle-background');
        if (!container) return;

        // Create random floating particles
        for (let i = 0; i < 50; i++) {
            const part = document.createElement('div');
            part.classList.add('particle');
            part.style.position = 'absolute';
            part.style.background = 'var(--c2)';
            part.style.borderRadius = '50%';
            part.style.opacity = '0.5';

            // Random positioning
            part.style.left = Math.random() * 100 + '%';
            part.style.top = Math.random() * 100 + '%';

            // Random size
            const size = Math.random() * 4 + 1;
            part.style.width = size + 'px';
            part.style.height = size + 'px';

            // Random delay
            part.style.animation = `pulse-opac ${Math.random() * 10 + 5}s infinite ease-in-out`;
            part.style.animationDelay = (Math.random() * 5) + 's';

            container.appendChild(part);
        }
    }

    addSoundEffects() {
        // Optional: Simple UI tick sounds could go here
    }
}

// Global auto-boot
document.addEventListener('DOMContentLoaded', () => {
    window.PrismVisuals = new VisualEngine();
});

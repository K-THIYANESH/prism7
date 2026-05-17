/**
 * PRISM7 - Animation Controllers
 * Background effects and visual animations
 */

/**
 * Particle Background System
 */
class ParticleBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        if (!this.container) return;

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }

        // Animate particles
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation duration
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';

        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        // Particles are animated via CSS
        // This method can be extended for more complex animations
    }

    destroy() {
        this.particles.forEach(p => p.remove());
        this.particles = [];
    }
}

/**
 * Matrix Rain Effect
 */
class MatrixRain {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.columns = [];
        this.columnCount = 20;
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.init();
    }

    init() {
        if (!this.container) return;

        // Create columns
        for (let i = 0; i < this.columnCount; i++) {
            this.createColumn(i);
        }
    }

    createColumn(index) {
        const column = document.createElement('div');
        column.className = 'matrix-column';

        // Random position
        column.style.left = (index * (100 / this.columnCount)) + '%';

        // Random animation duration
        column.style.animationDuration = (Math.random() * 5 + 5) + 's';
        column.style.animationDelay = Math.random() * 5 + 's';

        // Random characters
        const charCount = Math.floor(Math.random() * 10) + 5;
        let text = '';
        for (let i = 0; i < charCount; i++) {
            text += this.chars.charAt(Math.floor(Math.random() * this.chars.length)) + '<br>';
        }
        column.innerHTML = text;

        this.container.appendChild(column);
        this.columns.push(column);
    }

    destroy() {
        this.columns.forEach(c => c.remove());
        this.columns = [];
    }
}

/**
 * Typing Effect
 */
class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start() {
        return new Promise((resolve) => {
            const type = () => {
                if (this.index < this.text.length) {
                    this.element.textContent += this.text.charAt(this.index);
                    this.index++;
                    setTimeout(type, this.speed);
                } else {
                    resolve();
                }
            };
            type();
        });
    }

    reset() {
        this.element.textContent = '';
        this.index = 0;
    }
}

/**
 * Number Counter Animation
 */
class CounterAnimation {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.current = 0;
    }

    start() {
        const increment = this.target / (this.duration / 16);
        const timer = setInterval(() => {
            this.current += increment;
            if (this.current >= this.target) {
                this.current = this.target;
                clearInterval(timer);
            }
            this.element.textContent = Math.floor(this.current);
        }, 16);
    }
}

/**
 * Progress Ring Animation
 */
class ProgressRing {
    constructor(svgId, percentage = 0) {
        this.svg = document.getElementById(svgId);
        this.circle = this.svg?.querySelector('circle');
        this.percentage = percentage;
        this.radius = 45;
        this.circumference = 2 * Math.PI * this.radius;
        this.init();
    }

    init() {
        if (!this.circle) return;

        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;
    }

    setProgress(percentage) {
        this.percentage = percentage;
        const offset = this.circumference - (percentage / 100) * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }

    animate(targetPercentage, duration = 1000) {
        const start = this.percentage;
        const diff = targetPercentage - start;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = start + (diff * progress);
            this.setProgress(current);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }
}

/**
 * Parallax Mouse Effect
 */
class ParallaxMouse {
    constructor(selector, intensity = 20) {
        this.elements = document.querySelectorAll(selector);
        this.intensity = intensity;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * this.intensity;
            const y = (e.clientY / window.innerHeight - 0.5) * this.intensity;

            this.elements.forEach(element => {
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

/**
 * Scroll Reveal Animation
 */
class ScrollReveal {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.options = {
            threshold: 0.1,
            rootMargin: '0px',
            ...options,
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Glitch Effect
 */
class GlitchEffect {
    constructor(element, duration = 100) {
        this.element = element;
        this.duration = duration;
        this.originalText = element.textContent;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    }

    trigger() {
        let iterations = 0;
        const maxIterations = 10;

        const interval = setInterval(() => {
            this.element.textContent = this.originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return this.originalText[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');

            iterations++;

            if (iterations > maxIterations) {
                clearInterval(interval);
                this.element.textContent = this.originalText;
            }
        }, this.duration);
    }
}

/**
 * Boot Sequence Animation
 */
class BootSequence {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.lines = [
            'Initializing PRISM7 System...',
            'Loading Security Protocols...',
            'Connecting to Blockchain Vault...',
            'Verifying Evidence Database...',
            'System Ready.',
        ];
        this.currentLine = 0;
    }

    async start() {
        if (!this.container) return;

        for (const line of this.lines) {
            await this.addLine(line);
            await this.delay(500);
        }

        // Update progress bar
        this.updateProgress(100);
        await this.delay(1000);
    }

    async addLine(text) {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.style.color = 'var(--color-cyan)';

        this.container.appendChild(line);

        const typing = new TypingEffect(line, `> ${text}`, 30);
        await typing.start();
    }

    updateProgress(percentage) {
        const progressBar = document.querySelector('.boot-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Initialize Background Effects
 */
function initBackgroundEffects() {
    // Check if elements exist
    const particleContainer = document.getElementById('particle-background');
    const matrixContainer = document.getElementById('matrix-rain');

    if (particleContainer) {
        new ParticleBackground('particle-background');
    }

    if (matrixContainer) {
        new MatrixRain('matrix-rain');
    }

    // Add scanline effect
    if (!document.querySelector('.scanline')) {
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        document.body.appendChild(scanline);
    }

    // Add grid background
    if (!document.querySelector('.grid-background')) {
        const grid = document.createElement('div');
        grid.className = 'grid-background';
        document.body.appendChild(grid);
    }
}

/**
 * Auto-initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundEffects();
});

/**
 * Export animation classes
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleBackground,
        MatrixRain,
        TypingEffect,
        CounterAnimation,
        ProgressRing,
        ParallaxMouse,
        ScrollReveal,
        GlitchEffect,
        BootSequence,
        initBackgroundEffects,
    };
}

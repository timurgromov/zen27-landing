document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
            return;
        }

        link.addEventListener('click', event => {
            event.preventDefault();
            targetElement.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    const animatedElements = document.querySelectorAll('[data-animate]');
    if (prefersReducedMotion) {
        animatedElements.forEach(el => el.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    const accordionItems = document.querySelectorAll('.accordion__item');
    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion__trigger');
        const content = item.querySelector('.accordion__content');
        if (!trigger || !content) {
            return;
        }

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherTrigger = otherItem.querySelector('.accordion__trigger');
                    const otherContent = otherItem.querySelector('.accordion__content');
                    if (otherTrigger && otherContent) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        otherItem.classList.remove('is-open');
                        otherContent.style.maxHeight = null;
                    }
                }
            });

            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                item.classList.remove('is-open');
                content.style.maxHeight = null;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                item.classList.add('is-open');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    if (!prefersReducedMotion) {
        const tiltPanels = document.querySelectorAll('[data-tilt]');
        const maxTilt = 6;

        tiltPanels.forEach(panel => {
            panel.addEventListener('mousemove', event => {
                const rect = panel.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;
                const percentX = (offsetX / rect.width) * 2 - 1;
                const percentY = (offsetY / rect.height) * 2 - 1;

                const tiltX = (maxTilt * percentX * -1).toFixed(2);
                const tiltY = (maxTilt * percentY).toFixed(2);

                panel.style.setProperty('--tilt-x', `${tiltX}deg`);
                panel.style.setProperty('--tilt-y', `${tiltY}deg`);
            });

            panel.addEventListener('mouseleave', () => {
                panel.style.setProperty('--tilt-x', '0deg');
                panel.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    // PATCH BEGIN: PROOF_JS
    // Load and render proof statistics
    const loadProofStats = async () => {
        try {
            const response = await fetch('data/stats.json');
            if (!response.ok) throw new Error('Failed to load stats');
            const data = await response.json();
            
            const pulseProduct = data.products.find(p => p.name === 'Zen27 Pulse');
            if (!pulseProduct || !pulseProduct.scenarios.length) return;
            
            const ethScenario = pulseProduct.scenarios.find(s => s.asset === 'ETH');
            if (!ethScenario) return;
            
            // Update metrics
            const updateMetric = (selector, value) => {
                const element = document.querySelector(`[data-metric="${selector}"]`);
                if (element) element.textContent = value;
            };
            
            updateMetric('trades', ethScenario.trades);
            updateMetric('winrate', `${ethScenario.winratePct}%`);
            updateMetric('profitFactor', ethScenario.profitFactor);
            updateMetric('maxDrawdown', `${ethScenario.maxDrawdownPct}%`);
            updateMetric('roi', `+${ethScenario.roiPct}%`);
            updateMetric('period', ethScenario.period);
            
            // Update note
            const noteElement = document.querySelector('[data-note="note"]');
            if (noteElement) noteElement.textContent = ethScenario.note;
            
            // Handle sparkline placeholder
            const sparklineElement = document.querySelector('[data-chart="equity"]');
            if (sparklineElement && (!ethScenario.equity || ethScenario.equity.length === 0)) {
                const placeholder = sparklineElement.querySelector('.sparkline__placeholder');
                if (placeholder) placeholder.textContent = 'Данные графика недоступны';
            }
            
        } catch (error) {
            console.warn('Failed to load proof stats:', error);
            // Show fallback message
            const noteElement = document.querySelector('[data-note="note"]');
            if (noteElement) noteElement.textContent = 'Данные временно недоступны';
        }
    };
    
    // Load stats when DOM is ready
    loadProofStats();
    // PATCH END: PROOF_JS
});

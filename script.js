document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Modal functionality
    const modal = document.getElementById('tradingViewModal');
    const tryFreeBtn = document.getElementById('tryFreeBtn');
    const tryDemoBtn = document.getElementById('tryDemoBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const overlay = modal?.querySelector('.modal__overlay');

    if (tryFreeBtn && modal) {
        tryFreeBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (tryDemoBtn && modal) {
        tryDemoBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Workflow demo button
    const workflowDemoBtn = document.getElementById('workflowDemoBtn');
    if (workflowDemoBtn && modal) {
        workflowDemoBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
        if (e.key === 'Escape' && privacyModal?.classList.contains('active')) {
            closePrivacyModal();
        }
        if (e.key === 'Escape' && consentModal?.classList.contains('active')) {
            closeConsentModal();
        }
    });

    // Privacy Policy Modal
    const privacyModal = document.getElementById('privacyModal');
    const privacyLink = document.getElementById('privacyLink');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');
    const privacyOverlay = privacyModal?.querySelector('.modal__overlay');

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Consent Modal
    const consentModal = document.getElementById('consentModal');
    const consentLink = document.getElementById('consentLink');
    const closeConsentBtn = document.getElementById('closeConsentModal');
    const consentOverlay = consentModal?.querySelector('.modal__overlay');

    if (consentLink && consentModal) {
        consentLink.addEventListener('click', (e) => {
            e.preventDefault();
            consentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closePrivacyModal = () => {
        if (privacyModal) {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const closeConsentModal = () => {
        if (consentModal) {
            consentModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener('click', closePrivacyModal);
    }

    if (privacyOverlay) {
        privacyOverlay.addEventListener('click', closePrivacyModal);
    }

    if (closeConsentBtn) {
        closeConsentBtn.addEventListener('click', closeConsentModal);
    }

    if (consentOverlay) {
        consentOverlay.addEventListener('click', closeConsentModal);
    }

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

});

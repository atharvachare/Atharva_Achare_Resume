/* ============================================
   ATHARVA ACHARE – PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────────────────
    // 1. PARTICLE BACKGROUND
    // ──────────────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = Math.random() > 0.5 ? '6, 237, 249' : '168, 85, 247';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        this.x -= dx * 0.01;
                        this.y -= dy * 0.01;
                        this.opacity = Math.min(0.7, this.opacity + 0.02);
                    }
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 237, 249, ${0.06 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ──────────────────────────────────────────
    // 2. SCROLL REVEAL (Intersection Observer)
    // ──────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, .timeline-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Don't unobserve – allows re-triggering if needed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ──────────────────────────────────────────
    // 3. ANIMATED SKILL BARS
    // ──────────────────────────────────────────
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-width');
                entry.target.style.width = targetWidth;
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ──────────────────────────────────────────
    // 4. COUNTER ANIMATION
    // ──────────────────────────────────────────
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.floor(eased * target);
                    el.textContent = current + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        el.textContent = target + suffix;
                    }
                }
                requestAnimationFrame(updateCount);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ──────────────────────────────────────────
    // 5. ACTIVE NAV HIGHLIGHTING
    // ──────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));

    // ──────────────────────────────────────────
    // 6. SMOOTH SCROLL
    // ──────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // ──────────────────────────────────────────
    // 7. MOBILE HAMBURGER MENU
    // ──────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                hamburger.classList.add('active');
                mobileMenu.classList.add('open');
                mobileOverlay.classList.add('visible');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // ──────────────────────────────────────────
    // 8. SCROLL-TO-TOP BUTTON
    // ──────────────────────────────────────────
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ──────────────────────────────────────────
    // 9. NAV BACKGROUND ON SCROLL
    // ──────────────────────────────────────────
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.borderBottomColor = 'rgba(6, 237, 249, 0.15)';
            nav.style.background = 'rgba(10, 22, 23, 0.95)';
        } else {
            nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
            nav.style.background = 'rgba(10, 22, 23, 0.8)';
        }
    });

    // ──────────────────────────────────────────
    // 10. TYPEWRITER EFFECT (JS fallback)
    // ──────────────────────────────────────────
    const typewriterEl = document.getElementById('typewriter-text');
    if (typewriterEl) {
        const text = typewriterEl.getAttribute('data-text');
        typewriterEl.textContent = '';
        typewriterEl.style.width = 'auto';
        typewriterEl.style.opacity = '1';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 40 + Math.random() * 30);
            }
        }
        setTimeout(typeChar, 800);
    }

    // ──────────────────────────────────────────
    // 11. CONTACT FORM EMAIL INTEGRATION (EmailJS)
    // ──────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const originalBtnText = btnText ? btnText.textContent : 'SEND MESSAGE';

    // IMPORTANT: Replace with your actual Public Key from EmailJS
    // emailjs.init("YOUR_PUBLIC_KEY");

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Check if EmailJS is initialized
            if (typeof emailjs === 'undefined') {
                alert('EmailJS is not loaded yet. Please try again in a moment.');
                return;
            }

            // Visual Feedback: Loading
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'SENDING...';

            // IMPORTANT: Replace these with your actual Service ID and Template ID
            const serviceID = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // Success
                    if (btnText) btnText.textContent = 'MESSAGE SENT!';
                    if (submitBtn) submitBtn.style.backgroundColor = '#10b981'; // Green

                    alert('Success! Your message has been sent.');
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        if (btnText) btnText.textContent = originalBtnText;
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.style.backgroundColor = ''; // Reset to CSS default
                        }
                    }, 3000);
                }, (err) => {
                    // Error
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'FAILED TO SEND';

                    alert('FAILED... ' + JSON.stringify(err));

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        if (btnText) btnText.textContent = originalBtnText;
                    }, 3000);
                });
        });
    }

});

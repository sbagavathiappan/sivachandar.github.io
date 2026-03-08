// Main JavaScript - Scroll Reveal & Carousel
(function() {
    'use strict';

    // Scroll Reveal
    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // Carousel
    function initCarousel() {
        window.scrollCarousel = function(direction) {
            const carousel = document.getElementById('info-carousel');
            if (!carousel) return;
            
            const scrollAmount = carousel.clientWidth > 800 ? 832 : carousel.clientWidth * 0.85 + 32; 
            if (direction === 'left') {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        };
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const menuBtn = document.querySelector('[aria-label="Toggle menu"]');
        const navLinks = document.querySelector('.hidden.md\\:flex');
        
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                const isHidden = navLinks.classList.contains('hidden');
                if (isHidden) {
                    navLinks.classList.remove('hidden');
                    navLinks.classList.add('flex', 'flex-col', 'absolute', 'top-20', 'left-0', 'right-0', 'bg-brand-pearl', 'p-6', 'space-y-4', 'border-b', 'border-black/5');
                    menuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
                } else {
                    navLinks.classList.add('hidden');
                    navLinks.classList.remove('flex', 'flex-col', 'absolute', 'top-20', 'left-0', 'right-0', 'bg-brand-pearl', 'p-6', 'space-y-4', 'border-b', 'border-black/5');
                    menuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollReveal();
            initCarousel();
            initMobileMenu();
        });
    } else {
        initScrollReveal();
        initCarousel();
        initMobileMenu();
    }
})();

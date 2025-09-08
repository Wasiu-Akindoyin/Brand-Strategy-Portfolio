// ===== DOM CONTENT LOADED ===== 
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION FUNCTION =====
function initializeWebsite() {
    setupSmoothScrolling();
    setupScrollAnimations();
    setupMobileMenu();
    setupContactForm();
    setupActiveNavigation();
    setupHeaderScroll();
}

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
            }
        });
    });
}

// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// ===== MOBILE MENU FUNCTIONALITY =====
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Update button text/icon
            const isOpen = navMenu.classList.contains('active');
            this.textContent = isOpen ? '✕' : '☰';
            this.setAttribute('aria-expanded', isOpen);
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ===== CONTACT FORM HANDLING =====
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // If using Netlify forms, allow default submission
            if (this.hasAttribute('netlify')) {
                return;
            }
            
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // Basic validation
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('.cta-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showFormFeedback('success', 'Thank you! Your message has been sent. I\'ll get back to you within 24 hours.');
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name) errors.push('Name is required');
    if (!data.email) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email');
    if (!data.message) errors.push('Message is required');
    
    if (errors.length > 0) {
        showFormFeedback('error', errors.join(', '));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormFeedback(type, message) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 5px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    
    // Insert after form
    const form = document.querySelector('.contact-form');
    form.appendChild(feedback);
    
    // Remove feedback after 5 seconds
    setTimeout(() => {
        feedback.remove();
    }, 5000);
}

// ===== ACTIVE NAVIGATION ON SCROLL =====
function setupActiveNavigation() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ===== HEADER SCROLL EFFECTS =====
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    if (!header) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
}

// ===== UTILITY FUNCTIONS =====

// Throttle function to limit how often a function can be called
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function to delay execution until after calls have stopped
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== SERVICE WORKER REGISTRATION (OPTIONAL) =====
// Uncomment if you want to add PWA capabilities
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images when they come into viewport (if you add images later)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ===== ANALYTICS TRACKING (OPTIONAL) =====
// Add your analytics code here
function trackEvent(category, action, label) {
    // Google Analytics 4 example:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.cta-btn')) {
        trackEvent('Button', 'Click', 'CTA Button');
    }
    
    if (e.target.matches('.case-link')) {
        trackEvent('Link', 'Click', 'Case Study');
    }
    
    if (e.target.matches('.social-link')) {
        trackEvent('Social', 'Click', 'Social Media Link');
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-gold);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main';
        mainContent.setAttribute('role', 'main');
    }
}

// Initialize accessibility features
setupAccessibility();

// ===== CONSOLE GREETING =====
console.log(`
🎨 Brand Strategist Portfolio
Built with vanilla HTML, CSS, and JavaScript
Optimized for performance and accessibility

Need help with your startup's brand?
Get in touch: sarah@sarahchenstrategy.com
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        isValidEmail,
        throttle,
        debounce
    };
}
// Project Idol - Main JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    createParticles();
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initGallery();
    initShowsLightbox(); // New function for shows section
    initLoader();
    initMobileMenu();
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        // Create mask shape
        particle.innerHTML = `
            <svg width="20" height="20" fill="rgba(139, 92, 246, 0.3)" viewBox="0 0 100 100">
                <path d="M50 10 L30 30 L20 50 L30 70 L50 80 L70 70 L80 50 L70 30 Z"/>
            </svg>
        `;

        particlesContainer.appendChild(particle);
    }
}

// Navigation scroll effect
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate member cards sequentially
                if (entry.target.querySelector('.members-grid')) {
                    const cards = entry.target.querySelectorAll('.member-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }

                // Animate gallery items sequentially
                if (entry.target.querySelector('.gallery')) {
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.fade-section').forEach(section => {
        observer.observe(section);
    });

    // Initially hide member cards and gallery items
    document.querySelectorAll('.member-card, .gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
    });
}

// Gallery lightbox functionality
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const lightbox = createLightbox(img.src, img.alt);
            document.body.appendChild(lightbox);

            // Animate in
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
        });
    });
}

// Gallery filtering functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Function to filter gallery items
    function filterGallery(filter) {
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Set Live Shows as default on page load
    filterGallery('live');

    // Set the Live Shows button as active by default
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'live') {
            btn.classList.add('active');
        }
    });

    // Add click handlers for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            filterGallery(filter);
        });
    });
});

// Shows section lightbox functionality (NEW)
function initShowsLightbox() {
    // Set up click handlers for poster items in shows section
    const posterItems = document.querySelectorAll('.poster-item');

    posterItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior if it's an anchor
            const img = this.querySelector('img');
            if (img) {
                openShowLightbox(img.src, img.alt);
            }
        });
    });
}

// Open lightbox for shows section (NEW)
function openShowLightbox(src, alt) {
    const lightbox = createLightbox(src, alt);
    document.body.appendChild(lightbox);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
}

// Create lightbox element (UPDATED to work for both gallery and shows)
function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}">
        </div>
    `;

    // Close on click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
            closeLightbox(lightbox);
        }
    });

    // Close on escape key
    const escapeHandler = function (e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    return lightbox;
}

// Close lightbox helper function (NEW)
function closeLightbox(lightbox) {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
        setTimeout(() => {
            lightbox.remove();
        }, 300);
    }
}

// Page loader
function initLoader() {
    // Create loader if it doesn't exist
    if (!document.querySelector('.loader')) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="loader-content">
                <svg class="loader-mask" viewBox="0 0 100 100" fill="#8b5cf6">
                    <path d="M50 10 L30 30 L20 50 L30 70 L50 80 L70 70 L80 50 L70 30 Z" 
                          stroke="currentColor" stroke-width="2"/>
                </svg>
                <div class="loader-text">LOADING</div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    // Hide loader when page is fully loaded
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 500);
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// Add hover effect to member cards
document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.05)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add dynamic year to footer
document.addEventListener('DOMContentLoaded', function () {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
});

// Lightbox styles (inject into head)
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 10, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: zoom-out;
    }
    
    .lightbox.active {
        opacity: 1;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        width: auto;
        height: auto;
        display: block;
        border: 2px solid var(--primary-purple);
        border-radius: 10px;
        box-shadow: 0 0 50px rgba(139, 92, 246, 0.5);
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: var(--primary-purple);
        font-size: 40px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 2001;
    }
    
    .lightbox-close:hover {
        color: var(--accent-purple);
        transform: scale(1.2);
    }
    
    @media (max-width: 768px) {
        .lightbox-content {
            max-width: 95%;
            max-height: 95%;
        }
        
        .lightbox-close {
            top: 20px;
            right: 20px;
            background: rgba(10, 10, 10, 0.8);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
    }
`;

// Inject lightbox styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// ===========================
// Donation Modal Functions
// ===========================

// Open donation modal
function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Add escape key listener
        const escapeHandler = function (e) {
            if (e.key === 'Escape') {
                closeDonationModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Close donation modal
function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside content
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeDonationModal();
            }
        });
    }
});
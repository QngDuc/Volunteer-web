let slideIndex = 1;
let autoSlideInterval;

// Show slides when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);
    startAutoSlide();
});

// Next/previous controls
function changeSlide(n) {
    showSlides(slideIndex += n);
    resetAutoSlide();
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
    resetAutoSlide();
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dots[i].classList.remove("active");
    }
    
    // Show the current slide
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].classList.add("active");
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Navbar and Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    let touchStartX = 0;
    let touchEndX = 0;

    // Navbar scroll effect with opacity
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.opacity = '0.98';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.opacity = '1';
        }
    });

    // Mobile menu toggle with animation
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Handle touch events for mobile menu
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeThreshold = 100;
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - close menu
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - open menu
            mobileMenuBtn.classList.add('active');
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navLinks.contains(e.target);
        const isClickOnBtn = mobileMenuBtn.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnBtn && navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Set active link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // Smooth scroll with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                const offsetTop = document.querySelector(href).offsetTop;
                const navHeight = navbar.offsetHeight;
                
                window.scrollTo({
                    top: offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect for nav links
    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            if (!link.classList.contains('btn')) {
                const rect = link.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'nav-link-ripple';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                link.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 1000);
            }
        });
    });
});
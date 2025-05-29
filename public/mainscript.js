import emailjs from 'emailjs-com';

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let userPoints = 850;

    // Simulate stats counting
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                if (current >= target) {
                    stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                }
            }, 20);
        });
    }

    // Intersection Observer setup
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats();
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Scroll handler
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 100);
        
        // Update active nav link
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(current));
        });
    });

    // Handle contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.textContent = 'Đang gửi...';
            btn.disabled = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                showNotification('Tin nhắn của bạn đã được gửi thành công!', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
            }

            btn.textContent = 'Gửi tin nhắn';
            btn.disabled = false;
        });
    }

    // Helper function for notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Initialize animations
    setTimeout(animateStats, 1000);
});
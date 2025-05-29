import emailjs from 'emailjs-com';
// Animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
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
});
    // Animate elements when they enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats();
                }
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Update active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Đang gửi...';
            btn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = 'Tin nhắn của bạn đã được gửi thành công!';
                contactForm.insertBefore(successMessage, contactForm.firstChild);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } catch (error) {
                console.error('Error:', error);
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-error';
                errorMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
                contactForm.insertBefore(errorMessage, contactForm.firstChild);
                
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        });
    }

    // Points system animation
    function simulateActivity() {
        const pointsElement = document.getElementById('userPoints');
        const progressBar = document.querySelector('.progress');
        const levelElement = document.getElementById('userLevel');
        
        if (pointsElement && progressBar) {
            let currentPoints = parseInt(pointsElement.textContent);
            const newPoints = currentPoints + Math.floor(Math.random() * 10) + 1;
            
            // Animate points increase
            const pointsTimer = setInterval(() => {
                currentPoints++;
                pointsElement.textContent = currentPoints;
                
                // Update progress bar
                const progress = (currentPoints % 1000) / 1000 * 100;
                progressBar.style.width = `${progress}%`;
                
                // Update level
                if (currentPoints >= 1000) {
                    levelElement.textContent = 'Tình Nguyện Viên Vàng';
                } else if (currentPoints >= 500) {
                    levelElement.textContent = 'Tình Nguyện Viên Bạc';
                }
                
                if (currentPoints >= newPoints) {
                    clearInterval(pointsTimer);
                }
            }, 50);
        }
    }

    // Make simulateActivity available globally
    window.simulateActivity = simulateActivity;

    // Points System
let userPoints = 850;

function updatePoints(newPoints) {
    const pointsDisplay = document.getElementById('userPoints');
    const oldPoints = parseInt(pointsDisplay.textContent);
    
    // Animate points change
    pointsDisplay.classList.add('points-changing');
    pointsDisplay.textContent = newPoints;
    
    // Update all "Bạn có: X điểm" displays
    document.querySelectorAll('.points-have').forEach(el => {
        el.textContent = `Bạn có: ${newPoints} điểm`;
    });

    // Update progress bars
    document.querySelectorAll('.rewards-list li').forEach(li => {
        const pointsNeeded = parseInt(li.querySelector('.points-needed').textContent);
        const progress = li.querySelector('.progress');
        const button = li.querySelector('.btn-redeem');
        
        const percentage = Math.min((newPoints / pointsNeeded) * 100, 100);
        progress.style.width = `${percentage}%`;

        // Update button state
        if (newPoints >= pointsNeeded) {
            button.disabled = false;
            button.textContent = 'Đổi Ngay';
        } else {
            button.disabled = true;
            button.textContent = 'Chưa đủ điểm';
        }
    });

    // Remove animation class
    setTimeout(() => {
        pointsDisplay.classList.remove('points-changing');
    }, 500);
}

function redeemReward(button, points) {
    const li = button.closest('li');
    const rewardName = li.querySelector('.reward-name').textContent;
    const rewardDescription = li.querySelector('.reward-description').textContent;

    if (userPoints >= points) {
        // Show email confirmation modal
        showEmailModal(rewardName, points, rewardDescription, async (email) => {
            // Show loading state
            li.classList.add('redeeming');
            
            // Try to send email
            const emailSent = await sendRewardEmail(email, rewardName, points, rewardDescription);
            
            if (emailSent) {
                // Update points only if email was sent successfully
                userPoints -= points;
                updatePoints(userPoints);
                
                // Save email for future use
                localStorage.setItem('rewardEmail', email);
                
                // Update UI
                setTimeout(() => {
                    li.classList.remove('redeeming');
                    button.disabled = userPoints < points;
                    if (button.disabled) {
                        button.textContent = 'Chưa đủ điểm';
                    }
                }, 500);
            } else {
                // Remove loading state if email failed
                li.classList.remove('redeeming');
            }
        });
    } else {
        showNotification('Bạn không đủ điểm để đổi phần thưởng này.', 'error');
    }
}

// Enhanced modal for email confirmation
function showEmailModal(rewardName, points, rewardDescription, onSuccess) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    modal.innerHTML = `
        <div class="email-modal-content">
            <h3>Xác Nhận Đổi Thưởng</h3>
            <div class="reward-details">
                <p class="reward-title">${rewardName}</p>
                <p class="reward-desc">${rewardDescription}</p>
                <div class="points-info">
                    <p>Điểm cần thiết: <span class="points">${points}</span></p>
                    <p>Điểm còn lại: <span class="points">${userPoints - points}</span></p>
                </div>
            </div>
            <form id="rewardEmailForm">
                <div class="form-group">
                    <label for="rewardEmail">Email nhận thông tin đổi thưởng:</label>
                    <input type="email" id="rewardEmail" required 
                           placeholder="Nhập email của bạn"
                           value="${localStorage.getItem('rewardEmail') || ''}"
                           autocomplete="email">
                    <small class="form-text">Email xác nhận sẽ được gửi đến địa chỉ này</small>
                </div>
                <div class="button-group">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check"></i> Xác Nhận
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeEmailModal()">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                </div>
            </form>
        </div>
    `;

    // Add modal to document
    document.body.appendChild(modal);

    // Handle form submission
    const form = modal.querySelector('#rewardEmailForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('#rewardEmail').value;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        submitBtn.disabled = true;

        try {
            // Call the success callback with the email
            await onSuccess(email);
            closeEmailModal();
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification('Có lỗi xảy ra, vui lòng thử lại.', 'error');
        }
    });

    // Add some animation when the modal appears
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeEmailModal() {
    const modal = document.querySelector('.email-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 300);
    }
}

// Add email modal styles
const emailModalStyles = `
    .email-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }

    .email-modal-content {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        width: 90%;
        max-width: 500px;
        box-shadow: var(--card-shadow);
    }

    .email-modal h3 {
        margin-bottom: 1.5rem;
        color: var(--dark-color);
        font-size: 1.5rem;
        text-align: center;
    }

    .reward-details {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .reward-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    .reward-desc {
        color: var(--text-color);
        margin-bottom: 1rem;
        font-size: 0.95rem;
    }

    .points-info, .points-remaining {
        font-size: 0.9rem;
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }

    .email-modal .form-group {
        margin-bottom: 1.5rem;
    }

    .email-modal label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--dark-color);
        font-weight: 500;
    }

    .email-modal input {
        width: 100%;
        padding: 0.8rem;
        border: 2px solid var(--light-color);
        border-radius: 8px;
        transition: var(--transition);
    }

    .email-modal input:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 0 3px rgba(232, 66, 92, 0.1);
    }

    .email-modal .button-group {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .email-modal.closing {
        animation: fadeOut 0.3s ease forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        border-left: 4px solid #28a745;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification i {
        font-size: 1.2rem;
        color: #28a745;
    }

    .notification p {
        margin: 0;
        color: var(--dark-color);
    }

    .notification.error {
        border-left: 4px solid #dc3545;
    }

    .notification.error i {
        color: #dc3545;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add styles to document
const style = document.createElement('style');
style.textContent = emailModalStyles + notificationStyles;
document.head.appendChild(style);

// Update notification function to support error state
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

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initial animations
setTimeout(animateStats, 1000);

// EmailJS function for sending reward confirmation emails
async function sendRewardEmail(email, rewardName, points, rewardDescription) {
    try {
        const { serviceId, templateId } = window.EMAIL_CONFIG;
        
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const response = await emailjs.send(
            serviceId,
            templateId,
            {
                to_email: email,
                to_name: localStorage.getItem('username') || 'Người dùng',
                from_name: 'A4U - ALL FOR YOU',
                reward_name: rewardName,
                reward_description: rewardDescription,
                points_used: points,
                remaining_points: userPoints - points,
                date: formattedDate,
                contact_email: 'info@a4u.com',
                contact_phone: '0389.502.764',
                website_url: window.location.origin
            }
        );

        if (response.status === 200) {
            showNotification('Email xác nhận đã được gửi thành công!', 'success');
            return true;
        } else {
            throw new Error('Gửi email thất bại');
        }
    } catch (error) {
        console.error('Lỗi gửi email:', error);
        showNotification('Không thể gửi email xác nhận. Vui lòng thử lại sau.', 'error');
        return false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/';
        });
    }

    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 3000);
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    // Hàm mô phỏng hoạt động
    const activities = [
        { points: 50, message: "Bạn đã tham gia buổi hiến máu nhân đạo!", hours: 3 },
        { points: 30, message: "Hoàn thành công tác chuẩn bị cho sự kiện!", hours: 2 },
        { points: 70, message: "Tham gia chiến dịch Xuân Yêu Thương!", hours: 5 },
        { points: 40, message: "Hỗ trợ tổ chức sự kiện cộng đồng!", hours: 4 },
        { points: 60, message: "Tham gia dạy học cho trẻ em vùng cao!", hours: 6 },
        { points: 45, message: "Phát quà cho người vô gia cư!", hours: 4 },
        { points: 35, message: "Tham gia dọn dẹp môi trường!", hours: 3 },
        { points: 55, message: "Thăm và tặng quà cho người cao tuổi!", hours: 4 }
    ];

    window.simulateActivity = function() {
        // Chỉ chạy một lần khi nhấn nút
        simulateOneActivity();
    };

    function simulateOneActivity() {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const pointsElement = document.getElementById('userPoints');
        const currentPoints = parseInt(pointsElement.textContent);
        const newPoints = currentPoints + randomActivity.points;

        const hoursElement = document.querySelector('.stat-card:last-child .stat-number');
        const currentHours = parseInt(hoursElement.textContent);
        const newHours = currentHours + randomActivity.hours;
        
        const activitiesElement = document.querySelector('.stat-card:first-child .stat-number');
        const currentActivities = parseInt(activitiesElement.textContent);

        // Cập nhật UI với hiệu ứng
        animateNumber(pointsElement, currentPoints, newPoints);
        animateNumber(hoursElement, currentHours, newHours);
        animateNumber(activitiesElement, currentActivities, currentActivities + 1);

        updateAllProgress(newPoints);
        
        // Hiển thị thông báo toast
        showToast(randomActivity.message, 'success');
    }

    // Hàm tạo hiệu ứng số đếm
    function animateNumber(element, start, end) {
        let current = start;
        const step = (end - start) / 20; // Chia thành 20 bước
        const interval = setInterval(() => {
            current += step;
            if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
                current = end;
                element.textContent = Math.round(current);
                clearInterval(interval);
            } else {
                element.textContent = Math.round(current);
            }
        }, 50);
    }

    // Hàm cập nhật tiến trình
    function updateAllProgress(points) {
        if (!Number.isFinite(points) || points < 0) {
            console.error('Điểm không hợp lệ:', points);
            return;
        }

        const progressBars = document.querySelectorAll('.reward-progress');
        const userLevelElement = document.getElementById('userLevel');
        const mainProgressBar = document.querySelector('.points-card .progress');

        if (!userLevelElement || !mainProgressBar) {
            console.error('Không tìm thấy các phần tử UI cần thiết');
            return;
        }

        // Cập nhật level và thanh tiến trình chính
        let levelName = 'Tình Nguyện Viên Mới';
        let progressPercent = 0;

        if (points >= 1000) {
            levelName = 'Tình Nguyện Viên Xuất Sắc';
            progressPercent = 100;
        } else if (points >= 750) {
            levelName = 'Tình Nguyện Viên Nhiệt Huyết';
            progressPercent = 85;
        } else if (points >= 500) {
            levelName = 'Tình Nguyện Viên Tích Cực';
            progressPercent = 65;
        } else {
            progressPercent = (points / 500) * 50;
        }

        userLevelElement.textContent = levelName;
        mainProgressBar.style.width = `${progressPercent}%`;

        // Cập nhật các phần thưởng
        progressBars.forEach(bar => {
            const pointsNeeded = parseInt(bar.querySelector('.points-needed').textContent);
            const pointsHaveSpan = bar.querySelector('.points-have');
            const progressBar = bar.querySelector('.progress');
            const redeemButton = bar.closest('li').querySelector('.btn-redeem');

            pointsHaveSpan.textContent = `Bạn có: ${points} điểm`;
            const progress = Math.min((points / pointsNeeded) * 100, 100);
            progressBar.style.width = `${progress}%`;

            if (points >= pointsNeeded) {
                redeemButton.disabled = false;
                redeemButton.textContent = 'Đổi Ngay';
            } else {
                redeemButton.disabled = true;
                redeemButton.textContent = 'Chưa đủ điểm';
            }
        });
    }

    // Xử lý đổi thưởng
    window.redeemReward = async function(button, pointsRequired) {
        if (!button || !pointsRequired || pointsRequired <= 0) {
            console.error('Invalid parameters for reward redemption');
            return;
        }

        const pointsElement = document.getElementById('userPoints');
        if (!pointsElement) {
            console.error('Points element not found');
            return;
        }

        const currentPoints = parseInt(pointsElement.textContent);
        if (isNaN(currentPoints)) {
            console.error('Invalid points value');
            return;
        }
        
        if (currentPoints >= pointsRequired) {
            // Disable button to prevent double redemption
            button.disabled = true;
            const originalText = button.textContent;
            button.textContent = 'Đang xử lý...';

            try {
                const rewardName = button.closest('li').querySelector('.reward-name')?.textContent;
                const rewardDescription = button.closest('li').querySelector('.reward-description')?.textContent;
                
                if (!rewardName || !rewardDescription) {
                    throw new Error('Không tìm thấy thông tin phần thưởng');
                }

                const newPoints = currentPoints - pointsRequired;
                
                // Tạo nội dung chi tiết cho email đổi thưởng
                const emailDetails = `
                    Phần thưởng: ${rewardName}
                    Mô tả: ${rewardDescription}
                    Điểm đã sử dụng: ${pointsRequired}
                    Điểm còn lại: ${newPoints}
                    
                    Phần thưởng của bạn sẽ được xử lý và gửi đến trong thời gian sớm nhất.
                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email: info@a4u.com
                `;
                
                await sendNotificationEmail('Đổi thưởng thành công', emailDetails);
                
                // Update UI after successful email sending
                animateNumber(pointsElement, currentPoints, newPoints);
                button.textContent = 'Đã đổi';
                button.classList.add('redeemed');
                updateAllProgress(newPoints);
                
                alert('Đổi thưởng thành công! Phần thưởng sẽ được gửi đến bạn sớm nhất.');
                
            } catch (error) {
                console.error('Lỗi đổi thưởng:', error);
                alert('Có lỗi xảy ra khi đổi thưởng. Vui lòng thử lại sau.');
                
                // Reset button state on error
                button.disabled = false;
                button.textContent = originalText;
            }
        } else {
            alert('Bạn không đủ điểm để đổi phần thưởng này.');
        }
    };    // Hàm gửi email thông báo
    async function sendNotificationEmail(type, details) {
        console.log('Starting email sending process...', { type, details });
        
        if (!window.EMAIL_CONFIG) {
            console.error('EMAIL_CONFIG not initialized');
            throw new Error('Email configuration is missing');
        }

        try {
            const usernameElement = document.querySelector('.welcome-message h1');
            console.log('Looking for username element:', usernameElement);
            
            if (!usernameElement) {
                throw new Error('Username element not found');
            }

            const username = usernameElement.textContent.replace('Chào mừng trở lại, ', '').replace('!', '').trim();
            const currentPoints = document.getElementById('userPoints')?.textContent || '0';
            const currentLevel = document.getElementById('userLevel')?.textContent || 'Tình Nguyện Viên Mới';
            const currentDate = new Date().toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Template selection with validation
            let template;
            if (type === 'Hoạt động mới') {
                template = window.EMAIL_CONFIG.templates.activityNotification;
            } else if (type === 'Đổi thưởng thành công') {
                template = window.EMAIL_CONFIG.templates.rewardConfirmation;
            } else if (type === 'Đăng ký sự kiện') {
                template = window.EMAIL_CONFIG.templates.eventRegistration;
            } else {
                throw new Error('Invalid notification type: ' + type);
            }

            if (!template || !template.templateId) {
                throw new Error('Invalid email template configuration');
            }

            const templateParams = {
                to_name: username,
                activity_type: type,
                activity_details: details,
                points: currentPoints,
                level: currentLevel,
                date: currentDate,
                email_subject: template.subject,
                greeting: `Xin chào ${username},`,
                footer_text: 'Cảm ơn bạn đã tham gia cùng A4U - ALL FOR YOU!'
            };

            console.log('Sending email with configuration:', {
                serviceId: window.EMAIL_CONFIG.serviceId,
                templateId: template.templateId,
                userId: window.EMAIL_CONFIG.userId
            });

            // Add timeout for email sending
            const emailPromise = emailjs.send(
                window.EMAIL_CONFIG.serviceId,
                template.templateId,
                templateParams,
                window.EMAIL_CONFIG.userId
            );

            const result = await Promise.race([
                emailPromise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Email sending timeout')), 10000)
                )
            ]);

            console.log('Email sent successfully:', result);
            return result;

        } catch (error) {
            console.error('Email sending error:', error);
            // Rethrow the error with a user-friendly message
            throw new Error('Không thể gửi email thông báo. Vui lòng thử lại sau.');
        }
    }

    // Mobile menu handling
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const userMenu = document.querySelector('.user-menu');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks?.contains(e.target) && !mobileMenuBtn?.contains(e.target) && navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Handle user menu on mobile
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                userMenu.classList.toggle('active');
            }
        });
    }

    // Close user menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!userMenu?.contains(e.target)) {
            userMenu?.classList.remove('active');
        }
    });
});
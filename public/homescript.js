import emailjs from 'emailjs-com';
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/';
        });
    }

    // Xử lý đăng ký sự kiện
    const registerButtons = document.querySelectorAll('.register-event');
    if (registerButtons) {
        registerButtons.forEach(button => {
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                try {
                    await sendNotificationEmail('Đăng ký sự kiện', 'Bạn đã đăng ký tham gia sự kiện thành công');
                    alert('Đăng ký tham gia thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
                } catch (error) {
                    console.error('Lỗi đăng ký:', error);
                    alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
                }
            });
        });
    }

    // Biến để theo dõi số lần mô phỏng
    let simulationCount = 0;

    // Hàm mô phỏng hoạt động
    window.simulateActivity = function() {
        // Giới hạn số lần mô phỏng
        if (simulationCount >= 5) {
            alert('Bạn đã đạt giới hạn mô phỏng. Hãy tham gia các hoạt động thực tế!');
            return;
        }

        const activities = [
            { points: 50, message: "Bạn đã tham gia buổi hiến máu nhân đạo!", hours: 3 },
            { points: 30, message: "Hoàn thành công tác chuẩn bị cho sự kiện!", hours: 2 },
            { points: 70, message: "Tham gia chiến dịch Xuân Yêu Thương!", hours: 5 },
            { points: 40, message: "Hỗ trợ tổ chức sự kiện cộng đồng!", hours: 4 }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const pointsElement = document.getElementById('userPoints');
        const currentPoints = parseInt(pointsElement.textContent);
        const newPoints = currentPoints + randomActivity.points;

        const hoursElement = document.querySelector('.stat-card:last-child .stat-number');
        const currentHours = parseInt(hoursElement.textContent);
        const newHours = currentHours + randomActivity.hours;
        
        const activitiesElement = document.querySelector('.stat-card:first-child .stat-number');
        const currentActivities = parseInt(activitiesElement.textContent);



        // Gửi email thông báo
        const emailDetails = `
            Hoạt động: ${randomActivity.message}
            Điểm nhận được: +${randomActivity.points}
            Giờ thiện nguyện: +${randomActivity.hours}
        `;
        sendNotificationEmail('Hoạt động mới', emailDetails);

        // Cập nhật UI với hiệu ứng
        animateNumber(pointsElement, currentPoints, newPoints);
        animateNumber(hoursElement, currentHours, newHours);
        animateNumber(activitiesElement, currentActivities, currentActivities + 1);

        updateAllProgress(newPoints);
        simulationCount++;
    };

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
    window.redeemReward = function(button, pointsRequired) {
        const pointsElement = document.getElementById('userPoints');
        const currentPoints = parseInt(pointsElement.textContent);
        
        if (currentPoints >= pointsRequired) {            const rewardName = button.closest('li').querySelector('.reward-name').textContent;
            const rewardDescription = button.closest('li').querySelector('.reward-description').textContent;
            const newPoints = currentPoints - pointsRequired;
            
            animateNumber(pointsElement, currentPoints, newPoints);
            button.disabled = true;
            button.textContent = 'Đã đổi';
            
            alert('Đổi thưởng thành công! Phần thưởng sẽ được gửi đến bạn sớm nhất.');
            
            // Tạo nội dung chi tiết cho email đổi thưởng
            const emailDetails = `
                Phần thưởng: ${rewardName}
                Mô tả: ${rewardDescription}
                Điểm đã sử dụng: ${pointsRequired}
                Điểm còn lại: ${newPoints}
                
                Phần thưởng của bạn sẽ được xử lý và gửi đến trong thời gian sớm nhất.
                Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email: info@a4u.com
            `;
            
            sendNotificationEmail('Đổi thưởng thành công', emailDetails);
            
            updateAllProgress(newPoints);
        }
    };    // Hàm gửi email thông báo
    async function sendNotificationEmail(type, details) {
        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout sending email')), 10000)
        );

        try {
            const username = document.querySelector('.username').textContent.replace('Xin chào, ', '');
            const currentPoints = document.getElementById('userPoints').textContent;
            const currentLevel = document.getElementById('userLevel').textContent;
            const currentDate = new Date().toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const templateParams = {
                to_name: username,
                activity_type: type,
                activity_details: details,
                points: currentPoints,
                level: currentLevel,
                date: currentDate,
                // Thêm các thông tin bổ sung cho email
                email_subject: type === 'Hoạt động mới' ? 
                    'Thông báo hoạt động tình nguyện mới' : 
                    'Xác nhận đổi thưởng thành công',
                greeting: `Xin chào ${username},`,
                footer_text: 'Cảm ơn bạn đã tham gia cùng A4U - ALL FOR YOU!'
            };            // Chọn template và subject dựa trên loại thông báo
            let template;
            if (type === 'Hoạt động mới') {
                template = window.EMAIL_CONFIG.templates.activityNotification;
            } else if (type === 'Đổi thưởng thành công') {
                template = window.EMAIL_CONFIG.templates.rewardConfirmation;
            } else {
                template = window.EMAIL_CONFIG.templates.eventRegistration;
            }

            // Thêm subject vào templateParams
            templateParams.email_subject = template.subject;

            await Promise.race([
                emailjs.send(
                    window.EMAIL_CONFIG.serviceId,
                    template.templateId,
                    templateParams,
                    window.EMAIL_CONFIG.userId
                ),
                timeout
            ]);

            console.log('Email đã được gửi thành công!');
        } catch (error) {
            console.error('Lỗi gửi email:', error);
            alert('Có lỗi xảy ra khi gửi email thông báo. Vui lòng thử lại sau.');
        }
    }
});
// Cấu hình EmailJS cho toàn bộ ứng dụng
(function initEmailJS() {
    emailjs.init("GmfHkja59lYRbR2u6");
    window.EMAIL_CONFIG = {
        serviceId: "service_pss5hzt",
        userId: "GmfHkja59lYRbR2u6",
        templates: {
            activityNotification: {
                templateId: "template_m659rvn",
                subject: "Thông báo hoạt động mới - A4U"
            },
            rewardConfirmation: {
                templateId: "template_jah9zcf",
                subject: "Xác nhận đổi thưởng thành công - A4U"
            },
            eventRegistration: {
                templateId: "template_m659rvn",
                subject: "Xác nhận đăng ký sự kiện - A4U"
            }
        }
    };
})();
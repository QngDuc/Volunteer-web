document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    showLoading();

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    points: data.points
                }));
                
                // Chuyển hướng đến trang home
                window.location.href = '/home';
            } else {
                hideLoading();
                alert(data.message || 'Đăng nhập thất bại.');
            }
        } else {
            const error = await response.json();
            hideLoading();
            alert(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        hideLoading();
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    }
});

// Thêm animation loading khi đang đăng nhập
function showLoading() {
    const button = document.querySelector('button[type="submit"]');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
    button.disabled = true;
}

function hideLoading() {
    const button = document.querySelector('button[type="submit"]');
    button.innerHTML = 'Đăng Nhập';
    button.disabled = false;
}
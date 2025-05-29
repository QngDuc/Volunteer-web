document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const dob = document.getElementById('dob');

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameValue = username.value;
        const emailValue = email.value;
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;
        const dobValue = dob.value;

        // Kiểm tra mật khẩu trùng khớp
        if (passwordValue !== confirmPasswordValue) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Kiểm tra độ tuổi (ít nhất 16 tuổi)
        const birthDate = new Date(dobValue);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 16) {
            alert('Bạn phải đủ 16 tuổi để đăng ký!');
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            alert('Email không hợp lệ!');
            return;
        }

        // Kiểm tra độ dài mật khẩu
        if (passwordValue.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        // Nếu tất cả điều kiện đều hợp lệ
        console.log('Đăng ký với thông tin:', {
            username: usernameValue,
            email: emailValue,
            password: passwordValue,
            dob: dobValue
        });

        // Giả lập đăng ký thành công
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        // Chuyển hướng đến trang đăng nhập
        window.location.href = 'login.html';
    });

    // Input validation
    function validateInputs() {
        let isValid = true;
        
        // Username validation
        if (username.value.trim().length < 3) {
            setError(username, 'Username must be at least 3 characters');
            isValid = false;
        } else {
            setSuccess(username);
        }

        // Email validation
        if (!isValidEmail(email.value.trim())) {
            setError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            setSuccess(email);
        }

        // Password validation
        if (password.value.length < 6) {
            setError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            setSuccess(password);
        }

        // Confirm password validation
        if (confirmPassword.value !== password.value) {
            setError(confirmPassword, 'Passwords do not match');
            isValid = false;
        } else {
            setSuccess(confirmPassword);
        }

        return isValid;
    }

    // Helper functions
    function setError(element, message) {
        const input = element;
        input.classList.add('error');
        input.classList.remove('success');
        input.classList.add('shake');
        
        // Remove shake animation after it completes
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);

        // Show error message as title
        input.title = message;
    }

    function setSuccess(element) {
        const input = element;
        input.classList.remove('error');
        input.classList.add('success');
        input.title = '';
    }

    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Real-time validation
    username.addEventListener('input', () => validateInput(username));
    email.addEventListener('input', () => validateInput(email));
    password.addEventListener('input', () => validateInput(password));
    confirmPassword.addEventListener('input', () => validateInput(confirmPassword));

    function validateInput(element) {
        if (element === username) {
            if (element.value.trim().length < 3) {
                setError(element, 'Username must be at least 3 characters');
            } else {
                setSuccess(element);
            }
        }
        
        if (element === email) {
            if (!isValidEmail(element.value.trim())) {
                setError(element, 'Please enter a valid email');
            } else {
                setSuccess(element);
            }
        }
        
        if (element === password) {
            if (element.value.length < 6) {
                setError(element, 'Password must be at least 6 characters');
            } else {
                setSuccess(element);
            }
            
            // Check confirm password match
            if (confirmPassword.value) {
                if (confirmPassword.value !== element.value) {
                    setError(confirmPassword, 'Passwords do not match');
                } else {
                    setSuccess(confirmPassword);
                }
            }
        }
        
        if (element === confirmPassword) {
            if (element.value !== password.value) {
                setError(element, 'Passwords do not match');
            } else {
                setSuccess(element);
            }
        }
    }
});
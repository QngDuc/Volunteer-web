var express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var app = express();

// Session middleware configuration
app.use(cookieParser());
app.use(session({
    secret: 'a4u-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

app.listen(3000);


app.get('/', function(req, res) {
    res.render('indexmain');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('indexlogin');
});

app.get('/about-us', function(req, res) {
    res.render('indexabout');
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

// API Login route handler
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ thông tin!'
        });
    }

    try {
        // Demo authentication - replace with your database logic
        const validUsers = {
            'admin': { password: 'password', points: 850 },
            'user1': { password: 'user123', points: 500 },
            'user2': { password: 'user456', points: 300 }
        };

        const user = validUsers[username];
        
        if (user && user.password === password) {
            // Create user session
            req.session.user = {
                username: username,
                points: user.points,
                isAuthenticated: true
            };
            
            res.json({
                success: true,
                username: username,
                points: user.points
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra, vui lòng thử lại sau'
        });
    }
});

// Logout route
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

// Protected home route
app.get('/home', requireAuth, (req, res) => {
    res.render('home', {
        username: req.session.user.username,
        points: req.session.user.points
    });
});


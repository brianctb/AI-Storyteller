class AuthManager {
    constructor() {
        this.loginPage = document.getElementById('login-page');
        this.signupPage = document.getElementById('signup-page');
        this.dashboardPage = document.getElementById('dashboard-page');
        
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        this.logoutBtn = document.getElementById('logout-btn');

        this.switchToSignupLink = document.getElementById('switch-to-signup');
        this.switchToLoginLink = document.getElementById('switch-to-login');

        this.initEventListeners();
        this.checkAuthStatus();
    }

    initEventListeners() {
        this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.signupForm.addEventListener('submit', this.handleSignup.bind(this));
        
        this.switchToSignupLink.addEventListener('click', this.showSignupPage.bind(this));
        this.switchToLoginLink.addEventListener('click', this.showLoginPage.bind(this));
        
        this.logoutBtn.addEventListener('click', this.handleLogout.bind(this));
    }

    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            this.showDashboard();
        } else {
            this.showLoginPage();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        this.showDashboard();
    }

    handleSignup(e) {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        this.showDashboard();
    }

    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        this.showLoginPage();
    }

    showLoginPage() {
        this.hideAllPages();
        this.loginPage.classList.remove('hidden');
    }

    showSignupPage() {
        this.hideAllPages();
        this.signupPage.classList.remove('hidden');
    }

    showDashboard() {
        this.hideAllPages();
        this.dashboardPage.classList.remove('hidden');
    }

    hideAllPages() {
        this.loginPage.classList.add('hidden');
        this.signupPage.classList.add('hidden');
        this.dashboardPage.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
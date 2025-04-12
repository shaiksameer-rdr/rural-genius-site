// Initialize authentication system
import { createAuthModal, login, signup, logout, validateEmail, validatePassword } from './auth.js';

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAuth);

function initializeAuth() {
    // Create and append modal to body
    const authModal = createAuthModal();
    document.body.appendChild(authModal);

    // Get DOM elements
    const loginBtn = document.querySelector('.auth-buttons .login');
    const signupBtn = document.querySelector('.auth-buttons .signup');
    const modal = document.querySelector('.auth-modal');
    const closeBtn = document.querySelector('.close-modal');
    const loginForm = document.querySelector('#loginForm');
    const signupForm = document.querySelector('#signupForm');
    const formSwitchLinks = document.querySelectorAll('.form-switch a');

    // Add event listeners for opening modal
    loginBtn?.addEventListener('click', () => {
        modal.style.display = 'flex';
        showForm('login');
    });

    signupBtn?.addEventListener('click', () => {
        modal.style.display = 'flex';
        showForm('signup');
    });

    // Close modal functionality
    closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form switch functionality
    function showForm(formType) {
        const loginForm = document.querySelector('#loginForm');
        const signupForm = document.querySelector('#signupForm');
        
        if (formType === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    formSwitchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(link.dataset.form);
        });
    });

    // Handle form submissions
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Validate inputs
        let isValid = true;
        if (!validateEmail(email)) {
            showError(loginForm, 'email', 'Please enter a valid email address');
            isValid = false;
        }
        if (!validatePassword(password)) {
            showError(loginForm, 'password', 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (isValid) {
            const success = await login(email, password);
            if (success) {
                modal.style.display = 'none';
                loginForm.reset();
            } else {
                showError(loginForm, 'email', 'Invalid email or password');
            }
        }
    });

    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

        // Validate inputs
        let isValid = true;
        if (!fullName.trim()) {
            showError(signupForm, 'text', 'Please enter your full name');
            isValid = false;
        }
        if (!validateEmail(email)) {
            showError(signupForm, 'email', 'Please enter a valid email address');
            isValid = false;
        }
        if (!validatePassword(password)) {
            showError(signupForm, 'password', 'Password must be at least 8 characters long');
            isValid = false;
        }
        if (password !== confirmPassword) {
            showError(signupForm, 'password', 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            const success = await signup({ fullName, email, password });
            if (success) {
                modal.style.display = 'none';
                signupForm.reset();
            } else {
                showError(signupForm, 'email', 'Failed to create account. Please try again.');
            }
        }
    });

    // Handle logout
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('logout')) {
            logout();
        }
    });
}



// Error handling
function showError(form, inputType, message) {
    const input = form.querySelector(`input[type="${inputType}"]`);
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    input.classList.add('error');

    // Clear error after 3 seconds
    setTimeout(() => {
        errorElement.textContent = '';
        input.classList.remove('error');
    }, 3000);
}
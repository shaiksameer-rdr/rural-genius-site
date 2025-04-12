// Admin Authentication Service
import { getAuth, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js';

const auth = getAuth();
const adminEmail = 'admin@ruralgenius.com';
const adminPassword = 'sam1805117955';

// Handle admin login
export async function handleAdminLogin(password) {
    if (password !== adminPassword) {
        throw new Error('Invalid password');
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        window.location.href = 'admin.html';
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Handle admin logout
export async function adminLogout() {
    try {
        await signOut(auth);
        window.location.href = 'admin-login.html';
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const logoutButton = document.querySelector('.admin-logout');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const passwordInput = document.querySelector('#password');
            const errorMessage = document.querySelector('#error-message');

            try {
                await handleAdminLogin(passwordInput.value);
            } catch (error) {
                errorMessage.textContent = 'Invalid password. Please try again.';
                errorMessage.style.display = 'block';
                passwordInput.value = '';
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', adminLogout);
    }
});
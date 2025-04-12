import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase-init.js';

// Authentication state management
let currentUser = null;

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

// Modal management
function createAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <span class="close-modal">&times;</span>
            <div class="auth-forms">
                <div id="loginForm" class="auth-form active">
                    <h2>Login</h2>
                    <form>
                        <div class="form-group">
                            <input type="email" placeholder="Email" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="Password" required>
                            <span class="error-message"></span>
                        </div>
                        <button type="submit" class="btn primary">Login</button>
                        <p class="form-switch">Don't have an account? <a href="#" data-form="signup">Sign up</a></p>
                    </form>
                </div>
                <div id="signupForm" class="auth-form">
                    <h2>Sign Up</h2>
                    <form>
                        <div class="form-group">
                            <input type="text" placeholder="Full Name" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Email" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="Password" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="Confirm Password" required>
                            <span class="error-message"></span>
                        </div>
                        <button type="submit" class="btn primary">Sign Up</button>
                        <p class="form-switch">Already have an account? <a href="#" data-form="login">Login</a></p>
                    </form>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Authentication functions
async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        currentUser = {
            ...user,
            ...userData
        };

        updateUIForAuthenticatedUser();
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

async function signup(userData) {
    try {
        const { email, password, fullName } = userData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            fullName,
            email,
            role: 'user',
            createdAt: new Date().toISOString()
        });

        currentUser = {
            ...user,
            fullName,
            role: 'user'
        };

        updateUIForAuthenticatedUser();
        return true;
    } catch (error) {
        console.error('Signup failed:', error);
        throw error;
    }
}

async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        updateUIForUnauthenticatedUser();
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
}

// UI updates
function updateUIForAuthenticatedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn profile-btn">${currentUser.name}</button>
            <button class="btn logout">Logout</button>
        `;
    }
}

function updateUIForUnauthenticatedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn login">Login</button>
            <button class="btn signup">Signup</button>
        `;
    }
}



// Export functions
export {
    login,
    signup,
    logout,
    createAuthModal,
    validateEmail,
    validatePassword,
    getToken,
    currentUser
};
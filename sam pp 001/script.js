import { login, signup, logout, createAuthModal, validateEmail, validatePassword } from './auth.js';

// DOM Elements
const authButtons = document.querySelector('.auth-buttons');
let authModal = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupAuthButtons();
    setupMobileMenu();
});

function setupAuthButtons() {
    if (authButtons) {
        authButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('login')) {
                showAuthModal('login');
            } else if (e.target.classList.contains('signup')) {
                showAuthModal('signup');
            } else if (e.target.classList.contains('logout')) {
                logout();
            }
        });
    }
}

function showAuthModal(formType = 'login') {
    if (!authModal) {
        authModal = createAuthModal();
        document.body.appendChild(authModal);
        setupAuthModalEvents();
    }

    authModal.style.display = 'flex';
    showForm(formType);
}

function setupAuthModalEvents() {
    const closeBtn = authModal.querySelector('.close-modal');
    const formSwitchLinks = authModal.querySelectorAll('.form-switch a');
    const loginForm = authModal.querySelector('#loginForm form');
    const signupForm = authModal.querySelector('#signupForm form');

    closeBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    formSwitchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(link.dataset.form);
        });
    });

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
}

function showForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (formType === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    // Validate input
    if (!validateEmail(email)) {
        showError(form, 'email', 'Please enter a valid email address');
        return;
    }

    if (!validatePassword(password)) {
        showError(form, 'password', 'Password must be at least 8 characters long');
        return;
    }

    const success = await login(email, password);
    if (success) {
        authModal.style.display = 'none';
    } else {
        showError(form, 'email', 'Invalid email or password');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const fullName = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

    // Validate input
    if (!fullName.trim()) {
        showError(form, 'text', 'Please enter your full name');
        return;
    }

    if (!validateEmail(email)) {
        showError(form, 'email', 'Please enter a valid email address');
        return;
    }

    if (!validatePassword(password)) {
        showError(form, 'password', 'Password must be at least 8 characters long');
        return;
    }

    if (password !== confirmPassword) {
        showError(form, 'password', 'Passwords do not match');
        return;
    }

    const success = await signup({ fullName, email, password });
    if (success) {
        authModal.style.display = 'none';
    } else {
        showError(form, 'email', 'Failed to create account. Please try again.');
    }
}

function showError(form, inputType, message) {
    const input = form.querySelector(`input[type="${inputType}"]`);
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    input.classList.add('error');

    setTimeout(() => {
        errorElement.textContent = '';
        input.classList.remove('error');
    }, 3000);
}

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Initialize auth elements and state
initializeAuthElements();
checkLoginState();

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Handle dropdowns in mobile view
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }
});

// Handle navigation and page transitions
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Set active navigation item
const currentPath = window.location.pathname;
const currentHash = window.location.hash;
document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath.endsWith('index.html') && href === currentHash)) {
        link.classList.add('active');
    }
});

// Chatbot Widget
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const closeChat = document.querySelector('.close-chat');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendMessage = document.querySelector('.send-message');

chatbotToggle.addEventListener('click', () => {
    chatbotContainer.style.display = 'block';
});

closeChat.addEventListener('click', () => {
    chatbotContainer.style.display = 'none';
});

sendMessage.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addChatMessage('user', message);
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        addChatMessage('bot', 'Thank you for your message. Our AI assistant will help you shortly.');
    }, 1000);
}

function addChatMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Sample Course Data
const courses = [
    {
        title: 'AI Fundamentals',
        duration: '12 weeks',
        level: 'Beginner',
        image: 'path/to/course-image.jpg'
    },
    {
        title: 'Machine Learning Basics',
        duration: '10 weeks',
        level: 'Intermediate',
        image: 'path/to/course-image.jpg'
    },
    {
        title: 'Data Science Essentials',
        duration: '8 weeks',
        level: 'Beginner',
        image: 'path/to/course-image.jpg'
    },
    {
        title: 'Deep Learning Applications',
        duration: '14 weeks',
        level: 'Advanced',
        image: 'path/to/course-image.jpg'
    }
];

// Populate Course Cards
const courseGrid = document.querySelector('.course-grid');

courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.innerHTML = `
        <div class="course-image">
            <img src="${course.image}" alt="${course.title}">
        </div>
        <div class="course-info">
            <h3>${course.title}</h3>
            <p>Duration: ${course.duration}</p>
            <p>Level: ${course.level}</p>
            <button class="btn">Enroll Now</button>
        </div>
    `;
    courseGrid.appendChild(courseCard);
});

// Sample Job Listings
const jobs = [
    {
        title: 'AI Developer',
        company: 'Tech Corp',
        location: 'Remote',
        type: 'Full-time',
        skills: ['Python', 'Machine Learning', 'TensorFlow']
    },
    {
        title: 'Data Scientist',
        company: 'Data Solutions',
        location: 'Bangalore',
        type: 'On-site',
        skills: ['Python', 'SQL', 'Data Analysis']
    }
];

// Populate Job Listings
const jobListings = document.querySelector('.job-listings');

jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.classList.add('job-card');
    jobCard.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.company}</p>
        <p>${job.location} | ${job.type}</p>
        <div class="skills">
            ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        <button class="btn">Apply Now</button>
    `;
    jobListings.appendChild(jobCard);
});

// Sample Testimonials
const testimonials = [
    {
        name: 'Rahul Kumar',
        image: 'path/to/image.jpg',
        text: 'Rural Genius helped me transition from a farmer to an AI developer. Now I work remotely for a tech company!'
    },
    {
        name: 'Priya Singh',
        image: 'path/to/image.jpg',
        text: 'The AI training program opened new opportunities for me. I now help other rural students learn coding.'
    }
];

// Populate Testimonials
const testimonialsCarousel = document.querySelector('.testimonials-carousel');

testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement('div');
    testimonialCard.classList.add('testimonial-card');
    testimonialCard.innerHTML = `
        <img src="${testimonial.image}" alt="${testimonial.name}">
        <p>${testimonial.text}</p>
        <h4>${testimonial.name}</h4>
    `;
    testimonialsCarousel.appendChild(testimonialCard);
});

// Animate Counters
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Adjust for animation speed
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 40);
}

// Start counter animations when elements are in view
const counterElements = document.querySelectorAll('.counter-item .count');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

counterElements.forEach(counter => observer.observe(counter));
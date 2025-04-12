// Initialize all interactive features when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeJobPosting();
    initializeCandidateFilters();
    initializePartnershipForms();
    initializeContactForm();
    loadCandidates();
    initializeChatbot();
});

// Job Posting Functionality
function initializeJobPosting() {
    const jobForm = document.getElementById('jobPostForm');
    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                title: document.getElementById('jobTitle').value,
                description: document.getElementById('jobDescription').value,
                experience: document.getElementById('experienceLevel').value,
                location: document.getElementById('location').value,
                skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
                salary: {
                    min: document.getElementById('salaryMin').value,
                    max: document.getElementById('salaryMax').value
                }
            };
            // Here you would typically send this data to your backend
            console.log('Job Posted:', formData);
            jobForm.reset();
            showNotification('Job posted successfully!');
        });
    }
}

// Candidate Filtering and Display
function initializeCandidateFilters() {
    const filters = ['skillFilter', 'regionFilter', 'courseFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', () => {
                loadCandidates();
            });
        }
    });
}

// Sample candidate data (replace with API call)
const candidates = [
    {
        name: 'Amit Kumar',
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
        location: 'Bihar',
        course: 'AI Fundamentals',
        experience: '1 year',
        image: 'path/to/image.jpg'
    },
    {
        name: 'Priya Patel',
        skills: ['Data Science', 'SQL', 'Python'],
        location: 'Gujarat',
        course: 'Data Science',
        experience: 'Fresh Graduate',
        image: 'path/to/image.jpg'
    }
];

function loadCandidates() {
    const grid = document.getElementById('candidatesGrid');
    if (!grid) return;

    const skillFilter = document.getElementById('skillFilter').value;
    const regionFilter = document.getElementById('regionFilter').value;
    const courseFilter = document.getElementById('courseFilter').value;

    grid.innerHTML = '';
    
    candidates.forEach(candidate => {
        // Apply filters (simplified version)
        if ((skillFilter === 'all' || candidate.skills.includes(skillFilter)) &&
            (regionFilter === 'all' || candidate.location.includes(regionFilter)) &&
            (courseFilter === 'all' || candidate.course.includes(courseFilter))) {
            
            const card = document.createElement('div');
            card.className = 'candidate-card';
            card.innerHTML = `
                <img src="${candidate.image}" alt="${candidate.name}">
                <h3>${candidate.name}</h3>
                <p>${candidate.experience}</p>
                <div class="skills">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <p>${candidate.location}</p>
                <button class="btn secondary">View Profile</button>
                <button class="btn primary">Schedule Interview</button>
            `;
            grid.appendChild(card);
        }
    });
}

// Partnership Forms
function initializePartnershipForms() {
    const partnershipCards = document.querySelectorAll('.partnership-card');
    partnershipCards.forEach(card => {
        const btn = card.querySelector('.btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const type = card.querySelector('h3').textContent;
                showPartnershipModal(type);
            });
        }
    });
}

function showPartnershipModal(type) {
    // Implementation for partnership modal
    console.log(`Show partnership modal for: ${type}`);
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            };
            // Here you would typically send this data to your backend
            console.log('Contact Form Submitted:', formData);
            contactForm.reset();
            showNotification('Message sent successfully!');
        });
    }
}

// Chatbot Integration
function initializeChatbot() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendMessage = document.querySelector('.send-message');

    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.style.display = 'block';
            if (!chatbotContainer.dataset.initialized) {
                addBotMessage('Hello! How can I help you with recruitment today?');
                chatbotContainer.dataset.initialized = 'true';
            }
        });

        closeChat.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });

        sendMessage.addEventListener('click', handleChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatMessage();
        });
    }
}

function handleChatMessage() {
    const chatInput = document.querySelector('.chat-input input');
    const message = chatInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    chatInput.value = '';

    // Simple chatbot logic (replace with actual AI integration)
    setTimeout(() => {
        const response = getChatbotResponse(message);
        addBotMessage(response);
    }, 1000);
}

function addUserMessage(message) {
    addMessage('user', message);
}

function addBotMessage(message) {
    addMessage('bot', message);
}

function addMessage(type, message) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('post') && lowerMessage.includes('job')) {
        return 'To post a job, please fill out the job posting form in the "Post a Job" section. Need help with that?';
    } else if (lowerMessage.includes('candidate') || lowerMessage.includes('talent')) {
        return 'You can browse our talent pool using filters for skills, region, and completed courses. Would you like me to explain the verification process?';
    } else if (lowerMessage.includes('partner') || lowerMessage.includes('collaboration')) {
        return 'We offer various partnership opportunities including training sponsorship, webinars, and mentorship programs. Which one interests you?';
    }
    return 'I can help you with job posting, candidate search, and partnership opportunities. What would you like to know more about?';
}

// Utility Functions
function showNotification(message) {
    // Implementation for showing notifications
    console.log('Notification:', message);
}

// Animate counter numbers
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
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

// Initialize counter animations when elements are in view
const counterElements = document.querySelectorAll('.stat-card h3');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counterElements.forEach(counter => observer.observe(counter));
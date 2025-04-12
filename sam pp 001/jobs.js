// Sample job data structure
const jobs = [
    {
        id: 1,
        title: 'Junior AI Developer',
        company: 'TechCorp',
        logo: 'assets/company1.svg',
        location: 'Remote',
        type: 'Full-time',
        experience: 'Fresher',
        salary: '₹3,00,000 - ₹5,00,000',
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
        description: 'Entry-level position for AI enthusiasts...',
        posted: '2024-01-15'
    },
    // More job entries will be added dynamically
];

// Sample employer data
const featuredEmployers = [
    {
        name: 'TechCorp',
        logo: 'assets/techcorp.svg',
        description: 'Leading AI solutions provider',
        openPositions: 5
    },
    // More employers will be added dynamically
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    renderJobs(jobs);
    renderEmployers();
    initializeChatbot();
    setupEventListeners();
});

// Initialize filters
function initializeFilters() {
    const filters = document.querySelectorAll('.filter');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
        });
    });
}

// Apply filters to job listings
function applyFilters() {
    const industry = document.getElementById('industry-filter').value;
    const skills = document.getElementById('skills-filter').value;
    const location = document.getElementById('location-filter').value;
    const experience = document.getElementById('experience-filter').value;

    const filteredJobs = jobs.filter(job => {
        return (!industry || job.industry === industry) &&
               (!skills || job.skills.includes(skills)) &&
               (!location || job.location === location) &&
               (!experience || job.experience === experience);
    });

    renderJobs(filteredJobs);
}

// Render job listings
function renderJobs(jobsList) {
    const container = document.getElementById('jobs-container');
    container.innerHTML = '';

    jobsList.forEach(job => {
        const jobCard = createJobCard(job);
        container.appendChild(jobCard);
    });
}

// Create job card element
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="company-info">
            <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
            <div>
                <h3 class="job-title">${job.title}</h3>
                <p class="company-name">${job.company}</p>
            </div>
        </div>
        <div class="job-details">
            <span><i class="fas fa-map-marker-alt"></i>${job.location}</span>
            <span><i class="fas fa-briefcase"></i>${job.type}</span>
            <span><i class="fas fa-rupee-sign"></i>${job.salary}</span>
        </div>
        <div class="skills-list">
            ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        <div class="card-actions">
            <button class="btn primary">Apply Now</button>
            <button class="btn secondary save-job" data-id="${job.id}">
                <i class="far fa-bookmark"></i>
            </button>
        </div>
    `;

    return card;
}

// Render featured employers
function renderEmployers() {
    const container = document.querySelector('.employer-grid');
    if (!container) return;

    featuredEmployers.forEach(employer => {
        const card = document.createElement('div');
        card.className = 'employer-card';
        card.innerHTML = `
            <img src="${employer.logo}" alt="${employer.name} logo" class="employer-logo">
            <h3>${employer.name}</h3>
            <p>${employer.description}</p>
            <p class="open-positions">${employer.openPositions} Open Positions</p>
            <button class="btn secondary">View Profile</button>
        `;
        container.appendChild(card);
    });
}

// Initialize chatbot
function initializeChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggle = chatbot.querySelector('.chatbot-toggle');
    const closeBtn = chatbot.querySelector('.close-chat');
    const input = chatbot.querySelector('input');
    const sendBtn = chatbot.querySelector('.send-message');

    toggle.addEventListener('click', () => {
        chatbot.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
        chatbot.classList.remove('active');
    });

    sendBtn.addEventListener('click', () => {
        const message = input.value.trim();
        if (message) {
            addMessage('user', message);
            processMessage(message);
            input.value = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
}

// Add message to chatbot
function addMessage(type, content) {
    const messages = document.querySelector('.chat-messages');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = content;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

// Process chatbot message
function processMessage(message) {
    // Simple response logic - will be enhanced with AI
    const responses = {
        'interview': 'Here are some interview tips: 1. Research the company 2. Practice common questions 3. Prepare your own questions',
        'resume': 'To build a strong resume: 1. Highlight relevant skills 2. Use action words 3. Keep it concise',
        'jobs': 'I can help you find relevant jobs based on your skills. What are your key skills?'
    };

    const response = responses[message.toLowerCase()] || 
        'I can help you with job search, interview preparation, and resume building. What would you like to know?';
    
    setTimeout(() => {
        addMessage('bot', response);
    }, 500);
}

// Setup event listeners
function setupEventListeners() {
    // View toggle
    const viewToggle = document.querySelector('.view-toggle');
    if (viewToggle) {
        viewToggle.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                viewToggle.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById('jobs-container').className = 
                    e.target.dataset.view === 'grid' ? 'jobs-grid' : 'jobs-list';
            }
        });
    }

    // Save job functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('save-job')) {
            const jobId = e.target.dataset.id;
            toggleSaveJob(jobId);
        }
    });
}

// Toggle save job
function toggleSaveJob(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const index = savedJobs.indexOf(jobId);
    
    if (index === -1) {
        savedJobs.push(jobId);
        showNotification('Job saved successfully!');
    } else {
        savedJobs.splice(index, 1);
        showNotification('Job removed from saved items.');
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
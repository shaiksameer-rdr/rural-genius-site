// Progress Tracker
const progressSection = document.querySelector('.progress-tracker');
const coursesProgress = document.querySelector('.courses-progress');

// Sample progress data (replace with actual data from backend)
const userProgress = [
    {
        courseName: 'Introduction to AI',
        progress: 75,
        lastAccessed: '2024-01-15'
    },
    {
        courseName: 'Machine Learning Basics',
        progress: 30,
        lastAccessed: '2024-01-14'
    }
];

// Show progress only for logged-in users
function initializeProgressTracker() {
    const isLoggedIn = false; // Replace with actual auth check
    if (!isLoggedIn) {
        progressSection.style.display = 'none';
        return;
    }

    userProgress.forEach(course => {
        const progressCard = document.createElement('div');
        progressCard.className = 'course-card progress-card';
        progressCard.innerHTML = `
            <h3>${course.courseName}</h3>
            <div class="progress-bar">
                <div class="progress" style="width: ${course.progress}%"></div>
            </div>
            <p>${course.progress}% Completed</p>
            <p class="last-accessed">Last accessed: ${course.lastAccessed}</p>
            <button class="btn primary">Continue Learning</button>
        `;
        coursesProgress.appendChild(progressCard);
    });
}

// Calendar Events
const calendarGrid = document.querySelector('.calendar-grid');

// Sample calendar data (replace with actual data from backend)
const upcomingEvents = [
    {
        title: 'AI Tools Workshop',
        date: '2024-02-01',
        time: '10:00 AM',
        type: 'Workshop',
        seats: 50
    },
    {
        title: 'Machine Learning Live Session',
        date: '2024-02-03',
        time: '2:00 PM',
        type: 'Live Session',
        seats: 100
    }
];

function initializeCalendar() {
    upcomingEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <h3>${event.title}</h3>
            <p><i class="fas fa-calendar"></i> ${event.date}</p>
            <p><i class="fas fa-clock"></i> ${event.time}</p>
            <p><i class="fas fa-tag"></i> ${event.type}</p>
            <p><i class="fas fa-users"></i> ${event.seats} seats available</p>
            <button class="btn secondary">Register Now</button>
        `;
        calendarGrid.appendChild(eventCard);
    });
}

// Chatbot functionality
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-message');

let isChatbotOpen = false;

chatbotToggle.addEventListener('click', () => {
    isChatbotOpen = !isChatbotOpen;
    chatbotContainer.style.display = isChatbotOpen ? 'block' : 'none';
});

document.querySelector('.close-chat').addEventListener('click', () => {
    isChatbotOpen = false;
    chatbotContainer.style.display = 'none';
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage('user', message);
    chatInput.value = '';

    // Simulate bot response (replace with actual AI integration)
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage('bot', botResponse);
    }, 1000);
}

function addMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    // Simple response logic (replace with actual AI integration)
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
        return 'We offer several AI courses ranging from beginner to advanced levels. Would you like to know more about a specific level?';
    } else if (lowerMessage.includes('beginner')) {
        return 'For beginners, I recommend starting with our "Introduction to AI" or "AI Tools for Beginners" courses.';
    } else if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
        return 'Our courses include job placement assistance, and we have partnerships with leading tech companies.';
    }
    return 'How can I help you choose the right course? You can ask about specific topics or skill levels.';
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    initializeProgressTracker();
    initializeCalendar();
});
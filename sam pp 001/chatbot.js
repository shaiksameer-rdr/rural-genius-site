// Language Support
const supportedLanguages = {
    'en': 'English',
    'hi': 'Hindi',
    'te': 'Telugu',
    'kn': 'Kannada',
    'mr': 'Marathi'
};

let currentLanguage = 'en';

// Welcome Messages in different languages
const welcomeMessages = {
    en: "Hi! I'm your AI Assistant. I'm here to help you find jobs, explore training, and guide your career journey.",
    hi: "नमस्ते! मैं आपका AI सहायक हूं। मैं आपको नौकरियां खोजने, प्रशिक्षण का पता लगाने और आपकी करियर यात्रा में मार्गदर्शन करने में मदद करूंगा।",
    te: "హాయ్! నేను మీ AI అసిస్టెంట్. ఉద్యోగాలు కనుగొనడానికి, శిక్షణను అన్వేషించడానికి మరియు మీ కెరీర్ ప్రయాణంలో మార్గనిర్దేశం చేయడానికి నేను ఇక్కడ ఉన్నాను.",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಸಹಾಯಕ. ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಲು, ತರಬೇತಿಯನ್ನು ಅನ್ವೇಷಿಸಲು ಮತ್ತು ನಿಮ್ಮ ವೃತ್ತಿ ಪಯಣದಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.",
    mr: "नमस्कार! मी तुमचा AI सहाय्यक आहे. मी तुम्हाला नोकऱ्या शोधण्यास, प्रशिक्षण शोधण्यास आणि तुमच्या करिअर प्रवासात मार्गदर्शन करण्यास मदत करेन."
};

// Career Assistant Class
class CareerAssistant {
    constructor() {
        this.userProfile = null;
        this.currentContext = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
        const closeChat = document.querySelector('.close-chat');
        const chatInput = document.querySelector('.chat-input input');
        const sendMessage = document.querySelector('.send-message');

        // Add language selector
        this.addLanguageSelector();

        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.style.display = 'block';
            if (!this.welcomeShown) {
                this.showWelcomeMessage();
                this.welcomeShown = true;
            }
        });

        closeChat.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });

        sendMessage.addEventListener('click', () => this.handleUserMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });
    }

    addLanguageSelector() {
        const chatHeader = document.querySelector('.chatbot-header');
        const langSelect = document.createElement('select');
        langSelect.className = 'language-selector';
        
        Object.entries(supportedLanguages).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            langSelect.appendChild(option);
        });

        langSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            this.showWelcomeMessage();
        });

        chatHeader.appendChild(langSelect);
    }

    showWelcomeMessage() {
        this.addMessage('bot', welcomeMessages[currentLanguage]);
    }

    addMessage(type, message) {
        const chatMessages = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async handleUserMessage() {
        const chatInput = document.querySelector('.chat-input input');
        const message = chatInput.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        chatInput.value = '';

        // Detect intent and context
        const intent = await this.detectIntent(message);
        const response = await this.generateResponse(intent, message);
        
        setTimeout(() => {
            this.addMessage('bot', response);
        }, 1000);
    }

    async detectIntent(message) {
        // Simple intent detection based on keywords
        const lowercaseMessage = message.toLowerCase();
        
        if (lowercaseMessage.includes('job') || lowercaseMessage.includes('work') || lowercaseMessage.includes('career')) {
            return 'job_search';
        } else if (lowercaseMessage.includes('course') || lowercaseMessage.includes('training') || lowercaseMessage.includes('learn')) {
            return 'training_guidance';
        } else if (lowercaseMessage.includes('resume') || lowercaseMessage.includes('cv')) {
            return 'resume_help';
        } else if (lowercaseMessage.includes('interview')) {
            return 'interview_tips';
        } else if (lowercaseMessage.includes('human') || lowercaseMessage.includes('advisor') || lowercaseMessage.includes('mentor')) {
            return 'escalate_to_human';
        }
        
        return 'general';
    }

    async generateResponse(intent, message) {
        switch (intent) {
            case 'job_search':
                return this.handleJobSearch(message);
            case 'training_guidance':
                return this.handleTrainingGuidance(message);
            case 'resume_help':
                return this.handleResumeHelp();
            case 'interview_tips':
                return this.handleInterviewTips();
            case 'escalate_to_human':
                return this.handleEscalation();
            default:
                return this.handleGeneralQuery();
        }
    }

    handleJobSearch(message) {
        // Integrate with jobs data
        return 'I can help you find the perfect job! Let me know your preferred location and skills, and I\'ll show you matching opportunities.';
    }

    handleTrainingGuidance(message) {
        // Integrate with courses data
        return 'I can recommend training programs based on your interests and career goals. What skills would you like to develop?';
    }

    handleResumeHelp() {
        return 'I can help you create a professional resume. Would you like to see some templates or get specific tips for your industry?';
    }

    handleInterviewTips() {
        return 'Here are some common interview questions and tips to help you prepare. Would you like general tips or industry-specific advice?';
    }

    handleEscalation() {
        return 'I\'ll connect you with a career advisor. Please provide your contact details and preferred time for a callback.';
    }

    handleGeneralQuery() {
        return 'I\'m here to help with your career journey. You can ask me about jobs, training programs, resume building, or interview preparation.';
    }
}

// Initialize the Career Assistant
const careerAssistant = new CareerAssistant();
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeVideoLibrary();
    initializeAssessments();
    initializeProgressTracker();
    initializeFAQs();
    initializeCommunityLinks();

    // Video Library Filtering
    function initializeVideoLibrary() {
        const filters = document.querySelectorAll('.video-filters select');
        filters.forEach(filter => {
            filter.addEventListener('change', filterVideos);
        });
    }

    function filterVideos() {
        const category = document.getElementById('category-filter').value;
        const language = document.getElementById('language-filter').value;
        const duration = document.getElementById('duration-filter').value;

        // Example video data structure
        const videos = [
            {
                title: 'Introduction to AI',
                category: 'ai',
                language: 'english',
                duration: 'medium',
                url: 'https://example.com/video1'
            },
            // Add more video objects here
        ];

        const filteredVideos = videos.filter(video => {
            return (!category || video.category === category) &&
                   (!language || video.language === language) &&
                   (!duration || video.duration === duration);
        });

        displayVideos(filteredVideos);
    }

    function displayVideos(videos) {
        const videoGrid = document.querySelector('.video-grid');
        videoGrid.innerHTML = videos.map(video => `
            <div class="video-item">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="duration">${video.duration}</span>
                </div>
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `).join('');
    }

    // Skill Assessments
    function initializeAssessments() {
        const assessmentButtons = document.querySelectorAll('.start-assessment');
        assessmentButtons.forEach(button => {
            button.addEventListener('click', startAssessment);
        });
    }

    function startAssessment(event) {
        const assessmentType = event.target.parentElement.querySelector('h3').textContent;
        // Implementation for different assessment types
        switch(assessmentType) {
            case 'AI Concepts Quiz':
                startAIQuiz();
                break;
            case 'Web Development Challenge':
                startWebChallenge();
                break;
            case 'Logical Reasoning':
                startLogicalTest();
                break;
        }
    }

    function calculateScore(answers, correctAnswers) {
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) score++;
        });
        return (score / correctAnswers.length) * 100;
    }

    // Progress Tracker
    function initializeProgressTracker() {
        const milestones = document.querySelectorAll('.milestone');
        milestones.forEach((milestone, index) => {
            if (hasCompletedMilestone(index)) {
                milestone.classList.add('active');
            }
        });
    }

    function hasCompletedMilestone(index) {
        // Check user progress from backend/localStorage
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        return userProgress[`milestone_${index}`] === true;
    }

    // FAQs Accordion
    function initializeFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.question');
            const answer = item.querySelector('.answer');

            question.addEventListener('click', () => {
                answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
            });
        });
    }

    // Community Links
    function initializeCommunityLinks() {
        const communityLinks = document.querySelectorAll('.community-link');
        communityLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.classList.contains('whatsapp') ? 'WhatsApp' :
                               link.classList.contains('telegram') ? 'Telegram' : 'Forum';
                joinCommunity(platform);
            });
        });
    }

    function joinCommunity(platform) {
        // Implementation for joining different community platforms
        const platformUrls = {
            'WhatsApp': 'https://chat.whatsapp.com/invite/xxxxx',
            'Telegram': 'https://t.me/xxxxx',
            'Forum': '/forum'
        };

        window.open(platformUrls[platform], '_blank');
    }

    // Resource Downloads
    document.querySelectorAll('.download').forEach(button => {
        button.addEventListener('click', function(e) {
            const resourceType = this.parentElement.querySelector('h3').textContent;
            downloadResource(resourceType);
        });
    });

    function downloadResource(resourceType) {
        // Implementation for resource downloads
        const resourceUrls = {
            'Learning Roadmaps': '/resources/roadmaps.pdf',
            'Handbooks': '/resources/handbook.pdf',
            'Cheatsheets': '/resources/cheatsheet.pdf'
        };

        if (resourceUrls[resourceType]) {
            window.open(resourceUrls[resourceType], '_blank');
        }
    }

    // Category Navigation
    document.querySelectorAll('.view-resources').forEach(button => {
        button.addEventListener('click', function(e) {
            const category = this.parentElement.querySelector('h3').textContent;
            navigateToCategory(category);
        });
    });

    function navigateToCategory(category) {
        // Smooth scroll to relevant section or load category-specific content
        const sections = {
            'AI & Machine Learning': '#ai-resources',
            'Web Development': '#web-resources',
            'Soft Skills': '#soft-skills-resources',
            'Interview Preparation': '#interview-resources',
            'Government Job Prep': '#govt-resources',
            'Digital Marketing': '#marketing-resources'
        };

        const sectionId = sections[category];
        if (sectionId) {
            const section = document.querySelector(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});
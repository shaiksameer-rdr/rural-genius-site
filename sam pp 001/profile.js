document.addEventListener('DOMConmake a menu section in tentLoaded', function() {
    // Check authentication state
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    // Initialize profile page
    initializeProfile();
    setupEventListeners();
});

// Global variables
let currentUserType = 'student'; // or 'company'
let userData = null;

// Initialize profile page
function initializeProfile() {
    // Simulate loading user data (replace with actual API call)
    fetchUserData().then(data => {
        userData = data;
        updateUIForUserType();
        populateProfileData();
    });
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    editProfileBtn.addEventListener('click', openEditProfileModal);

    // Profile photo upload
    const editPhotoBtn = document.querySelector('.edit-photo-btn');
    editPhotoBtn.addEventListener('click', () => document.getElementById('profile-photo-input').click());

    // Resume upload
    const uploadResumeBtn = document.querySelector('.upload-btn');
    if (uploadResumeBtn) {
        uploadResumeBtn.addEventListener('click', () => document.getElementById('resume-upload').click());
    }

    // Company-specific listeners
    const postJobBtn = document.getElementById('post-job-btn');
    if (postJobBtn) {
        postJobBtn.addEventListener('click', openPostJobModal);
    }

    // Language selector
    setupLanguageSelector();
}

// Switch between tabs
function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected section and activate tab
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Update UI based on user type
function updateUIForUserType() {
    const studentTabs = ['edu-skills-tab', 'job-pref-tab', 'progress-tab', 'applications-tab'];
    const companyTabs = ['company-tab'];

    if (currentUserType === 'student') {
        // Show student tabs, hide company tabs
        studentTabs.forEach(tabId => document.getElementById(tabId)?.classList.remove('hidden'));
        companyTabs.forEach(tabId => document.getElementById(tabId)?.classList.add('hidden'));
        document.getElementById('user-type-badge').textContent = 'Student';
    } else {
        // Show company tabs, hide student tabs
        studentTabs.forEach(tabId => document.getElementById(tabId)?.classList.add('hidden'));
        companyTabs.forEach(tabId => document.getElementById(tabId)?.classList.remove('hidden'));
        document.getElementById('user-type-badge').textContent = 'Company';
    }
}

// Populate profile data
function populateProfileData() {
    if (!userData) return;

    // Update basic info
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('user-email').textContent = userData.email;
    document.getElementById('user-phone').textContent = userData.phone;
    document.getElementById('user-location').querySelector('span').textContent = userData.location;

    // Update profile photo
    const profilePhoto = document.getElementById('profile-photo');
    if (userData.photoUrl) {
        profilePhoto.src = userData.photoUrl;
    }

    if (currentUserType === 'student') {
        populateStudentData();
    } else {
        populateCompanyData();
    }
}

// Populate student-specific data
function populateStudentData() {
    if (!userData || !userData.student) return;

    const student = userData.student;

    // Education
    document.getElementById('qualification').textContent = student.qualification;
    document.getElementById('institution').textContent = student.institution;
    document.getElementById('edu-year').textContent = student.educationYear;

    // Skills
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    student.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'tag';
        skillTag.textContent = skill;
        skillsList.appendChild(skillTag);
    });

    // Certifications
    populateCertifications(student.certifications);

    // Progress
    updateProgressBars(student.progress);

    // Job Applications
    populateApplications(student.applications);
}

// Populate company-specific data
function populateCompanyData() {
    if (!userData || !userData.company) return;

    const company = userData.company;

    // Update stats
    document.getElementById('active-jobs-count').textContent = company.activeJobs;
    document.getElementById('total-applicants').textContent = company.totalApplicants;
    document.getElementById('successful-hires').textContent = company.successfulHires;

    // Populate job listings
    populateCompanyJobs(company.jobs);

    // Populate candidate list
    populateCandidateList(company.candidates);
}

// Mock API call (replace with actual API implementation)
function fetchUserData() {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            resolve({
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 9876543210',
                location: 'Bangalore, Karnataka',
                photoUrl: '',
                student: {
                    qualification: 'Bachelor of Technology',
                    institution: 'Rural Engineering College',
                    educationYear: '2020 - 2024',
                    skills: ['Python', 'Machine Learning', 'Web Development'],
                    certifications: [],
                    progress: {
                        aiTraining: 75,
                        liveSessions: 12
                    },
                    applications: []
                }
            });
        }, 1000);
    });
}

// Language selector setup
function setupLanguageSelector() {
    const languages = ['English', 'हिंदी', 'తెలుగు', 'ಕನ್ನಡ'];
    const selector = document.createElement('select');
    selector.className = 'language-selector';

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => changeLanguage(e.target.value));
    document.querySelector('.profile-header').appendChild(selector);
}

// Change language (placeholder for translation implementation)
function changeLanguage(language) {
    console.log(`Language changed to: ${language}`);
    // Implement actual translation logic here
}

// Helper functions for modals
function openEditProfileModal() {
    // Implement edit profile modal
    console.log('Opening edit profile modal');
}

function openPostJobModal() {
    // Implement post job modal
    console.log('Opening post job modal');
}

// Helper functions for dynamic content
function populateCertifications(certifications) {
    const certList = document.getElementById('certification-list');
    certList.innerHTML = '';
    // Implement certification list population
}

function updateProgressBars(progress) {
    // Update progress bars with actual data
    const aiProgress = document.querySelector('.progress');
    if (aiProgress) {
        aiProgress.style.width = `${progress.aiTraining}%`;
        aiProgress.textContent = `${progress.aiTraining}%`;
    }
}

function populateApplications(applications) {
    const appList = document.getElementById('job-applications');
    appList.innerHTML = '';
    // Implement applications list population
}

function populateCompanyJobs(jobs) {
    const jobList = document.getElementById('company-jobs');
    jobList.innerHTML = '';
    // Implement company jobs list population
}

function populateCandidateList(candidates) {
    const candidateList = document.getElementById('candidate-list');
    candidateList.innerHTML = '';
    // Implement candidate list population
}
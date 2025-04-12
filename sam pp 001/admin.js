// Firebase Configuration and Initialization

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBOxLBtGvHNH8xQPQYh_glPaYf2X5pTvA4",
    authDomain: "rural-genius.firebaseapp.com",
    projectId: "rural-genius",
    storageBucket: "rural-genius.appspot.com",
    messagingSenderId: "654321098765",
    appId: "1:654321098765:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication State Observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Check if user has admin role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        if (userData && userData.role === 'admin') {
            // User is admin
            updateUIForAdmin(user);
            loadDashboardData();
        } else {
            // User is not admin
            alert('Unauthorized access. You must be an admin to view this page.');
            window.location.href = '/login.html';
        }
    } else {
        // User is signed out
        window.location.href = '/login.html';
    }
});

// Update UI for Admin
function updateUIForAdmin(user) {
    const adminProfile = document.querySelector('.admin-profile span');
    if (adminProfile) {
        adminProfile.textContent = user.email;
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load total users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        updateStatCard('Total Users', usersSnapshot.size);

        // Load active courses count
        const coursesSnapshot = await getDocs(
            query(collection(db, 'courses'), where('status', '==', 'active'))
        );
        updateStatCard('Active Courses', coursesSnapshot.size);

        // Load jobs count
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        updateStatCard('Jobs Posted', jobsSnapshot.size);

        // Load pending approvals
        const pendingSnapshot = await getDocs(
            query(collection(db, 'approvals'), where('status', '==', 'pending'))
        );
        updateStatCard('Pending Approvals', pendingSnapshot.size);

        // Load activity feed
        await loadActivityFeed();

        // Load quick statistics
        await loadQuickStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update Stat Card
function updateStatCard(title, count) {
    const cards = document.querySelectorAll('.stat-card');
    const card = Array.from(cards).find(card => card.querySelector('h3').textContent === title);
    if (card) {
        card.querySelector('.count').textContent = count;
    }
}

// Load Activity Feed
async function loadActivityFeed() {
    try {
        const activitiesSnapshot = await getDocs(
            query(
                collection(db, 'activities'),
                orderBy('timestamp', 'desc'),
                limit(10)
            )
        );

        const feedContainer = document.querySelector('.feed-container');
        feedContainer.innerHTML = '';

        activitiesSnapshot.forEach(doc => {
            const activity = doc.data();
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <span class="material-icons">${getActivityIcon(activity.type)}</span>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <small>${formatTimestamp(activity.timestamp)}</small>
                </div>
            `;
            feedContainer.appendChild(activityElement);
        });
    } catch (error) {
        console.error('Error loading activity feed:', error);
    }
}

// Load Quick Statistics
async function loadQuickStats() {
    try {
        // Get website traffic
        const trafficSnapshot = await getDocs(
            query(
                collection(db, 'analytics'),
                orderBy('date', 'desc'),
                limit(7)
            )
        );

        // Get top courses
        const topCoursesSnapshot = await getDocs(
            query(
                collection(db, 'courses'),
                orderBy('views', 'desc'),
                limit(5)
            )
        );

        // Get chatbot usage
        const chatbotSnapshot = await getDocs(
            query(
                collection(db, 'chatbot_analytics'),
                orderBy('date', 'desc'),
                limit(1)
            )
        );

        const statsContainer = document.querySelector('.stats-container');
        // Update the stats container with the fetched data
        // Implementation depends on how you want to display the statistics
    } catch (error) {
        console.error('Error loading quick statistics:', error);
    }
}

// Utility Functions
function getActivityIcon(type) {
    const icons = {
        'user_registration': 'person_add',
        'course_added': 'school',
        'job_posted': 'work',
        'session_scheduled': 'event',
        'default': 'info'
    };
    return icons[type] || icons.default;
}

function formatTimestamp(timestamp) {
    const date = timestamp.toDate();
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        Math.floor((date - new Date()) / (1000 * 60 * 60 * 24)),
        'day'
    );
}

// Navigation Handler
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        document.querySelectorAll('.nav-links li').forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        // Load corresponding section
        loadSection(item.dataset.section);
    });
});

// Load Section Content
async function loadSection(sectionName) {
    const contentContainer = document.querySelector('.content-container');
    // Hide all sections
    document.querySelectorAll('.content-container > section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionName + 'Section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Load section specific data
        switch(sectionName) {
            case 'users':
                await loadUserManagement();
                break;
            case 'courses':
                await loadCourses();
                break;
            case 'jobs':
                await loadJobs();
                break;
            case 'resources':
                await loadResources();
                break;
            case 'liveSessions':
                await loadLiveSessions();
                break;
            case 'donations':
                await loadDonations();
                break;
            case 'companies':
                await loadCompanies();
                break;
            case 'chatbot':
                await loadChatbot();
                break;
            case 'blog':
                await loadBlog();
                break;
            case 'pageEditor':
                await loadPageEditor();
                break;
            case 'settings':
                await loadSettings();
                break;
        }
    }

    // User Management Functions
    async function loadUserManagement() {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const usersList = document.querySelector('#users-list');
        usersList.innerHTML = '';

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            const userCard = createUserCard(userData, doc.id);
            usersList.appendChild(userCard);
        });
    }

    // Course Management Functions
    async function loadCourseManagement() {
        try {
            const coursesRef = db.collection('courses');
            const coursesSnapshot = await coursesRef.get();
            const coursesList = document.querySelector('#courses-list');
            coursesList.innerHTML = '';

            coursesSnapshot.forEach((doc) => {
                const courseData = doc.data();
                const courseCard = createCourseCard(courseData, doc.id);
                coursesList.appendChild(courseCard);
            });
        } catch (error) {
            console.error('Error loading courses:', error);
            alert('Failed to load courses. Please try again.');
        }
    }

    async function editCourse(courseId) {
        try {
            const courseDoc = await db.collection('courses').doc(courseId).get();
            const courseData = courseDoc.data();
            
            const newTitle = prompt('Enter new title:', courseData.title);
            const newDescription = prompt('Enter new description:', courseData.description);
            const newDuration = prompt('Enter new duration:', courseData.duration);
            const newStatus = prompt('Enter new status (active/inactive):', courseData.status);
            
            if (newTitle && newDescription && newDuration && newStatus) {
                await db.collection('courses').doc(courseId).update({
                    title: newTitle,
                    description: newDescription,
                    duration: newDuration,
                    status: newStatus,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                await loadCourseManagement();
            }
        } catch (error) {
            console.error('Error editing course:', error);
            alert('Failed to edit course. Please try again.');
        }
    }

    async function deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await db.collection('courses').doc(courseId).delete();
                await loadCourseManagement();
                alert('Course deleted successfully');
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course. Please try again.');
            }
        }
    }

    // Job Management Functions
    async function loadJobManagement() {
        try {
            const jobsRef = db.collection('jobs');
            const jobsSnapshot = await jobsRef.get();
            const jobsList = document.querySelector('#jobs-list');
            jobsList.innerHTML = '';

            jobsSnapshot.forEach((doc) => {
                const jobData = doc.data();
                const jobCard = createJobCard(jobData, doc.id);
                jobsList.appendChild(jobCard);
            });
        } catch (error) {
            console.error('Error loading jobs:', error);
            alert('Failed to load jobs. Please try again.');
        }
    }

    async function editJob(jobId) {
        try {
            const jobDoc = await db.collection('jobs').doc(jobId).get();
            const jobData = jobDoc.data();
            
            const newTitle = prompt('Enter new title:', jobData.title);
            const newCompany = prompt('Enter new company:', jobData.company);
            const newLocation = prompt('Enter new location:', jobData.location);
            const newSalary = prompt('Enter new salary:', jobData.salary);
            
            if (newTitle && newCompany && newLocation && newSalary) {
                await db.collection('jobs').doc(jobId).update({
                    title: newTitle,
                    company: newCompany,
                    location: newLocation,
                    salary: newSalary,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                await loadJobManagement();
            }
        } catch (error) {
            console.error('Error editing job:', error);
            alert('Failed to edit job. Please try again.');
        }
    }

    async function deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job?')) {
            try {
                await db.collection('jobs').doc(jobId).delete();
                await loadJobManagement();
                alert('Job deleted successfully');
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Failed to delete job. Please try again.');
            }
        }
    }

    // Resource Management Functions
    async function loadResourceManagement() {
        const resourcesRef = collection(db, 'resources');
        const resourcesSnapshot = await getDocs(resourcesRef);
        const resourcesList = document.querySelector('#resources-list');
        resourcesList.innerHTML = '';

        resourcesSnapshot.forEach((doc) => {
            const resourceData = doc.data();
            const resourceCard = createResourceCard(resourceData, doc.id);
            resourcesList.appendChild(resourceCard);
        });
    }

    // Live Session Management Functions
    async function loadLiveSessionManagement() {
        const sessionsRef = collection(db, 'live-sessions');
        const sessionsSnapshot = await getDocs(sessionsRef);
        const sessionsList = document.querySelector('#sessions-list');
        sessionsList.innerHTML = '';

        sessionsSnapshot.forEach((doc) => {
            const sessionData = doc.data();
            const sessionCard = createSessionCard(sessionData, doc.id);
            sessionsList.appendChild(sessionCard);
        });
    }

    // Donation Management Functions
    async function loadDonationManagement() {
        const donationsRef = collection(db, 'donations');
        const donationsSnapshot = await getDocs(donationsRef);
        const donationsList = document.querySelector('#donations-list');
        donationsList.innerHTML = '';

        donationsSnapshot.forEach((doc) => {
            const donationData = doc.data();
            const donationCard = createDonationCard(donationData, doc.id);
            donationsList.appendChild(donationCard);
        });
    }

    // Company Management Functions
    async function loadCompanyManagement() {
        const companiesRef = collection(db, 'companies');
        const companiesSnapshot = await getDocs(companiesRef);
        const companiesList = document.querySelector('#companies-list');
        companiesList.innerHTML = '';

        companiesSnapshot.forEach((doc) => {
            const companyData = doc.data();
            const companyCard = createCompanyCard(companyData, doc.id);
            companiesList.appendChild(companyCard);
        });
    }

    // Chatbot Management Functions
    async function loadChatbotManagement() {
        const chatbotsRef = collection(db, 'chatbot-logs');
        const chatbotsSnapshot = await getDocs(chatbotsRef);
        const chatbotsList = document.querySelector('#chatbot-logs');
        chatbotsList.innerHTML = '';

        chatbotsSnapshot.forEach((doc) => {
            const chatbotData = doc.data();
            const chatbotCard = createChatbotCard(chatbotData, doc.id);
            chatbotsList.appendChild(chatbotCard);
        });
    }

    // Blog Management Functions
    async function loadBlogManagement() {
        const blogsRef = collection(db, 'blogs');
        const blogsSnapshot = await getDocs(blogsRef);
        const blogsList = document.querySelector('#blogs-list');
        blogsList.innerHTML = '';

        blogsSnapshot.forEach((doc) => {
            const blogData = doc.data();
            const blogCard = createBlogCard(blogData, doc.id);
            blogsList.appendChild(blogCard);
        });
    }

    // Site Settings Functions
    async function loadSiteSettings() {
        const settingsRef = doc(db, 'settings', 'general');
        const settingsSnapshot = await getDoc(settingsRef);
        if (settingsSnapshot.exists()) {
            const settings = settingsSnapshot.data();
            document.querySelector('#site-name').value = settings.siteName;
            document.querySelector('#site-description').value = settings.description;
            document.querySelector('#contact-email').value = settings.contactEmail;
        }
    }

    // Helper Functions for Creating UI Elements
    function createUserCard(userData, userId) {
        const card = document.createElement('div');
        card.className = 'admin-card user-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${userData.name}</h3>
                <span class="badge ${userData.role}">${userData.role}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-envelope"></i> ${userData.email}</p>
                <p><i class="fas fa-phone"></i> ${userData.phone || 'N/A'}</p>
                <p><i class="fas fa-calendar"></i> Joined: ${new Date(userData.joinDate).toLocaleDateString()}</p>
            </div>
            <div class="card-actions">
                <button onclick="editUser('${userId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteUser('${userId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    function createCourseCard(courseData, courseId) {
        const card = document.createElement('div');
        card.className = 'admin-card course-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${courseData.title}</h3>
                <span class="badge ${courseData.status}">${courseData.status}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-book"></i> ${courseData.description}</p>
                <p><i class="fas fa-clock"></i> Duration: ${courseData.duration}</p>
                <p><i class="fas fa-users"></i> Enrolled: ${courseData.enrolledCount || 0}</p>
            </div>
            <div class="card-actions">
                <button onclick="editCourse('${courseId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteCourse('${courseId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    function createJobCard(jobData, jobId) {
        const card = document.createElement('div');
        card.className = 'admin-card job-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${jobData.title}</h3>
                <span class="badge ${jobData.type}">${jobData.type}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-building"></i> ${jobData.company}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${jobData.location}</p>
                <p><i class="fas fa-money-bill-wave"></i> ${jobData.salary}</p>
            </div>
            <div class="card-actions">
                <button onclick="editJob('${jobId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteJob('${jobId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    function createResourceCard(resourceData, resourceId) {
        const card = document.createElement('div');
        card.className = 'admin-card resource-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${resourceData.title}</h3>
                <span class="badge ${resourceData.type}">${resourceData.type}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-info-circle"></i> ${resourceData.description}</p>
                <p><i class="fas fa-link"></i> <a href="${resourceData.url}" target="_blank">View Resource</a></p>
            </div>
            <div class="card-actions">
                <button onclick="editResource('${resourceId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteResource('${resourceId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    function createSessionCard(sessionData, sessionId) {
        const card = document.createElement('div');
        card.className = 'admin-card session-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${sessionData.title}</h3>
                <span class="badge ${sessionData.status}">${sessionData.status}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-user-tie"></i> Instructor: ${sessionData.instructor}</p>
                <p><i class="fas fa-calendar"></i> Date: ${new Date(sessionData.date).toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> Time: ${sessionData.time}</p>
            </div>
            <div class="card-actions">
                <button onclick="editSession('${sessionId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteSession('${sessionId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    function createDonationCard(donationData, donationId) {
        const card = document.createElement('div');
        card.className = 'admin-card donation-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>Donation #${donationId.slice(-6)}</h3>
                <span class="badge ${donationData.status}">${donationData.status}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-user"></i> Donor: ${donationData.donor}</p>
                <p><i class="fas fa-rupee-sign"></i> Amount: ${donationData.amount}</p>
                <p><i class="fas fa-calendar"></i> Date: ${new Date(donationData.date).toLocaleDateString()}</p>
            </div>
            <div class="card-actions">
                <button onclick="viewDonationDetails('${donationId}')"><i class="fas fa-eye"></i> View Details</button>
            </div>
        `;
        return card;
    }

    function createCompanyCard(companyData, companyId) {
        const card = document.createElement('div');
        card.className = 'admin-card company-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${companyData.name}</h3>
                <span class="badge ${companyData.status}">${companyData.status}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-industry"></i> Industry: ${companyData.industry}</p>
                <p><i class="fas fa-map-marker-alt"></i> Location: ${companyData.location}</p>
                <p><i class="fas fa-users"></i> Jobs Posted: ${companyData.jobsCount || 0}</p>
            </div>
            <div class="card-actions">
                <button onclick="editCompany('${companyId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteCompany('${companyId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    function createChatbotCard(chatbotData, chatbotId) {
        const card = document.createElement('div');
        card.className = 'admin-card chatbot-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>Chat Session #${chatbotId.slice(-6)}</h3>
                <span class="badge ${chatbotData.status}">${chatbotData.status}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-user"></i> User: ${chatbotData.userId}</p>
                <p><i class="fas fa-calendar"></i> Date: ${new Date(chatbotData.timestamp).toLocaleDateString()}</p>
                <p><i class="fas fa-comments"></i> Messages: ${chatbotData.messageCount}</p>
            </div>
            <div class="card-actions">
                <button onclick="viewChatLog('${chatbotId}')"><i class="fas fa-eye"></i> View Log</button>
            </div>
        `;
        return card;
    }

    function createBlogCard(blogData, blogId) {
        const card = document.createElement('div');
        card.className = 'admin-card blog-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${blogData.title}</h3>
                <span class="badge ${blogData.status}">${blogData.status}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-user"></i> Author: ${blogData.author}</p>
                <p><i class="fas fa-calendar"></i> Date: ${new Date(blogData.date).toLocaleDateString()}</p>
                <p><i class="fas fa-eye"></i> Views: ${blogData.views || 0}</p>
            </div>
            <div class="card-actions">
                <button onclick="editBlog('${blogId}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteBlog('${blogId}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        return card;
    }

    // CRUD Operations
    async function editUser(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            // Create a modal or form to edit user data
            const newName = prompt('Enter new name:', userData.name);
            const newPhone = prompt('Enter new phone:', userData.phone);
            const newRole = prompt('Enter new role (user/admin):', userData.role);
            
            if (newName && newPhone && newRole) {
                await db.collection('users').doc(userId).update({
                    name: newName,
                    phone: newPhone,
                    role: newRole,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Refresh the user list
                await loadUserManagement();
            }
        } catch (error) {
            console.error('Error editing user:', error);
            alert('Failed to edit user. Please try again.');
        }
    }

    async function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await db.collection('users').doc(userId).delete();
                await loadUserManagement();
                alert('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user. Please try again.');
            }
        }
    }dUserManagement();
        }
    }

    async function editCourse(courseId) {
        // Implement course edit functionality
    }

    async function deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course?')) {
            await deleteDoc(doc(db, 'courses', courseId));
            loadCourseManagement();
        }
    }

    async function editJob(jobId) {
        // Implement job edit functionality
    }

    async function deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job?')) {
            await deleteDoc(doc(db, 'jobs', jobId));
            loadJobManagement();
        }
    }

    async function editResource(resourceId) {
        // Implement resource edit functionality
    }

    async function deleteResource(resourceId) {
        if (confirm('Are you sure you want to delete this resource?')) {
            await deleteDoc(doc(db, 'resources', resourceId));
            loadResourceManagement();
        }
    }

    async function editSession(sessionId) {
        // Implement session edit functionality
    }

    async function deleteSession(sessionId) {
        if (confirm('Are you sure you want to delete this session?')) {
            await deleteDoc(doc(db, 'live-sessions', sessionId));
            loadLiveSessionManagement();
        }
    }

    async function editCompany(companyId) {
        // Implement company edit functionality
    }

    async function deleteCompany(companyId) {
        if (confirm('Are you sure you want to delete this company?')) {
            await deleteDoc(doc(db, 'companies', companyId));
            loadCompanyManagement();
        }
    }

    async function editBlog(blogId) {
        // Implement blog edit functionality
    }

    async function deleteBlog(blogId) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            await deleteDoc(doc(db, 'blogs', blogId));
            loadBlogManagement();
        }
    }

    // Show selected section and load its content
    switch(sectionName) {
        case 'users':
            await loadUserManagement();
            break;
        case 'courses':
            await loadCourseManagement();
            break;
        case 'jobs':
            await loadJobManagement();
            break;
        case 'resources':
            await loadResourceManagement();
            break;
        case 'live-sessions':
            await loadLiveSessionManagement();
            break;
        case 'donations':
            await loadDonationManagement();
            break;
        case 'companies':
            await loadCompanyManagement();
            break;
        case 'chatbot':
            await loadChatbotManagement();
            break;
        case 'blog':
            await loadBlogManagement();
            break;
        case 'settings':
            await loadSiteSettings();
            break;
        default:
            await loadDashboardData();
    }

    // Show selected section if it exists, otherwise load it
    let section = document.getElementById(sectionName);
    if (!section) {
        // Load section content from server or create dynamically
        section = await createSection(sectionName);
        contentContainer.appendChild(section);
    }
    section.classList.add('active');
}

// Create Section Content
async function createSection(sectionName) {
    const section = document.createElement('section');
    section.id = sectionName;

    // Load section content based on section name
    // This will be implemented for each section (users, courses, jobs, etc.)
    switch (sectionName) {
        case 'users':
            await loadUsersSection(section);
            break;
        case 'courses':
            await loadCoursesSection(section);
            break;
        // Add cases for other sections
    }

    return section;
}

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state
    const user = auth.currentUser;
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Load initial dashboard data
    loadDashboardData();
});
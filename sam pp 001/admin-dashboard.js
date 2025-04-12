import { getFirestore, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

// Collections
const usersCollection = collection(db, 'users');
const coursesCollection = collection(db, 'courses');
const jobsCollection = collection(db, 'jobs');
const donationsCollection = collection(db, 'donations');

// Dashboard Statistics
let dashboardStats = {
    totalUsers: 0,
    totalCourses: 0,
    totalJobs: 0,
    pendingApprovals: 0
};

// Initialize real-time listeners
export function initializeDashboard() {
    // Verify admin access
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (userData?.role !== 'admin') {
            window.location.href = '/';
            return;
        }

        setupDashboardListeners();
        initializeActivityFeed();
    });
}

// Setup real-time dashboard statistics
function setupDashboardListeners() {
    // Users counter
    const usersQuery = query(usersCollection);
    onSnapshot(usersQuery, (snapshot) => {
        dashboardStats.totalUsers = snapshot.size;
        updateDashboardUI();
    });

    // Active courses counter
    const coursesQuery = query(coursesCollection, where('status', '==', 'active'));
    onSnapshot(coursesQuery, (snapshot) => {
        dashboardStats.totalCourses = snapshot.size;
        updateDashboardUI();
    });

    // Active jobs counter
    const jobsQuery = query(jobsCollection, where('status', '==', 'active'));
    onSnapshot(jobsQuery, (snapshot) => {
        dashboardStats.totalJobs = snapshot.size;
        updateDashboardUI();
    });

    // Pending approvals counter
    const approvalsQuery = query(
        collection(db, 'approvals'),
        where('status', '==', 'pending')
    );
    onSnapshot(approvalsQuery, (snapshot) => {
        dashboardStats.pendingApprovals = snapshot.size;
        updateDashboardUI();
    });
}

// Initialize activity feed with real-time updates
function initializeActivityFeed() {
    const activityQuery = query(
        collection(db, 'activity'),
        orderBy('timestamp', 'desc'),
        limit(10)
    );

    onSnapshot(activityQuery, (snapshot) => {
        const activityFeed = document.getElementById('activityFeed');
        activityFeed.innerHTML = '';

        snapshot.forEach((doc) => {
            const activity = doc.data();
            const activityItem = createActivityItem(activity);
            activityFeed.appendChild(activityItem);
        });
    });
}

// Create activity feed item
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const icon = getActivityIcon(activity.type);
    const timeAgo = formatTimeAgo(activity.timestamp);

    item.innerHTML = `
        <div class="activity-icon">${icon}</div>
        <div class="activity-content">
            <p class="activity-text">${activity.description}</p>
            <span class="activity-time">${timeAgo}</span>
        </div>
    `;

    return item;
}

// Update dashboard UI with latest statistics
function updateDashboardUI() {
    document.getElementById('totalUsers').textContent = dashboardStats.totalUsers;
    document.getElementById('totalCourses').textContent = dashboardStats.totalCourses;
    document.getElementById('totalJobs').textContent = dashboardStats.totalJobs;
    document.getElementById('pendingApprovals').textContent = dashboardStats.pendingApprovals;
}

// Utility function to get activity icon
function getActivityIcon(type) {
    const icons = {
        'user_registration': '👤',
        'course_addition': '📚',
        'job_posted': '💼',
        'donation': '💰',
        'default': '📌'
    };
    return icons[type] || icons.default;
}

// Utility function to format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;

    return 'just now';
}
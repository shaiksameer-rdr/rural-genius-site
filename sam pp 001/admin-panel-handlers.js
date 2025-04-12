import { getFirestore, collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeDashboard } from './admin-dashboard.js';

const db = getFirestore();
const auth = getAuth();

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupNavigationHandlers();
    setupUserManagement();
    setupCourseManagement();
});

// Navigation Handlers
function setupNavigationHandlers() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show corresponding section
            const sectionId = link.dataset.section;
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// User Management
function setupUserManagement() {
    const userSearch = document.getElementById('userSearch');
    const userType = document.getElementById('userType');
    const registrationDate = document.getElementById('registrationDate');
    const applyFilters = document.getElementById('applyFilters');

    applyFilters.addEventListener('click', () => {
        loadUsers({
            search: userSearch.value,
            type: userType.value,
            date: registrationDate.value
        });
    });

    // Initial load
    loadUsers({});
}

async function loadUsers(filters) {
    const usersTableBody = document.getElementById('usersTableBody');
    usersTableBody.innerHTML = '';

    try {
        let q = query(collection(db, 'users'));

        // Apply filters
        if (filters.type && filters.type !== 'all') {
            q = query(q, where('type', '==', filters.type));
        }
        if (filters.date) {
            q = query(q, where('registrationDate', '>=', filters.date));
        }

        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const userData = doc.data();
            if (!filters.search || 
                userData.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                userData.email.toLowerCase().includes(filters.search.toLowerCase())) {
                
                const row = createUserTableRow(doc.id, userData);
                usersTableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function createUserTableRow(userId, userData) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userData.name}</td>
        <td>${userData.email}</td>
        <td>${userData.type}</td>
        <td>${new Date(userData.registrationDate).toLocaleDateString()}</td>
        <td>
            <span class="status-badge ${userData.status}">${userData.status}</span>
        </td>
        <td class="actions">
            <button class="btn-icon edit" data-id="${userId}">
                <svg class="icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon delete" data-id="${userId}">
                <svg class="icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
        </td>
    `;

    // Add event listeners
    row.querySelector('.edit').addEventListener('click', () => editUser(userId));
    row.querySelector('.delete').addEventListener('click', () => deleteUser(userId));

    return row;
}

async function editUser(userId) {
    // Implement edit user functionality
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    // Show edit modal with user data
    showEditUserModal(userId, userData);
}

async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteDoc(doc(db, 'users', userId));
            loadUsers({}); // Reload users list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

// Course Management
function setupCourseManagement() {
    const addCourseBtn = document.getElementById('addCourseBtn');
    const addCourseModal = document.getElementById('addCourseModal');
    const addCourseForm = document.getElementById('addCourseForm');

    addCourseBtn.addEventListener('click', () => {
        addCourseModal.classList.add('active');
    });

    document.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', () => {
            addCourseModal.classList.remove('active');
        });
    });

    addCourseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseData = {
            title: addCourseForm.courseTitle.value,
            description: addCourseForm.courseDescription.value,
            duration: parseInt(addCourseForm.courseDuration.value),
            level: addCourseForm.courseLevel.value,
            createdAt: new Date().toISOString(),
            createdBy: auth.currentUser.uid,
            status: 'active'
        };

        try {
            await createCourse(courseData);
            addCourseModal.classList.remove('active');
            addCourseForm.reset();
            loadCourses(); // Reload courses grid
        } catch (error) {
            console.error('Error creating course:', error);
        }
    });

    // Initial load
    loadCourses();
}

async function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '';

    try {
        const q = query(
            collection(db, 'courses'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const courseData = doc.data();
            const courseCard = createCourseCard(doc.id, courseData);
            coursesGrid.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function createCourseCard(courseId, courseData) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-header">
            <h3>${courseData.title}</h3>
            <span class="course-level ${courseData.level}">${courseData.level}</span>
        </div>
        <p class="course-description">${courseData.description}</p>
        <div class="course-details">
            <span>${courseData.duration} hours</span>
            <span class="status-badge ${courseData.status}">${courseData.status}</span>
        </div>
        <div class="course-actions">
            <button class="btn-icon edit" data-id="${courseId}">
                <svg class="icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon delete" data-id="${courseId}">
                <svg class="icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
        </div>
    `;

    // Add event listeners
    card.querySelector('.edit').addEventListener('click', () => editCourse(courseId));
    card.querySelector('.delete').addEventListener('click', () => deleteCourse(courseId));

    return card;
}

async function editCourse(courseId) {
    // Implement edit course functionality
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    const courseData = courseDoc.data();

    // Show edit modal with course data
    showEditCourseModal(courseId, courseData);
}

async function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            await deleteDoc(doc(db, 'courses', courseId));
            loadCourses(); // Reload courses grid
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }
}
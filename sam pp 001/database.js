import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from './firebase-init.js';

// Users Collection
export const usersCollection = collection(db, 'users');

export async function getUserProfile(userId) {
    const userDoc = await getDoc(doc(usersCollection, userId));
    return userDoc.data();
}

export async function updateUserProfile(userId, data) {
    await setDoc(doc(usersCollection, userId), data, { merge: true });
}

// Courses Collection
export const coursesCollection = collection(db, 'courses');

export async function createCourse(courseData) {
    const courseRef = doc(coursesCollection);
    await setDoc(courseRef, {
        ...courseData,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
    });
}

export async function getCourses(filters = {}) {
    const q = query(
        coursesCollection,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Jobs Collection
export const jobsCollection = collection(db, 'jobs');

export async function postJob(jobData) {
    const jobRef = doc(jobsCollection);
    await setDoc(jobRef, {
        ...jobData,
        postedAt: new Date().toISOString(),
        postedBy: auth.currentUser.uid,
        status: 'active'
    });
}

export async function getJobs(filters = {}) {
    const q = query(
        jobsCollection,
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Resources Collection
export const resourcesCollection = collection(db, 'resources');

export async function addResource(resourceData) {
    const resourceRef = doc(resourcesCollection);
    await setDoc(resourceRef, {
        ...resourceData,
        addedAt: new Date().toISOString(),
        addedBy: auth.currentUser.uid
    });
}

export async function getResources(category = null) {
    let q = query(resourcesCollection, orderBy('addedAt', 'desc'));
    if (category) {
        q = query(q, where('category', '==', category));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Donations Collection
export const donationsCollection = collection(db, 'donations');

export async function recordDonation(donationData) {
    const donationRef = doc(donationsCollection);
    await setDoc(donationRef, {
        ...donationData,
        timestamp: new Date().toISOString(),
        status: 'completed'
    });
}

export async function getDonationStats() {
    const q = query(donationsCollection, where('status', '==', 'completed'));
    const snapshot = await getDocs(q);
    const donations = snapshot.docs.map(doc => doc.data());
    
    return {
        totalAmount: donations.reduce((sum, donation) => sum + donation.amount, 0),
        totalDonors: new Set(donations.map(d => d.donorId)).size,
        recentDonations: donations.slice(0, 5)
    };
}

// Partners Collection
export const partnersCollection = collection(db, 'partners');

export async function registerPartner(partnerData) {
    const partnerRef = doc(partnersCollection);
    await setDoc(partnerRef, {
        ...partnerData,
        registeredAt: new Date().toISOString(),
        status: 'pending'
    });
}

export async function getApprovedPartners() {
    const q = query(
        partnersCollection,
        where('status', '==', 'approved'),
        orderBy('registeredAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
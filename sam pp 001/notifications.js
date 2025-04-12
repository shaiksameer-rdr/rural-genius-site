import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const messaging = getMessaging();
const db = getFirestore();
const auth = getAuth();

// Save FCM token to Firestore
export async function saveFCMToken() {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: process.env.FIREBASE_VAPID_KEY
        });

        if (currentToken && auth.currentUser) {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                fcmToken: currentToken
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error saving FCM token:', error);
    }
}

// Handle foreground messages
export function setupMessageHandler() {
    onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        
        // Create and show notification
        const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon,
            data: payload.data
        });

        // Handle notification click
        notification.onclick = function(event) {
            event.preventDefault();
            if (payload.data && payload.data.url) {
                window.open(payload.data.url, '_blank');
            }
            notification.close();
        };
    });
}

// Request notification permission
export async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            await saveFCMToken();
            setupMessageHandler();
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
}

// Subscribe to topics
export async function subscribeToTopic(topic) {
    try {
        const currentToken = await getToken(messaging);
        if (currentToken) {
            await fetch(`https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/${topic}`, {
                method: 'POST',
                headers: {
                    'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`
                }
            });
        }
    } catch (error) {
        console.error('Error subscribing to topic:', error);
    }
}

// Initialize notifications
export function initializeNotifications() {
    if ('Notification' in window) {
        requestNotificationPermission();
    }
}

// Send notification (from backend)
export async function sendNotification(userId, notification) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        if (userData && userData.fcmToken) {
            await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`
                },
                body: JSON.stringify({
                    to: userData.fcmToken,
                    notification: {
                        title: notification.title,
                        body: notification.body,
                        icon: notification.icon || '/logo.svg'
                    },
                    data: notification.data || {}
                })
            });
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}
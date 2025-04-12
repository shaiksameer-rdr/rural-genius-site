// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOxLBtGvHNH8xQPQYh_glPaYf2X5pTvA4",
    authDomain: "rural-genius.firebaseapp.com",
    projectId: "rural-genius",
    storageBucket: "rural-genius.appspot.com",
    messagingSenderId: "654321098765",
    appId: "1:654321098765:web:abcdef123456789"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
    mobileMenuBtn.classList.toggle('active');
});

// Animated Counters
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // Animation duration in milliseconds
    const step = target / (duration / 16); // Update every 16ms (60fps)
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Intersection Observer for counters
const counterElements = document.querySelectorAll('.count');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

counterElements.forEach(counter => observer.observe(counter));

// Partner Logos and Testimonials
const partners = [
    {
        name: 'Tech Corp',
        logo: 'assets/partner1.svg',
        website: 'https://techcorp.com',
        testimonial: 'Rural Genius has helped us find exceptional talent from rural India.'
    },
    // Add more partner data
];

function populatePartners() {
    const partnerGrid = document.querySelector('.partner-grid');
    const testimonialCarousel = document.querySelector('.testimonial-carousel');

    partners.forEach(partner => {
        // Add partner logo
        const logoDiv = document.createElement('div');
        logoDiv.classList.add('partner-logo');
        logoDiv.innerHTML = `
            <a href="${partner.website}" target="_blank">
                <img src="${partner.logo}" alt="${partner.name}">
            </a>
        `;
        partnerGrid.appendChild(logoDiv);

        // Add partner testimonial
        if (partner.testimonial) {
            const testimonialDiv = document.createElement('div');
            testimonialDiv.classList.add('testimonial');
            testimonialDiv.innerHTML = `
                <p>${partner.testimonial}</p>
                <h4>${partner.name}</h4>
            `;
            testimonialCarousel.appendChild(testimonialDiv);
        }
    });
}

populatePartners();

// Donation Form Handling
const donationTypeButtons = document.querySelectorAll('.donation-type button');
const amountButtons = document.querySelectorAll('.btn.amount');
const customAmountInput = document.querySelector('.custom-amount input');

// Initialize Stripe
const stripe = Stripe('your_publishable_key');

donationTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        donationTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        amountButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        customAmountInput.value = '';
    });
});

customAmountInput.addEventListener('input', () => {
    amountButtons.forEach(btn => btn.classList.remove('active'));
});

// Partner Registration Form
const partnerForm = document.getElementById('partnerForm');

partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(partnerForm);
    const partnerData = {
        organizationName: formData.get('organization'),
        contactName: formData.get('contact'),
        email: formData.get('email'),
        partnerType: formData.get('partnerType'),
        message: formData.get('message'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('partners').add(partnerData);
        alert('Thank you for your interest! We will contact you shortly.');
        partnerForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
    }
});

// Fund Allocation Chart
function initializeFundAllocationChart() {
    const ctx = document.createElement('canvas');
    document.querySelector('.allocation-chart').appendChild(ctx);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Training', 'Job Placement', 'Infrastructure'],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load impact photos from Firebase Storage
async function loadImpactPhotos() {
    const gallery = document.querySelector('.allocation-gallery');
    const storageRef = storage.ref('impact-photos');

    try {
        const result = await storageRef.listAll();
        const photos = await Promise.all(
            result.items.map(async (item) => {
                const url = await item.getDownloadURL();
                return url;
            })
        );

        photos.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Impact Photo';
            gallery.appendChild(img);
        });
    } catch (error) {
        console.error('Error loading impact photos:', error);
    }
}

// Initialize Chart.js and load photos when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFundAllocationChart();
    loadImpactPhotos();
});
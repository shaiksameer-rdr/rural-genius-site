document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.createElement('div');
    formMessage.className = 'form-message';
    contactForm.appendChild(formMessage);

    // Form validation and submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            category: document.getElementById('category').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate form data
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setFormLoadingState(true);

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(formData);
            
            // Show success message
            showFormMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            // Show error message
            showFormMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
        } finally {
            // Hide loading state
            setFormLoadingState(false);
        }
    });

    // Form validation function
    function validateForm(formData) {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Phone validation regex (optional field)
        const phoneRegex = /^[+]?[0-9\s-]{10,}$/;

        if (!formData.fullName) {
            showFormMessage('Please enter your full name.', 'error');
            return false;
        }

        if (!emailRegex.test(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (formData.phone && !phoneRegex.test(formData.phone)) {
            showFormMessage('Please enter a valid phone number.', 'error');
            return false;
        }

        if (!formData.category) {
            showFormMessage('Please select a category.', 'error');
            return false;
        }

        if (!formData.message) {
            showFormMessage('Please enter your message.', 'error');
            return false;
        }

        return true;
    }

    // Show form message function
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Set form loading state
    function setFormLoadingState(isLoading) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (isLoading) {
            submitButton.disabled = true;
            contactForm.classList.add('form-loading');
        } else {
            submitButton.disabled = false;
            contactForm.classList.remove('form-loading');
        }
    }

    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Form submitted:', formData);
                resolve();
            }, 1500);
        });
    }

    // Real-time form validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Clear error message when user starts typing
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        });
    });
});
export function initContactForm() {
    const form = document.getElementById('contact-form');
    const formGroups = document.querySelectorAll('.form-group');

    // Handle form submission
    form.addEventListener('submit', handleFormSubmit);

    // Handle input focus and blur for floating labels
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        if (input && label) {
            // Handle focus
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            // Handle blur
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    group.classList.remove('focused');
                }
                validateField(input);
            });

            // Handle input
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    group.classList.add('has-value');
                } else {
                    group.classList.remove('has-value');
                }
                
                // Clear error state when user starts typing
                if (group.classList.contains('error')) {
                    group.classList.remove('error');
                    removeErrorMessage(group);
                }
            });
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    let isValid = true;
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Simulate form submission
        submitForm(data);
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    formGroup.classList.remove('error');
    removeErrorMessage(formGroup);
    
    // Required field validation
    if (!value) {
        showFieldError(formGroup, `${capitalizeFirst(fieldName)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(formGroup, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value.length < 10) {
        showFieldError(formGroup, 'Message must be at least 10 characters long');
        return false;
    }
    
    return true;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff6b6b;
        font-size: 0.8rem;
        position: absolute;
        bottom: -20px;
        left: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    formGroup.appendChild(errorElement);
    
    // Animate in
    setTimeout(() => {
        errorElement.style.opacity = '1';
    }, 10);
}

function removeErrorMessage(formGroup) {
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.opacity = '0';
        setTimeout(() => {
            errorMessage.remove();
        }, 300);
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function submitForm(data) {
    const submitButton = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Remove has-value classes
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-value', 'focused');
        });
        
    } catch (error) {
        // Show error message
        showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-size: 0.9rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        ${type === 'success' 
            ? 'background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2);'
            : 'background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2);'
        }
    `;
    
    const form = document.getElementById('contact-form');
    form.appendChild(messageElement);
    
    // Animate in
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 5000);
}
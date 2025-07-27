import { initHeroScene } from './heroScene.js';
import { initAboutScene } from './aboutScene.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animation.js';
import { initContactForm } from './contactForm.js';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();
    
    // Initialize animations
    initAnimations();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize Three.js scenes
    initHeroScene();
    initAboutScene();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Trigger resize events for Three.js scenes
            window.dispatchEvent(new Event('resize-scenes'));
        }, 100);
    });
});
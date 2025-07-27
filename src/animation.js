import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // Hero section animations
    initHeroAnimations();
    
    // Section reveal animations
    initSectionAnimations();
    
    // Project cards animations
    initProjectAnimations();
    
    // Skills animations
    initSkillsAnimations();
    
    // Contact form animations
    initContactAnimations();
}

function initHeroAnimations() {
    // Hero text animations are handled by CSS keyframes
    // Add scroll indicator animation
    gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

function initSectionAnimations() {
    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title, 
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Animate section lines
    gsap.utils.toArray('.section-line').forEach(line => {
        gsap.fromTo(line,
            {
                scaleX: 0
            },
            {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // About section content animation
    gsap.fromTo('.about-text',
        {
            x: -50,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.about-visual',
        {
            x: 50,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

function initProjectAnimations() {
    // Stagger project cards animation
    gsap.fromTo('.project-card',
        {
            y: 80,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Project card hover animations
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

function initSkillsAnimations() {
    // Animate skill categories
    gsap.utils.toArray('.skill-category').forEach((category, index) => {
        gsap.fromTo(category,
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Animate skill tags
    gsap.utils.toArray('.skill-tag').forEach((tag, index) => {
        gsap.fromTo(tag,
            {
                scale: 0,
                opacity: 0
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                delay: index * 0.05,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

function initContactAnimations() {
    // Contact info animation
    gsap.fromTo('.contact-info',
        {
            x: -50,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Contact form animation
    gsap.fromTo('.contact-form',
        {
            x: 50,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Animate contact methods
    gsap.utils.toArray('.contact-method').forEach((method, index) => {
        gsap.fromTo(method,
            {
                y: 20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.contact-methods',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Form groups animation
    gsap.utils.toArray('.form-group').forEach((group, index) => {
        gsap.fromTo(group,
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}
import * as THREE from 'three';

let scene, camera, renderer, helixGroup, particles;
let animationId;

export function initAboutScene() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    updateSize();
    
    // Create DNA helix structure
    createDNAHelix();
    
    // Create floating particles
    createFloatingParticles();

    // Position camera
    camera.position.z = 8;

    // Resize handler
    window.addEventListener('resize-scenes', updateSize);

    // Start animation
    animate();
}

function createDNAHelix() {
    helixGroup = new THREE.Group();
    
    const helixHeight = 6;
    const helixRadius = 2;
    const segments = 60;
    const turns = 3;

    // Create two helical strands
    for (let strand = 0; strand < 2; strand++) {
        const strandGroup = new THREE.Group();
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2 * turns + (strand * Math.PI);
            const y = (i / segments) * helixHeight - helixHeight / 2;
            
            // Create sphere for each point
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: strand === 0 ? 0x667eea : 0x764ba2,
                transparent: true,
                opacity: 0.8
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.x = Math.cos(angle) * helixRadius;
            sphere.position.y = y;
            sphere.position.z = Math.sin(angle) * helixRadius;
            
            strandGroup.add(sphere);
            
            // Add connecting lines between strands
            if (i % 4 === 0 && strand === 0) {
                const oppositeAngle = angle + Math.PI;
                const lineGeometry = new THREE.BufferGeometry();
                const positions = new Float32Array([
                    Math.cos(angle) * helixRadius, y, Math.sin(angle) * helixRadius,
                    Math.cos(oppositeAngle) * helixRadius, y, Math.sin(oppositeAngle) * helixRadius
                ]);
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x888888,
                    transparent: true,
                    opacity: 0.4
                });
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                strandGroup.add(line);
            }
        }
        
        helixGroup.add(strandGroup);
    }
    
    scene.add(helixGroup);
}

function createFloatingParticles() {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x667eea);
    const color2 = new THREE.Color(0x764ba2);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions around the helix
        const radius = 4 + Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 8;
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = height;
        positions[i3 + 2] = Math.sin(angle) * radius;

        // Random colors
        const mixRatio = Math.random();
        const color = color1.clone().lerp(color2, mixRatio);
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function updateSize() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function animate() {
    animationId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Rotate the helix
    if (helixGroup) {
        helixGroup.rotation.y = time * 0.3;
        helixGroup.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    // Animate particles
    if (particles) {
        particles.rotation.y = time * 0.1;
        
        // Update particle positions for floating effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + i) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Cleanup function
export function cleanupAboutScene() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }
    window.removeEventListener('resize-scenes', updateSize);
}
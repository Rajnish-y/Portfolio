import * as THREE from 'three';

let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

export function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating geometric shapes
    createFloatingShapes();
    
    // Create particle system
    createParticles();

    // Position camera
    camera.position.z = 5;

    // Mouse movement handler
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Resize handler
    window.addEventListener('resize-scenes', onWindowResize, false);

    // Start animation loop
    animate();
}

function createFloatingShapes() {
    const shapes = [];
    const geometries = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.ConeGeometry(0.3, 0.6, 8),
        new THREE.OctahedronGeometry(0.4),
        new THREE.TetrahedronGeometry(0.4)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x667eea, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x764ba2, 
            wireframe: true,
            transparent: true,
            opacity: 0.4
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x667eea, 
            transparent: true,
            opacity: 0.3
        })
    ];

    // Create multiple floating shapes
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const shape = new THREE.Mesh(geometry, material);

        // Random positioning
        shape.position.x = (Math.random() - 0.5) * 20;
        shape.position.y = (Math.random() - 0.5) * 20;
        shape.position.z = (Math.random() - 0.5) * 10;

        // Random rotation
        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;
        shape.rotation.z = Math.random() * Math.PI;

        // Store initial position and random properties
        shape.userData = {
            initialX: shape.position.x,
            initialY: shape.position.y,
            initialZ: shape.position.z,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatRange: Math.random() * 2 + 1
        };

        shapes.push(shape);
        scene.add(shape);
    }

    // Store shapes for animation
    scene.userData.shapes = shapes;
}

function createParticles() {
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x667eea);
    const color2 = new THREE.Color(0x764ba2);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions
        positions[i3] = (Math.random() - 0.5) * 50;
        positions[i3 + 1] = (Math.random() - 0.5) * 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;

        // Interpolate between two colors
        const mixRatio = Math.random();
        const color = color1.clone().lerp(color2, mixRatio);
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Animate floating shapes
    if (scene.userData.shapes) {
        scene.userData.shapes.forEach((shape) => {
            const userData = shape.userData;
            
            // Rotation animation
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            shape.rotation.z += userData.rotationSpeed.z;

            // Floating animation
            shape.position.y = userData.initialY + Math.sin(time * userData.floatSpeed) * userData.floatRange;
            
            // Mouse interaction
            shape.position.x = userData.initialX + mouseX * 2;
            shape.position.z = userData.initialZ + mouseY * 2;
        });
    }

    // Animate particles
    if (particles) {
        particles.rotation.y = time * 0.1;
        
        // Mouse interaction for particles
        particles.position.x = mouseX * 5;
        particles.position.y = -mouseY * 5;
    }

    // Camera subtle movement
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Cleanup function
export function cleanupHeroScene() {
    if (renderer) {
        renderer.dispose();
    }
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize-scenes', onWindowResize);
}
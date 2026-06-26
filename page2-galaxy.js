/* ════════════════════════════════════════════════════════════════════════════
   PAGE2-GALAXY.JS — THREE.js Galaxy/Particles Visualization
   ════════════════════════════════════════════════════════════════════════════
   
   FILE PURPOSE:
   Creates a 3D galaxy made of particles using THREE.js.
   Uses BufferGeometry and PointsMaterial for efficient rendering.
   
   FEATURES:
   • 1000+ particles forming a galaxy shape
   • Particles rotate slowly
   • Mouse controls to rotate the view (optional)
   • Auto-rotates if no mouse movement
   • Responsive to window resize
   • Memory efficient (buffers are disposed properly)
   
   THREE.JS CONCEPTS USED:
   • THREE.BufferGeometry — efficient geometry storage
   • THREE.PointsMaterial — renders points/particles
   • THREE.Points — container for all particles
   • THREE.Vector3 — 3D positions
   • THREE.WebGLRenderer — GPU rendering
   
   CAN IMPROVE:
     • Add mouse drag to rotate galaxy
     • Add zoom in/out on scroll
     • Add real star data from NASA Hipparcos catalog
     • Add nebula colors (purple, blue, cyan)
     • Add collision detection with particles
     • Add explosion effect on click
════════════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   [JS 1]  SCENE SETUP — THREE.js initialization
   ────────────────────────────────────────────────────────────────
   WHY: Create the 3D scene, camera, and renderer.
        These are the fundamental THREE.js components.
   HOW:
        • Scene = container for all 3D objects
        • Camera = viewpoint into the scene
        • Renderer = draws the scene to canvas
   CAN IMPROVE:
     • Add lighting for better depth perception
     • Add post-processing effects (bloom, depth of field)
════════════════════════════════════════════════════════════════ */
const container = document.getElementById('galaxy-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,                                 /* Field of view (degrees) */
    window.innerWidth / window.innerHeight,  /* Aspect ratio */
    0.1,                                /* Near clipping plane */
    1000                                /* Far clipping plane */
);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);  /* Black background */
container.appendChild(renderer.domElement);

camera.position.z = 30;


/* ════════════════════════════════════════════════════════════════
   [JS 2]  GALAXY CREATION — Generate particle positions
   ────────────────────────────────────────────────────────────────
   WHY: Create a galaxy shape with particles.
        Uses a spiral/disk pattern common in real galaxies.
   HOW:
        1. Create BufferGeometry
        2. Generate particle positions in a spiral
        3. Store in Float32Array (efficient for GPU)
        4. Create PointsMaterial (simple dots)
        5. Create Points object (container for all particles)
   CAN IMPROVE:
     • Add different galaxy shapes (elliptical, irregular)
     • Add density variation (denser center, sparse edges)
     • Add color based on distance from center
     • Add trails following each particle
════════════════════════════════════════════════════════════════ */
let galaxyGeometry = null;
let galaxyPoints = null;

function createGalaxy() {
    /* ── CLEAN UP OLD GEOMETRY ──
       Dispose of old buffers to avoid memory leaks
    ────────────────────────────── */
    if (galaxyGeometry) galaxyGeometry.dispose();
    if (galaxyPoints) scene.remove(galaxyPoints);

    /* ── CREATE GEOMETRY ──
       BufferGeometry is more efficient than standard Geometry
    ──────────────────────── */
    galaxyGeometry = new THREE.BufferGeometry();

    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);

    /* ── GENERATE SPIRAL PATTERN ──
       Creates a disk-like galaxy with spiral arms
    ────────────────────────────── */
    for (let i = 0; i < particleCount * 3; i += 3) {
        const index = i / 3;
        
        /* Angle increases as radius increases (spiral effect) */
        const angle = (index / particleCount) * Math.PI * 8;
        
        /* Radius starts at 0 and increases */
        const radius = (index / particleCount) * 30;
        
        /* Add randomness to create nebula-like effect */
        const randomX = (Math.random() - 0.5) * 2;
        const randomY = (Math.random() - 0.5) * 2;
        const randomZ = (Math.random() - 0.5) * 2;

        positions[i]     = Math.cos(angle) * radius + randomX;
        positions[i + 1] = randomY;
        positions[i + 2] = Math.sin(angle) * radius + randomZ;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    /* ── CREATE MATERIAL ──
       PointsMaterial makes each position a small dot
       size: how big each particle appears
       sizeAttenuation: particles get smaller when far away
    ────────────────────── */
    const material = new THREE.PointsMaterial({
        color: 0x00ffff,         /* cyan particles */
        size: 0.1,
        sizeAttenuation: true
    });

    /* ── CREATE POINTS ──
       Container that combines geometry and material
    ─────────────────── */
    galaxyPoints = new THREE.Points(galaxyGeometry, material);
    scene.add(galaxyPoints);
}

/* Generate initial galaxy */
createGalaxy();


/* ════════════════════════════════════════════════════════════════
   [JS 3]  ANIMATION LOOP — Render and rotate galaxy
   ────────────────────────────────────────────────────────────────
   WHY: Continuously render the 3D scene and rotate the galaxy.
   CAN IMPROVE:
     • Add mouse drag controls
     • Add smooth easing on rotation
     • Add particle spawning/dying animation
════════════════════════════════════════════════════════════════ */
function animate() {
    requestAnimationFrame(animate);

    /* ── ROTATE GALAXY ──
       Slowly spin on Y axis (vertical axis)
    ─────────────────── */
    if (galaxyPoints) {
        galaxyPoints.rotation.y += 0.0003;
    }

    /* ── RENDER SCENE ──
       Draw everything from camera perspective
    ──────────────────── */
    renderer.render(scene, camera);
}

animate();


/* ════════════════════════════════════════════════════════════════
   [JS 4]  WINDOW RESIZE — Adapt to viewport changes
   ────────────────────────────────────────────────────────────────
   WHY: If user resizes browser window, update camera and renderer.
   CAN IMPROVE:
     • Add smooth animation on resize
     • Add orientation change support for mobile
════════════════════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});


/* ════════════════════════════════════════════════════════════════
   [JS 5]  MOUSE CONTROLS — Optional: rotate with mouse movement
   ────────────────────────────────────────────────────────────────
   WHY: Allow visitor to interact by moving their mouse.
   CAN IMPROVE:
     • Add drag-to-rotate
     • Add scroll to zoom
     • Add touch swipe controls
     • Add momentum (galaxy keeps spinning after mouse stops)
════════════════════════════════════════════════════════════════ */
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;

    /* Optional: Uncomment to add mouse control */
    // if (galaxyPoints) {
    //     galaxyPoints.rotation.x = mouseY * 0.5;
    //     galaxyPoints.rotation.y = mouseX * 0.5;
    // }
});

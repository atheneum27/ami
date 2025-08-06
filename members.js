// Initialize Three.js Scene
const canvas = document.getElementById('three-js-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create Star-Shaped Geometry
function createStarShape() {
    const shape = new THREE.Shape();
    const outerRadius = 1;
    const innerRadius = 0.4;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
        const angle = (i / points) * Math.PI;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }
    shape.closePath();
    return shape;
}

const starShape = createStarShape();
const extrudeSettings = {
    steps: 2,
    depth: 0.2,
    bevelEnabled: false
};
const starGeometrySmall = new THREE.ExtrudeGeometry(starShape, { ...extrudeSettings, depth: 0.1 });
const starGeometryBig = new THREE.ExtrudeGeometry(starShape, extrudeSettings);

// Create Stars
const stars = [];
const starColors = [0xf6e133, 0x99e11f, 0xffffff];
for (let i = 0; i < 100; i++) {
    const isBigStar = i < 30;
    const geometry = isBigStar ? starGeometryBig : starGeometrySmall;
    const material = new THREE.MeshBasicMaterial({
        color: starColors[Math.floor(Math.random() * starColors.length)],
        transparent: true,
        opacity: Math.random() * 0.4 + 0.6,
        side: THREE.DoubleSide
    });
    const star = new THREE.Mesh(geometry, material);

    star.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
    );

    star.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    const scale = isBigStar ? (Math.random() * 0.5 + 0.8) : (Math.random() * 0.3 + 0.3);
    star.scale.set(scale, scale, scale);

    star.userData = {
        twinkleSpeed: Math.random() * 0.03 + 0.02,
        twinkleOffset: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.01 + 0.005,
        baseScale: scale
    };

    scene.add(star);
    stars.push(star);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x99e11f, 1, 100);
pointLight.position.set(0, 0, 20);
scene.add(pointLight);

camera.position.z = 40;

function animate() {
    requestAnimationFrame(animate);
    stars.forEach(star => {
        star.material.opacity = 0.6 + 0.4 * Math.sin(Date.now() * star.userData.twinkleSpeed + star.userData.twinkleOffset);
        star.rotation.z += star.userData.rotationSpeed;
        star.position.z += Math.sin(Date.now() * 0.001 + star.position.x) * 0.03;
        if (star.position.z > 40) star.position.z -= 80;
        if (star.position.z < -40) star.position.z += 80;
    });
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Intersection Observer for Animations
const unitCards = document.querySelectorAll('.unit-card');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('exiting');
            } else {
                entry.target.classList.add('exiting');
                entry.target.classList.remove('visible');
            }
        });
    },
    { threshold: 0.1 }
);

unitCards.forEach(card => observer.observe(card));

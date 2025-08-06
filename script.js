// Function to hide the audio player
function hideAudioPlayer() {
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.style.display = 'none';
}

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
const starColors = [0x9ae01e, 0xffffff, 0xf7df3a]; // Green, white, yellow
for (let i = 0; i < 150; i++) {
  const isBigStar = i < 40; // 40 big stars, 110 small stars
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
const pointLight = new THREE.PointLight(0x9ae01e, 1, 100);
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

const loadingTips = [
  { tip: "Preparing Aktivis Markaz Islami...", subtext: "Empowering education with Islamic values." },
  { tip: "Initializing Community Programs...", subtext: "Building a brighter future for all." },
  { tip: "Loading Educational Resources...", subtext: "Fostering academic and spiritual growth." },
  { tip: "Connecting with the Community...", subtext: "Together, we make a difference." },
  { tip: "Finalizing Event Preparations...", subtext: "Join us for inspiring experiences." }
];

function updateLoadingTip() {
  const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
  document.getElementById('loading-tip').textContent = randomTip.tip;
  document.getElementById('loading-subtext').textContent = randomTip.subtext;
}

window.addEventListener('load', () => {
  const progressBar = document.getElementById('progress-bar');
  const loader = document.getElementById('loader');
  const navbar = document.querySelector('.navbar');
  const heroSection = document.querySelector('.hero-section');
  const body = document.body;
  
  // Add loading class to body to disable scrolling and interactions
  body.classList.add('loading');
  
  // Update loading tips
  updateLoadingTip();
  setInterval(updateLoadingTip, 3000);
  
  // Progress bar animation
  let progress = 0;
  const increment = 2; // Smaller increment for smoother animation
  const intervalTime = 80; // Faster interval for smoother animation
  const interval = setInterval(() => {
    progress += increment;
    if (progress > 100) {
      progress = 100; // Cap at 100%
    }
    progressBar.style.width = progress + '%';
    
    if (progress >= 100) {
      clearInterval(interval); // Stop the interval
      loader.classList.add('loaded'); // Fade out loader
      setTimeout(() => {
        // Remove loading class to re-enable scrolling and interactions
        body.classList.remove('loading');
        navbar.classList.add('show');
        heroSection.classList.add('show');
      }, 1150); // Match CSS transition duration (1.15s)
    }
  }, intervalTime);
  
  // Prevent touchmove events from scrolling the main content while loader is active
  document.addEventListener('touchmove', (e) => {
    if (body.classList.contains('loading')) {
      e.preventDefault();
    }
  }, { passive: false });
});

document.querySelectorAll('.nav-link').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });
});

// Button control for unit-slider carousel
const slider = document.querySelector('.unit-slider');
const leftButton = document.querySelector('.unit-nav-left');
const rightButton = document.querySelector('.unit-nav-right');
let currentRotateY = 0;
const cardsQuantity = 8; // Matches --quantity: 8
const anglePerCard = 360 / cardsQuantity; // 45 degrees per card

function updateRotation() {
  slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${currentRotateY}deg)`;
}

leftButton.addEventListener('click', () => {
  currentRotateY += anglePerCard; // Rotate left (next card)
  updateRotation();
});

rightButton.addEventListener('click', () => {
  currentRotateY -= anglePerCard; // Rotate right (previous card)
  updateRotation();
});

// Preserve hover-to-flip for mouse users
document.querySelectorAll('.unit-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    slider.style.transition = 'none'; // Prevent transition during hover
  });
  card.addEventListener('mouseleave', () => {
    slider.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'; // Restore transition
  });
});

// Intersection Observer for unit cards
const unitsSection = document.querySelector('.units');
const unitCards = document.querySelectorAll('.unit-card');

const unitObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        unitCards.forEach((card) => {
          card.classList.remove('exiting');
          card.classList.add('visible');
        });
      } else {
        unitCards.forEach((card) => {
          card.classList.remove('visible');
          card.classList.add('exiting');
        });
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px'
  }
);

unitObserver.observe(unitsSection);

// Intersection Observer for event animations
function observeEventCards() {
  const eventCards = document.querySelectorAll('.event');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When the event card enters the viewport
          entry.target.classList.remove('exiting');
          entry.target.classList.add('visible');
        } else {
          // When the event card leaves the viewport
          entry.target.classList.remove('visible');
          entry.target.classList.add('exiting');
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: '0px' // No margin around the viewport
    }
  );
  
  // Observe each event card
  eventCards.forEach((card) => {
    observer.observe(card);
  });
}

// Initialize observer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', observeEventCards);

// Optional: If events are loaded dynamically via an API, re-run the observer
async function loadEvents() {
  try {
    const response = await fetch('/api/events'); // Replace with your actual API endpoint
    const events = await response.json();
    // Example: Assuming you dynamically populate the events-grid
    const eventGrids = document.querySelectorAll('.events-grid');
    eventGrids.forEach((grid, index) => {
      grid.innerHTML = events[index].map((event) => `
        <div class="event">
          <h3>${event.title}</h3>
          <p class="event-date">${event.date}</p>
          <p class="event-desc">${event.description}</p>
          <div class="event-rewards">
            <h4>Highlights</h4>
            <ul>
              ${event.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('');
    });
    // Re-run the observer after dynamically adding event cards
    observeEventCards();
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// Uncomment the following line if events are loaded dynamically
// document.addEventListener('DOMContentLoaded', loadEvents);

// Typing Animation for Hero Section with Fixed Delay
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-animation');
    const textToType = 'Berjihad | Berkarya | Bersinergi dalam Dakwah';
    const animationDelay = 6000; // 5.5 seconds: loader (~4s) + hero show (1s) + hero fade-in (1.2s) + buffer (0.3s)
    let index = 0;

    function type() {
        if (index < textToType.length) {
            typingElement.textContent = textToType.slice(0, index + 1);
            index++;
            setTimeout(type, 70); // Typing speed (100ms per character)
        } else {
            // Stop blinking cursor after typing is complete
            typingElement.style.animation = 'none';
            typingElement.style.borderRight = 'none';
        }
    }

    // Start typing animation after the specified delay
    setTimeout(() => {
        typingElement.textContent = ''; // Clear initial text
        typingElement.classList.add('visible'); // Fade in the text
        type();
    }, animationDelay);
});

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public')); // Place your HTML, CSS, JS in a 'public' folder

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'studentnidzar@gmail.com',
    pass: process.env.EMAIL_PASSWORD // Use environment variable for security
  }
});

// Handle form submission
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  
  const mailOptions = {
    from: email,
    to: 'studentnidzar@gmail.com',
    subject: `New Message from ${name} via AMI Contact Form`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ status: 'success', message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error sending message.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent default form submission
  
  const form = e.target;
  const formStatus = document.getElementById('form-status');
  const email = form.querySelector('#email').value;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formStatus.textContent = 'Please enter a valid email address.';
    formStatus.style.color = '#ff4d4d';
    return;
  }
  
  formStatus.textContent = 'Sending...';
  formStatus.style.color = '#b0b0e0';
  
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      formStatus.textContent = 'Message sent successfully!';
      formStatus.style.color = '#9ae01e';
      form.reset();
    } else {
      formStatus.textContent = 'Error sending message. Please try again.';
      formStatus.style.color = '#ff4d4d';
    }
  } catch (error) {
    formStatus.textContent = 'Error sending message. Please try again.';
    formStatus.style.color = '#ff4d4d';
  }
});

// Add to AMI.js
async function loadRankings() {
  try {
    const response = await fetch('/api/rankings'); // Replace with your API endpoint
    const rankings = await response.json();
    const rankingColumn = document.querySelector('.ranking-column');
    rankingColumn.innerHTML = rankings.map((rank, index) => `
            <div class="rank-card">
                <div class="rank-position">${index + 1}</div>
                <h3>${rank.name}</h3>
                <p class="rank-desc">${rank.description}</p>
                <div class="rank-score">Score: ${rank.score}</div>
            </div>
        `).join('');
  } catch (error) {
    console.error('Error loading rankings:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadRankings);

// AMI.js
async function loadRankings() {
  try {
    const response = await fetch('/api/rankings'); // Replace with your API endpoint
    const rankings = await response.json();
    const rankingColumn = document.querySelector('.ranking-column');
    rankingColumn.innerHTML = rankings.map((rank, index) => `
            <div class="rank-card" data-rank="${index + 1}">
                <div class="rank-position" data-rank="${index + 1}">${index + 1}</div>
                <h3>${rank.name}</h3>
                <p class="rank-desc">${rank.description}</p>
                <div class="rank-score">Score: ${rank.score}</div>
            </div>
        `).join('');
  } catch (error) {
    console.error('Error loading rankings:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadRankings);

app.get('/api/rankings', (req, res) => {
  const rankings = [
    { name: 'Yusuf Azzam Hafi', description: 'Outstanding leadership in Pembina unit.', score: 950 },
    { name: 'Annisa Zulfa', description: 'Exceptional dedication in Rois Roisah.', score: 920 },
    { name: 'Nidzar Hammam Ismath', description: 'Key contributor to Sekretaris Umum.', score: 890 },
    { name: 'Fadly', description: 'Innovative efforts in Syiar dan Dakwah.', score: 860 },
    { name: 'Iman', description: 'Dedicated to Jasadiyah wa Ruhiyah.', score: 830 }
  ];
  res.json(rankings);
});

document.querySelectorAll('.nav-link').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });
});


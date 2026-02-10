// Screen elements
const intro = document.getElementById("intro");
const hug = document.getElementById("hug");
const message = document.getElementById("message");

// Interactive elements
const aura = document.getElementById("aura");
const teddy = document.getElementById("teddy");
const styleTitle = document.getElementById("styleTitle");
const techniqueName = document.getElementById("techniqueName");
const finalMessage = document.getElementById("finalMessage");
const holdProgress = document.querySelector(".hold-progress");
const particlesContainer = document.getElementById("particles");

// State
let currentStyle = "";
let holding = false;
let holdStartTime = 0;
let holdAnimationFrame = null;
const HOLD_DURATION = 1500; // 1.5 seconds to complete hug

// Messages for each breathing style
const messages = {
  fire: "Like an eternal flame, my love for you burns bright and unwavering. I'd cross any battlefield just to hold you. 🔥",
  water: "My feelings flow endlessly toward you, calm yet powerful. Even from afar, I always return to you. 💧",
  blossom: "Soft as petals, warm as spring - that's how you make me feel. You're the most beautiful part of my world. 🌸"
};

// Technique names (Demon Slayer style)
const techniques = {
  fire: "First Form: Eternal Embrace",
  water: "Tenth Form: Constant Flow of Affection",
  blossom: "Final Form: Blooming Heart"
};

// Particle configurations
const particleConfig = {
  fire: { emoji: ['🔥', '💥', '✨', '⭐'], color: '#ff6b1a' },
  water: { emoji: ['💧', '💎', '✨', '🌊'], color: '#4fc3f7' },
  blossom: { emoji: ['🌸', '🌺', '💗', '✨'], color: '#ff7aa2' }
};

// Initialize - add event listeners to style choice buttons
document.querySelectorAll(".style-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectStyle(btn.dataset.style);
  });
});

// Select breathing style
function selectStyle(style) {
  currentStyle = style;
  
  // Update body class for background
  document.body.className = style;
  
  // Update text content
  styleTitle.textContent = `${style.charAt(0).toUpperCase() + style.slice(1)} Breathing`;
  techniqueName.textContent = techniques[style];
  
  // Update aura class
  aura.className = `aura ${style}`;
  
  // Transition screens
  intro.classList.remove("active");
  setTimeout(() => {
    hug.classList.add("active");
    startBreathingParticles();
  }, 100);
}

// Particle system for breathing effects
let breathingParticleInterval = null;

function startBreathingParticles() {
  clearInterval(breathingParticleInterval);
  
  breathingParticleInterval = setInterval(() => {
    if (hug.classList.contains("active")) {
      createBreathingParticle();
    }
  }, 800);
}

function createBreathingParticle() {
  const config = particleConfig[currentStyle];
  const particle = document.createElement("div");
  particle.className = `particle ${currentStyle}-particle`;
  
  // Random emoji from the set
  const randomEmoji = config.emoji[Math.floor(Math.random() * config.emoji.length)];
  particle.textContent = randomEmoji;
  particle.style.fontSize = `${Math.random() * 20 + 20}px`;
  
  // Random position near the bear (center of screen)
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = (Math.random() - 0.5) * 150;
  const offsetY = (Math.random() - 0.5) * 150;
  
  particle.style.left = `${centerX + offsetX}px`;
  particle.style.top = `${centerY + offsetY}px`;
  
  // Random animation duration
  particle.style.animationDuration = `${Math.random() * 2 + 3}s`;
  
  particlesContainer.appendChild(particle);
  
  // Remove after animation
  setTimeout(() => {
    particle.remove();
  }, 5000);
}

// Hug burst particles
function createHugBurst() {
  const config = particleConfig[currentStyle];
  const burstCount = 20;
  
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.className = `particle ${currentStyle}-particle`;
      
      const randomEmoji = config.emoji[Math.floor(Math.random() * config.emoji.length)];
      particle.textContent = randomEmoji;
      particle.style.fontSize = `${Math.random() * 25 + 25}px`;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const angle = (Math.PI * 2 * i) / burstCount;
      const distance = Math.random() * 100 + 50;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      
      particle.style.left = `${centerX + offsetX}px`;
      particle.style.top = `${centerY + offsetY}px`;
      particle.style.animationDuration = `${Math.random() * 1.5 + 2}s`;
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 4000);
    }, i * 30);
  }
}

// Press & hold interaction
teddy.addEventListener("pointerdown", startHold);
teddy.addEventListener("pointerup", endHold);
teddy.addEventListener("pointerleave", endHold);
teddy.addEventListener("pointercancel", endHold);

function startHold(e) {
  e.preventDefault();
  holding = true;
  holdStartTime = Date.now();
  
  // Visual feedback
  aura.style.opacity = "1";
  teddy.classList.add("hugging");
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
  
  // Start hold animation
  animateHold();
}

function animateHold() {
  if (!holding) {
    return;
  }
  
  const elapsed = Date.now() - holdStartTime;
  const progress = Math.min(elapsed / HOLD_DURATION, 1);
  
  // Update progress bar
  holdProgress.style.width = `${progress * 100}%`;
  
  // Update aura scale based on progress
  const scale = 1 + progress * 0.4; // Scale from 1 to 1.4
  aura.style.transform = `scale(${scale})`;
  teddy.style.transform = `scale(${1 + progress * 0.2})`;
  
  if (progress < 1) {
    holdAnimationFrame = requestAnimationFrame(animateHold);
  } else {
    // Hug complete!
    completeHug();
  }
}

function endHold(e) {
  if (!holding) {
    return;
  }
  
  e.preventDefault();
  holding = false;
  
  if (holdAnimationFrame) {
    cancelAnimationFrame(holdAnimationFrame);
  }
  
  // Reset if not complete
  const elapsed = Date.now() - holdStartTime;
  if (elapsed < HOLD_DURATION) {
    resetHold();
  }
}

function resetHold() {
  aura.style.opacity = "0";
  aura.style.transform = "scale(1)";
  teddy.style.transform = "scale(1)";
  teddy.classList.remove("hugging");
  holdProgress.style.width = "0%";
}

function completeHug() {
  holding = false;
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50, 30, 100]);
  }
  
  // Create burst effect
  createHugBurst();
  
  // Stop breathing particles
  clearInterval(breathingParticleInterval);
  
  // Transition to message screen
  setTimeout(() => {
    hug.classList.remove("active");
    resetHold();
    
    setTimeout(() => {
      message.classList.add("active");
      finalMessage.textContent = messages[currentStyle];
      
      // Continue particles on message screen
      startMessageParticles();
    }, 100);
  }, 600);
}

// Particle system for message screen
let messageParticleInterval = null;

function startMessageParticles() {
  clearInterval(messageParticleInterval);
  
  messageParticleInterval = setInterval(() => {
    if (message.classList.contains("active")) {
      createMessageParticle();
    }
  }, 400);
  
  // Create initial burst
  for (let i = 0; i < 10; i++) {
    setTimeout(() => createMessageParticle(), i * 100);
  }
}

function createMessageParticle() {
  const particle = document.createElement("div");
  particle.className = `particle ${currentStyle}-particle`;
  particle.textContent = "💛";
  particle.style.fontSize = `${Math.random() * 20 + 25}px`;
  
  particle.style.left = `${Math.random() * window.innerWidth}px`;
  particle.style.top = `${window.innerHeight - 50}px`;
  particle.style.animationDuration = `${Math.random() * 2 + 3}s`;
  
  particlesContainer.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 5000);
}

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  clearInterval(breathingParticleInterval);
  clearInterval(messageParticleInterval);
  if (holdAnimationFrame) {
    cancelAnimationFrame(holdAnimationFrame);
  }
});

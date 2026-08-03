// Sticky header
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY >= 50) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

// Image sliding (safe version)
const slides = Array.from(document.querySelectorAll('.image-card'));
let index = 0;
let locked = false;

function move(dir) {
  if (locked) return;
  locked = true;

  const current = slides[index];
  const nextIndex = (index + dir + slides.length) % slides.length;
  const next = slides[nextIndex];

  next.className = 'image-card ' + (dir === 1 ? 'enter-from-right' : 'enter-from-left');
  void next.offsetWidth; // force reflow

  current.className = 'image-card active ' + (dir === 1 ? 'exit-to-left' : 'exit-to-right');
  next.className = 'image-card active';

  current.addEventListener('transitionend', () => {
    index = nextIndex;
    locked = false;
  }, { once: true });
}

const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
if (leftArrow) leftArrow.addEventListener('click', () => move(-1));
if (rightArrow) rightArrow.addEventListener('click', () => move(1));

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') move(-1);
  if (e.key === 'ArrowRight') move(1);
});

// Dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  if (!toggleBtn) return;

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }

  // Toggle on click
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
});

// mobile code

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');

  if (!menuBtn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  };

  const openMenu = () => {
    nav.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.innerHTML = '<i class="fas fa-times"></i>';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close after clicking a link (nice on mobile)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});

// Projects slider navigation logic
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("projects-container");
  const prevBtn = document.getElementById("project-prev");
  const nextBtn = document.getElementById("project-next");

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 370; // card width (350px) + gap (20px)

  prevBtn.addEventListener("click", () => {
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });
});

// Scroll to Top Button Visibility and Action
document.addEventListener("DOMContentLoaded", () => {
  const scrollTopBtn = document.getElementById("scroll-to-top");

  if (!scrollTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

/* ==========================================================
   Scroll Reveal Animation System (using Intersection Observer)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach((element) => {
    observer.observe(element);
  });
});

/* ==========================================================
   Typewriter Effect (Hero Subtitle Typing Loop)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("typewriter-text");
  if (!element) return;

  const words = JSON.parse(element.getAttribute("data-words"));
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let currentWord = "";

  function type() {
    const fullWord = words[wordIdx];
    
    if (isDeleting) {
      currentWord = fullWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      currentWord = fullWord.substring(0, charIdx + 1);
      charIdx++;
    }

    element.textContent = currentWord;

    let typeSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && currentWord === fullWord) {
      typeSpeed = 1800; // Pause at complete word
      isDeleting = true;
    } else if (isDeleting && currentWord === "") {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typeSpeed = 400; // Pause before starting new word
    }

    setTimeout(type, typeSpeed);
  }

  type();
});

/* ==========================================================
   Neural Network Interactive Canvas Particle Background
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const topSection = canvas.parentElement;

  let width = (canvas.width = topSection.offsetWidth);
  let height = (canvas.height = topSection.offsetHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = topSection.offsetWidth;
    height = canvas.height = topSection.offsetHeight;
  });

  const particles = [];
  const maxParticles = window.innerWidth < 768 ? 40 : 80;
  const connectionDist = 110;
  const mouse = { x: null, y: null, radius: 140 };

  topSection.addEventListener("mousemove", (e) => {
    const rect = topSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  topSection.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interaction with mouse pointer position
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      // Fetch dynamic primary-green theme color value (hex, rgb, etc.)
      const color = getComputedStyle(document.body).getPropertyValue('--primary-green').trim();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Populate particles list
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    const color = getComputedStyle(document.body).getPropertyValue('--primary-green').trim();
    ctx.strokeStyle = color;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDist) {
          ctx.lineWidth = 1 - dist / connectionDist;
          ctx.globalAlpha = (1 - dist / connectionDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1.0; // Reset canvas context alpha state

    requestAnimationFrame(animate);
  }

  animate();
});

/* ==========================================================
   3D Tilt Interaction for Profile Image
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".tilt-container");
  if (!container) return;

  // Only enable on desktop/pointer devices to prevent layout jumps on touch screen devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  container.addEventListener("mouseleave", () => {
    container.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

/* ==========================================================
   Cursor Spotlight Tracking for Cards, Skill Cards, & Project Cards
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card, .skill-card, .project-card");
  
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
});

/* ==========================================================
   Parallax Scroll for Scrollytelling Section
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const parallaxBg = document.getElementById("scrolly-parallax-bg");
  if (!parallaxBg) return;
  const section = parallaxBg.parentElement;

  window.addEventListener("scroll", () => {
    const rect = section.getBoundingClientRect();
    const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    
    // Check if section is in viewport boundaries
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Moves background from -45px to 45px relative scroll progress
      const yOffset = (scrollPercent - 0.5) * 90;
      parallaxBg.style.transform = `translateY(${yOffset}px)`;
    }
  });
});





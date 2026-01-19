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

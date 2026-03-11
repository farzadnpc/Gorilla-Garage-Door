// ===========================
// EmailJS Init
// ===========================
emailjs.init({ publicKey: '2YMtU9kQgwbLl4HOs' });

// ===========================
// Navbar scroll effect
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===========================
// Mobile hamburger menu
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const overlay   = document.getElementById('mobileOverlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ===========================
// Mobile accordion dropdowns
// ===========================
document.querySelectorAll('.has-dropdown .dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = this.closest('.has-dropdown');
      const isOpen = parent.classList.contains('mobile-open');
      document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('mobile-open'));
      if (!isOpen) parent.classList.add('mobile-open');
    }
  });
});

// ===========================
// Quote form — EmailJS
// ===========================
const quoteForm   = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

if (quoteForm) {
  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = quoteForm.querySelector('[name="name"]').value.trim();
    const phone   = quoteForm.querySelector('[name="phone"]').value.trim();
    const service = quoteForm.querySelector('[name="service"]').value;
    const suburb  = quoteForm.querySelector('[name="suburb"]').value.trim();

    if (!name || !phone || !service || !suburb) {
      alert('Please fill in all required fields.');
      return;
    }

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const templateParams = {
      from_name: name,
      phone:     phone,
      email:     quoteForm.querySelector('[name="email"]').value.trim() || 'Not provided',
      service:   service,
      suburb:    suburb,
      message:   quoteForm.querySelector('[name="message"]').value.trim() || 'No additional details provided.',
    };

    emailjs.send('service_kna5oca', 'template_e57xsho', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        quoteForm.style.display = 'none';
        formSuccess.style.display = 'block';
      })
      .catch(function(error) {
        console.error('FAILED...', JSON.stringify(error));
        submitBtn.textContent = 'Send My Free Quote Request →';
        submitBtn.disabled = false;
        alert('Error ' + (error.status || '') + ': ' + (error.text || 'Unknown error') + '\n\nPlease call us directly on 1300 000 000.');
      });
  });
}

// ===========================
// Scroll fade-in animations
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .door-card, .step, .testimonial-card, .feature-item, .promise-item'
).forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
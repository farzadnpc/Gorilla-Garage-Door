// EmailJS Init — only runs if EmailJS is loaded on the page
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: '2YMtU9kQgwbLl4HOs' });
}

// Navbar scroll
var navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Hamburger menu
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');
var overlay = document.getElementById('mobileOverlay');

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

if (hamburger && navLinks && overlay) {
  hamburger.addEventListener('click', function() {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
}

// Mobile dropdowns
document.querySelectorAll('.has-dropdown .dropdown-toggle').forEach(function(toggle) {
  toggle.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      var parent = this.closest('.has-dropdown');
      var isOpen = parent.classList.contains('mobile-open');
      document.querySelectorAll('.has-dropdown').forEach(function(d) {
        d.classList.remove('mobile-open');
      });
      if (!isOpen) {
        parent.classList.add('mobile-open');
      }
    }
  });
});

// Quote form with EmailJS
var quoteForm = document.getElementById('quoteForm');
var formSuccess = document.getElementById('formSuccess');
var submitBtn = document.getElementById('submitBtn');

if (quoteForm) {
  quoteForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var name = quoteForm.querySelector('[name="name"]').value.trim();
    var phone = quoteForm.querySelector('[name="phone"]').value.trim();
    var service = quoteForm.querySelector('[name="service"]').value;
    var suburb = quoteForm.querySelector('[name="suburb"]').value.trim();
    var email = quoteForm.querySelector('[name="email"]').value.trim();
    var message = quoteForm.querySelector('[name="message"]').value.trim();

    if (!name || !phone || !service || !suburb) {
      alert('Please fill in all required fields.');
      return;
    }

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    var templateParams = {
      from_name: name,
      phone: phone,
      email: email || 'Not provided',
      service: service,
      suburb: suburb,
      message: message || 'No additional details.'
    };

    emailjs.send('service_kna5oca', 'template_e57xsho', templateParams)
      .then(function(response) {
        console.log('Email sent!', response.status, response.text);
        quoteForm.style.display = 'none';
        formSuccess.style.display = 'block';
      })
      .catch(function(error) {
        console.error('Email failed:', error);
        submitBtn.textContent = 'Send My Free Quote Request';
        submitBtn.disabled = false;
        alert('Something went wrong: ' + JSON.stringify(error) + '\n\nPlease call us on 0426 955 751.');
      });
  });
}

// Scroll fade-in
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .door-card, .step, .testimonial-card, .feature-item, .promise-item').forEach(function(el) {
  el.style.opacity = '0';
  observer.observe(el);
});
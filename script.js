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

document.addEventListener("DOMContentLoaded", function() {
  const popupLinks = document.querySelectorAll('.popup-link');
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const closeBtn = document.querySelector('.lightbox-close');

  if(lightbox && lightboxImg) {
    // Open Lightbox
    popupLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Stops the browser from leaving the page
        lightboxImg.src = this.getAttribute('href');
        lightbox.classList.add('active');
      });
    });

    // Close Lightbox on X click
    if(closeBtn) {
      closeBtn.addEventListener('click', function() {
        lightbox.classList.remove('active');
      });
    }

    // Close Lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
      }
    });

    // Close Lightbox on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
      }
    });
  }
});
// GLOBAL LIGHTBOX OVERRIDE
document.addEventListener('click', function(event) {
  // 1. Detect if a gallery link or suburb photo was clicked
  const popupLink = event.target.closest('.popup-link, .gallery-item, .suburb-photo-slot');
  
  if (popupLink) {
    event.preventDefault(); // ABSOLUTELY STOP THE BROWSER REDIRECT
    event.stopPropagation(); // Stop any other conflicting scripts

    // Get the image URL
    let imageUrl = popupLink.getAttribute('href');
    if (!imageUrl || imageUrl === '#') {
      const img = popupLink.querySelector('img');
      if (img) imageUrl = img.src;
    }

    if (imageUrl) openDynamicLightbox(imageUrl);
  }
}, true); // The 'true' argument forces this script to run before anything else on the page

function openDynamicLightbox(imageSrc) {
  let lightbox = document.getElementById('gorilla-dynamic-lightbox');
  
  // 2. If the lightbox doesn't exist in the HTML, create it on the fly
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'gorilla-dynamic-lightbox';
    lightbox.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 9999999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position: absolute; top: 20px; right: 30px; color: #ffffff; font-size: 50px; font-weight: 300; cursor: pointer; z-index: 10000000; line-height: 1;';

    const img = document.createElement('img');
    img.id = 'gorilla-dynamic-image';
    img.style.cssText = 'max-width: 90%; max-height: 90vh; border-radius: 8px; box-shadow: 0 5px 25px rgba(0,0,0,0.8); object-fit: contain;';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);

    // Close logic
    const closeLightbox = () => {
      lightbox.style.opacity = '0';
      setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target !== img) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // 3. Set the image and forcefully show the popup
  const imgEl = document.getElementById('gorilla-dynamic-image');
  imgEl.src = imageSrc;
  lightbox.style.display = 'flex';
  
  // Tiny delay to allow the fade-in animation to trigger smoothly
  setTimeout(() => { lightbox.style.opacity = '1'; }, 10);
}
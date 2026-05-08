// MOBILE MENU TOGGLE
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
      link.addEventListener('click', function() {
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// SMOOTH SCROLLING & ACTIVE NAV LINKS
function initSmoothScrolling() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

function updateActiveNav() {
  const navLinks = document.querySelectorAll('.nav-list a');
  const scrollY = window.scrollY;

  navLinks.forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          link.classList.add('active');
        }
      }
    }
  });
}

// FORM VALIDATION
function initFormValidation() {
  const forms = document.querySelectorAll('.contact-form, form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm(this)) {
        showFormError(this, 'Please fill in all required fields correctly.');
      } else {
        // Show success message
        showFormSuccess(this);
      }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', function() {
        validateField(this);
      });
      
      field.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
  });
}

function validateForm(form) {
  let isValid = true;
  
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  // Remove previous error message
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  if (!value) {
    isValid = false;
    showFieldError(field, 'This field is required');
  } else if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      showFieldError(field, 'Please enter a valid email address');
    }
  } else if (field.type === 'tel') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (value && !phoneRegex.test(value)) {
      isValid = false;
      showFieldError(field, 'Please enter a valid phone number');
    }
  }

  if (isValid) {
    field.classList.remove('error');
  } else {
    field.classList.add('error');
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function showFormError(form, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error-message';
  errorDiv.textContent = message;
  form.insertBefore(errorDiv, form.firstChild);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function showFormSuccess(form) {
  const successDiv = document.createElement('div');
  successDiv.className = 'form-success-message';
  successDiv.textContent = '✓ Thank you! Your message has been sent successfully.';
  form.insertBefore(successDiv, form.firstChild);
  
  form.reset();
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// GALLERY IMAGE MODAL POP-UP
function initGalleryModal() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;

  const modalImage = document.getElementById("modalImage");
  const captionText = document.getElementById("caption");
  const closeBtn = document.querySelector(".close");

  // Get all gallery images
  const galleryImages = document.querySelectorAll(".gallery-item img");

  // Add click event to each gallery image
  galleryImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      modal.style.display = "block";
      modalImage.src = this.src;
      captionText.textContent = this.alt;
    });
  });

  // Close modal when clicking the X button
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside the image
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
  const scrollButton = document.getElementById('scrollToTop');
  
  if (!scrollButton) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollButton.style.display = 'block';
    } else {
      scrollButton.style.display = 'none';
    }
  });

  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// INITIALIZE ALL FUNCTIONS ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initSmoothScrolling();
  initFormValidation();
  initGalleryModal();
  initScrollToTop();

  // Log that JavaScript has loaded
  console.log('Adventure Horizons BD - JavaScript initialized');
});

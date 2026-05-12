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
  loadAdminContent();

  // Setup membership application form
  const membershipForm = document.getElementById('membershipApplicationForm');
  if (membershipForm) {
    membershipForm.addEventListener('submit', handleMembershipApplication);
  }

  // Log that JavaScript has loaded
  console.log('Adventure Horizons BD - JavaScript initialized');
});

// ============================================
// LOAD ADMIN CONTENT
// ============================================
function loadAdminContent() {
  loadAdminGallery();
  loadAdminEvents();
  loadAdminMembership();
  loadCommunityVoices();
}

function loadAdminGallery() {
  const gallery = JSON.parse(localStorage.getItem('galleryItems')) || [];
  const galleryGrid = document.querySelector('.gallery-grid');
  
  if (!galleryGrid || gallery.length === 0) return;

  // Add admin-uploaded photos to the gallery
  gallery.forEach(item => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    figure.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='images/pic-1.jpg'" />
      <figcaption>${item.title}</figcaption>
    `;
    galleryGrid.appendChild(figure);
  });

  // Re-initialize gallery modal for new images
  initGalleryModal();
}

function loadAdminEvents() {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const eventsContainer = document.querySelector('.grid-events-expanded');
  
  if (!eventsContainer || events.length === 0) return;

  // Add admin-added events
  events.forEach(event => {
    const article = document.createElement('article');
    article.className = 'event-card';
    article.innerHTML = `
      <p class="event-date">${event.date}</p>
      <h3>${event.title}</h3>
      <p><strong>Region:</strong> ${event.region} | ${event.duration}</p>
      <p>${event.description}</p>
    `;
    eventsContainer.appendChild(article);
  });
}

function loadAdminMembership() {
  const requests = JSON.parse(localStorage.getItem('membershipRequests')) || [];
  const approved = requests.filter(r => r.status === 'approved');
  
  // This can be used to display approved members on a public page if needed
  // For now, it just loads the data
  return approved;
}

function loadCommunityVoices() {
  const reviews = JSON.parse(localStorage.getItem('communityReviews')) || [];
  const voicesGrid = document.getElementById('communityVoicesGrid');
  
  if (!voicesGrid) return;

  if (reviews.length === 0) {
    voicesGrid.innerHTML = '<p class="no-reviews" style="grid-column: 1/-1; text-align: center; color: var(--muted);">No community reviews yet. Be the first to share your experience!</p>';
    return;
  }

  voicesGrid.innerHTML = reviews.map(review => `
    <article class="testimonial-card">
      <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
      <p style="margin: 1rem 0 0.5rem; font-weight: 600; font-size: 1.1rem;">"${review.title}"</p>
      <p style="color: var(--muted); font-size: 0.9rem; margin: 0.5rem 0;">📍 ${review.event}</p>
      <p style="margin: 1rem 0; line-height: 1.6;">${review.review}</p>
      <p class="author">${review.memberName}</p>
      <p style="color: var(--muted); font-size: 0.8rem; margin: 0.5rem 0;">Shared on ${review.dateSubmitted}</p>
    </article>
  `).join('');
}

// ===== MEMBERSHIP APPLICATION FORM =====
function openMembershipForm() {
  // Scroll to the membership application form
  const formContainer = document.querySelector('.membership-form-container');
  if (formContainer) {
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('appName').focus();
  }
}

function handleMembershipApplication(e) {
  e.preventDefault();

  const name = document.getElementById('appName').value;
  const email = document.getElementById('appEmail').value;
  const phone = document.getElementById('appPhone').value;
  const plan = document.getElementById('appPlan').value;
  const experience = document.getElementById('appExperience').value;
  const message = document.getElementById('appMessage').value;

  if (!name || !email || !phone || !plan || !experience) {
    alert('Please fill in all required fields');
    return;
  }

  // Get existing membership requests
  let requests = JSON.parse(localStorage.getItem('membershipRequests')) || [];

  // Check if email already exists
  const existingRequest = requests.find(r => r.email === email);
  if (existingRequest) {
    alert('An application with this email already exists. Please use a different email or contact admin.');
    return;
  }

  // Add new membership request
  const newRequest = {
    id: Date.now(),
    name,
    email,
    phone,
    plan,
    experience,
    message,
    status: 'pending',
    dateSubmitted: new Date().toLocaleDateString()
  };

  requests.push(newRequest);
  localStorage.setItem('membershipRequests', JSON.stringify(requests));

  // Clear form
  document.getElementById('membershipApplicationForm').reset();

  // Show success message
  const formContainer = document.querySelector('.membership-form-container');
  const successMsg = document.createElement('div');
  successMsg.className = 'form-success-message';
  successMsg.textContent = '✓ Your membership application has been submitted successfully! The admin will review it shortly.';
  formContainer.parentNode.insertBefore(successMsg, formContainer);

  setTimeout(() => {
    successMsg.remove();
  }, 5000);

  // Scroll to top of section
  document.querySelector('.section:has(.membership-form-container)').scrollIntoView({ behavior: 'smooth' });
}

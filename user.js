// USER DASHBOARD - INITIALIZATION & LOGIN
document.addEventListener('DOMContentLoaded', function() {
  initUserDashboard();
});

function initUserDashboard() {
  const userEmail = sessionStorage.getItem('userEmail');
  
  if (userEmail) {
    const approvedMembers = JSON.parse(localStorage.getItem('membershipRequests')) || [];
    const member = approvedMembers.find(m => m.email === userEmail && m.status === 'approved');
    
    if (member) {
      showUserDashboard(member);
    } else {
      showUserLoginForm();
      alert('Your membership has not been approved yet. Please contact admin.');
    }
  } else {
    showUserLoginForm();
  }

  // Setup form handlers
  if (document.getElementById('userLoginForm')) {
    document.getElementById('userLoginForm').addEventListener('submit', handleUserLogin);
  }
  if (document.getElementById('userGalleryForm')) {
    document.getElementById('userGalleryForm').addEventListener('submit', handleUserGallerySubmit);
  }
  if (document.getElementById('userReviewForm')) {
    document.getElementById('userReviewForm').addEventListener('submit', handleUserReviewSubmit);
  }

  // Load user's uploads and reviews
  loadUserPhotos();
  loadUserReviews();
}

// ===== USER LOGIN =====
function handleUserLogin(e) {
  e.preventDefault();
  const email = document.getElementById('userEmail').value;

  // Check if email is in approved members
  const membershipRequests = JSON.parse(localStorage.getItem('membershipRequests')) || [];
  const member = membershipRequests.find(m => m.email === email && m.status === 'approved');

  if (member) {
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('memberName', member.name);
    showUserDashboard(member);
  } else {
    alert('This email is not approved for membership yet. Please contact the admin.');
  }
}

function logout() {
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('memberName');
  showUserLoginForm();
}

function showUserLoginForm() {
  document.getElementById('userLoginSection').classList.remove('hidden');
  document.getElementById('userDashboard').classList.add('hidden');
}

function showUserDashboard(member) {
  document.getElementById('userLoginSection').classList.add('hidden');
  document.getElementById('userDashboard').classList.remove('hidden');
  
  // Update header info
  document.getElementById('memberName').textContent = member.name;
  document.getElementById('memberStatus').textContent = `Plan: ${member.plan} | ${member.email}`;
}

// ===== USER TAB SWITCHING =====
function switchUserTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.user-tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Remove active class from all tab buttons
  const buttons = document.querySelectorAll('.user-tab');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Show selected tab
  const selectedTab = document.getElementById(tabName + 'Tab');
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Add active class to clicked button
  event.target.classList.add('active');
}

// ===== USER UPLOAD METHOD SWITCHING =====
function switchUserUploadMethod(method) {
  const fileMethod = document.getElementById('userFileUploadMethod');
  const urlMethod = document.getElementById('userUrlUploadMethod');
  const buttons = document.querySelectorAll('.upload-method-tabs .upload-method-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (method === 'file') {
    fileMethod.classList.add('active');
    urlMethod.classList.remove('active');
  } else {
    fileMethod.classList.remove('active');
    urlMethod.classList.add('active');
  }
}

// ===== USER GALLERY UPLOAD =====
function handleUserGallerySubmit(e) {
  e.preventDefault();
  
  const userEmail = sessionStorage.getItem('userEmail');
  const memberName = sessionStorage.getItem('memberName');
  const title = document.getElementById('userPhotoTitle').value;
  const imageFile = document.getElementById('userPhotoFile').files[0];
  const imageUrl = document.getElementById('userPhotoUrl').value;
  const description = document.getElementById('userPhotoDescription').value;

  if (!title) {
    alert('Please enter a photo title');
    return;
  }

  if (!imageFile && !imageUrl) {
    alert('Please either upload an image file or provide an image URL');
    return;
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      addUserPhotoToGallery(userEmail, memberName, title, e.target.result, description);
    };
    reader.onerror = function() {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(imageFile);
  } else {
    addUserPhotoToGallery(userEmail, memberName, title, imageUrl, description);
  }
}

function addUserPhotoToGallery(userEmail, memberName, title, imageData, description) {
  // Get existing user gallery items
  let userGallery = JSON.parse(localStorage.getItem('userGalleryItems')) || [];

  // Add new item
  const newItem = {
    id: Date.now(),
    email: userEmail,
    memberName,
    title,
    imageUrl: imageData,
    description,
    dateAdded: new Date().toLocaleDateString(),
    type: 'user'
  };

  userGallery.push(newItem);
  localStorage.setItem('userGalleryItems', JSON.stringify(userGallery));

  // Also add to main gallery for display
  let mainGallery = JSON.parse(localStorage.getItem('galleryItems')) || [];
  const mainItem = {
    id: newItem.id,
    title: newItem.title + ' (by ' + memberName + ')',
    imageUrl: newItem.imageUrl,
    description: newItem.description,
    dateAdded: newItem.dateAdded,
    uploadedBy: memberName,
    userEmail: userEmail
  };
  mainGallery.push(mainItem);
  localStorage.setItem('galleryItems', JSON.stringify(mainGallery));

  // Clear form
  document.getElementById('userGalleryForm').reset();
  
  // Reload lists
  loadUserPhotos();
  
  alert('Photo uploaded successfully! It will appear in the gallery.');
}

function loadUserPhotos() {
  const userEmail = sessionStorage.getItem('userEmail');
  const userGallery = JSON.parse(localStorage.getItem('userGalleryItems')) || [];
  const userPhotos = userGallery.filter(item => item.email === userEmail);
  
  const photosList = document.getElementById('userPhotosList');

  if (userPhotos.length === 0) {
    photosList.innerHTML = '<p class="no-items">No photos uploaded yet</p>';
    return;
  }

  photosList.innerHTML = userPhotos.map(item => `
    <div class="user-item">
      <div class="user-item-header">
        <div>
          <h4>${item.title}</h4>
          <p class="user-item-meta">Uploaded: ${item.dateAdded}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteUserPhoto(${item.id})">Delete</button>
      </div>
      <img src="${item.imageUrl}" alt="${item.title}" class="user-item-preview" onerror="this.src='images/pic-1.jpg'">
      <p class="user-item-description">${item.description || 'No description'}</p>
    </div>
  `).join('');
}

function deleteUserPhoto(id) {
  if (confirm('Are you sure you want to delete this photo?')) {
    let userGallery = JSON.parse(localStorage.getItem('userGalleryItems')) || [];
    userGallery = userGallery.filter(item => item.id !== id);
    localStorage.setItem('userGalleryItems', JSON.stringify(userGallery));

    // Also remove from main gallery
    let mainGallery = JSON.parse(localStorage.getItem('galleryItems')) || [];
    mainGallery = mainGallery.filter(item => item.id !== id);
    localStorage.setItem('galleryItems', JSON.stringify(mainGallery));

    loadUserPhotos();
  }
}

// ===== USER REVIEW SUBMISSION =====
function setRating(rating) {
  document.getElementById('reviewRating').value = rating;
  
  // Update star display
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });

  // Update rating text
  const ratingTexts = ['', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
  document.getElementById('ratingDisplay').textContent = ratingTexts[rating];
}

function handleUserReviewSubmit(e) {
  e.preventDefault();
  
  const userEmail = sessionStorage.getItem('userEmail');
  const memberName = sessionStorage.getItem('memberName');
  const event = document.getElementById('reviewEvent').value;
  const rating = parseInt(document.getElementById('reviewRating').value);
  const title = document.getElementById('reviewTitle').value;
  const reviewText = document.getElementById('reviewText').value;

  if (!event || !title || !reviewText) {
    alert('Please fill in all required fields');
    return;
  }

  // Get existing reviews
  let reviews = JSON.parse(localStorage.getItem('communityReviews')) || [];

  // Add new review
  const newReview = {
    id: Date.now(),
    email: userEmail,
    memberName,
    event,
    rating,
    title,
    review: reviewText,
    dateSubmitted: new Date().toLocaleDateString()
  };

  reviews.push(newReview);
  localStorage.setItem('communityReviews', JSON.stringify(reviews));

  // Clear form
  document.getElementById('userReviewForm').reset();
  document.getElementById('reviewRating').value = 5;
  setRating(5);
  
  // Reload lists
  loadUserReviews();
  
  alert('Review submitted successfully! Thank you for sharing your experience.');
}

function loadUserReviews() {
  const userEmail = sessionStorage.getItem('userEmail');
  const allReviews = JSON.parse(localStorage.getItem('communityReviews')) || [];
  const userReviews = allReviews.filter(review => review.email === userEmail);
  
  const reviewsList = document.getElementById('userReviewsList');

  if (userReviews.length === 0) {
    reviewsList.innerHTML = '<p class="no-items">No reviews submitted yet</p>';
    return;
  }

  reviewsList.innerHTML = userReviews.map(review => `
    <div class="user-item review-item">
      <div class="user-item-header">
        <div>
          <h4>${review.title}</h4>
          <p class="user-item-meta">${review.event} • ${generateStars(review.rating)}</p>
          <p class="user-item-meta">Submitted: ${review.dateSubmitted}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteUserReview(${review.id})">Delete</button>
      </div>
      <p class="user-item-description">${review.review}</p>
    </div>
  `).join('');
}

function generateStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function deleteUserReview(id) {
  if (confirm('Are you sure you want to delete this review?')) {
    let reviews = JSON.parse(localStorage.getItem('communityReviews')) || [];
    reviews = reviews.filter(review => review.id !== id);
    localStorage.setItem('communityReviews', JSON.stringify(reviews));
    loadUserReviews();
  }
}

// ADMIN PANEL - INITIALIZATION & LOGIN
document.addEventListener('DOMContentLoaded', function() {
  initAdmin();
});

function initAdmin() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
  
  if (isLoggedIn === 'true') {
    showAdminDashboard();
  } else {
    showLoginForm();
  }

  // Setup form handlers
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('galleryForm').addEventListener('submit', handleGallerySubmit);
  document.getElementById('eventsForm').addEventListener('submit', handleEventSubmit);
  document.getElementById('membershipForm').addEventListener('submit', handleMembershipSubmit);

  // Load and display initial data
  loadGalleryList();
  loadEventsList();
  loadMembershipList();
}

// ===== LOGIN SYSTEM =====
function handleLogin(e) {
  e.preventDefault();
  const password = document.getElementById('adminPassword').value;
  const correctPassword = 'admin123';

  if (password === correctPassword) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showAdminDashboard();
    document.getElementById('adminPassword').value = '';
  } else {
    alert('Invalid password. Please try again.');
  }
}

function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  showLoginForm();
}

function showLoginForm() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('adminDashboard').classList.add('hidden');
}

function showAdminDashboard() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Remove active class from all tab buttons
  const buttons = document.querySelectorAll('.admin-tab');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Show selected tab
  const selectedTab = document.getElementById(tabName + 'Tab');
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Add active class to clicked button
  event.target.classList.add('active');
}

// ===== GALLERY MANAGEMENT =====
function switchUploadMethod(method) {
  const fileMethod = document.getElementById('fileUploadMethod');
  const urlMethod = document.getElementById('urlUploadMethod');
  const buttons = document.querySelectorAll('.upload-method-btn');

  // Remove active class from all buttons
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  event.target.classList.add('active');

  if (method === 'file') {
    fileMethod.classList.add('active');
    urlMethod.classList.remove('active');
    document.getElementById('galleryImageFile').focus();
  } else {
    fileMethod.classList.remove('active');
    urlMethod.classList.add('active');
    document.getElementById('galleryImageUrl').focus();
  }
}

function handleGallerySubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('galleryTitle').value;
  const imageFile = document.getElementById('galleryImageFile').files[0];
  const imageUrl = document.getElementById('galleryImageUrl').value;
  const description = document.getElementById('galleryDescription').value;

  if (!title) {
    alert('Please enter a photo title');
    return;
  }

  // Check if either file or URL is provided
  if (!imageFile && !imageUrl) {
    alert('Please either upload an image file or provide an image URL');
    return;
  }

  // If file is selected, convert it to data URL
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      addPhotoToGallery(title, e.target.result, description);
    };
    reader.onerror = function() {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(imageFile);
  } else {
    // Use URL directly
    addPhotoToGallery(title, imageUrl, description);
  }
}

function addPhotoToGallery(title, imageData, description) {
  // Get existing gallery items
  let gallery = JSON.parse(localStorage.getItem('galleryItems')) || [];

  // Add new item
  const newItem = {
    id: Date.now(),
    title,
    imageUrl: imageData,
    description,
    dateAdded: new Date().toLocaleDateString()
  };

  gallery.push(newItem);
  localStorage.setItem('galleryItems', JSON.stringify(gallery));

  // Clear form
  document.getElementById('galleryForm').reset();
  
  // Reload list
  loadGalleryList();
  
  alert('Photo added successfully!');
}

function loadGalleryList() {
  const gallery = JSON.parse(localStorage.getItem('galleryItems')) || [];
  const galleryList = document.getElementById('galleryList');

  if (gallery.length === 0) {
    galleryList.innerHTML = '<p class="no-items">No photos added yet</p>';
    return;
  }

  galleryList.innerHTML = gallery.map(item => `
    <div class="admin-item">
      <div class="admin-item-header">
        <div>
          <h4>${item.title}</h4>
          <p class="admin-item-meta">Added: ${item.dateAdded}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteGalleryItem(${item.id})">Delete</button>
      </div>
      <img src="${item.imageUrl}" alt="${item.title}" class="admin-item-preview" onerror="this.src='images/pic-1.jpg'">
      <p class="admin-item-description">${item.description || 'No description'}</p>
    </div>
  `).join('');
}

function deleteGalleryItem(id) {
  if (confirm('Are you sure you want to delete this photo?')) {
    let gallery = JSON.parse(localStorage.getItem('galleryItems')) || [];
    gallery = gallery.filter(item => item.id !== id);
    localStorage.setItem('galleryItems', JSON.stringify(gallery));
    loadGalleryList();
  }
}

// ===== EVENTS MANAGEMENT =====
function handleEventSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('eventTitle').value;
  const date = document.getElementById('eventDate').value;
  const duration = document.getElementById('eventDuration').value;
  const region = document.getElementById('eventRegion').value;
  const description = document.getElementById('eventDescription').value;

  if (!title || !date || !duration || !region || !description) {
    alert('Please fill in all required fields');
    return;
  }

  // Get existing events
  let events = JSON.parse(localStorage.getItem('events')) || [];

  // Add new event
  const newEvent = {
    id: Date.now(),
    title,
    date,
    duration,
    region,
    description,
    dateCreated: new Date().toLocaleDateString()
  };

  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));

  // Clear form
  document.getElementById('eventsForm').reset();
  
  // Reload list
  loadEventsList();
  
  alert('Event added successfully!');
}

function loadEventsList() {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const eventsList = document.getElementById('eventsList');

  if (events.length === 0) {
    eventsList.innerHTML = '<p class="no-items">No events added yet</p>';
    return;
  }

  eventsList.innerHTML = events.map(event => `
    <div class="admin-item">
      <div class="admin-item-header">
        <div>
          <h4>${event.title}</h4>
          <p class="admin-item-meta">${event.date} • ${event.region} • ${event.duration}</p>
          <p class="admin-item-meta">Created: ${event.dateCreated}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">Delete</button>
      </div>
      <p class="admin-item-description">${event.description}</p>
    </div>
  `).join('');
}

function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event?')) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(event => event.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    loadEventsList();
  }
}

// ===== MEMBERSHIP MANAGEMENT =====
function handleMembershipSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('memberName').value;
  const email = document.getElementById('memberEmail').value;
  const plan = document.getElementById('memberPlan').value;
  const phone = document.getElementById('memberPhone').value;

  if (!name || !email || !plan || !phone) {
    alert('Please fill in all required fields');
    return;
  }

  // Get existing requests
  let requests = JSON.parse(localStorage.getItem('membershipRequests')) || [];

  // Add new request
  const newRequest = {
    id: Date.now(),
    name,
    email,
    plan,
    phone,
    status: 'pending',
    dateSubmitted: new Date().toLocaleDateString()
  };

  requests.push(newRequest);
  localStorage.setItem('membershipRequests', JSON.stringify(requests));

  // Clear form
  document.getElementById('membershipForm').reset();
  
  // Reload lists
  loadMembershipList();
  
  alert('Membership request added successfully!');
}

function loadMembershipList() {
  const requests = JSON.parse(localStorage.getItem('membershipRequests')) || [];
  const approved = requests.filter(r => r.status === 'approved');
  const pending = requests.filter(r => r.status === 'pending');

  // Load pending requests
  const membershipList = document.getElementById('membershipList');
  if (pending.length === 0) {
    membershipList.innerHTML = '<p class="no-items">No pending requests</p>';
  } else {
    membershipList.innerHTML = pending.map(request => `
      <div class="admin-item">
        <div class="admin-item-header">
          <div>
            <h4>${request.name}</h4>
            <p class="admin-item-meta">${request.email} • ${request.phone}</p>
            <p class="admin-item-meta">Plan: <strong>${request.plan}</strong> • Submitted: ${request.dateSubmitted}</p>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-success btn-sm" onclick="approveMembership(${request.id})">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="rejectMembership(${request.id})">Reject</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load approved members
  const approvedList = document.getElementById('approvedList');
  if (approved.length === 0) {
    approvedList.innerHTML = '<p class="no-items">No approved members yet</p>';
  } else {
    approvedList.innerHTML = approved.map(member => `
      <div class="admin-item approved-member">
        <div class="admin-item-header">
          <div>
            <h4>${member.name}</h4>
            <p class="admin-item-meta">${member.email} • ${member.phone}</p>
            <p class="admin-item-meta">Plan: <strong>${member.plan}</strong> • Approved: ${member.dateApproved || member.dateSubmitted}</p>
          </div>
          <button class="btn btn-danger btn-sm" onclick="rejectMembership(${member.id})">Remove</button>
        </div>
      </div>
    `).join('');
  }
}

function approveMembership(id) {
  if (confirm('Approve this membership request?')) {
    let requests = JSON.parse(localStorage.getItem('membershipRequests')) || [];
    const request = requests.find(r => r.id === id);
    
    if (request) {
      request.status = 'approved';
      request.dateApproved = new Date().toLocaleDateString();
    }
    
    localStorage.setItem('membershipRequests', JSON.stringify(requests));
    loadMembershipList();
    alert('Membership approved!');
  }
}

function rejectMembership(id) {
  if (confirm('Remove this request/member?')) {
    let requests = JSON.parse(localStorage.getItem('membershipRequests')) || [];
    requests = requests.filter(r => r.id !== id);
    localStorage.setItem('membershipRequests', JSON.stringify(requests));
    loadMembershipList();
  }
}

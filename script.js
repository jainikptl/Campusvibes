// Canvas Background
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles(); // Reinitialize particles when canvas is resized
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle animation
let particlesArray = [];
const particleCount = Math.min(120, window.innerWidth / 10);
const connectionDistance = 150;
const mouseRadius = 100;

// Mouse interaction
let mouse = {
  x: null,
  y: null,
  radius: mouseRadius
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
  }
  
  update() {
    // Move particles
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Handle canvas boundaries
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    
    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mouse.radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouse.radius - distance) / mouse.radius;
      
      const directionX = forceDirectionX * force * 2;
      const directionY = forceDirectionY * force * 2;
      
      this.speedX -= directionX;
      this.speedY -= directionY;
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Initialize particles
function initParticles() {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
  }
}

// Connect particles with lines if they're close enough
function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < connectionDistance) {
        // Calculate opacity based on distance
        const opacity = 1 - (distance / connectionDistance);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
        ctx.lineWidth = particlesArray[i].size / 3;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  particlesArray.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  connectParticles();
  requestAnimationFrame(animateParticles);
}

// Initialize and start animation
initParticles();
animateParticles();

// Remove splash screen
setTimeout(() => {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    splash.style.animation = "fadeOut 1s forwards";
    setTimeout(() => splash.remove(), 1000); // cleanup from DOM
  }
}, 4000);

// Category filter functionality
document.getElementById('categoryFilter').addEventListener('change', function() {
  const selected = this.value;
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    const category = item.querySelector('.event-category').textContent.trim();
    if (selected === 'all' || category.includes(selected)) {
      item.style.display = 'block';
      item.style.animation = 'fadeInUp 0.7s forwards';
    } else {
      item.style.display = 'none';
    }
  });
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    const title = item.querySelector('h3').textContent.toLowerCase();
    const description = item.querySelector('p').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});

// Toggle between Timeline and Grid views
document.getElementById('timelineView').addEventListener('click', function() {
  this.classList.add('active');
  document.getElementById('gridView').classList.remove('active');
  document.getElementById('timelineContainer').style.display = 'block';
  document.getElementById('gridContainer').style.display = 'none';
});

document.getElementById('gridView').addEventListener('click', function() {
  this.classList.add('active');
  document.getElementById('timelineView').classList.remove('active');
  document.getElementById('timelineContainer').style.display = 'none';
  
  // Generate grid items from timeline items (if not already done)
  const gridContainer = document.getElementById('gridContainer');
  if (gridContainer.children.length === 0) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
      const category = item.querySelector('.event-category').innerHTML;
      const title = item.querySelector('h3').textContent;
      const description = item.querySelector('p').textContent;
      const date = item.querySelector('.detail:first-child span').textContent;
      
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.innerHTML = `
        <div class="grid-item-image">
          <img src="/api/placeholder/${300}/${200}" alt="${title}">
          <div class="grid-item-category">${category}</div>
        </div>
        <div class="grid-item-content">
          <h3>${title}</h3>
          <div class="grid-item-date">
            <i class="far fa-calendar-alt"></i>
            <span>${date}</span>
          </div>
          <p>${description}</p>
          <div class="grid-item-actions">
            <a href="#" class="register-btn">Register <i class="fas fa-ticket-alt"></i></a>
            <div>
              <button class="share-btn"><i class="fas fa-share-alt"></i></button>
              <button class="save-btn"><i class="far fa-bookmark"></i></button>
            </div>
          </div>
        </div>
      `;
      
      gridContainer.appendChild(gridItem);
      
      // Stagger the animation
      setTimeout(() => {
        gridItem.style.animation = 'fadeInUp 0.5s forwards';
      }, index * 100);
    });
  }
  
  gridContainer.style.display = 'grid';
});

// Load more button
document.getElementById('loadMoreBtn').addEventListener('click', function() {
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  // Simulate loading new content
  setTimeout(() => {
    // Create new timeline items
    const timeline = document.querySelector('.timeline');
    const loadMoreButton = document.querySelector('.load-more');
    
    // Example of new items (you would typically fetch these from an API)
    const newItems = [
      {
        position: 'left',
        category: '<i class="fas fa-football-ball"></i> Sports Club',
        title: 'Basketball Tournament',
        description: 'Inter-college basketball championship',
        date: '22 April 2025',
        time: '10:00 AM',
        location: 'College Grounds'
      },
      {
        position: 'right',
        category: '<i class="fas fa-book"></i> Literary Club',
        title: 'Poetry Slam Competition',
        description: 'Express yourself through verses and win exciting prizes',
        date: '25 April 2025',
        time: '4:00 PM',
        location: 'Library Hall'
      }
    ];
    
    // Add new items to timeline
    newItems.forEach(item => {
      const timelineItem = document.createElement('div');
      timelineItem.className = `timeline-item ${item.position}`;
      timelineItem.innerHTML = `
        <div class="timeline-item-content">
          <div class="event-category sports">
            ${item.category}
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="event-details">
            <div class="detail">
              <i class="far fa-calendar-alt"></i>
              <span>${item.date}</span>
            </div>
            <div class="detail">
              <i class="far fa-clock"></i>
              <span>${item.time}</span>
            </div>
            <div class="detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>${item.location}</span>
            </div>
          </div>
          <div class="action-buttons">
            <a href="#" class="register-btn">Register <i class="fas fa-ticket-alt"></i></a>
            <button class="share-btn"><i class="fas fa-share-alt"></i></button>
            <button class="save-btn"><i class="far fa-bookmark"></i></button>
          </div>
        </div>
      `;
      
      timeline.insertBefore(timelineItem, loadMoreButton);
      
      // Trigger animation
      setTimeout(() => {
        timelineItem.querySelector('.timeline-item-content').style.animation = 'fadeInUp 0.7s forwards';
      }, 200);
    });
    
    this.innerHTML = '<i class="fas fa-sync-alt"></i> Load More Events';
    
    // Also add to grid view if it exists
    const gridContainer = document.getElementById('gridContainer');
    if (gridContainer.style.display !== 'none') {
      newItems.forEach((item, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.style.opacity = '0';
        gridItem.innerHTML = `
          <div class="grid-item-image">
            <img src="/api/placeholder/${300}/${200}" alt="${item.title}">
            <div class="grid-item-category">${item.category}</div>
          </div>
          <div class="grid-item-content">
            <h3>${item.title}</h3>
            <div class="grid-item-date">
              <i class="far fa-calendar-alt"></i>
              <span>${item.date}</span>
            </div>
            <p>${item.description}</p>
            <div class="grid-item-actions">
              <a href="#" class="register-btn">Register <i class="fas fa-ticket-alt"></i></a>
              <div>
                <button class="share-btn"><i class="fas fa-share-alt"></i></button>
                <button class="save-btn"><i class="far fa-bookmark"></i></button>
              </div>
            </div>
          </div>
        `;
        
        gridContainer.appendChild(gridItem);
        
        // Stagger animation
        setTimeout(() => {
          gridItem.style.animation = 'fadeInUp 0.5s forwards';
        }, index * 100);
      });
    }
  }, 1500);
});

// Newsletter Form
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = this.querySelector('input');
  const email = emailInput.value;
  
  if (email) {
    // Normally you would submit this to your server
    this.innerHTML = '<p style="color: var(--success-color); font-weight: 500;"><i class="fas fa-check-circle"></i> Thanks for subscribing!</p>';
  }
});

// Interactive buttons
document.addEventListener('click', function(e) {
  // Handle save/bookmark button
  if (e.target.closest('.save-btn')) {
    const btn = e.target.closest('.save-btn');
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('far')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      btn.style.color = '#ffb142';
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      btn.style.color = '';
    }
  }
  
  // Handle share button
  if (e.target.closest('.share-btn')) {
    const btn = e.target.closest('.share-btn');
    // Here you could implement a share dialog
    alert('Share functionality will be implemented in the future!');
  }
});

// Animation for timeline items as they scroll into view
const observerOptions = {
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation delay to timeline items
document.querySelectorAll('.timeline-item-content').forEach((item, index) => {
  item.style.animationDelay = `${index * 0.2}s`;
  observer.observe(item);
});
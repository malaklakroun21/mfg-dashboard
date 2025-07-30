// ===============================================
// HAMBURGER MENU FUNCTIONALITY
// ===============================================

let sidebarOpen = true;

// Toggle sidebar function
function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-left');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebarOpen = !sidebarOpen;
    
    if (!sidebarOpen) {
        // Close sidebar
        sidebar.classList.add('collapsed');
        hamburgerBtn.classList.add('active');
        dashboardContainer.classList.add('sidebar-collapsed');
        overlay.classList.remove('active');
    } else {
        // Open sidebar
        sidebar.classList.remove('collapsed');
        hamburgerBtn.classList.remove('active');
        dashboardContainer.classList.remove('sidebar-collapsed');
        
        // Show overlay on mobile
        if (window.innerWidth <= 768) {
            overlay.classList.add('active');
        }
    }
}

// Initialize hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('sidebarOverlay');
    
    // Hamburger button click event
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleSidebar);
    }
    
    // Close button in sidebar
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Overlay click to close sidebar
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking outside on desktop
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.dashboard-left');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        
        if (sidebarOpen && 
            window.innerWidth > 768 &&
            !sidebar.contains(event.target) && 
            !hamburgerBtn.contains(event.target)) {
            // Uncomment the line below if you want to close sidebar when clicking outside
            // toggleSidebar();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const overlay = document.getElementById('sidebarOverlay');
        if (window.innerWidth > 768) {
            overlay.classList.remove('active');
        } else if (sidebarOpen) {
            overlay.classList.add('active');
        }
    });
});

// ===============================================
// EXISTING CODE
// ===============================================

setTimeout(() => {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}, 2000);

// Hover effects
document.querySelectorAll('.progress-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// ===============================================
// FAVORITES FUNCTIONALITY
// ===============================================

// Get favorites from localStorage
function getFavorites() {
    const favorites = localStorage.getItem('dashboardFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem('dashboardFavorites', JSON.stringify(favorites));
}

// Toggle favorite status
function toggleFavorite(event, appId) {
    event.preventDefault();
    event.stopPropagation();
    
    const favorites = getFavorites();
    const appElement = document.querySelector(`[data-app-id="${appId}"]`);
    const favoriteBtn = event.currentTarget;
    
    if (!appElement) return;
    
    const appData = {
        id: appId,
        url: appElement.getAttribute('data-url'),
        icon: appElement.getAttribute('data-icon'),
        title: appElement.getAttribute('data-title'),
        desc: appElement.getAttribute('data-desc')
    };
    
    const existingIndex = favorites.findIndex(fav => fav.id === appId);
    
    if (existingIndex > -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.querySelector('.star-icon').textContent = '☆';
    } else {
        // Add to favorites
        favorites.push(appData);
        favoriteBtn.classList.add('favorited');
        favoriteBtn.querySelector('.star-icon').textContent = '★';
    }
    
    saveFavorites(favorites);
    updateFavoritesPanel();
}

// Update the favorites panel in the right sidebar
function updateFavoritesPanel() {
    const favorites = getFavorites();
    const favoritesContainer = document.querySelector('.dashboard-right-apps-list');
    
    if (!favoritesContainer) return;
    
    // Clear existing favorites
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="no-favorites">
                <p>Aucun favori ajouté</p>
                <small>Cliquez sur ⭐ pour ajouter des applications à vos favoris</small>
            </div>
        `;
        return;
    }
    
    // Add each favorite app
    favorites.forEach(app => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'dashboard-app-btn favorite-app';
        favoriteElement.onclick = () => openApp(app.url);
        
        favoriteElement.innerHTML = `
            <img src="${app.icon}" alt="${app.title}">
            <span>
                <div class="dashboard-app-title">${app.title}</div>
                <div class="dashboard-app-desc">${app.desc}</div>
            </span>
            <button class="remove-favorite-btn" onclick="removeFavorite(event, '${app.id}')">
                <span class="remove-icon">×</span>
            </button>
        `;
        
        favoritesContainer.appendChild(favoriteElement);
    });
}

// Remove a favorite from the favorites panel
function removeFavorite(event, appId) {
    event.preventDefault();
    event.stopPropagation();
    
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== appId);
    
    saveFavorites(updatedFavorites);
    
    // Update the star button in the main apps list
    const appElement = document.querySelector(`[data-app-id="${appId}"]`);
    if (appElement) {
        const favoriteBtn = appElement.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.querySelector('.star-icon').textContent = '☆';
        }
    }
    
    updateFavoritesPanel();
}

// Open an app
function openApp(url) {
    window.location.href = url;
}

// Initialize favorites on page load
document.addEventListener('DOMContentLoaded', function() {
    const favorites = getFavorites();
    
    // Update star buttons based on saved favorites
    favorites.forEach(fav => {
        const appElement = document.querySelector(`[data-app-id="${fav.id}"]`);
        if (appElement) {
            const favoriteBtn = appElement.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.classList.add('favorited');
                favoriteBtn.querySelector('.star-icon').textContent = '★';
            }
        }
    });
    
    // Update favorites panel
    updateFavoritesPanel();
    
    // Add click handlers to app buttons
    document.querySelectorAll('.dashboard-app-btn').forEach(btn => {
        if (!btn.classList.contains('favorite-app')) {
            btn.addEventListener('click', function(e) {
                if (!e.target.closest('.favorite-btn')) {
                    const url = this.getAttribute('data-url');
                    if (url) openApp(url);
                }
            });
        }
    });
});

export function renderNavbar() {
  const currentPath = window.location.pathname;
  
  const navLinks = [
    { path: '/index.html', label: 'Home', altPaths: ['/'] },
    { path: '/about.html', label: 'About' },
    { path: '/centers.html', label: 'Learning Centers' },
    { path: '/programs.html', label: 'Programs' },
    { path: '/testimonials.html', label: 'Success Stories' },
    { path: '/volunteer.html', label: 'Volunteer' },
    { path: '/gallery.html', label: 'Gallery' },
    { path: '/faq.html', label: 'FAQ' },
    { path: '/contact.html', label: 'Contact' }
  ];

  const generateLinks = (isMobile = false) => {
    return navLinks.map(link => {
      const isActive = link.path === currentPath || (link.altPaths && link.altPaths.includes(currentPath)) ? 'active' : '';
      return `<li><a href="${link.path}" class="${isActive}">${link.label}</a></li>`;
    }).join('');
  };

  const html = `
    <!-- Sticky Navigation -->
    <header class="main-header">
        <div class="header-container">
            <a href="/index.html" class="header-logo">
                <span class="logo-icon">📚</span>
                Gyan Shala
            </a>
            <nav class="desktop-nav">
                <ul class="nav-links">
                    ${generateLinks()}
                </ul>
            </nav>
            <div class="header-actions">
                <a href="/login.html" class="btn-outline login-btn-dynamic">Login</a>
            </div>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay">
        <div class="mobile-menu-wrapper">
            <nav class="mobile-nav">
                <ul class="mobile-nav-links">
                    ${generateLinks(true)}
                </ul>
            </nav>
            <div class="mobile-menu-actions">
                <a href="/login.html" class="btn-primary login-btn-dynamic">Login</a>
            </div>
        </div>
    </div>
  `;

  return html;
}

export function initNavbarLogic() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const body = document.body;

  if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
          menuToggle.classList.toggle('active');
          mobileMenu.classList.toggle('active');
          body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      document.querySelectorAll('.mobile-nav-links a').forEach(link => {
          link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              mobileMenu.classList.remove('active');
              body.style.overflow = '';
          });
      });
  }

  // Dynamic Active Session check
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
      const loginBtns = document.querySelectorAll('.login-btn-dynamic');
      
      loginBtns.forEach(loginBtn => {
          if (loginBtn) {
              loginBtn.textContent = 'Go to Dashboard';
              loginBtn.classList.remove('btn-text', 'btn-outline');
              loginBtn.classList.add('btn-primary');
              loginBtn.style.textAlign = 'center';
              loginBtn.style.width = '100%';
              loginBtn.style.padding = '12px 24px';
              loginBtn.style.borderRadius = '12px';
              loginBtn.style.fontWeight = '600';
              loginBtn.style.textDecoration = 'none';

              if (currentUser.role === 'main_office') {
                  loginBtn.href = '/admin-dashboard.html';
              } else if (currentUser.role === 'supervisor') {
                  loginBtn.href = '/dashboard.html';
              } else if (currentUser.role === 'teacher') {
                  loginBtn.href = '/teacher-dashboard.html';
              } else if (currentUser.role === 'volunteer') {
                  loginBtn.href = '/volunteer-dashboard.html';
              }
          }
      });
  }
}

// shared-sidebar.js

const sidebarConfig = {
  admin: [
    { target: 'home', icon: 'dashboard', label: 'Dashboard' },
    { target: 'centers', icon: 'corporate_fare', label: 'Learning Centers' },
    { target: 'students', icon: 'groups', label: 'Students' },
    { target: 'teachers', icon: 'cast_for_education', label: 'Teachers' },
    { target: 'supervisors', icon: 'supervisor_account', label: 'Supervisors' },
    { target: 'volunteers', icon: 'volunteer_activism', label: 'Volunteers' },
    { target: 'parents', icon: 'family_restroom', label: 'Parents' },
    { target: 'attendance', icon: 'fact_check', label: 'Attendance Reports' },
    { target: 'progress', icon: 'analytics', label: 'Learning Progress' },
    { target: 'dropout', icon: 'warning', label: 'Dropout Risk' },
    { target: 'resources', icon: 'inventory_2', label: 'Resources' },
    { target: 'notifications', icon: 'notifications', label: 'Notifications' },
    { target: 'reports', icon: 'article', label: 'Reports' },
    { target: 'gismap', icon: 'map', label: 'GIS Resource Map' },
    { target: 'chatbot', icon: 'chat', label: 'Chatbot Logs' },
    { target: 'users', icon: 'manage_accounts', label: 'User Management' },
    { target: 'settings', icon: 'settings', label: 'Settings' },
    { target: 'profile', icon: 'person', label: 'Profile' }
  ],
  supervisor: [
    { target: 'home', icon: 'dashboard', label: 'Dashboard' },
    { target: 'centers', icon: 'corporate_fare', label: 'Assigned Centers' },
    { target: 'teachers', icon: 'cast_for_education', label: 'Teacher Monitoring' },
    { target: 'alerts', icon: 'warning', label: 'Dropout Alerts' },
    { target: 'students', icon: 'groups', label: 'Student Overview' },
    { target: 'attendance', icon: 'fact_check', label: 'Attendance Verification' },
    { target: 'visits', icon: 'map', label: 'Center Visit Reports' },
    { target: 'resources', icon: 'inventory_2', label: 'Resources' },
    { target: 'schedule', icon: 'calendar_month', label: 'Manage Schedule' },
    { target: 'messages', icon: 'chat', label: 'Messages' },
    { target: 'reports', icon: 'bar_chart', label: 'Reports' },
    { target: 'profile', icon: 'person', label: 'Profile' },
    { target: 'settings', icon: 'settings', label: 'Settings' }
  ],
  teacher: [
    { target: 'home', icon: 'dashboard', label: 'Dashboard' },
    { target: 'students', icon: 'groups', label: 'My Students' },
    { target: 'addstudent', icon: 'person_add', label: 'Add Student' },
    { target: 'studentprofile', icon: 'account_circle', label: 'Student Profile' },
    { target: 'attendance', icon: 'event_available', label: 'Daily Attendance' },
    { target: 'assessments', icon: 'quiz', label: 'Assessments' },
    { target: 'alerts', icon: 'warning', label: 'Dropout Alerts' },
    { target: 'messages', icon: 'chat', label: 'Messages' },
    { target: 'profile', icon: 'person', label: 'Profile' },
    { target: 'settings', icon: 'settings', label: 'Settings' },
    { target: 'help', icon: 'help', label: 'Help' }
  ],
  volunteer: [
    { target: 'home', icon: 'dashboard', label: 'Dashboard' },
    { target: 'centers', icon: 'corporate_fare', label: 'Assigned Centers' },
    { target: 'schedule', icon: 'schedule', label: 'Activity Schedule' },
    { target: 'attendance', icon: 'event_available', label: 'Attendance' },
    { target: 'submitreport', icon: 'assignment', label: 'Submit Report' },
    { target: 'photos', icon: 'photo_library', label: 'Upload Photos' },
    { target: 'hours', icon: 'hourglass', label: 'Volunteer Hours' },
    { target: 'messages', icon: 'chat', label: 'Messages' },
    { target: 'profile', icon: 'person', label: 'Profile' },
    { target: 'settings', icon: 'settings', label: 'Settings' }
  ],
  student: [
    { target: 'home', icon: 'dashboard', label: 'Dashboard' },
    { target: 'courses', icon: 'menu_book', label: 'My Courses' },
    { target: 'assignments', icon: 'assignment', label: 'Assignments' },
    { target: 'grades', icon: 'grade', label: 'Grades' },
    { target: 'schedule', icon: 'calendar_today', label: 'Schedule' },
    { target: 'messages', icon: 'chat', label: 'Messages' },
    { target: 'profile', icon: 'person', label: 'Profile' },
    { target: 'settings', icon: 'settings', label: 'Settings' }
  ],
  parent: [
    { target: 'home', icon: 'dashboard', label: 'Dashboard' },
    { target: 'children', icon: 'child_care', label: 'My Children' },
    { target: 'attendance', icon: 'event_available', label: 'Attendance' },
    { target: 'progress', icon: 'analytics', label: 'Academic Progress' },
    { target: 'messages', icon: 'chat', label: 'Messages' },
    { target: 'profile', icon: 'person', label: 'Profile' },
    { target: 'settings', icon: 'settings', label: 'Settings' }
  ]
};

function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarNav = document.querySelector('.sidebar-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarOverlay = document.getElementById('mobile-sidebar-overlay');
  
  if (!sidebar || !sidebarNav) return;

  // 1. Dynamic Menu Generation
  const role = document.body.getAttribute('data-role') || 'supervisor';
  const activePage = document.body.getAttribute('data-active-page') || 'home';
  
  const menuItems = sidebarConfig[role] || sidebarConfig['supervisor'];
  
  sidebarNav.innerHTML = ''; // Clear existing
  
  menuItems.forEach(item => {
    const a = document.createElement('a');
    a.href = '#';
    a.className = `nav-item ${item.target === activePage ? 'active' : ''}`;
    a.setAttribute('data-target', item.target);
    a.setAttribute('aria-label', item.label);
    
    a.innerHTML = `
      <span class="material-symbols-rounded">${item.icon}</span> 
      <span>${item.label}</span>
    `;
    
    sidebarNav.appendChild(a);
  });

  // 2. Mobile Drawer Logic
  function openSidebar() {
    sidebar.classList.add('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.classList.add('sidebar-open-body');
    sidebar.setAttribute('aria-expanded', 'true');
    // Basic focus trapping for accessibility
    setTimeout(() => {
        const firstFocusable = sidebar.querySelector('a, button, input');
        if (firstFocusable) firstFocusable.focus();
    }, 100);
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.classList.remove('sidebar-open-body');
    sidebar.setAttribute('aria-expanded', 'false');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });

  // Handle nav item clicks (both for desktop and mobile)
  sidebarNav.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem) {
      // Update active state in sidebar
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      navItem.classList.add('active');
      
      // Close sidebar on mobile after clicking a link
      if (window.innerWidth < 992) {
        closeSidebar();
      }
      
      // Here you'd normally also switch the view in your main app JS
      // The original scripts (dashboard.js etc.) might already do this
      // Make sure those scripts listen to document clicks or we trigger an event
      const target = navItem.getAttribute('data-target');
      const event = new CustomEvent('navItemSelected', { detail: { target } });
      document.dispatchEvent(event);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebar);
} else {
  initSidebar();
}

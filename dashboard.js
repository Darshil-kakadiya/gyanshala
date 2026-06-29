import { loadGoogleMaps, showGoogleMapsError } from './js/maps/google-maps-loader.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Session & Auth Verification Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first to access the dashboard.');
        window.location.href = 'login.html';
        return;
    }

    // Set dynamic date in topbar
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    // Update Header and Profile with Logged-in User Data
    const greetingName = document.querySelector('.welcome-msg h3');
    if (greetingName) greetingName.textContent = currentUser.fullName;
    
    const roleBadge = document.querySelector('.welcome-msg .role-badge');
    if (roleBadge) roleBadge.textContent = currentUser.role;

    const topBarAvatar = document.querySelector('.top-bar-right .avatar');
    if (topBarAvatar) topBarAvatar.textContent = currentUser.fullName.charAt(0);

    const profileAvatar = document.querySelector('.profile-large-avatar');
    if (profileAvatar) profileAvatar.textContent = currentUser.fullName.charAt(0);

    const profileName = document.querySelector('.profile-card h2');
    if (profileName) profileName.textContent = currentUser.fullName;

    const profileRoleBadge = document.querySelector('.profile-card .badge');
    if (profileRoleBadge) profileRoleBadge.textContent = currentUser.role;

    const profileInfoValues = document.querySelectorAll('#view-profile .info-row .value');
    if (profileInfoValues.length >= 4) {
        profileInfoValues[0].textContent = currentUser.id || 'GS-SUP-104';
        profileInfoValues[1].textContent = currentUser.email;
        profileInfoValues[2].textContent = currentUser.mobile;
        profileInfoValues[3].textContent = `${currentUser.city || ''}, ${currentUser.state || ''}`;
    }

    // Logout Functionality
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    });

    // 2. Single Page Router Logic
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const pageViews = document.querySelectorAll('.page-view');

    function switchView(viewId) {
        // Hide all views
        pageViews.forEach(view => view.classList.remove('active'));
        
        // Remove active class from navs
        navItems.forEach(item => item.classList.remove('active'));
        
        // Show target view
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) targetView.classList.add('active');
        
        // Add active to nav
        const activeNav = document.querySelector(`.sidebar-nav .nav-item[data-target="${viewId}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Lazy-load Google Maps for centers view
        if (viewId === 'centers') {
            if (typeof window.initSupervisorMap === 'function') {
                window.initSupervisorMap();
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (target) {
                switchView(target);
                window.location.hash = target;
            }
        });
    });

    // Check URL hash on load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(`view-${initialHash}`)) {
        switchView(initialHash);
    } else {
        switchView('home'); // Default to home view
    }

    // 3. Dynamic Rendering & Business Logic

    // A. Teacher Monitoring Section
    const teacherDrawer = document.getElementById('teacher-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeDrawerBtn = document.getElementById('close-drawer');
    const drawerName = document.getElementById('drawer-name');
    const drawerCenter = document.getElementById('drawer-center');
    const drawerAvatar = document.getElementById('drawer-avatar');

    function openDrawer(name, center, qual, exp, subjs) {
        if(drawerName) drawerName.textContent = name;
        if(drawerCenter) drawerCenter.textContent = center;
        if(drawerAvatar) drawerAvatar.textContent = name.charAt(0);
        
        const drawerSubjects = document.querySelector('#teacher-drawer .detail-box:nth-child(1) .value');
        const drawerExperience = document.querySelector('#teacher-drawer .detail-box:nth-child(2) .value');
        if (drawerSubjects) drawerSubjects.textContent = subjs || 'Not Specified';
        if (drawerExperience) drawerExperience.textContent = exp ? `${exp} Years` : 'Not Specified';

        if(teacherDrawer) teacherDrawer.classList.add('open');
        if(drawerOverlay) drawerOverlay.classList.add('open');
    }

    function closeDrawer() {
        if(teacherDrawer) teacherDrawer.classList.remove('open');
        if(drawerOverlay) drawerOverlay.classList.remove('open');
    }

    if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    function renderTeachers() {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const teachers = allUsers.filter(u => u.role === 'teacher');
        const tbody = document.querySelector('#view-teachers tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px;">No teachers registered yet.</td></tr>';
        } else {
            teachers.forEach(t => {
                const tr = document.createElement('tr');
                tr.className = 'teacher-row';
                tr.innerHTML = `
                    <td class="flex-start"><div class="avatar-small">${t.fullName.charAt(0)}</div><strong>${t.fullName}</strong></td>
                    <td>${t.pref_center || 'Not Assigned'}</td>
                    <td><span class="text-success">96%</span></td>
                    <td>${t.experience ? t.experience * 12 : 24}</td>
                    <td>2 hours ago</td>
                    <td>9.0 / 10</td>
                    <td><button class="icon-btn"><span class="material-symbols-rounded">visibility</span></button></td>
                `;
                tr.addEventListener('click', () => {
                    openDrawer(t.fullName, t.pref_center || 'Not Assigned', t.qualification, t.experience, t.subjects);
                });
                tbody.appendChild(tr);
            });
        }
        
        // Update home stats
        const teacherStatCard = document.querySelector('.grid-stats .stat-card:nth-child(2) h3');
        if (teacherStatCard) teacherStatCard.textContent = teachers.length;

        const uniqueCenters = [...new Set(teachers.map(t => t.pref_center).filter(Boolean))];
        const centerStatCard = document.querySelector('.grid-stats .stat-card:nth-child(1) h3');
        if (centerStatCard) centerStatCard.textContent = uniqueCenters.length;
    }

    // B. Student Overview Section
    function renderStudents() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const tbody = document.querySelector('#view-students tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px;">No students added yet. Click "Add Student" to create one.</td></tr>';
        } else {
            students.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${s.name}</strong></td>
                    <td>${s.roll}</td>
                    <td>${s.center}</td>
                    <td><span class="${parseFloat(s.attendance) < 75 ? 'text-danger' : 'text-success'}">${s.attendance}</span></td>
                    <td>${s.guardian}</td>
                    <td><span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Update home stats
        const studentStatCard = document.querySelector('.grid-stats .stat-card:nth-child(3) h3');
        if (studentStatCard) studentStatCard.textContent = students.length;
    }

    const addStudentBtn = document.querySelector('#view-students .btn-primary');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            const name = prompt("Enter Student Full Name:");
            if (!name) return;
            const roll = prompt("Enter Roll Number:");
            if (!roll) return;
            const center = prompt("Enter Center Name:");
            if (!center) return;
            const guardian = prompt("Enter Guardian Mobile Number:");
            if (!guardian) return;
            
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            students.push({ name, roll, center, guardian, attendance: '95%', status: 'Active' });
            localStorage.setItem('students', JSON.stringify(students));
            renderStudents();
        });
    }

    // C. Center Visit Reports Section
    function renderVisits() {
        const visits = JSON.parse(localStorage.getItem('visits') || '[]');
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = '';
        if (visits.length === 0) {
            timeline.innerHTML = '<p style="text-align:center; padding:24px;">No visits scheduled or reported yet. Click "Schedule New Visit" to add one.</p>';
        } else {
            visits.forEach(v => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                item.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="flex-between">
                            <h3>${v.center} - ${v.purpose}</h3>
                            <span class="text-body">${v.date}</span>
                        </div>
                        <p class="text-body" style="margin: 8px 0;"><strong>Purpose:</strong> ${v.purpose}</p>
                        <p class="text-body" style="margin: 0 0 16px 0;"><strong>Issues Found:</strong> ${v.issues}</p>
                        <span class="badge badge-success">${v.status}</span>
                    </div>
                `;
                timeline.appendChild(item);
            });
        }
    }

    const scheduleVisitBtn = document.querySelector('#view-visits .btn-primary');
    function createNewVisit() {
        const center = prompt("Enter Center Name to visit:");
        if (!center) return;
        const purpose = prompt("Enter Purpose of visit:");
        if (!purpose) return;
        const issues = prompt("Enter Issues Found (or None):") || 'None';
        
        const visits = JSON.parse(localStorage.getItem('visits') || '[]');
        visits.unshift({
            center,
            purpose,
            issues,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Report Submitted'
        });
        localStorage.setItem('visits', JSON.stringify(visits));
        renderVisits();
    }
    if (scheduleVisitBtn) scheduleVisitBtn.addEventListener('click', createNewVisit);

    // D. Resource Requests Section
    function renderResources() {
        const resources = JSON.parse(localStorage.getItem('resources') || '[]');
        const container = document.querySelector('#view-resources .grid-cards');
        if (!container) return;

        container.innerHTML = '';
        if (resources.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%; padding:24px;">No resource requests pending.</p>';
        } else {
            resources.forEach((r, idx) => {
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.style.borderTop = `4px solid ${r.priority === 'High' ? 'var(--danger)' : 'var(--warning)'}`;
                card.innerHTML = `
                    <div class="flex-between">
                        <h3>${r.item}</h3>
                        <span class="badge ${r.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${r.priority} Priority</span>
                    </div>
                    <div style="margin: 16px 0; color: var(--text-body);">
                        <p><strong>Center:</strong> ${r.center}</p>
                        <p><strong>By:</strong> ${r.by}</p>
                        <p><strong>Qty:</strong> ${r.qty}</p>
                    </div>
                    <div class="flex-start">
                        <button class="btn-primary approve-res-btn" data-idx="${idx}">Approve</button>
                        <button class="btn-outline reject-res-btn" data-idx="${idx}" style="color:var(--danger); border-color:var(--danger);">Reject</button>
                    </div>
                `;
                container.appendChild(card);
            });
            
            // Attach event listeners
            document.querySelectorAll('.approve-res-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.getAttribute('data-idx');
                    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
                    resources.splice(idx, 1);
                    localStorage.setItem('resources', JSON.stringify(resources));
                    renderResources();
                    alert('Resource request approved successfully!');
                });
            });
            document.querySelectorAll('.reject-res-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.getAttribute('data-idx');
                    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
                    resources.splice(idx, 1);
                    localStorage.setItem('resources', JSON.stringify(resources));
                    renderResources();
                    alert('Resource request rejected.');
                });
            });
        }
    }

    // E. Messaging Section
    function renderMessages() {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const contacts = allUsers.filter(u => u.role === 'teacher' || u.role === 'volunteer');
        const chatList = document.querySelector('.chat-list');
        if (!chatList) return;

        chatList.innerHTML = '';
        if (contacts.length === 0) {
            chatList.innerHTML = '<p style="padding:16px; text-align:center; font-size:0.875rem;">No registered teachers or volunteers to chat with.</p>';
            const chatWindow = document.querySelector('.chat-window');
            if (chatWindow) chatWindow.style.display = 'none';
        } else {
            const chatWindow = document.querySelector('.chat-window');
            if (chatWindow) chatWindow.style.display = 'flex';
            contacts.forEach((c, idx) => {
                const item = document.createElement('div');
                item.className = `chat-item ${idx === 0 ? 'active' : ''}`;
                item.setAttribute('data-email', c.email);
                item.innerHTML = `
                    <div class="avatar-small">${c.fullName.charAt(0)}</div>
                    <div class="chat-item-info"><h4>${c.fullName}</h4><p class="last-msg">${c.role.charAt(0).toUpperCase() + c.role.slice(1)}</p></div>
                `;
                chatList.appendChild(item);
                
                item.addEventListener('click', () => {
                    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    loadChat(c.email, c.fullName);
                });
            });
            
            // Initial load first chat
            if (contacts[0]) {
                loadChat(contacts[0].email, contacts[0].fullName);
            }
        }
    }
     
    function loadChat(contactEmail, contactName) {
        const headerName = document.querySelector('.chat-header h3');
        const headerAvatar = document.querySelector('.chat-header .avatar-small');
        if (headerName) headerName.textContent = contactName;
        if (headerAvatar) headerAvatar.textContent = contactName.charAt(0);
        
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '';
        
        const allMessages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        const filtered = allMessages.filter(m => 
            (m.sender === currentUser.email && m.receiver === contactEmail) ||
            (m.sender === contactEmail && m.receiver === currentUser.email)
        );
        
        if (filtered.length === 0) {
            messagesContainer.innerHTML = '<p style="text-align:center; padding:24px; color:var(--text-body);">No messages yet. Send a message to start the conversation!</p>';
        } else {
            filtered.forEach(m => {
                const bubble = document.createElement('div');
                bubble.className = `message-bubble ${m.sender === currentUser.email ? 'message-sent' : 'message-received'}`;
                bubble.innerHTML = m.text;
                messagesContainer.appendChild(bubble);
            });
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    const sendBtn = document.querySelector('.chat-input button');
    const chatInput = document.querySelector('.chat-input input');
    if (sendBtn && chatInput) {
        sendBtn.replaceWith(sendBtn.cloneNode(true));
        const cleanSendBtn = document.querySelector('.chat-input button');
        
        const handleSend = () => {
            const chatBoxInput = document.querySelector('.chat-input input');
            const text = chatBoxInput.value.trim();
            if (!text) return;
            
            const activeChat = document.querySelector('.chat-item.active');
            if (!activeChat) return;
            const contactEmail = activeChat.getAttribute('data-email');
            
            const allMessages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
            allMessages.push({
                sender: currentUser.email,
                receiver: contactEmail,
                text: text,
                timestamp: Date.now()
            });
            localStorage.setItem('chat_messages', JSON.stringify(allMessages));
            chatBoxInput.value = '';
            loadChat(contactEmail, activeChat.querySelector('h4').textContent);
        };

        cleanSendBtn.addEventListener('click', handleSend);

        const chatBoxTextInput = document.querySelector('.chat-input input');
        chatBoxTextInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });
    }

    // F. Dropout Alerts Section
    function renderAlerts() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const alertsContainer = document.querySelector('#view-alerts div');
        if (!alertsContainer) return;

        // Filter students at risk (attendance < 75%)
        const atRiskStudents = students.filter(s => parseFloat(s.attendance) < 75);
        
        alertsContainer.innerHTML = '';
        if (atRiskStudents.length === 0) {
            alertsContainer.innerHTML = '<p>No dropout alerts currently. Attendance rates are stable.</p>';
        } else {
            atRiskStudents.forEach(s => {
                const card = document.createElement('div');
                card.className = 'glass-card alert-card risk-high';
                card.innerHTML = `
                    <div class="alert-header flex-between">
                        <div class="flex-start"><span class="material-symbols-rounded risk-icon" style="color:var(--danger);">error</span>
                            <div><h3>${s.name}</h3><p class="subtitle">${s.center}</p></div>
                        </div>
                        <span class="badge badge-danger">High Risk</span>
                    </div>
                    <div class="alert-body">
                        <div class="info-grid">
                            <div><small>Attendance</small><strong>${s.attendance}</strong></div>
                            <div><small>Guardian Contact</small><strong>${s.guardian}</strong></div>
                        </div>
                        <div class="reason-box">
                            <small>Alert Reason:</small>
                            <p>Critical attendance drop. Absent for multiple days.</p>
                        </div>
                    </div>
                    <div class="alert-actions">
                        <button class="btn-action call-btn" data-phone="${s.guardian}"><span class="material-symbols-rounded">call</span> Call Parent</button>
                    </div>
                `;
                alertsContainer.appendChild(card);
            });

            document.querySelectorAll('.call-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    alert(`Calling guardian at ${btn.getAttribute('data-phone')}...`);
                });
            });
        }
        
        // Update top alert counts
        const dropoutCount = document.querySelector('.grid-stats .stat-card:nth-child(4) p.text-danger');
        if (dropoutCount) dropoutCount.textContent = `${atRiskStudents.length} Dropout Risk`;
    }

    // 4. Quick Action Floating Button (FAB) Action Selector
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', () => {
            const action = prompt("Quick Actions:\n1. Schedule Visit\n2. Add Student\n3. Create Resource Request\nEnter option number (1-3):");
            if (action === '1') {
                createNewVisit();
            } else if (action === '2') {
                if (addStudentBtn) addStudentBtn.click();
            } else if (action === '3') {
                const item = prompt("Enter Resource Item (e.g. Std 1 Books):");
                if (!item) return;
                const qty = prompt("Enter Quantity:");
                if (!qty) return;
                const center = prompt("Enter Center Name:");
                if (!center) return;
                const priority = prompt("Enter Priority (High/Medium/Low):") || 'Medium';

                const resources = JSON.parse(localStorage.getItem('resources') || '[]');
                resources.push({
                    item,
                    qty,
                    center,
                    priority,
                    by: currentUser.fullName
                });
                localStorage.setItem('resources', JSON.stringify(resources));
                renderResources();
                alert('Resource request created!');
            }
        });
    }

    // 5. Notification Panel Logic
    const notificationBtn = document.getElementById('notification-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const closePanelBtn = document.getElementById('close-panel');

    function togglePanel() {
        if(notificationPanel) {
            notificationPanel.classList.toggle('open');
            if (notificationPanel.classList.contains('open')) {
                markNotificationsAsRead();
            }
        }
        closeDrawer();
    }

    if(notificationBtn) notificationBtn.addEventListener('click', togglePanel);
    if(closePanelBtn) closePanelBtn.addEventListener('click', () => notificationPanel.classList.remove('open'));

    function renderNotificationsPanel() {
        const panelContent = document.querySelector('#notification-panel .panel-content');
        if (!panelContent) return;
        
        const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Supervisor sees: All, All Supervisors, or specific email target
        const myNotifs = notifs.filter(n => n.target === 'All' || n.target === 'All Supervisors' || n.target === currentUser.email);
        
        const badgeDot = document.querySelector('#notification-btn .badge-dot');
        const unreadCount = myNotifs.filter(n => !n.readBy || !n.readBy.includes(currentUser.email)).length;
        if (badgeDot) {
            badgeDot.style.display = unreadCount > 0 ? 'block' : 'none';
        }
        
        panelContent.innerHTML = '';
        if (myNotifs.length === 0) {
            panelContent.innerHTML = '<p style="text-align:center; padding:20px; font-size:0.85rem; color:var(--text-body);">No notifications</p>';
            return;
        }
        
        myNotifs.forEach(n => {
            const isRead = n.readBy && n.readBy.includes(currentUser.email);
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.style.padding = '10px';
            item.style.marginBottom = '10px';
            item.style.background = isRead ? 'transparent' : 'rgba(37, 99, 235, 0.05)';
            item.style.borderLeft = isRead ? 'none' : '3px solid var(--primary)';
            item.style.borderRadius = '4px';
            item.innerHTML = `
                <div>
                    <strong>${n.senderName} (${n.target})</strong>
                    <p style="margin: 4px 0 0 0; font-size:0.8rem; color:var(--text-dark);">${n.message}</p>
                    <small style="font-size:0.7rem; color:var(--text-body);">${n.date}</small>
                </div>
            `;
            panelContent.appendChild(item);
        });
    }

    function markNotificationsAsRead() {
        const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifs.forEach(n => {
            if (n.target === 'All' || n.target === 'All Supervisors' || n.target === currentUser.email) {
                if (!n.readBy) n.readBy = [];
                if (!n.readBy.includes(currentUser.email)) {
                    n.readBy.push(currentUser.email);
                }
            }
        });
        localStorage.setItem('notifications', JSON.stringify(notifs));
        renderNotificationsPanel();
    }

    // Call dynamic notifications check on load
    renderNotificationsPanel();

    // Initialize all views data
    renderTeachers();
    renderStudents();
    renderVisits();
    renderResources();
    renderMessages();
    renderScheduleAdmin();

    function renderScheduleAdmin() {
        const tbody = document.querySelector('#admin-schedule-table tbody');
        if (!tbody) return;
        
        let schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        if (schedules.length === 0) {
            schedules = [
                { id: 1, day: 'Monday', center: 'Bapunagar Center', activity: 'Teaching Mathematics, Storytelling' },
                { id: 2, day: 'Tuesday', center: 'Naroda Center', activity: 'English Reading, Vocabulary Games' }
            ];
            localStorage.setItem('schedules', JSON.stringify(schedules));
        }

        tbody.innerHTML = '';
        schedules.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.day}</strong></td>
                <td>${s.center}</td>
                <td>${s.activity}</td>
                <td style="text-align:center;">
                    <button class="btn-outline delete-schedule" data-id="${s.id || Math.random()}" style="color:var(--danger); border-color:var(--danger); padding:4px 8px;">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.delete-schedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToRemove = e.target.getAttribute('data-id');
                schedules = schedules.filter(s => String(s.id) !== String(idToRemove));
                localStorage.setItem('schedules', JSON.stringify(schedules));
                window.dispatchEvent(new Event('storage'));
                renderScheduleAdmin();
            });
        });
        
        const addBtn = document.getElementById('add-schedule-btn');
        if (addBtn && !addBtn.dataset.bound) {
            addBtn.dataset.bound = 'true';
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const day = document.getElementById('schedule-day').value;
                const center = document.getElementById('schedule-center').value;
                const activity = document.getElementById('schedule-activity').value;
                
                if(!center || !activity) {
                    alert('Please fill out all fields.');
                    return;
                }
                
                const schedulesArr = JSON.parse(localStorage.getItem('schedules') || '[]');
                schedulesArr.push({ id: Date.now(), day, center, activity });
                localStorage.setItem('schedules', JSON.stringify(schedulesArr));
                window.dispatchEvent(new Event('storage'));
                
                document.getElementById('schedule-center').value = '';
                document.getElementById('schedule-activity').value = '';
                renderScheduleAdmin();
                alert('Schedule added successfully!');
            });
        }
    }

    // Cross-tab Real-time Sync for Chat Messages & Storage
    window.addEventListener('storage', (e) => {
        if (e.key === 'chat_messages') {
            const activeChat = document.querySelector('.chat-item.active');
            if (activeChat) {
                const contactEmail = activeChat.getAttribute('data-email');
                const headerName = activeChat.querySelector('h4').textContent;
                loadChat(contactEmail, headerName);
            }
        } else if (e.key === 'schedules') {
            const activeTarget = document.querySelector('.nav-item.active')?.getAttribute('data-target');
            if (activeTarget === 'schedule') {
                renderScheduleAdmin();
            }
        } else if (e.key === 'students' || e.key === 'assessments') {
            const activeTarget = document.querySelector('.nav-item.active')?.getAttribute('data-target');
            if (activeTarget === 'students') {
                renderStudents();
            }
        }
    });
    renderAlerts();

    // Export Functions
    function exportToExcel(students) {
        try {
            if (!students || students.length === 0) {
                alert('No student records available to export.');
                return;
            }
            let csv = "Student Name,Roll No,Learning Center,Guardian,Attendance,Status\n";
            students.forEach((s, idx) => {
                const roll = s.roll || 'GS-ST-' + (100 + idx);
                csv += `"${s.name}","${roll}","${s.center}","${s.guardian}","${s.attendance || '100%'}","${s.status || 'Active'}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "student_directory.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert('Failed to export to Excel: ' + err.message);
        }
    }

    function exportToPDF(students) {
        try {
            if (!students || students.length === 0) {
                alert('No student records available to export.');
                return;
            }
            const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
            if (jsPDFClass) {
                const doc = new jsPDFClass();
                doc.setFontSize(18);
                doc.text("Gyan Shala NGO - Student Directory", 14, 20);
                doc.setFontSize(10);
                doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
                
                const headers = [["Student Name", "Roll No", "Learning Center", "Guardian", "Attendance", "Status"]];
                const data = students.map((s, idx) => [
                    s.name, 
                    s.roll || 'GS-ST-' + (100 + idx), 
                    s.center, 
                    s.guardian, 
                    s.attendance || '100%', 
                    s.status || 'Active'
                ]);
                
                if (typeof doc.autoTable === 'function') {
                    doc.autoTable({
                        startY: 35,
                        head: headers,
                        body: data,
                        theme: 'grid',
                        headStyles: { fillColor: [37, 99, 235] },
                        styles: { fontSize: 9 }
                    });
                } else {
                    let y = 38;
                    doc.setFontSize(9);
                    doc.text("Student Name | Roll No | Learning Center | Guardian | Attendance | Status", 14, y);
                    doc.line(14, y + 2, 196, y + 2);
                    y += 10;
                    data.forEach(row => {
                        doc.text(row.join(" | "), 14, y);
                        y += 7;
                    });
                }
                doc.save('student_directory.pdf');
            } else {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Export PDF Fallback</title></head><body>');
                    printWindow.document.write('<h2>Student Directory</h2><table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse; width:100%; font-family:sans-serif;">');
                    printWindow.document.write('<tr><th>Name</th><th>Roll</th><th>Center</th><th>Attendance</th><th>Status</th></tr>');
                    students.forEach((s, idx) => {
                        printWindow.document.write(`<tr><td>${s.name}</td><td>${s.roll || 'GS-ST-'+(100+idx)}</td><td>${s.center}</td><td>${s.attendance||'100%'}</td><td>${s.status||'Active'}</td></tr>`);
                    });
                    printWindow.document.write('</table><script>window.onload = function() { window.print(); window.close(); }</script></body></html>');
                    printWindow.document.close();
                } else {
                    alert('Popup blocker prevented printing fallback.');
                }
            }
        } catch (err) {
            alert('Failed to export to PDF: ' + err.message);
        }
    }

    const exportExcelBtn = document.getElementById('export-excel-btn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportToExcel(JSON.parse(localStorage.getItem('students') || '[]'));
        });
    }

    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportToPDF(JSON.parse(localStorage.getItem('students') || '[]'));
        });
    }

});

// Initialize Supervisor Google Map
let supervisorMap = null;
let supervisorMyLocationMarker = null;

window.initSupervisorMap = async function() {
    if (supervisorMap) return; // Already initialized

    const mapContainer = document.getElementById('supervisor-map-container');
    if (!mapContainer) return;

    try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || localStorage.getItem('VITE_GOOGLE_MAPS_API_KEY') || '';
        await loadGoogleMaps(apiKey);

        const ahmedabad = { lat: 23.0225, lng: 72.5714 };
        
        supervisorMap = new google.maps.Map(mapContainer, {
            center: ahmedabad,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            gestureHandling: 'auto'
        });

        // Add Mock Learning Centers
        const centers = [
            { name: 'Sunrise Center', lat: 23.03, lng: 72.58, status: 'Healthy', teacher: 'Ravi Kumar', students: 45, timing: 'Morning', phone: '9876543210' },
            { name: 'Hope Hub', lat: 23.01, lng: 72.56, status: 'Critical', teacher: 'Anita Patel', students: 30, timing: 'Evening', phone: '9876543211' },
            { name: 'Bright Future', lat: 23.04, lng: 72.55, status: 'Needs Visit', teacher: 'Sneha Shah', students: 50, timing: 'Morning', phone: '9876543212' }
        ];

        const bounds = new google.maps.LatLngBounds();

        centers.forEach(center => {
            const position = { lat: center.lat, lng: center.lng };
            bounds.extend(position);

            let iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
            if (center.status === 'Critical') iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            if (center.status === 'Needs Visit') iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

            const marker = new google.maps.Marker({
                position: position,
                map: supervisorMap,
                title: center.name,
                icon: iconUrl
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding:10px; min-width:200px;">
                        <h4 style="margin:0 0 5px 0;">${center.name}</h4>
                        <p style="margin:2px 0;"><strong>Teacher:</strong> ${center.teacher}</p>
                        <p style="margin:2px 0;"><strong>Students:</strong> ${center.students}</p>
                        <p style="margin:2px 0;"><strong>Timing:</strong> ${center.timing}</p>
                        <p style="margin:2px 0;"><strong>Phone:</strong> ${center.phone}</p>
                        <p style="margin:2px 0;"><strong>Status:</strong> ${center.status}</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(supervisorMap, marker);
            });
        });

        supervisorMap.fitBounds(bounds);

        // Setup My Location Button
        const myLocBtn = document.getElementById('btn-supervisor-my-location');
        if (myLocBtn) {
            myLocBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                            supervisorMap.setCenter(latlng);
                            supervisorMap.setZoom(16);
                            
                            if (supervisorMyLocationMarker) supervisorMyLocationMarker.setMap(null);
                            
                            supervisorMyLocationMarker = new google.maps.Marker({
                                position: latlng,
                                map: supervisorMap,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 7,
                                    fillColor: '#3B82F6',
                                    fillOpacity: 1,
                                    strokeColor: '#FFFFFF',
                                    strokeWeight: 2
                                },
                                title: 'My Location'
                            });
                        },
                        (err) => {
                            alert('Could not acquire GPS: ' + err.message);
                        }
                    );
                } else {
                    alert('Geolocation is not supported by your browser.');
                }
            });
        }

        // Listen for generic errors from loader
        window.addEventListener('GoogleMapsError', (e) => {
            showGoogleMapsError('supervisor-map-container', e.detail);
        });

    } catch (err) {
        console.error('Google Maps Load Error in Supervisor:', err);
        showGoogleMapsError('supervisor-map-container', err.message);
    }
};

// Mobile Sidebar Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && mobileSidebarOverlay && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
            mobileSidebarOverlay.classList.add('active');
        });

        mobileSidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            mobileSidebarOverlay.classList.remove('active');
        });

        // Close sidebar when a nav item is clicked on mobile
        const sideNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
        sideNavItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    mobileSidebarOverlay.classList.remove('active');
                }
            });
        });
    }
});

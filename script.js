
        // Global variables and state management
        let currentTheme = localStorage.getItem('theme') || 'light';
        let isAdminLoggedIn = false;
        let editingPostId = null;
        let currentDate = new Date();
        
        // Data storage using localStorage
        const STORAGE_KEYS = {
            POSTS: 'communityPosts',
            CONTACTS: 'communityContacts',
            THEME: 'theme'
        };

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            setTheme(currentTheme);
            loadSampleData();
            renderAllSections();
            initializeCalendar();
            
            // Add event listeners
            document.getElementById('postCategory').addEventListener('change', toggleCategoryFields);
        }

        // Theme Management
        function toggleTheme() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(currentTheme);
        }

        function setTheme(theme) {
            document.body.className = theme === 'dark' ? 'dark-mode' : '';
            document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
        }

        // Admin Panel Management
        function openAdminPanel() {
            document.getElementById('adminOverlay').classList.add('show');
            document.getElementById('adminPanel').classList.add('show');
        }

        function closeAdminPanel() {
            document.getElementById('adminOverlay').classList.remove('show');
            document.getElementById('adminPanel').classList.remove('show');
            resetAdminForm();
        }

        function adminLogin() {
            const password = document.getElementById('adminPassword').value;
            // Simple password check - in production, use proper authentication
            if (password === 'admin123' || password === 'community2024') {
                isAdminLoggedIn = true;
                document.getElementById('loginForm').classList.add('hidden');
                document.getElementById('adminContent').classList.remove('hidden');
                document.getElementById('adminPassword').value = '';
            } else {
                alert('❌ Incorrect password! Try: admin123 or community2024');
            }
        }

        function resetAdminForm() {
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postContact').value = '';
            document.getElementById('postPrice').value = '';
            document.getElementById('eventDate').value = '';
            document.getElementById('eventTime').value = '';
            document.getElementById('postImage').value = '';
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('pinPost').checked = false;
            document.getElementById('urgentPost').checked = false;
            document.getElementById('postStatus').value = 'available';
            cancelEdit();
        }

        // Category-specific field management
        function toggleCategoryFields() {
            const category = document.getElementById('postCategory').value;
            const marketplaceFields = document.getElementById('marketplaceFields');
            const eventFields = document.getElementById('eventFields');
            
            marketplaceFields.style.display = category === 'marketplace' ? 'block' : 'none';
            eventFields.style.display = category === 'events' ? 'block' : 'none';
        }

        // Image preview functionality
        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                preview.style.display = 'none';
            }
        }

        // Data Management Functions
        function loadFromStorage(key, defaultValue = []) {
            try {
                const stored = localStorage.getItem(key);
                return stored ? JSON.parse(stored) : defaultValue;
            } catch (error) {
                console.error('Error loading from storage:', error);
                return defaultValue;
            }
        }

        function saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error('Error saving to storage:', error);
            }
        }

        function loadSampleData() {
            // Load existing data or create sample data
            let posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            let contacts = loadFromStorage(STORAGE_KEYS.CONTACTS, []);

            // Add sample data if empty
            if (posts.length === 0) {
                posts = [
                    {
                        id: Date.now(),
                        category: 'announcements',
                        title: 'Water Supply Maintenance',
                        content: 'Water supply will be interrupted on September 2nd from 9:00 AM to 2:00 PM for maintenance work.',
                        contact: 'Building Management',
                        date: new Date().toISOString(),
                        urgent: true,
                        pinned: false,
                        likes: 5
                    },
                    {
                        id: Date.now() + 1,
                        category: 'events',
                        title: 'Community BBQ Night',
                        content: 'Join us for a fun evening with neighbors! Food, music, and games for the whole family.',
                        contact: 'community@haarlem.nl',
                        date: new Date().toISOString(),
                        eventDate: '2024-09-05',
                        eventTime: '18:00',
                        urgent: false,
                        pinned: true,
                        likes: 12
                    },
                    {
                        id: Date.now() + 2,
                        category: 'marketplace',
                        title: 'City Bike for Sale',
                        content: 'Excellent condition city bike, perfect for commuting. Includes basket and lights.',
                        contact: 'jan.smith@email.com',
                        price: '₹98,000',
                        status: 'available',
                        date: new Date().toISOString(),
                        urgent: false,
                        pinned: false,
                        likes: 3,
                        image: 'bike.jpg'
                    }
                ];
                saveToStorage(STORAGE_KEYS.POSTS, posts);
            }

            if (contacts.length === 0) {
                contacts = [
                    {
                        id: 1,
                        title: '🏢 Building Management',
                        phone: '+31 23 123 4567',
                        email: 'management@haarlemcommunity.nl',
                        emergency: '+31 6 987 6543',
                        hours: 'Mon-Fri 9:00-17:00'
                    },
                    {
                        id: 2,
                        title: '🚨 Emergency Services',
                        phone: '112',
                        email: 'emergency@politie.nl',
                        emergency: '112',
                        hours: '24/7'
                    },
                    {
                        id: 3,
                        title: '🔧 Maintenance',
                        phone: '+31 23 234 5678',
                        email: 'maintenance@haarlem.nl',
                        emergency: '+31 23 234 5679',
                        hours: 'Mon-Sat 8:00-18:00'
                    },
                    {
                        id: 4,
                        title: '👥 Residents Association',
                        phone: '+31 6 123 4567',
                        email: 'residents@haarlemcommunity.nl',
                        emergency: 'N/A',
                        hours: 'Meetings: First Tuesday of each month'
                    }
                ];
                saveToStorage(STORAGE_KEYS.CONTACTS, contacts);
            }
        }

        // Post Management Functions
        function savePost() {
            const category = document.getElementById('postCategory').value;
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();
            const contact = document.getElementById('postContact').value.trim();

            if (!title || !content) {
                alert('❌ Please fill in title and content!');
                return;
            }

            const post = {
                id: Date.now(),
                category: category,
                title: title,
                content: content,
                contact: contact,
                date: new Date().toISOString(),
                urgent: document.getElementById('urgentPost').checked,
                pinned: document.getElementById('pinPost').checked,
                likes: 0
            };

            // Add category-specific fields
            if (category === 'marketplace') {
                post.price = document.getElementById('postPrice').value.trim();
                post.status = document.getElementById('postStatus').value;
            }

            if (category === 'events') {
                post.eventDate = document.getElementById('eventDate').value;
                post.eventTime = document.getElementById('eventTime').value;
            }

            // Handle image upload
            const imageInput = document.getElementById('postImage');
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    post.image = e.target.result;
                    savePostToStorage(post);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                savePostToStorage(post);
            }
        }

        function savePostToStorage(post) {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            posts.push(post);
            saveToStorage(STORAGE_KEYS.POSTS, posts);
            renderAllSections();
            resetAdminForm();
            closeAdminPanel();
            alert('✅ Post added successfully!');
        }

        function updatePost() {
            const postId = parseInt(document.getElementById('editingPostId').value);
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const postIndex = posts.findIndex(p => p.id === postId);

            if (postIndex === -1) return;

            const post = posts[postIndex];
            post.title = document.getElementById('postTitle').value.trim();
            post.content = document.getElementById('postContent').value.trim();
            post.contact = document.getElementById('postContact').value.trim();
            post.urgent = document.getElementById('urgentPost').checked;
            post.pinned = document.getElementById('pinPost').checked;

            if (post.category === 'marketplace') {
                post.price = document.getElementById('postPrice').value.trim();
                post.status = document.getElementById('postStatus').value;
            }

            if (post.category === 'events') {
                post.eventDate = document.getElementById('eventDate').value;
                post.eventTime = document.getElementById('eventTime').value;
            }

            // Handle image update
            const imageInput = document.getElementById('postImage');
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    post.image = e.target.result;
                    updatePostInStorage(posts);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                updatePostInStorage(posts);
            }
        }

        function updatePostInStorage(posts) {
            saveToStorage(STORAGE_KEYS.POSTS, posts);
            renderAllSections();
            resetAdminForm();
            closeAdminPanel();
            alert('✅ Post updated successfully!');
        }

        function editPost(postId) {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const post = posts.find(p => p.id === postId);
            
            if (!post) return;

            // Open admin panel and login if not already
            if (!isAdminLoggedIn) {
                openAdminPanel();
                alert('⚠️ Please login as admin to edit posts');
                return;
            }

            openAdminPanel();

            // Populate form with post data
            document.getElementById('editingPostId').value = post.id;
            document.getElementById('postCategory').value = post.category;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
            document.getElementById('postContact').value = post.contact || '';
            document.getElementById('urgentPost').checked = post.urgent || false;
            document.getElementById('pinPost').checked = post.pinned || false;

            if (post.category === 'marketplace') {
                document.getElementById('postPrice').value = post.price || '';
                document.getElementById('postStatus').value = post.status || 'available';
            }

            if (post.category === 'events') {
                document.getElementById('eventDate').value = post.eventDate || '';
                document.getElementById('eventTime').value = post.eventTime || '';
            }

            if (post.image) {
                document.getElementById('imagePreview').src = post.image;
                document.getElementById('imagePreview').style.display = 'block';
            }

            toggleCategoryFields();

            // Show update/cancel buttons, hide add button
            document.querySelector('.btn-success').classList.add('hidden');
            document.getElementById('updateBtn').classList.remove('hidden');
            document.getElementById('cancelEditBtn').classList.remove('hidden');

            editingPostId = postId;
        }

        function cancelEdit() {
            document.getElementById('editingPostId').value = '';
            document.querySelector('.btn-success').classList.remove('hidden');
            document.getElementById('updateBtn').classList.add('hidden');
            document.getElementById('cancelEditBtn').classList.add('hidden');
            editingPostId = null;
        }

        function deletePost(postId) {
            if (!confirm('🗑️ Are you sure you want to delete this post?')) return;

            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const filteredPosts = posts.filter(p => p.id !== postId);
            saveToStorage(STORAGE_KEYS.POSTS, filteredPosts);
            renderAllSections();
            alert('✅ Post deleted successfully!');
        }

        function toggleLike(postId) {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const post = posts.find(p => p.id === postId);
            
            if (post) {
                // Simple like toggle - in production, track user likes
                post.likes = (post.likes || 0) + 1;
                saveToStorage(STORAGE_KEYS.POSTS, posts);
                renderAllSections();
            }
        }

        function toggleInterested(postId) {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const post = posts.find(p => p.id === postId);
            
            if (post) {
                post.interested = (post.interested || 0) + 1;
                saveToStorage(STORAGE_KEYS.POSTS, posts);
                renderAllSections();
                alert('✅ Interest registered! The organizer will be notified.');
            }
        }

        // Navigation Functions
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected section
            document.getElementById(sectionName).classList.add('active');

            // Add active class to clicked tab
            event.target.classList.add('active');

            // Special handling for calendar
            if (sectionName === 'calendar') {
                renderCalendar();
            }
        }

        // Rendering Functions
        function renderAllSections() {
            renderAnnouncements();
            renderEvents();
            renderMarketplace();
            renderContacts();
            renderCalendar();
        }

        function renderAnnouncements() {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const announcements = posts.filter(p => p.category === 'announcements');
            
            // Sort: pinned first, then by date
            announcements.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.date) - new Date(a.date);
            });

            const container = document.getElementById('announcementsList');
            container.innerHTML = '';

            announcements.forEach(post => {
                const postElement = createPostCard(post);
                container.appendChild(postElement);
            });

            if (announcements.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">📭 No announcements yet. Check back later!</p>';
            }
        }

        function renderEvents() {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const events = posts.filter(p => p.category === 'events');
            
            events.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                if (a.eventDate && b.eventDate) {
                    return new Date(a.eventDate) - new Date(b.eventDate);
                }
                return new Date(b.date) - new Date(a.date);
            });

            const container = document.getElementById('eventsList');
            container.innerHTML = '';

            events.forEach(post => {
                const postElement = createPostCard(post);
                container.appendChild(postElement);
            });

            if (events.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">🎉 No upcoming events. Why not organize one?</p>';
            }
        }

        function renderMarketplace() {
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            let marketplace = posts.filter(p => p.category === 'marketplace');
            
            // Apply filters
            const searchTerm = document.getElementById('marketplaceSearch')?.value.toLowerCase() || '';
            const statusFilter = document.getElementById('marketplaceFilter')?.value || '';

            if (searchTerm) {
                marketplace = marketplace.filter(item =>
                    item.title.toLowerCase().includes(searchTerm) ||
                    item.content.toLowerCase().includes(searchTerm)
                );
            }

            if (statusFilter) {
                marketplace = marketplace.filter(item => item.status === statusFilter);
            }

            marketplace.sort((a, b) => new Date(b.date) - new Date(a.date));

            const container = document.getElementById('marketplaceGrid');
            container.innerHTML = '';

            marketplace.forEach(item => {
                const itemElement = createMarketplaceCard(item);
                container.appendChild(itemElement);
            });

            if (marketplace.length === 0) {
                container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">🛒 No marketplace items found.</div>';
            }
        }

        function renderContacts() {
            const contacts = loadFromStorage(STORAGE_KEYS.CONTACTS, []);
            let filteredContacts = contacts;

            // Apply search filter
            const searchTerm = document.getElementById('contactSearch')?.value.toLowerCase() || '';
            if (searchTerm) {
                filteredContacts = contacts.filter(contact =>
                    contact.title.toLowerCase().includes(searchTerm) ||
                    (contact.phone && contact.phone.toLowerCase().includes(searchTerm)) ||
                    (contact.email && contact.email.toLowerCase().includes(searchTerm))
                );
            }

            const container = document.getElementById('contactGrid');
            container.innerHTML = '';

            filteredContacts.forEach(contact => {
                const contactElement = createContactCard(contact);
                container.appendChild(contactElement);
            });

            if (filteredContacts.length === 0) {
                container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">📞 No contacts found.</div>';
            }
        }

        // Card Creation Functions
        function createPostCard(post) {
            const card = document.createElement('div');
            card.className = `post-card ${post.urgent ? 'urgent' : ''} ${post.pinned ? 'pinned' : ''}`;

            const formatDate = (dateString) => {
                return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            };

            const formatTime = (timeString) => {
                if (!timeString) return '';
                return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            };

            let eventInfo = '';
            if (post.category === 'events' && post.eventDate) {
                eventInfo = `
                    <p><strong>📅 Date:</strong> ${formatDate(post.eventDate)}</p>
                    ${post.eventTime ? `<p><strong>⏰ Time:</strong> ${formatTime(post.eventTime)}</p>` : ''}
                `;
            }

            let imageHtml = '';
            if (post.image) {
                imageHtml = `<img src="${post.image}" alt="${post.title}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">`;
            }

            card.innerHTML = `
                <div class="post-header">
                    <div>
                        <h3 class="post-title">
                            ${post.pinned ? '📌 ' : ''}
                            ${post.urgent ? '🚨 ' : ''}
                            ${post.title}
                        </h3>
                    </div>
                    <div class="post-actions">
                        <button onclick="editPost(${post.id})" class="btn" style="background: var(--info); color: white; padding: 6px 12px; font-size: 0.8rem;">✏️</button>
                        <button onclick="deletePost(${post.id})" class="btn" style="background: var(--danger); color: white; padding: 6px 12px; font-size: 0.8rem;">🗑️</button>
                    </div>
                </div>
                ${imageHtml}
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${post.content}</p>
                ${eventInfo}
                <div class="post-meta">
                    <span>📅 ${formatDate(post.date)}</span>
                    ${post.contact ? `<span>📧 ${post.contact}</span>` : ''}
                    <div style="margin-left: auto; display: flex; gap: 1rem;">
                        ${post.category === 'events' ? 
                            `<button onclick="toggleInterested(${post.id})" class="btn btn-primary" style="padding: 4px 12px; font-size: 0.8rem;">
                                ⭐ Interested ${post.interested || 0 > 0 ? '(' + (post.interested || 0) + ')' : ''}
                            </button>` :
                            `<button onclick="toggleLike(${post.id})" class="btn btn-success" style="padding: 4px 12px; font-size: 0.8rem;">
                                👍 Like ${post.likes || 0 > 0 ? '(' + (post.likes || 0) + ')' : ''}
                            </button>`
                        }
                    </div>
                </div>
            `;

            return card;
        }

        function createMarketplaceCard(item) {
            const card = document.createElement('div');
            card.className = 'marketplace-item';

            const formatDate = (dateString) => {
                return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            };

            let imageHtml = '';
            if (item.image) {
                imageHtml = `<img src="${item.image}" alt="${item.title}" class="item-image">`;
            } else {
                imageHtml = `<div class="item-image"><img src="bike.jpg" alt="No image available" class="item-image"></div>`;
            }

            card.innerHTML = `
                ${imageHtml}
                <div class="item-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">${item.title}</h3>
                            ${item.price ? `<div class="item-price">${item.price}</div>` : ''}
                        </div>
                        <span class="item-status status-${item.status || 'available'}">${(item.status || 'available').toUpperCase()}</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">${item.content}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--text-meta);">
                        <span>📅 ${formatDate(item.date)}</span>
                        ${item.contact ? `<span>📧 ${item.contact}</span>` : ''}
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: space-between;">
                        <button onclick="toggleLike(${item.id})" class="btn btn-success" style="padding: 8px 16px; font-size: 0.9rem;">
                            👍 Like ${item.likes || 0 > 0 ? '(' + (item.likes || 0) + ')' : ''}
                        </button>
                        <div>
                            <button onclick="editPost(${item.id})" class="btn" style="background: var(--info); color: white; padding: 8px 12px; font-size: 0.8rem;">✏️</button>
                            <button onclick="deletePost(${item.id})" class="btn" style="background: var(--danger); color: white; padding: 8px 12px; font-size: 0.8rem;">🗑️</button>
                        </div>
                    </div>
                </div>
            `;

            return card;
        }

        function createContactCard(contact) {
            const card = document.createElement('div');
            card.className = 'contact-card';

            card.innerHTML = `
                <h4 class="contact-title">${contact.title}</h4>
                ${contact.phone ? `<p><strong>📞 Phone:</strong> <a href="tel:${contact.phone}" style="color: var(--accent-primary); text-decoration: none;">${contact.phone}</a></p>` : ''}
                ${contact.email ? `<p><strong>📧 Email:</strong> <a href="mailto:${contact.email}" style="color: var(--accent-primary); text-decoration: none;">${contact.email}</a></p>` : ''}
                ${contact.emergency ? `<p><strong>🚨 Emergency:</strong> <a href="tel:${contact.emergency}" style="color: var(--danger); text-decoration: none;">${contact.emergency}</a></p>` : ''}
                ${contact.hours ? `<p><strong>⏰ Hours:</strong> ${contact.hours}</p>` : ''}
            `;

            return card;
        }

        // Filter Functions
        function filterMarketplace() {
            renderMarketplace();
        }

        function filterContacts() {
            renderContacts();
        }

        // Calendar Functions
        function initializeCalendar() {
            renderCalendar();
        }

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            document.getElementById('calendarTitle').textContent = 
                new Date(year, month).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                });

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            const calendarGrid = document.getElementById('calendarGrid');
            calendarGrid.innerHTML = '';

            // Add day headers
            const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayHeaders.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day';
                dayHeader.style.fontWeight = 'bold';
                dayHeader.style.textAlign = 'center';
                dayHeader.style.background = 'var(--accent-primary)';
                dayHeader.style.color = 'white';
                dayHeader.textContent = day;
                calendarGrid.appendChild(dayHeader);
            });

            // Add empty cells for days before month starts
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day';
                calendarGrid.appendChild(emptyDay);
            }

            // Add days of the month
            const posts = loadFromStorage(STORAGE_KEYS.POSTS, []);
            const events = posts.filter(p => p.category === 'events' && p.eventDate);

            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                
                const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEvent = events.some(event => event.eventDate === currentDateStr);
                
                if (hasEvent) {
                    dayElement.classList.add('has-event');
                    const eventDot = document.createElement('div');
                    eventDot.className = 'event-dot';
                    dayElement.appendChild(eventDot);
                }
                
                dayElement.innerHTML = `<strong>${day}</strong>` + dayElement.innerHTML;
                calendarGrid.appendChild(dayElement);
            }
        }

        function previousMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }
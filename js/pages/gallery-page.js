import { gallery } from '../data/gallery.js';
import { renderGalleryItem } from '../components/Cards.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gallery-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const uploadForm = document.getElementById('upload-media-form');
    let currentFilter = 'all';

    function renderGallery(filter = 'all') {
        if (!container) return;
        
        const localGallery = JSON.parse(localStorage.getItem('user_gallery') || '[]');
        const allGallery = [...localGallery, ...gallery]; // User uploads first

        const filtered = filter === 'all' 
            ? allGallery 
            : allGallery.filter(item => item.category === filter);
            
        container.innerHTML = filtered.map(g => renderGalleryItem(g)).join('');
    }

    // Initial render
    renderGallery(currentFilter);

    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('media-url').value;
            const type = document.getElementById('media-type').value;
            const category = document.getElementById('media-category').value;

            const newMedia = {
                id: 'media-' + Date.now(),
                url: url,
                type: type,
                category: category
            };

            const localGallery = JSON.parse(localStorage.getItem('user_gallery') || '[]');
            localGallery.unshift(newMedia); // Add to top
            localStorage.setItem('user_gallery', JSON.stringify(localGallery));

            renderGallery(currentFilter);
            uploadForm.reset();
            alert('Media added to gallery successfully!');
        });
    }

    // Filter logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline');
            });
            e.target.classList.remove('btn-outline');
            e.target.classList.add('btn-primary', 'active');

            // Render filtered
            currentFilter = e.target.getAttribute('data-filter');
            renderGallery(currentFilter);
        });
    });
});

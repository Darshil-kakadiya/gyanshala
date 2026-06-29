import { gallery } from '../data/gallery.js';
import { renderGalleryItem } from '../components/Cards.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gallery-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderGallery(filter = 'all') {
        if (!container) return;
        
        const filtered = filter === 'all' 
            ? gallery 
            : gallery.filter(item => item.category === filter);
            
        container.innerHTML = filtered.map(g => renderGalleryItem(g)).join('');
    }

    // Initial render
    renderGallery();

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
            const filter = e.target.getAttribute('data-filter');
            renderGallery(filter);
        });
    });
});

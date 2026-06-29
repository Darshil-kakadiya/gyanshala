import { testimonials } from '../data/testimonials.js';
import { renderTestimonialCard } from '../components/Cards.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('testimonials-container');
    const form = document.getElementById('share-story-form');

    function renderAll() {
        if (!container) return;
        const localStories = JSON.parse(localStorage.getItem('user_testimonials') || '[]');
        const allStories = [...testimonials, ...localStories];
        container.innerHTML = allStories.map(t => renderTestimonialCard(t)).join('');
    }

    renderAll();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('story-name').value;
            const role = document.getElementById('story-role').value;
            const image = document.getElementById('story-image').value || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
            const text = document.getElementById('story-text').value;

            const newStory = {
                name,
                role,
                text,
                image
            };

            const localStories = JSON.parse(localStorage.getItem('user_testimonials') || '[]');
            localStories.unshift(newStory); // Add to top
            localStorage.setItem('user_testimonials', JSON.stringify(localStories));

            renderAll();
            form.reset();
            alert('Thank you for sharing your experience!');
        });
    }
});

import { testimonials } from '../data/testimonials.js';
import { renderTestimonialCard } from '../components/Cards.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('testimonials-container');
    if (container) {
        container.innerHTML = testimonials.map(t => renderTestimonialCard(t)).join('');
    }
});

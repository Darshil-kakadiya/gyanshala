import { faqs } from '../data/faqs.js';
import { renderFaqItem } from '../components/Cards.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('faq-container');
    if (container) {
        container.innerHTML = faqs.map(f => renderFaqItem(f)).join('');
    }
});

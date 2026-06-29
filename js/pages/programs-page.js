import { programs } from '../data/programs.js';
import { renderProgramCard } from '../components/Cards.js';

window.toggleDetails = function(id) {
    const detailsDiv = document.getElementById(`details-${id}`);
    const btn = detailsDiv.nextElementSibling;
    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';
        btn.textContent = 'Show Less ↑';
    } else {
        detailsDiv.style.display = 'none';
        btn.textContent = 'Learn More ↓';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('programs-container');
    if (container) {
        container.innerHTML = programs.map(p => renderProgramCard(p)).join('');
    }
});

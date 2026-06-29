import { programs } from '../data/programs.js';
import { renderProgramCard } from '../components/Cards.js';

window.toggleDetails = function(id) {
    const container = document.getElementById('programs-container');
    const targetCard = document.getElementById(`card-${id}`);
    const detailsDiv = document.getElementById(`details-${id}`);
    const btn = detailsDiv.nextElementSibling;
    
    // Check if we are currently expanding or shrinking
    const isExpanding = !targetCard.classList.contains('expanded');
    
    if (isExpanding) {
        // Expand this card
        container.classList.add('expanded-mode');
        
        // Remove expanded class from all cards and reset their buttons
        document.querySelectorAll('.program-glass-card').forEach(card => {
            card.classList.remove('expanded');
            const otherBtn = card.querySelector('.program-details').nextElementSibling;
            otherBtn.textContent = 'Learn More ↓';
        });
        
        targetCard.classList.add('expanded');
        btn.textContent = 'Show Less ↑';
    } else {
        // Shrink back to normal
        container.classList.remove('expanded-mode');
        targetCard.classList.remove('expanded');
        btn.textContent = 'Learn More ↓';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('programs-container');
    if (container) {
        container.innerHTML = programs.map(p => renderProgramCard(p)).join('');
    }
});

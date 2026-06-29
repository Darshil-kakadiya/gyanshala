export function renderProgramCard(program) {
  return `
    <div class="program-glass-card ${program.colorClass}" id="card-${program.id}">
        <div class="program-icon">${program.icon}</div>
        <h3>${program.title}</h3>
        <p><strong>Age:</strong> ${program.ageGroup} | <strong>Duration:</strong> ${program.duration}</p>
        <p>${program.description}</p>
        <p><em>Benefits:</em> ${program.benefits.join(', ')}</p>
        
        <div class="program-details" id="details-${program.id}" style="display: none; margin-top: 15px; text-align: left; padding: 15px; background: rgba(255,255,255,0.5); border-radius: 8px; font-size: 0.9em; line-height: 1.5;">
            ${program.details}
        </div>
        
        <button onclick="toggleDetails('${program.id}')" class="btn-text" style="background: none; border: none; cursor: pointer; font-weight: bold; margin-top: 10px; width: 100%;">Learn More ↓</button>
    </div>
  `;
}

export function renderCenterCard(center) {
  return `
    <div class="center-card">
        <img src="${center.image}" alt="${center.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px 8px 0 0; margin-bottom: 15px;" loading="lazy">
        <div class="center-status ${center.status === 'Active' ? 'active' : ''}">${center.status}</div>
        <div style="padding: 0 15px 15px;">
            <h3>${center.name}</h3>
            <p class="center-area">📍 ${center.address}</p>
            <div class="center-stats" style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 15px;">
                <span>👩‍🏫 Teacher: ${center.teacher}</span>
                <span>🎓 Students: ${center.students}</span>
                <span>⏰ Timing: ${center.timing}</span>
                <span>📞 ${center.phone}</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="#" class="btn-primary" style="flex: 1; text-align: center;">View Details</a>
                <a href="https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}" target="_blank" class="btn-outline" style="flex: 1; text-align: center;">View on Map</a>
            </div>
        </div>
    </div>
  `;
}

export function renderTestimonialCard(testimonial) {
  return `
    <div class="story-card">
        <div class="story-image">
            <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
        </div>
        <div class="story-content">
            <p class="quote">${testimonial.quote}</p>
            <h4>${testimonial.name}</h4>
            <span class="story-role">${testimonial.role}</span>
        </div>
    </div>
  `;
}

export function renderGalleryItem(item) {
  return `
    <div class="masonry-item" data-category="${item.category}">
        <img src="${item.url}" alt="${item.alt}" loading="lazy">
    </div>
  `;
}

export function renderFaqItem(faq) {
  return `
    <div class="faq-item" style="border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; margin-bottom: 15px; padding: 15px; background: white;">
        <h4 style="margin: 0 0 10px 0; color: #1a237e;">${faq.question}</h4>
        <p style="margin: 0; color: #555;">${faq.answer}</p>
    </div>
  `;
}

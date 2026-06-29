let map;

function initContactMap() {
    const headOfficeLocation = { lat: 23.0225, lng: 72.5714 }; 
    
    map = new google.maps.Map(document.getElementById("map-container"), {
        zoom: 14,
        center: headOfficeLocation,
    });

    const marker = new google.maps.Marker({
        position: headOfficeLocation,
        map: map,
        title: "Gyan Shala Head Office"
    });
}

window.initContactMap = initContactMap;

document.addEventListener('DOMContentLoaded', () => {
    // Form Validation
    const form = document.getElementById('contact-form');
    const msgDiv = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !message) {
                msgDiv.textContent = 'Please fill out all fields.';
                msgDiv.style.color = 'red';
                return;
            }

            // Simulate success
            msgDiv.textContent = 'Message sent successfully! We will get back to you shortly.';
            msgDiv.style.color = 'green';
            form.reset();
        });
    }

    // Load Google Maps Script dynamically
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
        import('../maps/google-maps-loader.js').then(module => {
            module.loadGoogleMaps(apiKey).then(() => {
                initContactMap();
            }).catch(err => {
                module.showGoogleMapsError('map-container', err.message);
            });
        });
    } else {
        console.error("Google Maps API Key is missing");
        document.getElementById("map-container").innerHTML = "<p style='text-align:center; padding: 20px;'>Google Maps API key is missing.</p>";
    }
});

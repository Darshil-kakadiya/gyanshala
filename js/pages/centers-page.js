import { centers } from '../data/centers.js';
import { renderCenterCard } from '../components/Cards.js';

let map;

function initMap() {
    const defaultCenter = { lat: 23.0225, lng: 72.5714 }; // Default to Ahmedabad area based on data
    
    map = new google.maps.Map(document.getElementById("map-container"), {
        zoom: 12,
        center: defaultCenter,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#747474"}]
            }
        ]
    });

    // Add markers for all active centers
    centers.forEach(center => {
        if (center.lat && center.lng) {
            const marker = new google.maps.Marker({
                position: { lat: center.lat, lng: center.lng },
                map: map,
                title: center.name,
                animation: google.maps.Animation.DROP
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px; max-width: 250px;">
                        <h4 style="margin: 0 0 5px 0; color: #1a237e;">${center.name}</h4>
                        <p style="margin: 0 0 5px 0; font-size: 13px;">${center.address}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Students: ${center.students} | Teacher: ${center.teacher}</p>
                    </div>
                `
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        }
    });
}

// Export it to window so Google Maps callback can find it
window.initMap = initMap;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('centers-container');
    if (container) {
        container.innerHTML = centers.map(c => renderCenterCard(c)).join('');
    }

    // Load Google Maps Script dynamically using API key from env
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
        import('../maps/google-maps-loader.js').then(module => {
            module.loadGoogleMaps(apiKey).then(() => {
                initMap();
            }).catch(err => {
                module.showGoogleMapsError('map-container', err.message);
            });
        });
    } else {
        console.error("Google Maps API Key is missing in .env file");
        document.getElementById("map-container").innerHTML = "<p style='text-align:center; padding: 50px;'>Google Maps API key is missing.</p>";
    }
});

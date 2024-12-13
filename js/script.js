// Inicializa el mapa centrado en Ciudad de Panamá con un nivel de zoom de 12
const map = L.map('map').setView([8.725465, -79.531646], 9);

// Añade una capa de mapa base utilizando OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, // Nivel máximo de zoom permitido
    attribution: '© OpenStreetMap contributors' // Atribución requerida por OpenStreetMap
}).addTo(map);

// Crea un grupo de clústeres para gestionar múltiples marcadores
const markers = L.markerClusterGroup();

// Define un icono personalizado discreto
const simpleIcon = L.divIcon({
    className: 'simple-marker', // Clase CSS para personalizar
    iconSize: [10, 10], // Tamaño del punto
    html: '<div style="width: 8px; height: 8px; background-color: #007BFF; border-radius: 50%;"></div>'
});

// Función para cargar datos GeoJSON
async function loadGeoJSON() {
    try {
        const response = await fetch('../json/dump.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Añade los datos GeoJSON al grupo de clústeres
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: simpleIcon }); // Usa el icono personalizado
            },
            onEachFeature: function (feature, layer) {
                // Mejor estructura para los popups
                if (feature.properties && feature.geometry) {
                    const { popup } = feature.properties;
                    const [lng, lat] = feature.geometry.coordinates;
                    const content = `<div>
                                <h3>${popup || 'Sin título'}</h3>
                                <p>Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                            </div>`;
                    layer.bindPopup(content);
                }
            }
        }).eachLayer(function (layer) {
            markers.addLayer(layer);
        });

        // Añade el grupo de clústeres al mapa
        map.addLayer(markers);
    } catch (error) {
        console.error('Error al cargar el archivo GeoJSON:', error);
    }
}

// Llama a la función para cargar el GeoJSON
loadGeoJSON();
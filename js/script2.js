// Inicializa el mapa centrado en Ciudad de Panamá con un nivel de zoom de 9
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

// Función para cargar datos JSON
async function loadJSON() {
    try {
        const response = await fetch('../json/dump2.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Procesa cada entrada en el JSON
        data.forEach(item => {
            console.log(item);
            // Validar si las coordenadas existen
            if (item.lat && item.lng) {
                const marker = L.marker([item.lat, item.lng], { icon: simpleIcon });

                // Construye el contenido del popup
                const content = `
                    <div>
                        <h3>${item.nombre || 'Sin título'}</h3>
                        <p>Propietario: ${item.propietario || 'Desconocido'}</p>
                        <p>Provincia: ${item.provincia || 'Desconocida'}</p>
                        <p>Distrito: ${item.distrito || 'Desconocido'}</p>
                        <p>Coordenadas: ${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}</p>
                    </div>
                `;
                marker.bindPopup(content);

                // Añade el marcador al grupo de clústeres
                markers.addLayer(marker);
            }
        });

        // Añade el grupo de clústeres al mapa
        map.addLayer(markers);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

// Llama a la función para cargar el JSON
loadJSON();

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

// Función para cargar y mostrar los datos del JSON
async function loadData() {
    try {
        const response = await fetch('../json/AllFarmsMap.json'); // Ruta del archivo JSON
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();

        // Accede al array "QRY_ResumenEstabMapFarms"
        const farms = jsonData.QRY_ResumenEstabMapFarms;

        // Itera sobre cada entrada en el array
        farms.forEach(farm => {
            const {
                LatFarm,
                LongFarm,
                Nombre,
                Responsable,
                Region,
                CodProvNomProv,
                Agencia,
                CodDistNomDist,
                CodCorrNomCorr,
                CodLPobNomLPob,
                CodigoDINASA,
                RUATZ,
                CodigoSIGAP,
                ZonaZoo,
                EstabActivoInactivo
            } = farm;

            // Crea un marcador para cada entrada
            const marker = L.marker([LatFarm, LongFarm], {icon: simpleIcon});

            // Añade un popup con la información relevante
            const popupContent = `
                    <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                        <h3 style="margin-top: 0; font-size: 18px; color: #007BFF; text-align: center;">${Nombre}</h3>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Responsable:</strong> ${Responsable}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Región:</strong> ${Region}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Agencia:</strong> ${Agencia}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Provincia:</strong> ${CodProvNomProv}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Distrito:</strong> ${CodDistNomDist}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Corregimiento:</strong> ${CodCorrNomCorr}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Localidad:</strong> ${CodLPobNomLPob}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Coordenadas:</strong> ${LatFarm.toFixed(4)}, ${LongFarm.toFixed(4)}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Código DINASA:</strong> ${CodigoDINASA}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>RUATZ:</strong> ${RUATZ || 'No disponible'}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Código SIGAP:</strong> ${CodigoSIGAP || 'No disponible'}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: #555;">
                            <strong>Zona:</strong> ${ZonaZoo}
                        </p>
                        <p style="margin: 5px 0; font-size: 14px; color: ${EstabActivoInactivo ? '#28a745' : '#dc3545'};">
                            <strong>Estado:</strong> ${EstabActivoInactivo ? 'Activo' : 'Inactivo'}
                        </p>
                    </div>
                `;
            marker.bindPopup(popupContent);

            // Añade el marcador al grupo de clústeres
            markers.addLayer(marker);
        });

        // Añade el grupo de clústeres al mapa
        map.addLayer(markers);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

// Llama a la función para cargar los datos
loadData();

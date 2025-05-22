// Reemplaza con tu clave de API de Google Maps
const GOOGLE_MAPS_API_KEY = "AIzaSyAAgbBhRLl_H1acPv633ypo9SAKYh7lMuk";

document.getElementById("calcular").addEventListener("click", function () {
    const salida = document.getElementById("salida").value.trim();
    const llegada = document.getElementById("llegada").value.trim();
    const hora = document.getElementById("hora").value;
    const personas = parseInt(document.getElementById("personas").value);

    if (!salida || !llegada || !hora || isNaN(personas)) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Llama a la API de Google Maps
    calcularDistancia(salida, llegada, personas);
});

function calcularDistanciaConMaps() {
    const salida = document.getElementById("salida").value.trim();
    const llegada = document.getElementById("llegada").value.trim();
    const personas = parseInt(document.getElementById("personas").value);

    if (!salida || !llegada || isNaN(personas)) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [salida],
            destinations: [llegada],
            travelMode: google.maps.TravelMode.DRIVING,
        },
        function (response, status) {
            if (status === "OK") {
                const element = response.rows[0].elements[0];
                if (element.status === "OK") {
                    const distancia = element.distance.value / 1000; // Convertir metros a km
                    mostrarResultado(distancia, personas);
                } else {
                    alert("No se pudo calcular la distancia. Verifique las ubicaciones.");
                }
            } else {
                alert("Error al calcular la distancia: " + status);
            }
        }
    );
}

function mostrarResultado(distancia, personas) {
    const precioPorKm = 1000; // Precio por km
    const precioPorPersona = 20; // Extra por persona adicional
    let precio = distancia * precioPorKm;
    if (personas > 1) {
        precio += (personas - 1) * precioPorPersona;
    }

    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
        <p><strong>Detalles de tu cotización:</strong></p>
        <p>Distancia calculada: ${distancia.toFixed(2)} km</p>
        <p><strong>Precio estimado: $${precio.toFixed(2)}</strong></p>
    `;
}

document.getElementById("calcular").addEventListener("click", calcularDistanciaConMaps);

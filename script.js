const GOOGLE_MAPS_API_KEY = "AIzaSyBH7UdQD2VnEhABM_gAjphjiOlW_TTn55c";

document.getElementById("calcular").addEventListener("click", function () {
    const llegada = document.getElementById("llegada").value.trim();
    const hora = document.getElementById("hora").value;
    const personas = parseInt(document.getElementById("personas").value);
    buttonContinuar.style.display = 'flex'

    if (!salida || !llegada || !hora || isNaN(personas)) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Llama a la API de Google Maps
    calcularDistancia(salida, llegada, personas);
});

function calcularDistanciaConMaps() {
    const salida = "barrio amuppol 3 mza j casa 7";
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
    const base50 = document.getElementById("on").checked;
    const base80 = document.getElementById("off").checked;

    if (!base50 && !base80) {
        alert("Por favor, seleccione una base (50.000 o 80.000).");
        return;
    }

    if (base50 && base80) {
        alert("Por favor, seleccione solo una base.");
        return;
    }

    let precioBase = base50 ? 50000 : 80000;

    // Suma $1.000 cada 5 km
    const extraPorKm = Math.floor(distancia / 5) * 1000;

    // Suma $5.000 cada 50 personas
    const extraPorPersona = Math.floor(personas / 50) * 5000;

    let precio = precioBase + extraPorKm + extraPorPersona;

    const resultado = document.getElementById("resultadoCotizador");
    resultado.innerHTML = `
        <p><strong>Detalles de tu cotización:</strong></p>
        <p>Distancia calculada: ${distancia.toFixed(2)} km</p>
        <p>Personas: ${personas}</p>
        <p><strong>Precio estimado: $${precio.toLocaleString()}</strong></p>
    `;
    
    // Guardamos en variable global
    total = precio;
}

document.getElementById("calcular").addEventListener("click", calcularDistanciaConMaps);



let phoneNumber = +5492634407613;


document.getElementById('buttonContinuar').addEventListener("click", function () {

    const endLocation = document.getElementById('llegada').value;
    const cantidadPersonas = document.getElementById('personas').value;
    const hora = document.getElementById('hora').value;

    const base50 = document.getElementById("on").checked;
    const base80 = document.getElementById("off").checked;

    let planSeleccionado = "No especificado";
    if (base50) planSeleccionado = "Básico ($50.000)";
    if (base80) planSeleccionado = "Premium ($80.000)";

    let message =
        `Cotización de mi evento:\n\n` +
        `- Lugar: ${endLocation}\n` +
        `- Cantidad de personas: ${cantidadPersonas}\n` +
        `- Hora del evento: ${hora}\n` +
        `- Plan seleccionado: ${planSeleccionado}\n` +
        `- Total: $${total.toLocaleString()}`;

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
});

let mapa;
let geocoder;
let marker;
let llegadaSeleccionada = "";

function initMap() {
    const centroInicial = { lat: -32.8908, lng: -68.8272 }; // Mendoza como centro

    mapa = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 13,
        center: centroInicial,
        gestureHandling: "greedy", // permite mover y hacer clic libremente
    });

    geocoder = new google.maps.Geocoder();

    mapa.addListener("click", function (e) {
        const latlng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        if (marker) marker.setMap(null); // borra marcador anterior

        marker = new google.maps.Marker({
            position: latlng,
            map: mapa,
        });

        geocoder.geocode({ location: latlng }, function (results, status) {
            if (status === "OK" && results[0]) {
                llegadaSeleccionada = results[0].formatted_address;

                // mostrar la dirección seleccionada
                document.getElementById("direccionSeleccionada").innerText =
                    "Dirección seleccionada: " + llegadaSeleccionada;

                // autocompletar el input con lo elegido
                document.getElementById("llegada").value = llegadaSeleccionada;
            } else {
                alert("No se pudo obtener la dirección desde el mapa.");
            }
        });
    });
}
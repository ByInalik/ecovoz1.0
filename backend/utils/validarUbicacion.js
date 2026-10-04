// backend/utils/validarUbicacion.js

/**
 * Coordenadas oficiales del municipio de Garzón, Huila (según SRS)
 * Centro: 2.1969° N, 75.6269° W
 * Radio de validación: 5 km (según SRS RF-025)
 */
const CENTRO_GARZON = {
  lat: 2.1969,
  lng: -75.6269
};

const RADIO_MAXIMO_KM = 5;

/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine
 * @returns distancia en kilómetros
 */
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Valida que las coordenadas estén dentro del área de Garzón
 * @returns { valido: boolean, distancia: number|null, mensaje: string }
 */
function validarUbicacion(latitud, longitud) {
  // Validar que sean números
  if (typeof latitud !== 'number' || typeof longitud !== 'number') {
    return {
      valido: false,
      distancia: null,
      mensaje: 'Latitud y longitud deben ser números'
    };
  }

  // Rango válido de coordenadas globales
  if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
    return {
      valido: false,
      distancia: null,
      mensaje: 'Coordenadas fuera del rango válido global'
    };
  }

  const distancia = calcularDistancia(
    latitud, longitud,
    CENTRO_GARZON.lat, CENTRO_GARZON.lng
  );

  if (distancia > RADIO_MAXIMO_KM) {
    return {
      valido: false,
      distancia: parseFloat(distancia.toFixed(2)),
      mensaje: `Esta ubicación está a ${distancia.toFixed(2)} km del centro de Garzón. Máximo permitido: ${RADIO_MAXIMO_KM} km.`
    };
  }

  return {
    valido: true,
    distancia: parseFloat(distancia.toFixed(2)),
    mensaje: 'Ubicación válida dentro de Garzón'
  };
}

module.exports = {
  validarUbicacion,
  calcularDistancia,
  CENTRO_GARZON,
  RADIO_MAXIMO_KM
};
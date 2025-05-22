// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Capacitor } from '@capacitor/core';

let API_URL = 'http://107.22.235.180:8000'; // Valor por defecto para navegador

// Detectar si estamos en plataforma nativa (emulador/dispositivo Android)
// if (Capacitor.isNativePlatform()) {
//   API_URL = 'http://107.22.235.180:8000'; // Cambia por la IP de tu PC si usas móvil real
// }

export const environment = {
  production: false,
  API_URL: API_URL,

  LOGO: "https://res.cloudinary.com/dddghjiwv/image/upload/v1744883802/x5ut8o8tn79nrxo5zsky.jpg",
 
  cloudinary: {
    cloudName: 'dddghjiwv',  
    uploadPreset: 'Stockify'
  },

  EMAIL_PATTERN: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
};

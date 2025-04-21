// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://127.0.0.1:8000',
  
  LOGO: "https://res.cloudinary.com/dddghjiwv/image/upload/v1744883802/x5ut8o8tn79nrxo5zsky.jpg",
 
  cloudinary: {
    cloudName: 'dddghjiwv',  
    uploadPreset: 'Stockify'
  },

  EMAIL_PATTERN: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',

};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

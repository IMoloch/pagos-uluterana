// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBEXrhAY680bLxzQ_CUf9tbzkrt6AMLUe8",
    authDomain: "pagos-uluterana.firebaseapp.com",
    projectId: "pagos-uluterana",
    storageBucket: "pagos-uluterana.appspot.com",
    messagingSenderId: "321278237991",
    appId: "1:321278237991:web:d824da2a225b7b7ca71d02"
  },
  paypal: {
    clientId: "AU0I-0whpmYkcAgHxj6nIXNxIVfr-eaZD0r2Gx3qS_warGPCn5Oesv5kTmQvkCNXKRGOpvERkXXbO0AD",
    secretKey: "EKS567b-917OMWU3T_z3zpYqBGcMvrydaby35fR6nMprsrAh5LBvMIQtUAdkDURBIDiT3RNxjkoC8R2n"
  },
  emailJs: {
    options: {
      publicKey: '08eTfVhxv8lREXjP8',
    },
    serviceID: 'service_rfkp2m5',
    templateID: 'template_dzk5ml5',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
  	apiKey: "AIzaSyB0-aNmXEFwZdPRkveQbwPZsv6KjD74rX4",
    authDomain: "pf-tools.firebaseapp.com",
    databaseURL: "https://pf-tools.firebaseio.com",
    projectId: "pf-tools",
    storageBucket: "pf-tools.appspot.com",
    messagingSenderId: "95343487279"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

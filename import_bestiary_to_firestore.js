var admin = require("./node_modules/firebase-admin");

var serviceAccount = require("../firebase_service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pf-tools.firebaseio.com"
});

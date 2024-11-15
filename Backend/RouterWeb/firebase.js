const admin = require("firebase-admin");
serviceAccount = require("../config/firebase-adminsdk.json");

// Initialize firebase admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://hotel-5d504.appspot.com",
// });
const FirebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://hotel-5d504.appspot.com",
});
// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
  bucket,
  FirebaseApp,
};

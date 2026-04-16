const admin = require("firebase-admin");

let serviceAccount;

try {
  serviceAccount = require("../Rootfiles/serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase initialized successfully");
} catch (err) {
  console.warn("Firebase service account key not found. Firebase auth will be disabled.");
  console.warn("To enable Firebase: Ensure serviceAccountKey.json is in the Rootfiles folder.");
}

module.exports = admin;
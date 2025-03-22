// server/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');// Add the correct path to your Firebase service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:"turf-management-system-23732.appspot.com" , 
});

// Export Firebase services you need (like Storage)
const bucket = admin.storage().bucket();

module.exports = { bucket };

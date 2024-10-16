import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJYq8Q5X_J2zulLgTqrFGvPgwBOFGClJI",
  authDomain: "turf-management-system-23732.firebaseapp.com",
  projectId: "turf-management-system-23732",
  storageBucket: "turf-management-system-23732.appspot.com",
  messagingSenderId: "479674955224",
  appId: "1:479674955224:web:83090c51a3a711523b2ead",
  measurementId: "G-MVCZB8WX9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Export Firebase storage and functions
export { storage, ref, uploadBytes, getDownloadURL };

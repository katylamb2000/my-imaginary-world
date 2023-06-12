// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4PGlYGY0i4DMuMnpWTSK3HPfs_w5xWT8",
  authDomain: "my-imaginary-world-b5705.firebaseapp.com",
  projectId: "my-imaginary-world-b5705",
  storageBucket: "my-imaginary-world-b5705.appspot.com",
  messagingSenderId: "687811263391",
  appId: "1:687811263391:web:af6b687a5c4ad94d909baa",
  measurementId: "G-NTPF86KWFH"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage();
const storageRef = ref(storage, 'some-child');

console.log("STORAGE --> ", storage, storageRef)
export { db, storage, ref, uploadBytes, getDownloadURL  }
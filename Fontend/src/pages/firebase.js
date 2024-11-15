import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: "AIzaSyA823Kr893jhFGPAowlLSBlkI-X3LPcmC8",
  authDomain: "hotel-5d504.firebaseapp.com",
  databaseURL: "https://hotel-5d504.firebaseio.com",
  storageBucket: "hotel-5d504.appspot.com",
};
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);

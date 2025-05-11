import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// File upload function
const uploadFile = async (file, folderName = "uploads") => {
  try {
    // Only sign in anonymously if not already signed in
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    const storageRef = ref(storage, `${folderName}/${file.name}`);  // User-specific folder in Firebase Storage
    await uploadBytes(storageRef, file);  // Upload file
    console.log('File uploaded successfully');

    // Get the file URL
    const fileURL = await getDownloadURL(storageRef);
    console.log('File URL:', fileURL);
    return fileURL;
  } catch (error) {
    alert('Ngarkimi i materialit dështoi. Ju lutemi provoni përsëri.\n' + (error && error.message ? error.message : error));
    console.error("Error uploading file:", error);
    throw error; // Rethrow so the caller can handle it
  }
};

export { uploadFile };  // Export uploadFile function
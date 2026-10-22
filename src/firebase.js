import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const ENV_NAMES = {
  apiKey: "VITE_API_KEY",
  authDomain: "VITE_AUTH_DOMAIN",
  projectId: "VITE_PROJECT_ID",
  appId: "VITE_APP_ID",
};

// Missing keys make Firebase throw at import time, which would leave a blank
// page. We collect them instead so the app can show a readable setup screen.
export const missingFirebaseEnv = Object.entries(ENV_NAMES)
  .filter(([key]) => !firebaseConfig[key])
  .map(([, envName]) => envName);

const app = missingFirebaseEnv.length === 0 ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;

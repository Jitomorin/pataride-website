//   apiKey: "AIzaSyAiHgHNw75qkle9w58ONozYH2pbZp8j9KU",
//   authDomain: "pata-ride-web.firebaseapp.com",
//   projectId: "pata-ride-web",
//   storageBucket: "pata-ride-web.appspot.com",
//   messagingSenderId: "67588996400",
//   appId: "1:67588996400:web:8805b78583a8b299fe1cf5",
import { initializeApp, getApps } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);
export const storage = getStorage(firebase_app);
// export const messaging = getMessaging(firebase_app);
export const firebaseAuthErrors = [
  {
    code: "auth/invalid-email",
    message: "The email address is badly formatted.",
  },
  {
    code: "auth/user-disabled",
    message: "The user account has been disabled by an administrator.",
  },
  {
    code: "auth/user-not-found",
    message:
      "There is no user record corresponding to this identifier. The user may have been deleted.",
  },
  {
    code: "auth/wrong-password",
    message: "The password is invalid or the user does not have a password.",
  },
  {
    code: "auth/email-already-in-use",
    message: "The email address is already in use by another account.",
  },
  {
    code: "auth/operation-not-allowed",
    message: "Password sign-in is disabled for this project.",
  },
  {
    code: "auth/weak-password",
    message: "The password must be 6 characters long or more.",
  },
  {
    code: "auth/invalid-api-key",
    message:
      "Your API key is invalid, please check you have copied it correctly.",
  },
  {
    code: "auth/app-not-authorized",
    message:
      "This app is not authorized to use Firebase Authentication with the provided API key.",
  },
  {
    code: "auth/invalid-credential",
    message: "The supplied auth credential is malformed or has expired.",
  },
  {
    code: "auth/invalid-verification-code",
    message: "The verification code is invalid.",
  },
  {
    code: "auth/captcha-check-failed",
    message:
      "The reCAPTCHA response token provided is either invalid, expired, or has already been used.",
  },
  {
    code: "auth/account-exists-with-different-credential",
    message:
      "An account already exists with the same email address but different sign-in credentials.",
  },
  {
    code: "auth/requires-recent-login",
    message:
      "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
  },
  {
    code: "auth/provider-already-linked",
    message: "User with the given provider already linked to this account.",
  },
  {
    code: "auth/too-many-requests",
    message:
      "We have blocked all requests from this device due to unusual activity. Try again later.",
  },
  {
    code: "auth/missing-android-pkg-name",
    message:
      "An Android Package Name must be provided if the Android App is required to be installed.",
  },
  {
    code: "auth/auth-domain-config-required",
    message:
      "Be sure to include authDomain when calling firebase.initializeApp(), by including it in firebaseConfig.",
  },
  // Add more error codes as needed
];

export default firebase_app;

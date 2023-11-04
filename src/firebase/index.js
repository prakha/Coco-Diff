import firebase from 'firebase'
import { LoadingRef } from '../App/AppProvider';
import 'firebase/database'; // Import the Realtime Database service
import 'firebase/remote-config'; // Import the Remote Config service
import 'firebase/analytics'; // Import the Analytics service
import 'firebase/messaging'; // Import the Cloud Messaging service


const firebaseConfig = {
  apiKey: "AIzaSyDa5WnFkkkjC1bydgpHrWPxME61oVH1Eho",
  authDomain: "coco-1612595023563.firebaseapp.com",
  projectId: "coco-1612595023563",
  storageBucket: "coco-1612595023563.appspot.com",
  messagingSenderId: "959635100670",
  appId: "1:959635100670:web:33d173aa9716bc101ca6af",
  measurementId: "G-GLPRE6GDBK"
};

let database;
if (typeof window !== 'undefined') {
  try {
    const firebaseApp = firebase.initializeApp(firebaseConfig);

    database = firebaseApp.database();

   
    const remoteConfig = firebase.remoteConfig();
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    remoteConfig.defaultConfig = {
      "welcome_message": "Welcome To Coco"
    };
    const val = remoteConfig.getValue("welcome_message");

 
    const analytics = firebase.analytics();
    analytics.logEvent("app initialized");

    // Set up Cloud Messaging
    const messaging = firebase.messaging();
    messaging.getToken({ vapidKey: "YOUR_VAPID_KEY" })
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM token:", currentToken);
          window.fcmToken = currentToken;
          LoadingRef.current && LoadingRef.current.updateDevice();
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
    });
  } catch (e) {
    console.warn("Firebase error catch ", e);
  }
}

export { database };
export const firebaseClient = firebase;
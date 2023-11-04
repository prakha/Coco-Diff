import firebase from 'firebase'
import { LoadingRef } from '../App/AppProvider';

const firebaseConfig = {
    apiKey: "AIzaSyDa5WnFkkkjC1bydgpHrWPxME61oVH1Eho",
    authDomain: "coco-1612595023563.firebaseapp.com",
    projectId: "coco-1612595023563",
    storageBucket: "coco-1612595023563.appspot.com",
    messagingSenderId: "959635100670",
    appId: "1:959635100670:web:33d173aa9716bc101ca6af",
    measurementId: "G-GLPRE6GDBK"
  };


  if(typeof window !== undefined){
   try{

    firebase.initializeApp(firebaseConfig)
    // firebase.initializeApp(firebaseConfig)
    
    const remoteConfig = firebase.remoteConfig();
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    
    remoteConfig.defaultConfig = {
      "welcome_message": "Welcome To Coco"
    };
    const val = remoteConfig.getValue("welcome_message");
    
     const analytics  = firebase.analytics();
    analytics.logEvent("app initialized")
    
    
    const messaging = firebase.messaging();
    messaging.getToken({vapidKey: "BDNDh9vYV5vzrbWMFqiwTRbgYfUrXj6apWnFFRBN-fJGFHBh8Fg18ZhDxwZKvIv5qf4JV-yfpdH6mYwkz1WOzng"})
    .then((currentToken) => {
    if (currentToken) {
         // Send the token to your server and update the UI if necessary
         console.log("token fcm", currentToken)
          window.fcmToken = currentToken
          LoadingRef.current && LoadingRef.current.updateDevice()
         // ...
       } else {
         // Show permission request UI
         console.log('No registration token available. Request permission to generate one.');
         // ...
       }
     }).catch((err) => {
       console.log('An error occurred while retrieving token. ', err);
       // ...
     });
       
     messaging.onMessage((payload) => {
       console.log('Message received. ', payload);
       // ...
     });
   }catch(e){
     console.warn("firebase error catch " , e)
   }
    
  }




export const firebaseClient = firebase;

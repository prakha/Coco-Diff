importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }

  const firebaseConfig = {
    apiKey: "AIzaSyDa5WnFkkkjC1bydgpHrWPxME61oVH1Eho",
    authDomain: "coco-1612595023563.firebaseapp.com",
    projectId: "coco-1612595023563",
    storageBucket: "coco-1612595023563.appspot.com",
    messagingSenderId: "959635100670",
    appId: "1:959635100670:web:33d173aa9716bc101ca6af",
    measurementId: "G-GLPRE6GDBK"
  };


firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions);
  });
  
var firebase = require("firebase");
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
firebase.initializeApp(firebaseConfig);
exports.realTimeDB = firebase.database();

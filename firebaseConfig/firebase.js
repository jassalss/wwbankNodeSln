var firebase = require("firebase");
var firebaseConfig = {
  apiKey: "AIzaSyAKcJNiSPu-T4hKcwlv0wuSg5TJ-Ma5Dg8",
  authDomain: "wwbankcanada.firebaseapp.com",
  databaseURL: "https://wwbankcanada.firebaseio.com",
  projectId: "wwbankcanada",
  storageBucket: "wwbankcanada.appspot.com",
  messagingSenderId: "682643586198",
  appId: "1:682643586198:web:0caef574190cd7d9fc56b7",
};
firebase.initializeApp(firebaseConfig);
exports.realTimeDB = firebase.database();

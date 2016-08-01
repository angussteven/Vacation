  var firebase = require(vendor/firebase.js);
  var config = {
    apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
    authDomain: "vacationtracker-5d242.firebaseapp.com",
    databaseURL: "https://vacationtracker-5d242.firebaseio.com",
    storageBucket: "",
  };

  firebase.initializeApp(config);

/*Test Connection*/
  firebase.child('.info/connected').on('value', function(connectedSnap) {
  if (connectedSnap.val() === true) {
  		console.log("ON");
    } else {
  		console.log("off");
  }
});

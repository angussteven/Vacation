function fireSignOut(){
	firebase.auth().signOut().then(function() {
  		alert("Success");
  		$("#loginWrap").show();
	    $("#wrap").hide();
}, function(error) {
  alert("Fail");
});
}
function logIn(){
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	if (password == "") {
		alert("Enter a password");
		return;
	}

  	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  if (errorCode == 'auth/invalid-email') {
	      alert(errorMessage);
		} 
	  else if (errorCode == 'auth/user-not-found') {
	      alert(errorMessage);
	    }
	   else if (errorCode == 'auth/wrong-password'){
	   	alert(errorMessage);
	   }
  		console.log(errorCode, errorMessage);
	});
}
$( document ).ready(function() {
	//prevent form from posting
	$("#loginForm").submit(function(event){
	     event.preventDefault();
	});
	//event thatchecks if user is logged in or just signed on
   	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log(user.email);
	    $("#loginWrap").hide();
	    $("#wrap").show();
	    $('#calendar').fullCalendar('render');
	  } else {
	    console.log("Not logged in");
  		}
	});
});

function fireSignOut() {
	firebase.auth().signOut().then(function () {
  		$("#loginWrap").show();
		$("#wrap").hide();
		$("#sidebar").hide();
		$("#signOutButton").show()
		$("#wrapper").removeClass("wrapper");
	}, function (error) {
		alertify.alert("Fail");
	});
}

function logIn() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	if (password == "") {
		alertify.alert("Enter a password");
		return;
	}

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/invalid-email') {
			alertify.alert(errorMessage);
		}
		else if (errorCode == 'auth/user-not-found') {
			alertify.alert(errorMessage);
		}
	   else if (errorCode == 'auth/wrong-password') {
			alertify.alert(errorMessage);
	   }
  		console.log(errorCode, errorMessage);
	});
}
$(document).ready(function () {

	if (JSON.parse(localStorage.getItem(localStorage.key(0))).email != undefined){
		var emailStorage = JSON.parse(localStorage.getItem(localStorage.key(0))).email;
		console.log(emailTest);
	}
	

	
	//prevent form from posting
	$("#loginForm").submit(function (event) {
		event.preventDefault();
	});
	//event that checks if user is logged in or just signed on
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			$("#loginWrap").hide();
			$("#wrap").show();
			$("#signOutButton").show();
			$("#uploadBtn").removeClass("no-click");
			$("#sidebar").show();
			$("#wrapper").addClass("wrapper");
			$('#calendar').fullCalendar('render');
		} else {
			console.log("Not logged in");
  		}
	});
});

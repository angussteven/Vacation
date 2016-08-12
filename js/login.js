function fireSignOut() {
	firebase.auth().signOut().then(function () {
  		Console.log("Successfully Logged Out");
  		$("#loginWrap").show();
		$("#wrap").hide();
		$("#signOutButton").show()
	}, function (error) {
		alertify.alert("Fail");
	});
}


function logIn() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	let verifyEmail = document.getElementById('emailAddressVerify').value;
	let verifyPassword = document.getElementById('profilePasswordVerify').value;

	if (password == "") {
		alertify.alert("Enter a password");
		return;
	}
	console.log("Password 1: ",password,", Pasword 2:", verifyPassword);
	if (password == profilePasswordVerify) {
		alertify.alert("password does not match");
		return;
	}	

	console.log("email 1: ",email,", email 2:", verifyEmail);
	/*check email match*/
	if(email != verifyEmail){
		alertify.alert("email does not match");
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
	//prevent form from posting
	$("#loginForm").submit(function (event) {
		event.preventDefault();
	});
	//event thatchecks if user is logged in or just signed on
	firebase.auth().onAuthStateChanged(function (user) {
		if (isNewAccount) {
			//create employee in firebase databse
		}
		if (user) {
			$("#loginWrap").hide();
			$("#wrap").show();
			$('#calendar').fullCalendar('render');
			$("#signOutButton").show();
		} else {
			console.log("Not logged in");
  		}
	});
});

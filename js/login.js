function fireSignOut() {
	firebase.auth().signOut().then(function () {
  		alert("Success");
  		$("#loginWrap").show();
		$("#wrap").hide();
	}, function (error) {
		alert("Fail");
	});
}
function logIn() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	if (password == "") {
		alert("Enter a password");
		return;
	}

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/invalid-email') {
			alert(errorMessage);
		}
		else if (errorCode == 'auth/user-not-found') {
			alert(errorMessage);
		}
	   else if (errorCode == 'auth/wrong-password') {
			alert(errorMessage);
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
			// Employee //

			// Get employee with given email address [DONE]
			function getEmployee(emailAddress) {
				var ref = firebase.database().ref().child('employee/' + fixEmail(emailAddress));
				ref.once('value', function (snapshot) {
					if (snapshot.exists()) {
						employee = snapshot.val();
					}
					else {
						employee = null;
					}
					getEmployeeCallback.resolve();
				})
			}
			// Implementation of getEmployee
			var getEmployeeCallback = $.Deferred(getEmployee("andrew.moawad@gm.com"));
			getEmployeeCallback.done(function (data) {
				if (employee == null) {
					console.log("No employee found");
				} else {
					console.log("Name: " + employee.firstName + " " + employee.lastName);
					console.log("Email: " + employee.email);
					console.log("Total Vacation Days: " + employee.totalVacationDays);
					console.log("Remaining Vacation Days: " + employee.daysLeft);
				}
			});
			$("#loginWrap").hide();
			$("#wrap").show();
			$('#calendar').fullCalendar('render');
		} else {
			console.log("Not logged in");
  		}
	});
});

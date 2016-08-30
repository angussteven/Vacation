function fireSignOut() {
	firebase.auth().signOut().then(function () {
		$("#loginWrap").show();
		$("#wrap").hide();
		$("#sidebar").hide();
		$("#signOutButton").show();
		$("#wrapper").removeClass("wrapper");

		localStorage.removeItem('firstName');
		localStorage.removeItem('lastName');
		localStorage.removeItem('team');
		localStorage.removeItem('vacationdays');
		localStorage.removeItem('daysLeft');
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
	//load the cache
	if (JSON.parse(localStorage.getItem(localStorage.key(1))).email != undefined) {
		var emailStorage = JSON.parse(localStorage.getItem(localStorage.key(1))).email;
		document.getElementById("profileName").innerHTML = capitalizeName(localStorage.getItem("firstName")) + " " + capitalizeName(localStorage.getItem("lastName"));
		document.getElementById("profileTeam").innerHTML = 'Team: ' + localStorage.getItem("team");
		var vdays = document.getElementById("vacationdays");
		var info = "Total Days: " + localStorage.getItem("vacationDays") + "<br>Remaining Days: " + localStorage.getItem("daysLeft");
		vdays.innerHTML = info;

		//Render the pages NOW if in cache
		RenderCalendar();
	}

	//prevent form from posting
	$("#loginForm").submit(function (event) {
		event.preventDefault();
	});
	//event that checks if user is logged in or just signed on
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			if (JSON.parse(localStorage.getItem(localStorage.key(1))).email != undefined) {
				RenderCalendar();
			}

		} else {
			console.log("Not logged in");
		}
	});
});

function RenderCalendar() {
	$("#loginWrap").hide();
	$("#wrap").show();
	$("#signOutButton").show();
	$("#uploadBtn").removeClass("no-click");
	$("#sidebar").show();
	$("#wrapper").addClass("wrapper");
	$('#calendar').fullCalendar('render');
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

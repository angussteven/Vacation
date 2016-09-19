// Initialize Firebase
var config = {
	apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
	authDomain: "vacationtracker-5d242.firebaseapp.com",
	databaseURL: "https://vacationtracker-5d242.firebaseio.com",
	storageBucket: "vacationtracker-5d242.appspot.com",
};
firebase.initializeApp(config);

function capitalizeName(name) {
	try {
		return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	}
	catch (err) {
		return name;
	}
}

function getEmployee(emailAddress) {
	return new Promise(function (resolve, reject) {
		var ref = firebase.database().ref().child('employee/' + fixEmail(emailAddress));

		ref.once('value', function (snapshot) {
			if (snapshot.exists()) {
				resolve(snapshot.val());
			}
			else {
				reject();
			}
		});
	});
}

function getEmployeeEvents(emailAddress) {
	return new Promise(function (resolve, reject) {
		var fixedEmail = fixEmail(emailAddress);
		var evRef = firebase.database().ref().child('event');
		evRef.orderByChild("email").equalTo(emailAddress).once('value', function (snapshot) {
			if (snapshot.exists()) {
				resolve(snapshot.val());
			}
			else {
				reject();
			}
		});
	});
}

function getEmployeesOnTeam(teamName) {
	return new Promise(function (resolve, reject) {
		var ref = firebase.database().ref().child('employee');
		ref.orderByChild("team").equalTo(teamName.toLowerCase()).once('value', function (snapshot) {
			if (snapshot.exists()) {
				resolve(snapshot);
			} else {
				reject();
			}
		});
	});
}

// Updates a given event [TODO]
function updateEvent(eventID, email, startDate, endDate, title, type, description) {
	// Update the information for an event
	var tempData = {
		description: description,
		email: email,
		endDate: endDate,
		startDate: startDate,
		title: title,
		type: type
	};
	var updates = {};
	updates[eventID] = tempData;
	return firebase.database().ref('event').update(updates);
}

function removeEmpFromTeam(userID, teamName) {
	var refs = firebase.database().ref().child('team').child(teamName);
	var employeeIndex;
	refs.child('employee').once('value', function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			if (childSnapshot.val().toString() === userID) {

				employeeIndex = childSnapshot.getKey();
			}
		});
		refs.child('employee').child(employeeIndex).remove();
	});
	var userIDWithoutSpecial = userID.replace(/[^a-zA-Z ]/g, "");
	var empRef = firebase.database().ref().child('employee').child(userIDWithoutSpecial).child('team');
	empRef.remove();
}

// Removes employee from team [Andrew]
function removeManagerFromTeam(userID, teamName) {
	var refs = firebase.database().ref().child('team').child(teamName);
	var managerIndex;
	refs.child('manager').once('value', function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			if (childSnapshot.val().toString() === userID) {
				managerIndex = childSnapshot.getKey();
			}
		});
		refs.child('manager').child(managerIndex).remove();
	});
}

/*
	  Save a team into the database [UNTESTED]
	  teamID = int
	  employees = array of strings (emails)
	  managers = array of strings (emails)
 */
function saveTeam(teamID, employees, managers, teamName) {	firebase.database().ref('team/' + teamName).set({
		teamID: teamID,
		employee: employees,
		manager: managers,
		name: teamName
	});
}
function createTeam() {
	var teamName = document.getElementById("teamName").value;
	console.log(teamName);
	if (teamName.toString() === "") {
		alertify.alert("Please enter a Team Name");
	} else {

		var userID = localStorage.getItem("profileEmail");
		firebase.database().ref('team/' + teamName).set({
			manager: userID,
			name: teamName
		});
		var teamManagerFixedEmail = fixEmail(userID);
		firebase.database().ref('employee/' + teamManagerFixedEmail).child('isManager').set(true);
	}
}

// Update the employee's manager
/*function updateManager() {
	var manager = document.getElementById("newManager").value;
	var tempUser = sessionStorage.getItem('user');
	var tempData = JSON.parse(tempUser);
	var tempEmail = fixEmail(tempData.email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('managers').set(manager);
	showChangeManager();
}
*/
function updateTeam() {
    var team = document.getElementById("newTeam").value;
    var tempUser = sessionStorage.getItem('user');
    var tempData = JSON.parse(tempUser);
	var oldTeam = tempData.team;
	var tempAddress = tempData.email;
    var tempEmail = fixEmail(tempData.email);
    firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('team').set(team);
	firebase.database().ref().child('team').child(team.toLowerCase()).child('employee').push(tempAddress);
	var ref = firebase.database().ref().child('team').child(oldTeam);
	ref.child('employee').once('value', function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			if (childSnapshot.val().toString() === tempAddress) {
				var key = childSnapshot.getKey();
				ref.child('employee').child(key).remove();
			}
		});
	});
    showChangeManager();
}

/*
 	Save an event into the database
 	email: string (email)
 	eventID: int
 	startDate: string (ex. "08-29-2016")
 	endDate: string (ex. "08-31-2016")
 	vacationType: stirng (vaction or business)
 	eventTitle: string
 	title: string
 	description: string
 */

//saveEvent("zachary.dicino@gm.com",3,"08-29-2016","08-31-2016","business","vacation I need time","why");

function saveEvent(email, eventID, startDate, endDate, vacationType,
	eventTitle, eventDescription) {
	firebase.database().ref('event/' + eventID).set({
		email: email,
		eventID: eventID,
		startDate: startDate,
		endDate: endDate,
		type: vacationType,
		title: eventTitle,
		description: eventDescription
	});

	//add the event id into the employee
	addEventToEmp(email, eventID);

	//getting data from session storage
	var data = sessionStorage.getItem('user');
	var dataResult = JSON.parse(data);

	//switching the dates around
	startDate = startDate.slice(-5) + "-" + startDate.slice(0, 4);
	endDate = subtractDay(endDate);
	endDate = endDate.slice(-5) + "-" + endDate.slice(0, 4);

	//calculate the vacation days
	var vacation = calculateVacationDays(startDate, endDate);


	//changing the session storage object
	dataResult.daysLeft = dataResult.daysLeft - vacation;
	sessionStorage.setItem('user', JSON.stringify(dataResult));

	//updating the vacation in the database
	updateDaysLeft(email, dataResult.daysLeft);

	//repopulating the html fields
	var vdays = document.getElementById("vacationdays");
    var info = "Total Days: " + dataResult.totalVacationDays + "<br>Remaining Days: " + dataResult.daysLeft;
    vdays.innerHTML = info;
}

function addEventToEmp(email, eventID) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('events').push(eventID);
}

function getImage(fileName) {
	var storage = firebase.storage();
	// Create a storage reference from our storage service
	var storageRef = storage.ref();
	var imagesRef = storageRef.child("images/" + fileName);
	var path = imagesRef.fullPath;
	//return path;

	// Get the download URL
	imagesRef.getDownloadURL().then(function (url) {
		// Insert url into an <img> tag to "download"
		var Image = document.getElementById("picture");
		Image.src = url;
	});
}


function updateDaysLeft(email, daysLeft) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('daysLeft').set(daysLeft);
}

function updateName(email, firstName, lastName) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('firstName').set(firstName);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('lastName').set(lastName);
}

function updateManager(email, manager) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('manager').set(manager);

}

function updatetotalVacationDays(email, totalVacationDays) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('totalVacationDays').set(totalVacationDays);

}

// Takes an email and returns the email with no special characters [DONE]
function fixEmail(tempEmail) {
	var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
	return result;
}

// Deletes an event [UNKNOWN]
function deleteEvent(eventID) {

	var Key;
	var ref = firebase.database().ref().child('event');
	ref.orderByChild("eventID").equalTo(eventID).once('value', function (snapshot) {
		keyToObject = Object.keys(snapshot.val()).toString();
		if (keyToObject !== null) {
			ref.child(keyToObject).remove();
		}

		//snapshot.ref().remove();
	});
	var profileEmail = localStorage.getItem("profileEmail");
	var fixedEmail = fixEmail(profileEmail);
	var empRef = firebase.database().ref().child('employee').child(fixedEmail).child('events');
	empRef.once('value', function (snapshot) {
		if (snapshot.exists()) {
			snapshot.forEach(function (childSnapshot) {
				if (childSnapshot.val().toString() === eventID) {
					key = childSnapshot.getKey();
				}
				//console.log("this is the employee requested: " + childSnapshot.val());
			});

			if (key !== null) {
				empRef.child(key).remove();
			}
		}
	});
}

function updateDeleteEvent(eventID) {
	var startDate;
	var endDate;
	var vacation;
	var ref = firebase.database().ref().child('event').child(eventID);
	ref.once('value', function (snapshot) {
		startDate = snapshot.child("startDate").val();
		endDate = snapshot.child("endDate").val();
		//switching the dates around
		startDate = startDate.slice(-5) + "-" + startDate.slice(0, 4);
		endDate = subtractDay(endDate);
		endDate = endDate.slice(-5) + "-" + endDate.slice(0, 4);
		vacation = calculateVacationDays(startDate, endDate);
		//getting data from session storage
		var data = sessionStorage.getItem('user');
		var dataResult = JSON.parse(data);
		//changing the session storage object
		dataResult.daysLeft = dataResult.daysLeft + vacation;
		sessionStorage.setItem('user', JSON.stringify(dataResult));
		//repopulating the html fields
		var vdays = document.getElementById("vacationdays");
		var info = "Total Days: " + dataResult.totalVacationDays + "<br>Remaining Days: " + dataResult.daysLeft;
		vdays.innerHTML = info;
		updateDeleteEventDatabase(dataResult.email);
	});
}

function updateDeleteEventDatabase(email) {
	//getting data from session storage
	var data = sessionStorage.getItem('user');
	var dataResult = JSON.parse(data);
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('daysLeft').set(dataResult.daysLeft);
}

function uploadImage(file) {
	var storageRef = firebase.storage().ref();
	//var file = 'img/temp.jpg';
	//file.setAttribute("type", "file");
	var uploadTask = storageRef.child('images/' + file.name).put(file);
	var data = sessionStorage.getItem('user');
    var dataResult = JSON.parse(data);
    firebase.database().ref().child('employee/' + fixEmail(dataResult.email.toLowerCase())).child('image').set(file.name);

}

function getImage(fileName) {
	var storage = firebase.storage();
	// Create a storage reference from our storage service
	var storageRef = storage.ref();
	var imagesRef = storageRef.child("images/" + fileName);
	var path = imagesRef.fullPath;
	//return path;

	// Get the download URL
	imagesRef.getDownloadURL().then(function (url) {
		// Insert url into an <img> tag to "download"
		var Image = document.getElementById("picture");
		Image.src = url;
		console.log(url);
	});
}

function getProfileImage(email) {
    var ref = firebase.database().ref().child('employee/' + fixEmail(email.toLowerCase())).child('image');
    var fileName;
    ref.on('value', function (snapshot) {
		fileName = snapshot.val();
		console.log(snapshot.val());
	});
    if (fileName === null) {

    } else {

		var storage = firebase.storage();
		// Create a storage reference from our storage service
		var storageRef = storage.ref();
		var imagesRef = storageRef.child("images/" + fileName);
		sessionStorage.setItem('image', fileName);

		var path = imagesRef.fullPath;
		imagesRef.getDownloadURL().then(function (url) {
			// Insert url into an <img> tag to "download"
			var Image = document.getElementById("picture");
			Image.src = url;
		});

    }
}

function updateSessionVacation(vacation) {
	var data = sessionStorage.getItem('user');
	var dataResult = JSON.parse(data);
	//changing the session storage object
	dataResult.daysLeft = dataResult.daysLeft + vacation;
	sessionStorage.setItem('user', JSON.stringify(dataResult));
}

function addEmpToManager(managerEmail, email) {
    var tempEmail = fixEmail(managerEmail);
    firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('employees').push(email);
}

function addEmpToTeam(email, teamName) {
    var tempEmail = fixEmail(email);
    firebase.database().ref().child('team').child(teamName.toLowerCase()).child('employee').push(email);
}

function addManagerToTeam(email, teamName) {
    var tempEmail = fixEmail(email);
    firebase.database().ref().child('team').child(teamName.toLowerCase()).child('manager').push(email);
}

function getAllManagers() {
	var allManagers = [];
	return new Promise(function (resolve, reject) {
		var ref = firebase.database().ref().child('employee');
		ref.on('value', function (snapshot) {
			if (snapshot.exists()) {
				snapshot.forEach(function (childSnapshot) {
					if (childSnapshot.child("isManager").val() === true) {
						allManagers.push(childSnapshot.val());
					}
				});
				resolve(allManagers);
			}
			else{
				reject();
			}
		});
	});
}

function getAllTeams() {
	var allTeams = [];
	return new Promise(function (resolve, reject) {
		var ref = firebase.database().ref().child('team');
		ref.on('value', function (snapshot) {
			if (snapshot.exists) {
				snapshot.forEach(function (childSnapshot) {
					allTeams.push(childSnapshot.val());
				});
				resolve(allTeams);
			}
			else{
				reject();
			}
		});
	});
}

//This method will add the user to the User table(firebase), and also store the rest of the information in the database [UNTESTED]
function addUser(email, password, firstName, lastName, totalVacationDays, dayslefts, isManager, managers, team, employees, pathToPicture, title) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(data) {
            saveEmployee(firstName, lastName, totalVacationDays, dayslefts, team, managers, isManager, email, "No save");
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                console.log(errorCode);
            } else if (errorCode == 'auth/email-already-in-use') {
                console.log(errorCode);
            } else if (errorCode == 'auth/invalid-email') {
                console.log(errorCode);
            } else {
                console.log(errorMessage);
            }
        });
}

function saveEmployee(firstname, lastname, totalVacation, daysleft, teamName, managers, isManager, email, password) {
    var tempEmail = fixEmail(email);
    firebase.database().ref('employee/' + tempEmail).set({
        firstName: firstname,
        lastName: lastname,
        totalVacationDays: totalVacation,
        daysLeft: daysleft,
        team: teamName,
        managers: managers,
        isManager: isManager,
        email: email,
        password: password,
        employees: null
    });

    /**
     *	Now we must add this employee in their manager's employees list
     *	Do a get Manager call based on each manager in the managers array
     * 	insert this employee in the manager's employee list
     */
    addEmpToManager(managers, email);

    /**
     *	Now we must add the employee to their team
     */
    if (isManager) {
        addManagerToTeam(email, teamName);
    } else {
        addEmpToTeam(email, teamName);
    }

}

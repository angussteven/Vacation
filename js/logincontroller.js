
$(document).ready(function () {
    var popup = new Foundation.Reveal($('#createProfileModal'));
    $("#createCloseBtn").click(function () {
            popup.close();
    });

    $(document).foundation();
    $("#createProfileForm").on("submit", function(ev) {
        ev.preventDefault();
        createProfile();
        $('#createProfileModal').foundation('close');
  });
});
  
var isNewAccount = false;
function createProfile() {
    isNewAccount = true;
    var email = document.getElementById('emailAddress').value;
    var emailVerify = document.getElementById('emailAddressVerify').value;
    var firstName = document.getElementById('profileFirstName').value;
    var lastName = document.getElementById('profileLastName').value;
    var password = document.getElementById('profilePassword').value;
    var passwordVerify = document.getElementById('profilePasswordVerify').value;
    var isManager = $("#yesMan").is(":checked");
    var manager = $("#selectedManager :selected").val();
    var team = $("#selectedTeam :selected").val();
    var totalVacationDays = document.getElementById('vacationDaysTotal').value;
    var vacationDaysLeft = document.getElementById('vacationDaysLeft').value;

    addUser(email, password, firstName, lastName, totalVacationDays, vacationDaysLeft, isManager, manager, team, "ALL EMPLOYEES", "URL", "Title")
}

// User
//This method will add the user to the User table(firebase), and also store the rest of the information in the database [UNTESTED]
function addUser(email, password,firstName,lastName,totalVacationDays,dayslefts,isManager,managers,team,employees,pathToPicture,title) {
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
 	var tempEmail = fixsEmail(email);
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
    addEmpToManager(managers,email);

	/**
	*	Now we must add the employee to their team
	*/
	if(isManager){
		addManagerToTeam(email, teamName);
	}else{
		addEmpToTeam(email, teamName);
	}

     


 }

 function addEmpToManager(managerEmail, email){
	var tempEmail = fixsEmail(managerEmail);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('employees').push(email);
 }


function addEmpToTeam(email, teamName){
	var tempEmail = fixsEmail(email);
	firebase.database().ref().child('team').child(teamName.toLowerCase()).child('employee').push(email);
}

function addManagerToTeam(email, teamName){
	var tempEmail = fixsEmail(email);
	firebase.database().ref().child('team').child(teamName.toLowerCase()).child('manager').push(email);
}
 // TRakes an email and returns the email with no special characters [DONE]
function fixsEmail(tempEmail){
  var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
  return result;
}

var allManagers = [];
var managerObject = {};

var getAllManagersCallback = $.Deferred(getAllManagers);
getAllManagersCallback.done(function(data){
    var select = document.getElementById("selectedManager");
    
    for(var i = 0; i < allManagers.length; i++){

        select[select.length] = new Option((allManagers[i].firstName + " " + allManagers[i].lastName), allManagers[i].email);
    }
    console.log(managerObject);
});

function getAllManagers(){
    var ref = firebase.database().ref().child('employee');
    ref.on('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            if(childSnapshot.child("isManager").val() == true){
                allManagers.push(childSnapshot.val());
            }
        });
        getAllManagersCallback.resolve();
    });
}

var allTeams = [];

var getAllTeamsCallback = $.Deferred(getAllTeams);
getAllTeamsCallback.done(function(data){
    var select = document.getElementById("selectedTeam");
    
    for(var i = 0; i < allTeams.length; i++){
        select[select.length] = new Option(allTeams[i].name, allTeams[i].name);
        console.log(allTeams[i]);
    }
});

function getAllTeams(){
    var ref = firebase.database().ref().child('team');
    ref.on('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            allTeams.push(childSnapshot.val());
        });
        getAllTeamsCallback.resolve();
    });
}


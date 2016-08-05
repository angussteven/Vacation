
$(document).ready(function () {
    var popup = new Foundation.Reveal($('#createProfileModal'));
    $("#newUserBtn").click(function () {
        popup.open();
    });
    $("#createCloseBtn").click(function () {
            popup.close();
    });

    //prevent createProfileForm form from posting
    $("#createProfileForm").submit(function (event) {
        event.preventDefault();
        createProfile();
    });

    // $("#createProfileBtn").click(function(){
    //     createProfile();
    // })
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
    var manager = $("#selectedManager :selected").text();
    var totalVacationDays = document.getElementById('vacationDaysTotal').value;
    var vacationDaysLeft = document.getElementById('vacationDaysLeft').value;

    if(email !== emailVerify && email == "" && emailVerify == ""){
        alert("Emails do not match.");
        return
    }
    if(password !== passwordVerify && password == ""){
        alert("Passwords do not match.")
        return
    }
    addUser(email, password, firstName, lastName, totalVacationDays, vacationDaysLeft, isManager, manager, "TEAAAM", "ALL EMPLOYEES", "URL", "Title")
}




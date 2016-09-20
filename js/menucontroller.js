var sideBarOpen = true;
var settingsMenuOpen = false;

function toggleSideBar(burgerBar) {
    var sidebar = document.getElementById("sidebar");
    var settingsButton = document.getElementById("settingsButton");

    if (sideBarOpen) {
        sidebar.style.left = "-1000px";
        sideBarOpen = false;
    } else {
        if (settingsMenuOpen) {
            toggleProfileSettings(settingsButton);
        }

        sidebar.style.left = "0";
        sideBarOpen = true;
    }
    animateButton(burgerBar);
}

function toggleProfileSettings(settings) {
    var settingsMenu = document.getElementById("profileSettings");
    var burgerBar = document.getElementById("burgerMenu");

    if (settingsMenuOpen) {
        settingsMenu.style.right = "-2000px";
        settingsMenuOpen = false;
    } else {
        if (sideBarOpen) {
            toggleSideBar(burgerBar);
        }
        settingsMenu.style.right = "0";
        settingsMenuOpen = true;
    }

}

function animateButton(burgerBar) {
    burgerBar.classList.toggle("animate");
}

function populateProfileSettings() {
    document.getElementById("menuFirstName").value = localStorage.getItem("firstName");
    document.getElementById("menuLastName").value = localStorage.getItem("lastName");
    document.getElementById("menuEmail").value = localStorage.getItem("profileEmail");
    document.getElementById("menuManager").value = capitalizeName(localStorage.getItem("managerFirstName")) + " " + capitalizeName(localStorage.getItem("managerLastName"));
    document.getElementById("menuTotalVacationDays").value = localStorage.getItem("vacationDays");
    document.getElementById("menuUserDays").value = localStorage.getItem("daysLeft");
    document.getElementById("newManager").value = localStorage.getItem("managerEmail");
    //document.getElementById("newTeam").value = localStorage.getItem("team");
}

function updateProfileSettings() {
  var currentEmail = localStorage.getItem("profileEmail");

  var newFirstName = document.getElementById("menuFirstName").value;
  var newLastName = document.getElementById("menuLastName").value;
  //var newEmail = document.getElementById("newManager").value;
  var newManager = document.getElementById("newManager").value;
  var newTotalVacationDays = document.getElementById("menuTotalVacationDays").value;
  //var daysLeft = document.getElementById("userDays").value;

  updateName(currentEmail, newFirstName, newLastName);
    // localStorage.setItem("firstName", newFirstName);
    // localStorage.setItem("lastName", newLastName);

  updateManager(currentEmail, newManager);
  updatetotalVacationDays(currentEmail, newTotalVacationDays);

  initialize(currentEmail);
//   localStorage.setItem("vacationDays", newTotalVacationDays);

  //location.reload();
  //localStorage.setItem("manager")

}

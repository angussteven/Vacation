/*
* Flags to keep track of the state of the menus
*/
var sideBarOpen = true;
var settingsMenuOpen = false;
/*
* This function toggles the state of the left side bar by moving it off and on
* the page depending on its current state.
*/
function toggleSideBar(burgerBar) {
    /*
    * Sidebar and settings button objects are loaded.
    */
    var sidebar = document.getElementById("sidebar");
    var settingsButton = document.getElementById("settingsButton");
    /*
    * If the sidebar is open and then we move it to the left off of the screen and
    * and toggle the corresponding flag.
    */
    if (sideBarOpen) {
        sidebar.style.left = "-1000px";
        sideBarOpen = false;
    }
    /*
    * If the sidebar is closed we check to see if the settings menu is open. If the settings
    * menu is open it is closed adn the sidebar is opened.
    */
    else {
        if (settingsMenuOpen) {
            toggleProfileSettings(settingsButton);
        }

        sidebar.style.left = "0";
        sideBarOpen = true;
    }
    /*
    * The menu button is animted on toggle.
    */
    animateButton(burgerBar);
}
/*
* This function toggles the position of the profile settings menu.
*/
function toggleProfileSettings(settings) {
  /*
  * Sidebar and settings button objects are loaded.
  */
    var settingsMenu = document.getElementById("profileSettings");
    var burgerBar = document.getElementById("burgerMenu");
    /*
    * if the settings menu is open it is closed and the flag is toggled.
    */
    if (settingsMenuOpen) {
        settingsMenu.style.right = "-2000px";
        settingsMenuOpen = false;
    }
    /*
    * If the settings menu is opened we check to see it the left side is open, if it
    * is open we close it, open the settings menu, and toggle the corresponding flags.
    */
    else {
        if (sideBarOpen) {
            toggleSideBar(burgerBar);
        }
        settingsMenu.style.right = "0";
        settingsMenuOpen = true;
    }

}
/*
* This function simply activates the animation of the burger icon.
*/
function animateButton(burgerBar) {
    burgerBar.classList.toggle("animate");
}
/*
* This method is used to fill in the text boxes in the settings menu with the information
* corresponding to the current user.
*/
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
/*
* This function takes all of the contents in the settings menu and updates the database
* with it.
*/
function updateProfileSettings() {
  var currentEmail = localStorage.getItem("profileEmail");
  var newFirstName = document.getElementById("menuFirstName").value;
  var newLastName = document.getElementById("menuLastName").value;
  //var newEmail = document.getElementById("newManager").value;
  var newManager = document.getElementById("newManager").value;
  var newTotalVacationDays = document.getElementById("menuTotalVacationDays").value;
  //var daysLeft = document.getElementById("userDays").value;

  updateName(currentEmail, newFirstName, newLastName);
  updateManager(currentEmail, newManager);
  updatetotalVacationDays(currentEmail, newTotalVacationDays);

  initialize(currentEmail);
}

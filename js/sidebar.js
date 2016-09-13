var menuOpen = true;

function toggleSideBar(burgerBar) {
    var sidebar = document.getElementById("sidebar");
    var sidebarContainer = document.getElementById("sidebarContainer");
    var calendarContainer = document.getElementById("wrap");
    var width = sidebarContainer.offsetWidth;
    
    console.log("Menu width: " + width);
    
    if (menuOpen) {
        sidebar.style.left = "-500px";
        menuOpen = false;
    }
    else {
        sidebar.style.left = "0";
        menuOpen = true;
    }
    /*
    if (width <= 0) {
        sidebarContainer.style.width = "100%";
        sidebar.style.width = "25em";
        // calendarContainer.style.width = "70%";
        //sidebar.style.backgroundColor = "#80b3ff"
        sidebar.style.backgroundImage = "url('img/background.png')";
        menuOpen = true;
        $("#sidebarContainer").show();
    }
    else {
        sidebarContainer.style.width = "0";
        sidebar.style.width = "0em";
        calendarContainer.style.width = "100%";
        sidebar.style.backgroundImage = "none";
        menuOpen = false;
        $("#sidebarContainer").hide();
    }
    */
    animateButton(burgerBar);
}

function animateButton(burgerBar) {
    burgerBar.classList.toggle("animate");
}
function toggleSideBar(burgerBar) {
    var sidebar = document.getElementById("sidebar");
    var sidebarContainer = document.getElementById("sidebarContainer");
    var width = sidebarContainer.offsetWidth;
    
    console.log("Menu width: " + width);
    if (width <= 0) {
        sidebarContainer.style.width = "100%";
        sidebar.style.width = "20%";
        $("#sidebarContainer").show();
    }
    else {
        sidebarContainer.style.width = "0";
        sidebar.style.width = "0";
        $("#sidebarContainer").hide();
    }
    burgerBar.classList.toggle("animate");
}
function Account(GMIN, First, Last, Email, Manager, TotalVacation, UsedVacation) {
    this.GMIN = GMIN;
    this.First = First;
    this.Last = Last;
    this.Email = Email;
    this.Manager = Manager;
    this.TotalVacation = TotalVacation;
    this.UsedVacation = UsedVacation;
};
var robert = Account("242348733", "Robert", "Kasper", "robert.kasperiv@gm.com", "Michael Eilers", "15", "3");

var steven = Account("546461651", "Steven", "Angus", "steven.angus@gm.com", "Michael Eilers", "15", "0");
	
$(document).ready(function() {
    var popup = new Foundation.Reveal($('#createProfileModal'));
    $("#newUserBtn").click(function () {
        popup.open();
    });
    $("#createCloseBtn").click(function () {
        var ans = confirm("Are you sure you want to cancel? All progress will be lost.");
      	if (ans == true)
            popup.close();
		});
});

function setData(){
    var select = document.getElementById('gmin');
    var gmin = select.options[select.selectedIndex].value;
    document.accountSelection.action = "index.html?gmid=" + gmin;
    accountSelection.submit();
};

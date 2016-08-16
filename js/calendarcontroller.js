$(document).foundation();

$(document).ready(function() {

var emailAddress;

firebase.auth().onAuthStateChanged(function (user) {
  if(user) {
    emailAddress = user.email;
    //emailAddress = fixEmail(emailAddress);
  }
});

function checkDate(date) {
  var today = new Date().toJSON().slice(0,10);
  if(date < today) {
    return false;
  }
  return true;
}

// date1 is start date, date2 is end date
function compareDates(date1, date2) {
  date1 = parseInt(date1.replace(/-/g,''));
  date2 = parseInt(date2.replace(/-/g,''));
  if (date1 > date2) {
    return false;
  }
  return true;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() +
    s4() + s4() + s4() + s4();
}

function getEmail() {
  return emailAddress;
}

function fixEmail(tempEmail){
  var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
  return result;
}

function createICSFile(managerEmail, userName, userEmail, startDate, endDate, isVacation, alert) {
  startDate = startDate.split('-');
  startDate = startDate[0] + startDate[1] + startDate[2];
  endDate = endDate.split('-');
  endDate = endDate[0] + endDate[1] + endDate[2];
  switch (alert) {
    case "alertFour":
      alert = "-PT5760M";
      break;

    case "alertWeek":
      alert = "-PT10080M";
      break;

    default:
      alert = "-P1D";
      break;
  }
  switch (isVacation) {
    case "vacation":
      isVacation = "Vacation";
      break;
    case "travel":
      isVacation = "Business Travel";
      break;
  }
  var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=" + userName + " ;RSVP=TRUE:MAILTO:" + userEmail + "\nATTENDEE;CN= ;RSVP=TRUE:MAILTO:" + managerEmail + "\nORGANIZER;CN=Me:MAILTO:" + userEmail + "\nDTSTART:" + startDate +"\nDTEND:" + endDate +"\nLOCATION:OOO\nSUMMARY:"+ isVacation + "\nX-MICROSOFT-CDO-BUSYSTATUS:OOF\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Vacation\nTRIGGER:" + alert + "\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR";
  return icsMSG;
}

function updateTotals(){
    vacationDays = 0;

    $("#daysSelected").val(vacationDays);

}

function removeTime(date) {
  var dateArray = date.split('T');
  return dateArray[0];
}

function addDay(eventDay) {
  eventDay = eventDay.split('-');
  switch(eventDay[1]) {
    case '01': case '03': case '05': case '07': case '08': case '10':
      if (eventDay[2] === '31') {
        eventDay[2] = '0';
        var tempMonth = parseInt(eventDay[1]);
        eventDay[1] = (tempMonth + 1).toString();
        if (eventDay[1] <= 9){
          eventDay[1] = '0' + eventDay[1];
        }
      }
      break;

    case '04': case '06': case '09': case '11':
      if (eventDay[2] === '30') {
        eventDay[2] = '0';
        tempMonth = parseInt(eventDay[1]);
        eventDay[1] = (tempMonth + 1).toString();
        if (eventDay[1] <= 9)
          eventDay[1] = "0" + eventDay[1];
      }
      break;

    case '12':
      if (eventDay[2] === '31') {
        eventDay[2] = '0';
        eventDay[1] = '01';
        var tempYear = parseInt(eventDay[0]);
        eventDay[0] = (tempYear + 1).toString();
      }
      break;

    case '02':
      var testYear = parseInt(eventDay[0]);
      if ((testYear % 4 == 0) && (testYear % 100 != 0) || (testYear % 400 == 0)) {
        if (eventDay[2] === '29')
          eventDay[2] = '0';
          eventDay[1] = '03';
      }
      else if (eventDay[2] === '28') {
        eventDay[2] = '0';
        eventDay[1] = '03';
      }
      break;
  }
  num = parseInt(eventDay[2]);
  num+=1;
  eventDay[2] = num.toString();
  if (eventDay[2] <= 9)
    eventDay[2] = "0" + eventDay[2];
  eventDay = eventDay[0] + '-' + eventDay[1] + '-' + eventDay[2];
  return eventDay;
}

  function Account(GMIN, First, Last, Email, Manager, TotalVacation, UsedVacation) {
    this.GMIN = GMIN;
    this.First = First;
    this.Last = Last;
    this.Email = Email;
    this.Manager = Manager;
    this.TotalVacation = TotalVacation;
    this.UsedVacation = UsedVacation;
  };

  function loadProfile(account) {
    $("#GMIN").val(account.GMIN);
    $("#firstName").val(account.First);
    $("#lastName").val(account.Last);
    $("#emailAddress").val(account.Email);
    $("#manager").val(account.Manager);
    $("#totalVacationDays").val(account.TotalVacation);
    $("#usedVacationDays").val(account.UsedVacation);
  };

    var popup2 = new Foundation.Reveal($('#viewProfileModal'));
    var popup3 = new Foundation.Reveal($('#addEventModal'));
    var popup4 = new Foundation.Reveal($("#viewEventModal"));
    var eventData;
    var title;
    var clickedID;
		$('#calendar').fullCalendar({
			header: {
				left: '',
				center: 'title',
				right: 'prev,next today'
			},
      height: "parent",
      theme: false,
      weekends: false,
			selectable: true,
			selectHelper: true,
      fixedWeekCount: false,

			select: function(start, end) {
        var check = start._d.toJSON().slice(0,10);
        var today = new Date().toJSON().slice(0,10);
        if(check < today) {
          console.log(check);
          $('#calendar').fullCalendar('unselect');
          alertify.alert("Please select a start date on or after today's date.");
        }
        else {
          title = $("#firstName").val() + ' ' + $("#lastName").val();
          if (title) {
            popup3.open();
            $("#startDate").val(start.toISOString());
            $("#endDate").val(subtractDay(end.toISOString()));
            console.log($("#endDate").val());
            $("#alertOne").prop("checked", true);
            $("#vacationRadio").prop("checked", true);
            $("#downloadICSCheckbox").prop("checked", false);
            $("#createEventDescription").val("");
            var data = sessionStorage.getItem('user');
            var dataResult = JSON.parse(data);
            $("#createEventTitle").val(dataResult.firstName + " " + dataResult.lastName);
            var startDate = $("#startDate").val().slice(-5) + "-" + $("#startDate").val().slice(0,4);
            endDate = subtractDay($("#endDate").val());
            var endDate = $("#endDate").val().slice(-5) + "-" + $("#endDate").val().slice(0,4);
            var vacation = calculateVacationDays(startDate,endDate);
            $("#daysSelected").val(vacation);
            $("#daysLeft").val(dataResult.daysLeft-vacation);
            //$("#createEventTitle").val("Variable for your name");//update to include name dynamically
          };
          $('#calendar').fullCalendar('unselect');
        }
			},
      eventClick: function(event, element) {
        clickedID = event.id;
        $("#eventTitle").val(event.title);
        $("#eventDescription").val(event.description);
        $("#viewStartDate").val(removeTime(event.start.toISOString()));
        var tempEnd = removeTime(event.end.toISOString());
        $("#viewEndDate").val(subtractDay(tempEnd));
        /*
        * If the user is not the owner of the event they will not be able to modify it.
        */
        if (event.owner == emailAddress) {
          popup4.open();
        }
        return false;
      },
			editable: false,
			eventLimit: true, // allow "more" link when too many events

      dayClick: function(date) {

        $("#daysSelected").val(1);//Should be added to vacation balance calculator
      },
//			events: [
//				{
//					title: 'All Day Event',
//					start: '2016-06-01'
//				},
//				{
//					title: 'Long Event',
//					start: '2016-06-07',
//					end: '2016-06-10'
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: '2016-06-09T16:00:00'
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: '2016-06-16T16:00:00'
//				},
//				{
//					title: 'Conference',
//					start: '2016-06-11',
//					end: '2016-06-13'
//				},
//				{
//					title: 'Meeting',
//					start: '2016-06-12T10:30:00',
//					end: '2016-06-12T12:30:00'
//				},
//				{
//					title: 'Lunch',
//					start: '2016-06-12T12:00:00'
//				},
//				{
//					title: 'Meeting',
//					start: '2016-06-12T14:30:00'
//				},
//				{
//					title: 'Happy Hour',
//					start: '2016-06-12T17:30:00'
//				},
//				{
//					title: 'Dinner',
//					start: '2016-06-12T20:00:00'
//				},
//				{
//					title: 'Birthday Party',
//					start: '2016-06-13T07:00:00'
//				},
//				{
//					title: 'Click for Google',
//					url: 'http://google.com/',
//					start: '2016-06-28'
//				}
//			]
        eventAfterAllRender: function (view) {
        //Use view.intervalStart and view.intervalEnd to find date range of holidays
        //Make ajax call to find holidays in range.
        var newYearsDay = moment("2016-01-01","YYYY-MM-DD");
        var mlkDay = moment("2016-01-18","YYYY-MM-DD");
        var goodFriday = moment("2016-03-25","YYYY-MM-DD");
        var dayAfterEaster = moment("2016-03-28","YYYY-MM-DD");
        var fourthOfJuly = moment('2016-07-04','YYYY-MM-DD');
        var laborDay = moment("2016-09-05","YYYY-MM-DD");
        var electionDay = moment("2016-11-08","YYYY-MM-DD");
        var veteransDay = moment("2016-11-11","YYYY-MM-DD");
        var thanksgiving1 = moment("2016-11-24","YYYY-MM-DD");
        var thanksgiving2 = moment("2016-11-25","YYYY-MM-DD");
        var christmas1 = moment("2016-12-26","YYYY-MM-DD");
        var christmas2 = moment("2016-12-27","YYYY-MM-DD");
        var christmas3 = moment("2016-12-28","YYYY-MM-DD");
        var christmas4 = moment("2016-12-29","YYYY-MM-DD");
        var christmas5 = moment("2016-12-30","YYYY-MM-DD");


        var holidays = [newYearsDay, mlkDay, goodFriday, dayAfterEaster, fourthOfJuly, laborDay, electionDay, veteransDay, thanksgiving1, thanksgiving2, christmas1, christmas2, christmas3, christmas4, christmas5];
        var holidayMoment;
        for(var i = 0; i < holidays.length; i++) {
          holidayMoment = holidays[i];
          if (view.name == 'month') {
            $("td[data-date=" + holidayMoment.format('YYYY-MM-DD') + "]").addClass('holiday');
          } else if (view.name =='agendaWeek') {
            var classNames = $("th:contains(' " + holidayMoment.format('M/D') + "')").attr("class");
            if (classNames != null) {
              var classNamesArray = classNames.split(" ");
              for(var i = 0; i < classNamesArray.length; i++) {
                if(classNamesArray[i].indexOf('fc-col') > -1) {
                  $("td." + classNamesArray[i]).addClass('holiday');
                  break;
                }
              }
            }
          } else if (view.name == 'agendaDay') {
            if(holidayMoment.format('YYYY-MM-DD') == $('#calendar').fullCalendar('getDate').format('YYYY-MM-DD')) {
              $("td.fc-col0").addClass('holiday');
            };
          }
        }
      }
		});

    $("#addCloseBtn").click(function () {
      popup3.close();
    });

    $("#notifyBtn").click(function() {
      var id = guid();
      // checks for start date following end date; if event ends before start, it will be set to a one-day event on the start date
      var startd = $("#startDate").val();
      var endd = addDay($("#endDate").val());
      if (!checkDate(startd)) {
        alertify.alert("Please select a valid start date.");
      }
      else if (!checkDate(endd)) {
        alertify.alert("Please select a valid end date.");
      }
      else if (!compareDates(startd, endd)) {
        alertify.alert("The end date cannot be before the start date.");
      }
      else {
        if(Date.parse(startd) >= Date.parse(endd)) {
          endd = addDay(startd);
        }
        eventData = {
          owner: emailAddress,
          id: id,
          title: $("#createEventTitle").val(),
          start: startd,
          end: endd,
          description: $("#createEventDescription").val(),
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true);

        activeEvents.push(eventData.id.toString());

        alert = $('input:radio[name=alert]:checked').val();
        isVacation = $('input:radio[name=isVacation]:checked').val();
        saveEvent(emailAddress, id, $("#startDate").val(), addDay($("#endDate").val()), isVacation, $("#createEventTitle").val(), $("#createEventDescription").val());
        popup3.close();
        if ($("#downloadICSCheckbox").is(':checked') === true) {
          var data = sessionStorage.getItem('user');
          var dataResult = JSON.parse(data);
          var fullName = dataResult.firstName + " " + dataResult.lastName;
          var icsFile = createICSFile(dataResult.managers, fullName, dataResult.email, $("#startDate").val(), addDay($("#endDate").val()), isVacation, alert);
          window.open( "data:text/calendar;charset=utf8," + escape(icsFile));
        }
      }
    });

    $("#deleteBtn").click(function() {
      alertify.confirm("Are you sure you want to remove this event?", function(){
        $("#calendar").fullCalendar('removeEvents',clickedID);
        activeEvents.splice(activeEvents.indexOf(clickedID), 1);
        updateDeleteEvent(clickedID);
        deleteEvent(clickedID);
        popup4.close();
      });
    });

    $("#viewEventCloseBtn").click(function () {
      alertify.confirm("Are you sure you want to exit? All progress will be lost.", function(){
        popup4.close();
      });
    });

    $("#changeEventBtn").click(function () {
      // checks for start date following end date; if event ends before start, it will be set to a one-day event on the start date
      var news = $("#viewStartDate").val();
      var newe = addDay($("#viewEndDate").val());
      if (!checkDate(news)) {
        alertify.alert("Please select a valid start date.");
      }
      else if (!checkDate(newe)) {
        alertify.alert("Please select a valid end date.");
      }
      else if (!compareDates(news, newe)) {
        alertify.alert("The end date cannot be before the start date.");
      }
      else {
        $('#calendar').fullCalendar('removeEvents', clickedID);
        deleteEvent(clickedID);
        if(Date.parse(news) >= Date.parse(newe))
        {
          newe = addDay(news);
        }
        console.log(news + ", " + newe);
        changedEvent = {
          owner: emailAddress,
          id: guid(),
          title: $("#eventTitle").val(),
          start: news,
          end: newe,
          description: $("#eventDescription").val(),
        };
        alert = $('input:radio[name=alert_viewModal]:checked').val();
        isVacation = $('input:radio[name=isVacation_viewModal]:checked').val();
        $('#calendar').fullCalendar('renderEvent', changedEvent, true);
        saveEvent(emailAddress, guid(), news, newe, isVacation, $("#eventTitle").val(), $("#createEventDescription").val());
        popup4.close();
        if ($("#downloadICSCheckbox_viewModal").is(':checked') === true) {
          var data = sessionStorage.getItem('user');
          var dataResult = JSON.parse(data);
          var fullName = dataResult.firstName + " " + dataResult.lastName;
          var icsFile = createICSFile(dataResult.managers, fullName, dataResult.email, $("#viewStartDate").val(), addDay($("#viewEndDate").val()), isVacation, alert);
          window.open( "data:text/calendar;charset=utf8," + escape(icsFile));
        }
      }
    })
	});

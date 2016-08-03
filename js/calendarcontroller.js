$(document).foundation();


function updateTotals(){
    vacationDays = 0;

    $("#daysSelected").val(vacationDays);

}

function removeTime(date) {
  var dateArray = date.split('T');
  return dateArray[0];
}

function subtractDay(day) {
  day = day.split('-');
  endDay = day[0] + day[1] + day[2];

  if (day[2] === "01"){//if the day is 1 it is actually the last day of the previous month
      switch (day[1]){//switching on month
        case 01: 
            day = (day[0] - 1) + '-' + "12" + '-' + "31";
          break;

        case 03: 
          if ((day[0] % 4 == 0) && (day[0] % 100 != 0) || (day[0] % 400 == 0)){
            day = day[0] + '-' + "02" + '-' + "29";
          } else {
            day = day[0] + '-' + "02" + '-' + "28";
          }
          
          break;

        case 05: case 07: case 08: case 10:
          day = day[0] + '-0' + (day[1] - 1) + '-' + "30";
          break;

        case 12:
          day = day[0] + '-' + (day[1] - 1) + '-' + "30";
          break;

          case 02: case 04: case 06: case 09:
        default:
          day = day[0] + '-0' + (day[1] - 1) + '-' + "31";
          break;
      }
    } else {
      day[2]-='1';
      if (day[2] <= 9){ day[2] = "0" + day[2];}
      day = day[0] + '-' + day[1] + '-' + day[2];
    }

  return day;
}

function addDay(eventDay) {
  eventDay = eventDay.split('-');
  switch(eventDay[1]) {
    case '01': case '03': case '05': case '07': case '08': case '10':
      if (eventDay[2] === '31')
        eventDay[2] = '0';
        var tempMonth = parseInt(eventDay[1]);
        eventDay[1] = (tempMonth + 1).toString();
      break;

    case '04': case '06': case '09': case '11':
      if (eventDay[2] === '30')
        eventDay[2] = '0';
        tempMonth = parseInt(eventDay[1]);
        eventDay[1] = (tempMonth + 1).toString();
      break;

    case '12':
      if (eventDay[2] === '31')
        eventDay[2] = '0';
        eventDay[1] = '1';
        var tempYear = parseInt(eventDay[0]);
        eventDay[0] = (tempYear + 1).toString();
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
  if (eventDay[1] <= 9)
    eventDay[1] = "0" + eventDay[1];
  eventDay = eventDay[0] + '-' + eventDay[1] + '-' + eventDay[2];
  console.log(eventDay);
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

  var id = 0;
	$(document).ready(function() {
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
      theme: false,
      weekends: false,
			selectable: true,
			selectHelper: true,
			select: function(start, end) {
				title = $("#firstName").val() + ' ' + $("#lastName").val();
				if (title) {
          popup3.open();
          $("#startDate").val(start.toISOString());
          $("#endDate").val(subtractDay(end.toISOString()));
				};
				$('#calendar').fullCalendar('unselect');
			},
      eventClick: function(event) {
        clickedID = event.id;
        $("#eventTitle").val(event.title);
        $("#eventDescription").val(event.description);
        $("#viewStartDate").val(removeTime(event.start.toISOString()));
        var tempEnd = removeTime(event.end.toISOString());
        $("#viewEndDate").val(subtractDay(tempEnd));
        $("#changeEventBtn").click(function () {
          event.title = $("#eventTitle").val();
          event.description = $("#eventDescription").val();
          event.start = $("#viewStartDate").val();
          event.end = addDay($("#viewEndDate").val());
          $('#calendar').fullCalendar('updateEvent', event);
          popup4.close();
        });
        popup4.open();
        return false;
      },
			editable: false,
			eventLimit: true, // allow "more" link when too many events

      dayClick: function(date) {
        $("#daysSelected").val(1);//Should be added to vacation balance calculator
      }
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
		});
    $("#addCloseBtn").click(function () {
      popup3.close();
    });
    $("#notifyBtn").click(function() {
      id+=1;
      eventData = {
        id: id,
        title: $("#createEventTitle").val(),
        start: $("#startDate").val(),
        end: endDay,
        description: $("#createEventDescription").val(),
//        url: 'click'
      };
      $('#calendar').fullCalendar('renderEvent', eventData, true);
      popup3.close();
      
      //ICS File
      startDay = $("#startDate").val().split('-');
      startDay = startDay[0] + startDay[1] + startDay[2];
      
      alert = $('input:radio[name=alert]:checked').val();
      isVacation = $('input:radio[name=isVacation]:checked').val();

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

      //dtstamp autogenerated?
      var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=Steven Angus ;RSVP=TRUE:MAILTO:steven.angus@gm.com\nATTENDEE;CN=Robert Kasper IV ;RSVP=TRUE:MAILTO:robert.kasperiv@gm.com\nORGANIZER;CN=Me:MAILTO:steven.angus@gm.com\nDTSTART:" + startDay +"\nDTEND:" + endDay +"\nLOCATION:OOO\nSUMMARY:Vacation - Steven Angus\nX-MICROSOFT-CDO-BUSYSTATUS:OOF\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Vacation\nTRIGGER:" + alert + "\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR";
        window.open( "data:text/calendar;charset=utf8," + escape(icsMSG));
    });
    $("#deleteBtn").click(function() {
      var ans = confirm("Are you sure you want to remove this event?");
      if (ans == true)
        $("#calendar").fullCalendar('removeEvents',clickedID);
        popup4.close();
    });
    $("#viewEventCloseBtn").click(function () {
      var ans = confirm("Are you sure you want to exit? All progress will be lost.");
      if (ans == true)
        popup4.close();
    })
	});
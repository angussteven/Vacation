/*
Function takes 2 dates and returns inclusive number of business days (no weekends/holidays)
Based off of Suitoku's formula.js library NETWORKDAYS function, license info:

Copyright (c) 2014 Sutoiku, Inc. - MIT License (below)

Other libraries included:
BESSELI, BESSELJ, BESSELK, BESSELY functions:
Copyright (c) 2013 SheetJS - MIT License (below)

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function vacationDays(start_date, end_date) {
  // call parseData to take inputs and convert to Date object
  start_date = parseDate(start_date);
  start_date = validStart(start_date);
  end_date = parseDate(end_date);

  // contants for weekends and holidays; holiday array should include all company holidays in string format "MM-DD-YYYY"
  weekend = [6,0]; // don't change this
  holidays = ["09-05-2016","11-08-2015","11-11-2016","11-24-2016","11-25-2016","12-26-2016","12-27-2016","12-28-2016","12-29-2016","12-30-2016"];

  // for loop parses holiday array into Date objects
  for (var i = 0; i < holidays.length; i++) {
    var h = parseDate(holidays[i]);
    holidays[i] = h;
  }

  // variables used in calculations
  var days = (end_date - start_date) / (1000 * 60 * 60 * 24) + 1;
  var total = days;
  var day = start_date;

  // for loop iterates for each day and decrements the total for each holiday or weekend day
  for (i = 0; i < days; i++) {
    var d = (new Date().getTimezoneOffset() > 0) ? day.getUTCDay() : day.getDay();
    var dec = false;
    if (d === weekend[0] || d === weekend[1]) {
      dec = true;
    }
    for (var j = 0; j < holidays.length; j++) {
      var holiday = holidays[j];
      if (holiday.getDate() === day.getDate() &&
        holiday.getMonth() === day.getMonth() &&
        holiday.getFullYear() === day.getFullYear()) {
        dec = true;
        break;
      }
    }
    if (dec) {
      total--;
    }
    day.setDate(day.getDate() + 1);
  }
  return total;
};

// function checks if start date has passed; if so, today's date is returned
function validStart(date) {
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  if(day < 10)
    day = '0' + day;
  if(month < 10)
    month = '0' + month;
  today = month + '-' + day + '-' + year;
  today = parseDate(today);

  if(date.getTime() < today.getTime())
    return today;
  else
    return date;
}

// function takes input and returns a Date object
function parseDate(date) {
  if (!isNaN(date)) {
    if (date instanceof Date) {
      return new Date(date);
    }
    var d = parseInt(date, 10);
    if (d < 0) {
      return null;
    }
    if (d <= 60) {
      return new Date(d1900.getTime() + (d - 1) * 86400000);
    }
    return new Date(d1900.getTime() + (d - 2) * 86400000);
  }
  if (typeof date === 'string') {
    date = new Date(date);
    if (!isNaN(date)) {
      return date;
    }
  }
  return null;
};

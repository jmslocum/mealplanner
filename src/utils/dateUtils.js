(function() {

  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'];

  /**
   * Get the start date of the month of the current date
   *
   * @return Date - the date object for the 1st of the month
   */
  function getStartOfTheMonthDate(currentDay) {
    var currentMonth = currentDay.getMonth();
    var currentYear = currentDay.getFullYear();
    return new Date(currentYear, currentMonth, 1);
  }

  /**
   * Get the end date for the month of the current date
   *
   * @return Date - the date object for the last of the month
   */
  function getEndOfTheMonthDate(currentDay) {
    var currentMonth = currentDay.getMonth() + 1;
    var currentYear = currentDay.getFullYear();

    if (currentMonth > 11){
      currentMonth %= 12;
      currentYear += 1;
    }

    return new Date(currentYear, currentMonth, 0);
  }

  function getStartOfNextMonthDate(d) {
    var currentMonth = d.getMonth() + 1;
    var currentYear = d.getFullYear();

    if (currentMonth > 11){
      currentMonth %= 12;
      currentYear += 1;
    }

    return new Date(currentYear, currentMonth, 1);
  }

  function getEndOfNextMonthDate(d) {
    var currentMonth = d.getMonth() + 2;
    var currentYear = d.getFullYear();

    if (currentMonth > 11){
      currentMonth %= 12;
      currentYear += 1;
    }

    return new Date(currentYear, currentMonth, 0);
  }

  function tomorrow(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }

  function yesterday(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  }

  function getStartOfWeek(d) {
    if (d.getDay() == 0) return d;
    
    var temp = d;
    while(temp.getDay() != 0) {
      temp = yesterday(temp);
    }

    return temp;
  }

  function getEndOfWeek(d) {
    if (d.getDay() == 6) return d;

    var temp = d;
    while(temp.getDay() < 6) {
      temp = tomorrow(temp);
    }

    return temp;
  }

  function getStartOfNextWeek(d) {
    var temp = getEndOfWeek(d);
    return tomorrow(temp);
  }

  function getEndOfNextWeek(d) {
    var temp = getStartOfNextWeek(d);
    for (i = 0; i < 6; i++) {
      temp = tomorrow(temp);
    }

    return temp;
  }

  //Export the functions
  module.exports = {
    getStartOfTheMonthDate : getStartOfTheMonthDate,
    getEndOfTheMonthDate : getEndOfTheMonthDate,
    getStartOfNextMonthDate : getStartOfNextMonthDate,
    getEndOfNextMonthDate : getEndOfNextMonthDate,
    tomorrow : tomorrow,
    yesterday : yesterday, 
    getStartOfWeek : getStartOfWeek,
    getEndOfWeek : getEndOfWeek,
    getStartOfNextWeek : getStartOfNextWeek,
    getEndOfNextWeek : getEndOfNextWeek
  }

})();

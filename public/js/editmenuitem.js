(function() {

  var allMeals = null;
  var allSides = null;

  $(document).ready(function() {
    fetchAllMeals();
    fetchAllSides();

    $('.menu-item').on('click', function(event) {
      var day = $(this).data('day');
      var mealId = $(this).find('span.meal-name').data('meal-id');
      var sides = [];

      $(this).find('span.side-name').each(function(i) {
        sides.push($(this).data('side-id'));
      });

      setCurrentMealSelection(mealId, sides, day);
        
      $('#overlay').toggle();        
    });

    $('#editMenuForm').on('reset', function(event) {
      $('#overlay').toggle();
    });

    $('#editMenuForm').on('submit', function(event) {
      var day = $('#dayIndex').val();
      var mealId = $('#mealSelection').val();
      var sideIds = $('#choosenSides').val();
      var menuId = $('#menu').data('menu-id');

      console.log('menuId: ' + menuId + ' day: ' + day + ' mealId: ' + mealId + ' sides: ' + JSON.stringify(sideIds));

      var postData = {
        'mealId' : mealId,
        'sideIds' : sideIds
      };

      $.ajax({
        url : '/menu/' + menuId + '/meal/' + day,
        method : 'POST',
        dataType : 'json',
        data : postData
      })
      .done(function(response) {
        window.location = '/menu/edit/' + menuId;
        $('#overlay').toggle();
      })
      .fail(function(error) {
        console.error('Unable to update menu for day: ' + day + ' error: ' + JSON.stringify(error));
        $('#overlay').toggle();
      });

      event.preventDefault();
    });
  });

  function fetchAllMeals() {
    $.ajax({
      url : '/meal/meals',
      method : 'GET',
      dataType : 'json'
    })
    .done(function(meals) {
      allMeals = meals;

      $.each(meals.meals, function(i, meal) {
        $('#mealSelection').append($('<option>', {
          value : meal._id,
          text : meal.name
        }));
      });
    })
    .fail(function(error) {
      console.error('Unable to fetch meals from API');
    });
  }

  function fetchAllSides() {
    $.ajax({
      url : '/meal/sides',
      method : 'GET',
      dataType : 'json'
    })
    .done(function(sides) {
      allSides = sides;
      
      $.each(sides.meals, function(i, side) {
        $('#choosenSides').append($('<option>', {
          value : side._id,
          text : side.name
        }));
      });

    })
    .fail(function(error) {
      console.error('Unable to fetch meals from API');
    });
  }

  function setCurrentMealSelection(mealId, sides, day) {
    if (mealId) {
      $('#mealSelection').val(mealId); 
    }

    if (sides && sides.length > 0) {
      $('#choosenSides').val(sides);
    }
    else {
      $('#choosenSides').val([]);
    }

    $('#dayIndex').val(day);
  }

})();

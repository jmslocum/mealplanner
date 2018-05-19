var configs = null;

/**
 * This is the main code that will run on page load
 */
$(document).ready(function() {
  //Fetch the configs for the editing the meals
  $.ajax({
    url : '/config/all',
    dataType : 'json'
  }).done(function(config) {
    configs = config;
    populateOptions(config);
  }).fail(function(error) {
    console.error('Unable to fetch config data');
  });

  //Attach the edit listener to the edit buttons
  $('.editMealButton').each(function() {
    $(this).on('click', function(event) {
      var id = $(this).closest('.mealCard').data('meal-id');

      $.ajax({
        url : '/meal/' + id,
        dataType : 'json',
        cache : false
      }).done(function(result) {
        populateEditForm(result.meal);
        $('#overlay').toggle();
      }).fail(function(error) {
        console.error('Unable to fetch meal data to edit. id=' + id);
      });

    });
  });

  //Attach the delete listener to the delete buttons
  $('.deleteMealButton').each(function() {
    $(this).on('click', function(event) {
      var id = $(this).closest('.mealCard').data('meal-id');

      $.ajax({
        url : '/meal/' + id,
        method : 'DELETE',
        dataType : 'json'
      }).done(function(data) {
        //Just refresh the page if the we deleted a meal
        location.reload();
      }).fail(function(error) {
        console.error('Unable to delete record');
      });

      event.preventDefault();
    });
  });

  //If the submit button is pressed on the edit form
  $('#newMealForm').on('submit', function(event) {
    var fields = $(this).serializeArray();
    var formData = new FormData();
    var id = $('#newMealForm').data().id;
    
    console.log('id is' + id);
    console.log(fields);
    
    populateFormData(formData, fields);
    
    $.ajax({
      url : '/meal/' + id,
      type : 'POST',
      data: formData,
      cache : false,
      contentType : false,
      processData : false
    }).done(function(meal) {
     $('#overlay').toggle();
      location.reload();
    }).fail(function(error) {
      console.error('Unable to update meal');
      $('#overlay').toggle();
    });

    event.preventDefault();
  });

  //If the cancel button is pressed on the edit form
  $('#mealCancelButton').on('click', function(event) {
    $('#overlay').toggle();
    resetForm();
  });

});

/**
 * This will populate the various selectable options on the edit page.
 * These options come from the config ajax on the server
 *
 * @param conifg - The config object that contains all of the default configurations
 */
function populateOptions(config) {
  populatePerferredDays(config.days);
  populateMealTypes(config.mealTypes);
  populateDifficulties(config.difficulties);
  populateSides();
}

/**
 * This will populate the perferred days selector with the 
 * proper configuration values. 
 *
 * @param days - The days config object
 */
function populatePerferredDays(days) {
  $.each(days, function(i, day) {
    $('#perferredDays').append($('<option>', {
      value : day.id,
      text : day.name
    }));
  });
}

/**
 * This will populate the meal types selector with the proper
 * configuration values
 *
 * @param mealTypes - the MealType config object
 */
function populateMealTypes(mealTypes) {
  $.each(mealTypes, function(i, mealType) {
    $('#mealType').append($('<option>', {
      value : mealType.value,
      text : mealType.name
    }));
  });
}

/**
 * This will populate the difficulties ratings with the proper
 * configuraiton values
 *
 * @param diff - The list of difficulties objects that a meal can have
 */
function populateDifficulties(diffs) {
  $.each(diffs, function(i, diff) {
    $('#mealDifficulty').append($('<option>', {
      value : diff.rank,
      text : diff.name
    }));
  });
}

/**
 * This will populate the side dishes that a meal can have
 */
function populateSides() {
  $.ajax({
    url : '/meal/sides',
    method : 'GET',
    dataType : 'json'
  })
  .done(function(data) {
    $.each(data.meals, function(i, meal) {
      $('#perferredSides').append($('<option>', {
        value : meal._id,
        text : meal.name
      }));
    });
  })
  .fail(function(error) {
    console.error('Unable to fetch sides');
  });
}

/**
 * When editing a meal, this will populate the form with the correct values
 * for the meal being currently edited. 
 *
 * @param meal - The meal object that is being edited
 */
function populateEditForm(meal) {
  console.log(meal);
  $('#newMealForm').data("id", meal._id);
  $('#mealName').val(meal.name);
  $('#mealDescription').val(meal.description);
  $('#mealType').val(meal.type);
  $('#mealDifficulty').val(meal.difficulty);
  $('#numberOfSides').val(meal.number_of_sides);
  $('#perferredDays').val(meal.perferred_days);
  if (meal.perferred_sides.length > 0){
    var sidesArray = [];
    $.each(meal.perferred_sides, function(i, side) {
      sidesArray.push(side._id);
    });
    $('#perferredSides').val(sidesArray);
  }

  prepopulateImages(convertImages(meal.images));
}

function convertImages(images) {
  var img = [];
  for (let image of images) {
    img.push({
      image_id : image._id,
      image_url : image.image_url
    });
  }

  return img;
}

/**
 * Populate the form data with the values from the form fields
 */
function populateFormData(formData, fields) {
  $.each(fields, function(i, field) {
    if (field.name === 'imageId') {
      formData.append('images', field.value); 
    }
    else if (field.name === 'perferredDays') {
      formData.append('perferredDays', field.value);
    }
    else if (field.name === 'perferredSides') {
      formData.append('perferredSides', field.value);
    }
    else {
      formData.append(field.name, field.value);
    }
  });

  return formData;
}

/**
 * clear the form of all data, and reset the picture container
 */
function resetForm() {
  $('#newMealForm').trigger('reset');
  $('#image-container').empty();
  $('input[name="imageId"]').remove();
}

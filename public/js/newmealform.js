$(document).ready(function() {
  $.ajax({
    url : '/config/days',
    dataType : 'json'
  }).done(function(days) {
    $.each(days, function(i, day) {
      $('#perferredDays').append($('<option>', {
        value : day.id,
        text : day.name
      }));
    });
  }).fail(function(error) {
    console.error(error); 
  });

  $.ajax({
      url : '/config/mealTypes',
      dataType : 'json'
    }).done(function(mealTypes) {
      $.each(mealTypes, function(i, mealType) {
        $('#mealType').append($('<option>', {
          value : mealType.value,
          text : mealType.name
        }));
      });
    }).fail(function(error) {
      console.error(error); 
    });
  
  $.ajax({
      url : '/config/difficulties',
      dataType : 'json'
    }).done(function(diffs) {
      $.each(diffs, function(i, diff) {
        $('#mealDifficulty').append($('<option>', {
          value : diff.rank,
          text : diff.name
        }));
      });
    }).fail(function(error) {
      console.error(error); 
    });

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


  $('#mealType').change(function(e) {
    if (e.target.value === 'side') {
      $('#meal-difficulty-group').hide();
      $('#perferred-sides-group').hide();
      $('#number-of-sides-group').hide();
      $('#perferred-days-group').hide();
    }
    else {
      $('#meal-difficulty-group').show();
      $('#perferred-sides-group').show();
      $('#number-of-sides-group').show();
      $('#perferred-days-group').show();
    }
  });

  $('#newMealForm').on('submit', function(event) {
    var fields = $(this).serializeArray();
    var formData = new FormData(); 
    populateFormData(formData, fields);

    $.ajax({
      url : '/meal/new',
      type : 'POST', 
      data : formData,
      cache : false,
      contentType : false,
      processData : false
    })
    .done(function(response) {
      postNotification('New meal created successfully!', false);
    })
    .fail(function(error) {
      postNotification('Failed to create new meal', true);
    });

    event.preventDefault(); 
  });
});

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

function postNotification(text, isError) {
  var notification = $('#notification');
  notification.empty();
  notification.text(text);

  if (isError) {
    notification.removeClass('alert-success');
    notification.addClass('alert-danger');
  }
  else {
    resetForm();
    notification.removeClass('alert-danger');
    notification.addClass('alert-success');
  }

  notification.animate({opacity : 1.0}, 'slow', 'swing', function() {
    setTimeout(function() {
      notification.animate({opacity : 0.0}, 'slow');
    }, 5000);
  });

  $('html, body').animate({scrollTop: 0 }, "fast");
}

function resetForm() {
  $('#newMealForm').trigger('reset');
  $('#image-container').empty();
  $('input[name="imageId"]').remove();
  $('#meal-difficulty-group').show();
  $('#perferred-sides-group').show();
  $('#number-of-sides-group').show();
  $('#perferred-days-group').show();
}

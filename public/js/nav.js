$(document).ready(function() {
  $('#generateWeekLink').on('click', function(event) {
    $.ajax({
      url : '/menu/new/week',
      method : 'GET',
      dataType : 'json'
    })
    .done(function(response) {
      //On success, redirect to the edit page to make adjustments
      if (response.success) {
        var id = response.menu._id;
        window.location.replace('/menu/edit/' + id);
      }
    })
    .fail(function(error) {
      console.error('Unable to build new menu: ' + JSON.stringify(error));
    });

    event.preventDefault();
  });
});


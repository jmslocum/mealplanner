$(document).ready(function() {
  $('.menu-row').on('click', function(event) {
    if ($(event.target).is('button.deleteMealButton')){
      return;
    }

    var id = $(this).data('menu-id');
    document.location.href = '/menu/edit/' + id;
  });

  $('button.deleteMealButton').on('click', function(event) {
    var id = $(this).closest('.menu-row').data('menu-id');
    
    $.ajax({
      url : '/menu/' + id,
      method : 'DELETE',
      dataType : 'json'
    })
    .done(function(response) {
      //Just reload the edit page
      location.reload();
    })
    .fail(function(error) {
      console.error('Unable to delete meal: ' + JSON.stringify(error));
    });

    event.preventDefault();
  });
});

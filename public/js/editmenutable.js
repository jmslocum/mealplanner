$(document).ready(function() {
  $('.menu-row').on('click', function(event) {
    var id = $(this).data('menu-id');
    document.location.replace('/menu/edit/' + id);
  });
});

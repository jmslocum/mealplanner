$(document).ready(function() {
  $('#image-selector').change(function(e) {
    var element = e.target;
    var formData = new FormData();
    formData.append('imageFile', element.files[0]);
    $.ajax({
      url : '/image/upload',
      type : 'POST',
      data : formData,
      cache : false,
      contentType : false,
      processData : false
    })
    .done(function(response) {
      $('#image-container').append(getImage(response));  
      $('#image-upload-display').after(getHiddenInput(response));
    })
    .fail(function(error) {
      console.error("Unable to upload image");
    });
  });
});

function getImage(image) {
  var image = '<img src="' + image.image_url + '" class="img-thumbnail" />';
  return image; 
}

function getHiddenInput(image) {
  var input = '<input type="hidden" name="imageId" value="';
  input += image.image_id;
  input += '" />';
  return input;
}

function getTableRow(image) {
  var table_row = '<tr>';
  table_row += '<td>' + image.image_id + '</td>';
  table_row += '<td>' + image.image_url + '</td>';
  table_row += '<td><img class="img-thumbnail" src="' + image.image_url + '" /></td>';
  table_row += '</tr>';
  return table_row;
}

function prepopulateImages(images) {
  $.each(images, function(i, image) {
    $('#image-container').append(getImage(image));  
    $('#image-upload-display').after(getHiddenInput(image));
  });
}



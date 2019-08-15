let freezerInventory = [];

function fetchFreezerInventory() {
  $.ajax({
    url: '/inventory/all',
    dataType : 'json'
  }).done((inventory) => {
    freezerInventory = inventory.items;
    populateFreezerInventory(freezerInventory);
  }).fail((error) => {
    console.error('Unable to fetch the freezer inventory');
  });
}

/**
 * This function will add the inventory data to the table
 */
function populateFreezerInventory(inventory) {
  $.each(inventory, (i, item) => {
    let newRow = $(buildInventoryTableRow(item));
    $('#inventory-item-table > tbody').append(newRow);
    attachButtonListeners(newRow);
  });
}

function buildInventoryTableRow(item) {
  var tableRow = '<tr class="item-row" data-item-id="' + item._id + '">';
  tableRow += '<td>' + item.name + '</td>';
  tableRow += '<td class="item-count">' + item.count + '</td>';
  tableRow += '<td><a class="increase-inventory"><i class="far fa-arrow-alt-circle-up fa-2x"></i></a>';
  tableRow += '<a class="decrease-inventory"><i class="far fa-arrow-alt-circle-down fa-2x"></i></a>'; 
  tableRow += '<a class="delete-item text-danger"><i class="delete-item fas fa-trash fa-2x"></i></a></td>';

  return tableRow;
}

function attachButtonListeners(itemRowElement) {
   //increase count
  itemRowElement.find('.increase-inventory').on('click', (e) => {
    let row = $(e.target).closest('.item-row');
    let countElement = row.find('.item-count');
    let id = row.data('item-id');
    let count = parseInt(countElement.text());
    updateItemById(id, count+1, countElement);
    e.preventDefault();
  });

  //decrease count
  itemRowElement.find('.decrease-inventory').on('click', (e) => {
    let row = $(e.target).closest('.item-row');
    let countElement = row.find('.item-count');
    let id = row.data('item-id');
    let count = parseInt(countElement.text());
    updateItemById(id, count-1, countElement);
    e.preventDefault();
  });

  //delete item
  itemRowElement.find('.delete-item').on('click', (e) => {
    let row = $(e.target).closest('.item-row');
    let id = row.data('item-id');
    deleteItemById(id, row);
    e.preventDefault();
  });
}

function setUpControls() {
  //add new item
  $('#new-inventory-input').on('change', (e) => {
    let textElement = $(e.target);
    let name = textElement.val();
    textElement.val("");
    createNewItem(name);
    e.preventDefault();
  });
}

function updateItemById(id, count, countElement) {
  let formData = new FormData();
  formData.append('count', count);

  $.ajax({
    url : '/inventory/' + id,
    method : 'POST',
    data: formData,
    cache: false,
    processData: false,
    contentType: false
  }).done((response) => {
    countElement.html(response.count); 
  }).fail((error) => {
    console.error(error);
  });
}

function deleteItemById(id, rowElement) {
  $.ajax({
    url : '/inventory/' + id,
    type : 'DELETE',
    cache: false
  }).done((response) => {
    //Remove the row from the table
    rowElement.remove();
  }).fail((error) => {
    console.error(error);
  });
}

function createNewItem(name) {
  let formData = new FormData();
  formData.append('name', name);
  formData.append('count', 1);

  $.ajax({
    url : '/inventory/new',
    method : 'POST',
    data : formData,
    cache : false,
    processData: false,
    contentType: false
  }).done((response) => {
    let newRow = $(buildInventoryTableRow(response.item));
    $('#inventory-item-table > tbody').append(newRow);
    attachButtonListeners(newRow);
  }).fail((error) => {
    console.error(error);
  });
}

/**
 * runs when the document loads
 */
$(document).ready(() => {
  fetchFreezerInventory();
  setUpControls();
});

// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function(){
	$('.product-table').DataTable();
}
$(document).on('turbolinks:load',ready);
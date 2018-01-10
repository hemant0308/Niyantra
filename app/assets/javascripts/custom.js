var custom_ready = function () {
  $('.numerical').numeric();
  AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
  $('.loader').hide();
}
$(document).on('turbolinks:load',custom_ready);
$(document).on('turbolinks:click',function(){
  $('.loader').show();
});
$(document).ready(function(){

})
var AUTH_TOKEN;

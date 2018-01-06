var ready = function () {
  $('.numerical').numeric();
  AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
  $('.loader').hide();
}
$(document).on('turbolinks:load',ready);
$(document).on('turbolinks:click',function(){
  $('.loader').show();
});
$(document).ready(function(){
  $('.loader').hide();
})
var AUTH_TOKEN;

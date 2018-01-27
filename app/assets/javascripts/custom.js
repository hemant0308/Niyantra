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
	
});
$.fn.fullScreen = function(){
  	if($(this)[0].requestFullscreen)
		$(this)[0].requestFullscreen();
	else if($(this)[0].mozRequestFullScreen)
		$(this)[0].mozRequestFullScreen();
	else if($(this)[0].webkitRequestFullscreen)
		$(this)[0].webkitRequestFullscreen();
	else if($(this)[0].msRequestFullscreen)
		$(this)[0].msRequestFullscreen();
	return this;
};
var AUTH_TOKEN;
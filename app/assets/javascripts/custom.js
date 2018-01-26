var datatable;
var AUTH_TOKEN;
var custom_ready = function () {
  $('.numerical').numeric();
  AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
  $('.loader').hide();
}
$(document).ready(custom_ready);
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
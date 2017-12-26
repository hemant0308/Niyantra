// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready;
ready = function(){
	var building = false;
	$('#stock_product_count').change(function(event){
		window.alert('asdf');
		var count = parseInt($(this).val());
		if(count <=0 || count >50  || building){
			return;
		}
		if(!count){
			count = 1;
		}
		var cur_cnt = $('#stock_products tr').length;
		if(cur_cnt < count){
			for(var i=cur_cnt;i<count;i++){
				var $tr = $('#stock_products tr:first-child').clone();
				$($tr).removeClass('d-none');	
				$('#stock_products').append($tr);
			}			
		}else{
			$($('#stock_products tr').slice(count,cur_cnt+1)).remove();
		}

		building = false;
	})
}
$(document).on('turbolinks:load',ready);
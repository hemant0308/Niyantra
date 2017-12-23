// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function(){
	var building = false;
	$('#stock_product_count').keyup(function(event){
		var count = parseInt($(this).val());
		if(count <=0 || count >50  || building){
			return;
		}
		if(!count){
			count = 1;
		}
		building =true;
		var $tr = $('#stock_products tr:first-child').clone();
		$('#stock_products').html('');
		for(var i=0;i<count;i++){	
			$('#stock_products').append($tr);	
			$tr = $('#stock_products tr:first-child').clone();
		}	
		building = false;
	})
})
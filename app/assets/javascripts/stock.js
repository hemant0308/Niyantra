// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready;
ready = function(){
	$(".spinner").show();
	var building = false;
	$('#stock_product_count').change(function(event){
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
	});
	$('#stock_form').validate({

			errorClass:'invalid-feedback',
			validClass:'is-valid',
			focusCleanup : true,
			onkeyup: false,
    	onfocusout: false,
			focusInvalid : false,
			success:function(label,ele){$(ele).removeClass('is-invalid').addClass('is-valid');
							var id = $(ele).attr('id');
							$('#'+id+'-error').remove();
			},
			rules:{
				'stock[supplier_name]':{required:true},
				'stock[quantity]':{required:true,productCount:true},
				'stock[total_price]':{required:true},
				'stock[paid_amount]':{required:true},
				'stock[product_count]':{required:true},
				'product[][product_id]':{required:true},
				'product[][current_price]':{required:true},
				'product[][quantity]':{required:true},
				'product[][offer]' : {
					required:function(ele){
										return $(ele).closest('tr').find('#offer_type').val() != '';
									}
					}
			},
			highlight : function(ele,errorClass){
			          $(ele).addClass('is-invalid');
			        },
	});
	$('.effective-date').datepicker({
		autoclose:true,
		onSelect : function(date,ele){
			$(this).datepicker('hide');
		}
	}
	);
	$('.product-id').select2({
		ajax: {
			url : '/stock/getproducts',
			data : function(params){
				var query = {
					search :params.term,
					page: params.page || 1
				}
				return query;
			}
		}
	});
	jQuery.validator.addMethod('productCount',function(value,element){
		var total = parseInt($('#stock_total_quantity').val());
		$('.product-quantity').each(function(){
			total -=parseInt($(this).val());
		})
		return total == 0;
	},"Total Quantity not equals to each product qunatity.");
	$('#stock_table').DataTable({
		ajax : {
			url:'/getstocks',
			type : 'POST',
			data : {'authenticity_token':AUTH_TOKEN}
		}
	});
}
$(document).on("turbolinks:click", function(){
  $(".spinner").show();
});
$(document).on('turbolinks:load',ready);

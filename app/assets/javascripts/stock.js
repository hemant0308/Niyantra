// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready;
ready = function(){
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
				var new_element = $("<tr><td><select name='product[][product_id]' id='' class='form-control product-id is-valid'></select></td><td><input type='text' name='product[][current_price]' id='' value='' class='form-control numerical current_price'></td><td><select name='product[][offer_type]' id='' class='form-control numerical offer-type'><option value=''>select offer type</option><option value='1'>discount</option><option value='2'>cutoff</option></select></td><td><input type='text' name='product[][offer]' id='' value='' class='form-control numerical offer'></td><td><input type='text' name='product[][effective_date]' id='' value='' class='form-control effective-date'></td><td><input type='text' name='product[][quantity]' id='' value='' class='form-control numerical product-quantity'></td></tr>").appendTo('#stock_products');
				makeReady(new_element);
			}
			validator.destroy();
			validator = validateForm();
		}else{
			$($('#stock_products tr').slice(count,cur_cnt+1)).remove();
		}
		building = false;
	});
	validator = validateForm();
	makeReady('#stock_products tr:first-child');
	function validateForm(){
		var validator =
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
			jQuery.validator.addMethod('productCount',function(value,element){
				var total = parseInt($('#stock_total_quantity').val());
				$('.product-quantity').each(function(){
					total -=parseInt($(this).val());
				})
				return total == 0;
			},"Total Quantity not equals to each product qunatity.");
			return validator;
	}

	function makeReady(ele){
		$(ele).find('.effective-date').datepicker({
			autoclose:true,
			onSelect : function(date,ele){
				$(this).datepicker('hide');
			}
		}
		);
		$(ele).find('.product-id').select2({
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
	}

	datatable = $('#stock_table').DataTable({
		ajax : {
			url:'/getstocks',
			type : 'POST',
			data : {'authenticity_token':AUTH_TOKEN}
		}
	});
	$(document).on('turbolinks:before-cache',function(){
		if(typeof datatable !== 'undefined'){
			datatable.destroy();
		}
	})
}
$(document).on('turbolinks:load',ready);

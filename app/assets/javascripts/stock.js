// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready;
ready = function(){
	var building = false;
	/*$('#stock_product_count').change(function(event){
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
				
				makeReady(new_element);
			}
			validator.destroy();
			validator = validateForm();
		}else{
			$($('#stock_products tr').slice(count,cur_cnt+1)).remove();
		}
		building = false;
	});*/
	$(document).on('click','.add-prod',function(){
			var new_element = $("<div class='row mb-4'><div class='col-md-2'><label for='product_id'>product</label></div><div class='col-md-4'><select name='product[][product_id]' id='' class='form-control product-id'></select></div><div class='col-md-2'><label for='quantity'>Quantity</label></div><div class='col-md-3'><input type='text' name='product[][quantity]' id='quantity' value='' class='form-control is-valid'></div><div class='col-md-1'><button class='btn btn-primary btn-pill p-2 add-prod' type='button'><span class='fa fa-plus'></span></button><button class='btn btn-danger btn-pill p-2 d-none del-prod' type='button'><span class='fa fa-minus'></span></button></div></div>").appendTo('#stock_products');
			makeReady(new_element);
			var eles = $('#stock_products div.row:not(:last-child)');
			$(eles).find('.del-prod').removeClass('d-none');
			$(eles).find('.add-prod').addClass('d-none');
	});
	$(document).on('click','.del-prod',function(){
			$(this).closest('div.row').remove();
	})
	validator = validateForm();
	makeReady('#stock_products div.row:first-child');
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
						'stock[quantity]':{required:true},
						'stock[total_price]':{required:true,greaterThan:'#stock_paid_amount'},
						'stock[paid_amount]':{required:true,lessThan:"#stock_total_price"},
						'product[][product_id]':{required:true},
						'product[][quantity]':{required:true},
					},
					highlight : function(ele,errorClass){
										$(ele).addClass('is-invalid');
									},
			});
			$.validator.addMethod("greaterThan",function (value, element, param) {
          		var $otherElement = $(param);
          		return parseInt(value, 10) >= parseInt($otherElement.val(), 10);
    		},"Wrong entry");
    		$.validator.addMethod("lessThan",function (value, element, param) {
          		var $otherElement = $(param);
          		return parseInt(value, 10) <= parseInt($otherElement.val(), 10);
    		},"Wrong entry");
			return validator;
	}

	function makeReady(ele){
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
			},
			'width':'100%'
		});
	}

	datatable = $('#stock_table').DataTable({
		ajax : {
			url:'/getstocks',
			type : 'POST',
			data : {'authenticity_token':AUTH_TOKEN}
		},
		"columnDefs": [{
                "render": function(data,type,row){
                 return "<btn class='btn btn-success view-prod p-2' data-id='"+data+"'>view</div>";},
                "targets": -1,
            }]
	});
	$('#stock_supplier_id').select2({
		tags:true,
		'width':'100%'
	})

}
$(document).ready(ready);

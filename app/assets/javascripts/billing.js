ready = function(){
  $('#noted_customer').on('change',function(){

    if($(this).prop('checked')){
      $('#customer_name_input').autocomplete({
        source : '/billing/get_customers',
        minlength : 1,
        select : function(event,ui){
          var item = ui.item.data
          $('#customer_name_select').val(item.name);
          $('#bill_customer_phone').val(item.phone);
          $('#bill_customer_email').val(item.email);
          $('#bill_customer_address').val(item.address)
          $('#bill_customer_id').val(item.id);
        }
      })
    }else{
      $('#customer_name_input').autocomplete('destroy');
    }

  });
  $('#product_code').keyup(function(event){
    var code = $(this).val();
    if(code.length==6){
      $.ajax({
        'url':'/billing/get_product',
        'method':'get',
        'data' : 'code='+code,
        success:function(data){
          addProduct(data);
        }
      });
      last = code
    }
  });
  $('#product_code').keypress(function(event){
    if(event.keyCode >= 48 && event.keyCode <= 122){
      if($(this).val().length==6){
        event.preventDefault();
      }
    }
  });
  shortcut.add('F4',function(){
    $('#billing_form').submit();
  });
  $(document).keydown(function(event){
    if(event.keyCode == 115){
      event.stopPropagation();
    }
  })
  $('#billing_form').validate({
    errorClass:'invalid-feedback',
    validClass:'is-valid',
    focusCleanup : true,
    onkeyup: false,
    onfocusout: false,
    focusInvalid : false,
    highlight : function(ele,errorClass){
              $(ele).addClass('is-invalid');
            },
    success:function(label,ele){$(ele).removeClass('is-invalid').addClass('is-valid');
            var id = $(ele).attr('id');
            $('#'+id+'-error').remove();
    },
    rules:{
      'bill[customer][name]':{required:function(){
            return $('#noted_customer').prop('checked');
          }
        },
      'bill[customer][phone]':{required:function(){
        return $('#noted_customer').prop('checked');
      }},
    },
  })
  function addProduct(data){
    if(data){
      if(!data.is_available){
        window.alert('out of stock');
        $('#product_code').val('');
        return;
      }
      var html = '';
      var id = data.id;
      var quantity = "<input type='text' class='form-control numerical quantity' name='quantity["+id+"]' value='1'>";
      html = "<tr id='product_"+id+"' data-id='"+id+"' data-price='"+data.current_price+"' data-offer='"+data.offer+"'><td><input type='hidden' name='product[]' value='"+id+"'>"+data.name+"</td><td>"+data.description+"</td><td>"+quantity+"</td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='price'>"+data.current_price+"</span></td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='offer'>"+data.offer+"</span></td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='net-price'>"+data.net_price+"</span></td></tr>";
      $('#bill_products').prepend(html);
      $('#product_'+id+' .numerical').numeric();
      $('#product_code').val('');
    }else{
      window.alert($('#product_code').val()+' invalid !');
      $('#product_code').val('');
    }
  }
  $(document).on('keyup','.quantity',function(){
    calculate($(this).closest('tr').data('id'));

  });
  $(document).on('change','.quantity',function(){
    if($(this).val() == ''){
      $(this).val('1');
      calculate($(this).closest('tr').data('id'));
    }
  });
  function calculate(id){
      var parent = $('tr#product_'+id);
      var quantity = $(parent).find('.quantity').val();
      if(quantity == ''){
        return;
      }
      quantity = parseInt(quantity);
      var price = parseInt($(parent).data('price'));
      var offer = parseInt($(parent).data('offer'));
      $(parent).find('.price').html(quantity*price);
      $(parent).find('.offer').html(quantity*offer);
      $(parent).find('.net-price').html(quantity*(price-offer));
  }
}
$(document).on('turbolinks:load',ready);

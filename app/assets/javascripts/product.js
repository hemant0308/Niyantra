// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function(){
  $('#properties').select2({
    ajax: {
      url : '/product/get_properties',
      data : function(params){
        var query = {
          search :params.term,
          page: params.page || 1
        }
        return query;
      }
    },
    width:'100%'
  });
  $('#properties').on('select2:select',function(e){
    var options = e.params.data.data;
    a=e
    var id = e.params.data.id
    var name = e.params.data.text;
    var ele = $('#properties_table tbody');
    var input;
    if(options != false){
      input = "<select class='form-control' name='product[property["+id+"]]'>";
      for(var i=0;i<options.length;i++){
        input += "<option value='"+options[i]+"'>"+options[i]+"</option>";
      }
      input += "</select>";
    }else{
      input = "<input type='text' class='form-control'  name='product[property["+id+"]]'>";
    }
    var html = "<tr id='property_"+id+"'><td>"+name+"</td><td>"+input+"</td></tr>";
    $(ele).append(html);
    $('#properties_table').parent().removeClass('d-none');

  });
  $('#properties').on('select2:unselect',function(e){
    var id = e.params.data.id;
    $('#property_'+id).remove();
  })
  /*  function split( val ) {
      return val.split( /,\s );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }

    $( "#properties" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
      	minLength : 1,
        source: function( request, response ) {
          $.ajax({
          	url : '/product/getProperties',
          	dataType : 'json',
          	method : 'get',
          	data : {q:extractLast(request.term)},
          	success : function(data){
          		response(data)
          	}
          })
        },
        search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 1 ) {
            return false;
          }
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join( ", " );
          var options = ui.item.data
          a=options;
          var ele = $('#properties_table tbody');
          var input;
          if(options != false){
            input = "<select class='form-control' name='product[property["+ui.item.id+"]]'>";
            for(var i=0;i<options.length;i++){
              input += "<option value='"+options[i]+"'>"+options[i]+"</option>";
            }
            input += "</select>";
          }else{
            input = "<input type='text' class='form-control'  name='product[property["+ui.item.id+"]]'>";
          }
          var html = "<tr><td>"+ui.item.value+"</td><td>"+input+"</td></tr>";
          $(ele).append(html);
          $('#properties_table').parent().removeClass('d-none');
          return false;
        }
      });
      */

      $('#product_table').DataTable({
        ajax : {
          url:'/getProducts',
          type : 'POST',
          data : {'authenticity_token':AUTH_TOKEN}
        }
      });
    /*  $('#product_form').on('submit',function(event){
        var is_valid = true;
        $(this).find('input,select').each(function(){
          if($(this).val()==''){
            is_valid = false;
            $(this).addClass('is-invalid');
            return false;
          }
          if($(this).hasClass('double')){
            if(!isDouble($(this).val())){
              is_valid = false;
              $(this).addClass('is-invalid');
              return false;
            }
          }
        });
        if(!is_valid){
          event.preventDefault();
          return false;
        }
      });
      $('#product_form').find('input').keyup(function(){
        var is_valid = true
        if($(this).val().length <= 0){
          is_valid = false;
        }
        if($(this).hasClass('double') && !isDouble($(this).val())){
          is_valid = false;
        }
        if(is_valid){
          $(this).addClass('is-valid');
          $(this).removeClass('is-invalid');
        }else{
          $(this).addClass('is-invalid');
          $(this).removeClass('is-valid');
        }
      })
      function isDouble(ele){
        var regex = /^\d+.?\d*$/
        if(ele.match(regex) == null){
          return false;
        }
        return true;
      }*/
      $('#product_form').validate({
        errorClass:'invalid-feedback',
        validClass:'is-valid',
        onkeyup : false,
  			onkeyup: false,
      	onfocusout: false,
  			focusInvalid : false,
        focusCleanup: true,
        success:function(label,ele){$(ele).removeClass('is-invalid').addClass('is-valid');
        							var id = $(ele).attr('id');
        							$('#'+id+'-error').remove();
        			},
        rules:{
          'product[name]':{required:true},
          'product[brand_id]' : {required:true},
          'product[type_id]' : {required:true},
          'product[current_price]':{required:true},
          'product[offer]':{
            required:function(ele){
              return $('#product_offer_type').val() != '';
            },
            validOffer : {'type':$('#product_offer_type'),'amount':$('#product_current_price')}
          }
        },
        highlight : function(ele,errorClass){
          $(ele).addClass('is-invalid');
        },
      });
      jQuery.validator.addMethod('validOffer',function(value,element,params){
    		var offer = parseInt($(element).val());
        var type = parseInt($(params['type']).val());
        var total = parseInt($(params['amount']).val());
        if(type == 1){
          return offer<100 && offer >0
        }else if(type == 2){
          return offer<total && offer > 0;
        }else{
          return true;
        }

    	},"Invalid offer value");

}
$(document).on('turbolinks:load',ready);

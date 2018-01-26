// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function() {
    $('#properties').select2({
        ajax: {
            url: '/product/get_properties',
            data: function(params) {
                var query = {
                    search: params.term,
                    page: params.page || 1
                }
                return query;
            }
        },
        width: '100%'
    });
    $('#product_brand_id,#product_type_id').select2({ width: '100%' });
    $('#properties').on('select2:select', function(e) {
        var options = e.params.data.data;
        a = e
        var id = e.params.data.id
        var name = e.params.data.text;
        buildProperty(id,name,options);
    });
    $('#properties').on('select2:unselect', function(e) {
        var id = e.params.data.id;
        $('#property_' + id).remove();
    });
    function buildProperty(id,name,options,value=''){

        var ele = $('#properties_table tbody');
        var input;
        if (options != false) {
            input = "<select class='form-control' name='product[property[" + id + "]]'>";
            for (var i = 0; i < options.length; i++) {
                var selected = (options[i]==value)?'selected':''
                input += "<option value='" + options[i] + "'"+selected+" >" + options[i] + "</option>";
            }
            input += "</select>";
        } else {
            input = "<input type='text' class='form-control'  name='product[property[" + id + "]]'>";
        }
        var html = "<tr id='property_" + id + "'><td>" + name + "</td><td>" + input + "</td></tr>";
        $(ele).append(html);
        $('#properties_table').parent().removeClass('d-none');
    }
    if(typeof product_datatable != 'undefined'){
        product_datatable.destroy();
    }
    product_datatable = datatable = $('#product_table').DataTable({
        ajax: {
            url: '/get_products',
            type: 'POST',
            data: { 'authenticity_token': AUTH_TOKEN }
        },
        "columnDefs": [{
                "render": function(data,type,row){
                 return "<form method='post' class='table-btn-container' action='/product/delete'><input type='hidden' name='authenticity_token' value='"+AUTH_TOKEN+"'><input type='hidden' name='id' value='"+data+"'><div class='table-btn edit-prod'><span class='fa fa-pencil-square-o text-success'></span></div><div class='table-btn del-prod'><span class='fa fa-trash-o text-info'></span></div></form>";},
                "targets": -1,
            },
            {
                "targets": [3, 4, 9],
                "orderable": false
            },
            {
                "render": function(data, type, row) {

                  return "<span class='fa fa-inr'></span> " + parseFloat(data).toFixed(2);
                },
                "createdCell": function(td, cellData, rowData, row, col) {
                    $(td).addClass('text-right');
                },
                "targets": -5
            }
        ],
        "createdRow": function(row, data, dataIndex) {
            $(row).data('id', data[data.length - 1]);
        }
    });
    $(document).on('click','.edit-prod',function(){
      var id = $(this).closest('tr').data('id');
      $.ajax({
        url : '/product/get_product_info',
        data : 'id='+id,
        type : 'GET',
        dataType : 'json',
        success:function(data){
          product = data.product
          $('#product_name').val(product.name);
          if(product.brand_id){
            $('#product_brand_id').select2('val',product.brand_id.toString()
            );
          }
          if(product.type_id){
            $('#product_type_id').select2('val',product.type_id.toString());  
          }
          
          $('#product_current_price').val(product.current_price);
          $('#product_offer_type').val(product.offer_type);
          $('#product_offer').val(product.offer);
          $('#product_id').val(product.id);
          var properties = data.properties;
          var property_values = data.property_values
          var properties_text = '';
          $('#properties_table tbody').html('');
          for(var i=0;i<property_values.length;i++){
            var id = property_values[i].property_id;
            var value = property_values[i].value;
            var name = properties[id].name
            properties_text += "<option value='"+id+"' selected>"+name+"</option>";
            var data = properties[id].data;
            var options = (properties[id].is_referenced == 1)?(data.split(',')):false;
            buildProperty(id,name,options,value);
          }

          $('#properties').html(properties_text);
          $('#product_modal').modal('show');
        }
      })
    });
    $(document).on('click','.del-prod',function(){
      if(window.confirm('Are you sure')){
        $(this).parent().submit();

      }
    })
    $('#product_form').validate({
        errorClass: 'invalid-feedback',
        validClass: 'is-valid',
        onkeyup: false,
        onkeyup: false,
        onfocusout: false,
        focusInvalid: false,
        focusCleanup: true,
        success: function(label, ele) {
            $(ele).removeClass('is-invalid').addClass('is-valid');
            var id = $(ele).attr('id');
            $('#' + id + '-error').remove();
        },
        rules: {
            'product[name]': { required: true },
            'product[brand_id]': { required: true },
            'product[type_id]': { required: true },
            'product[current_price]': { required: true },
            'product[offer]': {
                required: function(ele) {
                    return $('#product_offer_type').val() != '';
                },
                validOffer: { 'type': $('#product_offer_type'), 'amount': $('#product_current_price') }
            }
        },
        highlight: function(ele, errorClass) {
            $(ele).addClass('is-invalid');
        },
    });
    jQuery.validator.addMethod('validOffer', function(value, element, params) {
        var offer = parseInt($(element).val());
        var type = parseInt($(params['type']).val());
        var total = parseInt($(params['amount']).val());
        if (type == 1) {
            return offer < 100 && offer > 0
        } else if (type == 2) {
            return offer < total && offer > 0;
        } else {
            return true;
        }

    }, "Invalid offer value");

}
$(document).on('turbolinks:load', ready);
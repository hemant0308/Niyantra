ready = function(){
  $('#noted_customer').on('change',function(){

    if($(this).prop('checked')){
      $('#customer_name_select').select2({
        ajax: {
          url : '/billing/getcustomers',
          data : function(params){
            var query = {
              search :params.term,
              page: params.page || 1
            }
            return query;
          }
        },
        width:'100%',
        multiple : 'multiple'
      });
      $('#customer_name_select').removeClass('d-none').removeAttr('disabled');
      $('#customer_name_input').addClass('d-none').attr('disabled',true);
    }else{
      $('#customer_name_select').select2('destroy');
      $('#customer_name_select').addClass('d-none').attr('disabled',true);
      $('#customer_name_input').removeClass('d-none').removeAttr('disabled');
    }

  })
}
$(document).on('turbolinks:load',ready);

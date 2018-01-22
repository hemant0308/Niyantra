// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function(){
	$('#customers_table').DataTable({
		ajax:{
			url:'/get_customers',
          	type : 'POST',
          	data : {'authenticity_token':AUTH_TOKEN }
		},
		"columnDefs": [{
     		"data": null,
      		"defaultContent": "<div class='table-btn add-trans'><span class='fa fa-money text-success'></span></div><div class='table-btn view-trans'><span class='fa fa-eye text-info'></span></div>",
      		"targets": -1,
      		"createdCell":  function (td, cellData, rowData, row, col) {
           		$(td).addClass('p-0'); 
        	   },
          },
          {
            "targets":[1,2,3,5],
            "orderable":false
          },   
          {
            "render": function ( data, type, row ) {
                    return "<span class='fa fa-inr'></span> "+data;
                },
             "createdCell":  function (td, cellData, rowData, row, col) {
                              $(td).addClass('text-right'); 
                            },
                "targets": -2
          }
    	],
    	"createdRow": function( row, data, dataIndex ) {
      			$(row).data('id',data[data.length-1]);
            $(row).data('due',data[4]);
            $(row).data('name',data[0]);
  		}
	});
  $(document).on('click','.view-trans',function(){
    var current = $('#view_trans').attr('data-current');
    var row = $(this).closest('tr');
    var id = $(row).data('id');
    var name = $(row).data('name');
    var due = $(row).data('due');
    if(current != id){
      if(typeof customer_datatable !== 'undefined'){
        customer_datatable.destroy();
      }
      customer_datatable = $('#customer_transactions').DataTable({
        ajax:{
          url:'/customers/get_transactions',
          type : 'POST',
          data : {'authenticity_token':AUTH_TOKEN,'id':id }
        },
        'initComplete':function(settings,json){
          $('#customer_name').html(name);
          $('#customer_due').html(parseFloat(due).toFixed(2));
          $('#view_trans').attr('data-current',id);
          $('#view_trans').modal('show');
        }
      });
    }else{
      $('#view_trans').modal('show');
    }
    
  })
}
$(document).on('turbolinks:load',ready)
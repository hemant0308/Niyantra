// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function() {
    datatable = $('#customers_table').DataTable({
        responsive: true,
        ajax: {
            url: '/get_customers',
            type: 'GET',
            data: { 'authenticity_token': AUTH_TOKEN }
        },
        "columnDefs": [
            {
                render: function(data, type, row) {
                    return "<div class='table-btn'><a href='/customers/" + data + "' class='btn btn-primary p-1'>view</a></div>";
                },
                targets: 5
          },
            {
                "targets": [1, 2, 3, 5],
                "orderable": false
          },
            {
                "render": function(data, type, row) {
                    return "<span class='fa fa-inr'></span> " + data;
                },
                "createdCell": function(td, cellData, rowData, row, col) {
                    $(td).addClass('text-right');
                },
                "targets": -2
          }
      ],
        "createdRow": function(row, data, dataIndex) {
            $(row).data('id', data[data.length - 1]);
            $(row).data('due', data[4]);
            $(row).data('name', data[0]);
        }
    });



    $(document).on('click', '.view-trans', function() {
        var current = $('#view_trans').attr('data-current');
        var row = $(this).closest('tr');
        var id = $(row).data('id');
        var name = $(row).data('name');
        var due = $(row).data('due');
        $('#customer_due').html(due);
        $('.view-trans-container').removeClass('d-none');
        $('.add-trans-container').addClass('d-none');
        $('#view_trans').find('.modal-dialog').addClass('modal-lg')
        if (current != id) {
            if (typeof customer_datatable !== 'undefined') {
                customer_datatable.destroy();
            }

        } else {
            $('#view_trans').modal('show');
        }

    });
    var datepicker;
    var trans_datatable = $('#customer_transactions').DataTable({
        responsive: true,
        serverSide: true,
        order: [[0, 'desc']],
        ajax: {
            url: '/customers/get_transactions',
            type: 'GET',
            data: function(d) {
                d.id = $('#customer_transactions').data('id');
                d.date = $('#date').val();
            }
        },
        columnDefs: [
            {
                targets: [1, 2, 3],
                orderable: false
          },
            {
                "render": function(data, type, row) {
                    return formatDate(new Date(parseInt(data) * 1000));
                },
                targets: 0
          }
          ],
    });
    $(document).on('click', '.add-trans', function() {
        $('#add_trans').modal('show');
    });
    $('#customer_transaction').validate($.extend(validator_commons, {
        rules: {
            'amount': { required: true, lessThan: '#cust_due' }
        },
        messages: {
            'amount': { required: 'please enter money', lessThan: "Money must be less than due." }
        }
    }));
}
$(document).ready(ready)
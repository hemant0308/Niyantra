var ready = function(){
	    var bills_table = $('#bills_table').DataTable({
        serverSide: true,
        responsive: true,
        ajax: '/billing/get_bills',
        aaSorting: [[4, 'desc']],

        columnDefs: [
            { "orderable": false, "targets": [0, 1, 2, 3] },
            { "searchable": false, "targets": [1, 2, 3, 4, 5] },
            {
                "render": function(data, type, row) {
                    return formatDate(new Date(parseInt(data) * 1000));
                },
                "targets": -2
      },
            {
                "render": function(data, type, row) {
                    return "<span class ='fa fa-inr'></span> " + parseFloat(data).toFixed(2);
                },
                "targets": [2, 3]
            },
            {
                "render": function(data, type, row) {
                    return "<a class='btn btn-primary table-btn p-1' href='/billing/receipt/" + data + "'>receipt</a>"
                },
                "targets": [-1]
            }

    ],
        "createdRow": function(row, data, dataIndex) {

            $(row).find("td:nth-child(3),td:nth-child(4)").addClass('text-center');
        },
        "initComplete": function() {
            $('.dataTables_filter').closest('div.row').append("<div class='col-md-4 col-sm-12 dataTables_filter'><label> Date :<input type='text' class='datepicker form-control' id='datepicker'></label></div>").find('>div').removeClass('col-md-6').addClass('col-md-4')
            datepicker = $('#datepicker').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
            });
            datepicker.on('changeDate', function() {
                datepicker.datepicker('hide');
                bills_table.search(this.value).draw();
            });

        },

    });
    $('body').on('keyup', '#datepicker,.dataTables_filter input[type=search]', function() {
        $('.dataTables_filter input[type=search]').val($(this).val());
        $('#datepicker').val($(this).val());
        $('.dataTables_filter input[type=search]').trigger('keyup');
    });
};
$(document).ready(ready);
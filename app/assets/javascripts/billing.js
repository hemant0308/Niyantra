ready = function() {
    $('#noted_customer').on('change', function() {
        if ($(this).prop('checked')) {
            $('#customer_name_input').autocomplete({
                source: '/billing/get_customers',
                minlength: 1,
                select: function(event, ui) {
                    var item = ui.item.data
                    $('#customer_name_input').val(item.name);
                    $('#bill_customer_phone').val(item.phone);
                    $('#bill_customer_email').val(item.email);
                    $('#bill_customer_address').val(item.address)
                    $('#bill_customer_id').val(item.id);
                    $('#due').html(parseFloat(item.due).toFixed(2));
                    updateTotal();
                }
            });
            $('#due_container').removeClass('d-none').addClass('animated bounceInDown');
        } else {
            $('#customer_name_input').autocomplete('destroy');
            $('#customer_name_input').val('');
            $('#bill_customer_phone').val('');
            $('#bill_customer_email').val('');
            $('#bill_customer_address').val('')
            $('#due_container').addClass('d-none');
        }

    });
    $('#product_code').keyup(function(event) {
        getProduct($(this).val());
    });
    $('#product_code').change(function(event) {
        getProduct($(this).val());
    })

    function getProduct(code) {
        if (code.length == 6) {
            $.ajax({
                'url': '/billing/get_product',
                'method': 'get',
                'data': 'code=' + code,
                success: function(data) {
                    addProduct(data);
                }
            });
            last = code
        }
    }
    $('#product_code').keypress(function(event) {
        if (event.keyCode >= 48 && event.keyCode <= 122) {
            if ($(this).val().length == 6) {
                event.preventDefault();
            }
        }
    });
    shortcut.add('F4', function() {
        $('#billing_form').submit();
    });
    $(document).keydown(function(event) {
        if (event.keyCode == 115) {
            event.stopPropagation();
        }
    });
    $('#billing_form').validate({
        errorClass: 'invalid-feedback',
        validClass: 'is-valid',
        focusCleanup: true,
        onkeyup: false,
        onfocusout: false,
        focusInvalid: false,
        highlight: function(ele, errorClass) {
            $(ele).addClass('is-invalid');
        },
        success: function(label, ele) {
            $(ele).removeClass('is-invalid').addClass('is-valid');
            var id = $(ele).attr('id');
            $('#' + id + '-error').remove();
        },
        rules: {
            'bill[customer][name]': {
                required: function() {
                    return $('#noted_customer').prop('checked');
                }
            },
            'bill[customer][phone]': {
                required: function() {
                    return $('#noted_customer').prop('checked');
                }
            },
            'bill[paid_amount]': {
                required: function() {
                    return $('#noted_customer').prop('checked');
                }
            },

        },
    });
    var total_price = 0.0;

    function addProduct(data) {
        if (data) {
            if (data.quantity <= 0) {
                window.alert('out of stock');
                $('#product_code').val('');
                return;
            }
            var html = '';
            var id = data.id;
            var net_price = data.current_price - data.offer;
            total_price += net_price;
            var quantity = "<input type='text' class='form-control numerical quantity' name='quantity[" + id + "]' value='1'>";
            html = "<tr id='product_" + id + "' data-quantity='" + data.quantity + "'  price='" + net_price + "' data-id='" + id + "' data-price='" + parseFloat(data.current_price).toFixed(2) + "' data-offer='" + parseFloat(data.offer).toFixed(2) + "'><td><input type='hidden' name='product[]' value='" + id + "'>" + data.name + "</td><td>" + data.description + "</td><td>" + quantity + "</td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='unit-price'>" + parseFloat(data.current_price).toFixed(2) + "</span></td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='price'>" + parseFloat(data.current_price).toFixed(2) + "</span></td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='offer'>" + parseFloat(data.offer).toFixed(2) + "</span></td><td></td><td><span class='fa fa-inr'></span>&nbsp;&nbsp;<span class='net-price'>" + parseFloat(net_price).toFixed(2) + "</span></td><td><div class='table-btn del-prod'><span class='fa fa-trash-o text-info'></span></div></td></tr>";
            $('#bill_products').prepend(html);
            $('#product_' + id + ' .numerical').numeric();
            $('#product_code').val('');
            updateTotal();
        } else {
            window.alert($('#product_code').val() + ' invalid !');
            $('#product_code').val('');
        }
    }
    $(document).on('keyup', '.quantity', function(event) {
        id = $(this).closest('tr').data('id');
        calculate(id);
    });
    $('#paid_amount').on('keyup', function() {
        if ($(this).val() != '') {
            updateTotal();
        }

    })
    $(document).on('change', '.quantity', function() {
        if ($(this).val() == '') {
            $(this).val('1');
            calculate($(this).closest('tr').data('id'));
        }
    });
    $(document).on('keyup', '#total_offer,#net_total_price', function() {
        var total = $('#total_price').val();
        if (total != '') {
            parseFloat(total);
        } else {
            total = 0.0;
        }

        updateDue(total);
    })
    // full screen mode
    function calculate(id) {
        var parent = $('tr#product_' + id);
        var quantity = $(parent).find('.quantity').val();
        if (quantity == '') {
            return;
        }
        var remaining_quantity = parseInt($(parent).data('quantity'));
        quantity = parseInt(quantity);
        if (quantity > remaining_quantity) {
            //window.alert('maximum '+remaining_quantity+' items only');
            $(parent).find('.quantity').val(remaining_quantity);
            quantity = remaining_quantity;
        }
        var price = parseFloat($(parent).data('price'));
        var offer = parseInt($(parent).data('offer'));
        var net_price = quantity * (price - offer)
        $(parent).find('.price').html((quantity * price).toFixed(2));
        $(parent).find('.offer').html((quantity * offer).toFixed(2));
        $(parent).find('.net-price').html(net_price.toFixed(2));
        $(parent).attr('price', net_price);
        updateTotal();
    }

    function updateTotal() {
        var total = 0.00;
        var offer = 0.00;
        var total_products = 0;
        var total_items = 0;
        $('#bill_products tr').not(':last-child').each(function() {
            total += parseFloat($(this).attr('price'));
            offer += parseFloat($(this).attr('offer'));
            var quantity = parseInt($(this).find('.quantity').val());
            total_products++;
            total_items += quantity;
        });
        $('#total_net_price').html(total.toFixed(2));
        $('#total_product_count').html(total_products);
        $('#total_items_count').html(total_items);
        $('#total_price').val(total);
        updateDue(total);
    }

    function updateDue(total) {
        var total = total;
        var discount = $('#total_offer').val();
        //window.alert(discount);
        if (discount != '') {
            discount = parseFloat(discount);
        } else {
            discount = 0.0;
        }
        // window.alert(total);
        total = total - discount;
        var due = parseFloat($('#due').html());
        var paid_amount = $('#paid_amount').val();
        paid_amount = (paid_amount == '') ? 0 : parseFloat(paid_amount);
        var remaining_due = due + total - paid_amount;
        $('#remaining_due').html(remaining_due.toFixed(2));
        $('#today_payble').html(total.toFixed(2));
        $('#net_total_price').html(total);
    }
    $(document).on('click', '.del-prod', function() {
        $(this).closest('tr').remove();
        updateTotal();
    });
    $(document).on('focus', '.quantity', function() {
        $(this).select();
    });

    /* bills page scripting */
    var bills_table = $('#bills_table').DataTable({
        serverSide: true,
        responsive:true,
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
  $('body').on('keyup','#datepicker,.dataTables_filter input[type=search]',function(){
    $('.dataTables_filter input[type=search]').val($(this).val());
    $('#datepicker').val($(this).val());
  });

}
$(document).ready(ready);
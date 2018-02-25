// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready;
ready = function() {
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
    $(document).on('click', '.add-prod', function() {
        var new_element = $("<div class='row mb-4 product'> <div class='col-md-3'> <label for='product_id'>select product</label> <select name='product[][product_id]' id='' class='form-control product-id'></select> </div> <div class='col-md-2'> <label for='quantity'>Quantity</label> <input type='text' name='product[][quantity]' id='' value='' class='form-control quantity'> </div> <div class='col-md-2'> <label for='purchase_price'>Purchase price</label> <input type='text' name='product[][purchase_price]' id='' value='' class='form-control purchase'> </div> <div class='col-md-2'> <label for='profit'>profit(%)</label> <input type='text' name='product[][profit]' id='' value='' class='form-control profit'> </div> <div class='col-md-2'> <label for='retail_price'>Retail price</label> <input type='text' name='product[][current_price]' id='' value='' class='form-control retail'> </div> <div class='col-md-1 pt-4'> <button class='btn btn-primary btn-pill p-2 add-prod mt-1' type='button'><span class='fa fa-plus'></span></button> <button class='btn btn-danger btn-pill d-none del-prod p-2 mt-1' type='button'><span class='fa fa-minus'></span></button> </div> <div class='col-md-12'><span class='help-text'></span></div> </div> ").appendTo('#stock_products');
        makeReady(new_element);
        var eles = $('#stock_products div.row:not(:last-child)');
        $(eles).find('.del-prod').removeClass('d-none');
        $(eles).find('.add-prod').addClass('d-none');
        $("#stock_products").animate({ scrollTop: $('#stock_products').prop("scrollHeight") }, 1000);
    });
    $(document).on('click', '.del-prod', function() {
        $(this).closest('div.row').remove();
    })
    makeReady('#stock_products div.row:first-child');
    $('#stock_form').validate({
        errorClass: 'invalid-feedback',
        validClass: 'is-valid',
        focusCleanup: true,
        onkeyup: false,
        onfocusout: false,
        focusInvalid: false,
        success: function(label, ele) {
            $(ele).removeClass('is-invalid').addClass('is-valid');
            var id = $.escapeSelector($(ele).attr('name'));
            $('#' + id + '-error').remove();
        },
        rules: {
            'stock[supplier_id]': { required: true },
            'stock[quantity]': { required: true },
            'stock[total_price]': { required: true, greaterThan: '#stock_paid_amount' },
            'stock[paid_amount]': { required: true, lessThan: "#stock_total_price" },
            'product[][product_id]': { required: true },
            'product[][quantity]': { required: true },
            'product[][purchase_price]': { required: true },
            'product[][profit]': { required: true, max: 100 },
            'product[][current_price]': { required: true }
        },
        highlight: function(ele, errorClass) {
            $(ele).addClass('is-invalid');
        },
        unhighlight: function(ele) {
            $(ele).removeClass('is-invalid is-valid');
            var id = $.escapeSelector($(ele).attr('name'));
            $('#' + id + '-error').remove();
        },
        errorPlacement: function(error, ele) {
            $(error).appendTo($(ele).parent());
        }
    });

    function makeReady(ele) {
        $(ele).find('.product-id').select2({
            ajax: {
                url: '/stock/getproducts',
                data: function(params) {
                    var query = {
                        search: params.term,
                        page: params.page || 1
                    }
                    return query;
                }
            },
            'width': '100%',
        });
    }

    $(document).on("select2:select", ".product-id", function(e) {
        var ele = $(this).closest('.product');
        var id = e.data;
        $(ele).attr('data-name', e.params.data.text.split(" ").slice(0, -1).join(' '));
        $(ele).attr('data-id', e.params.data.id);
        $(ele).attr('data-price', e.params.data.price);
        $(ele).attr('data-quantity', e.params.data.quantity);
        $(ele).attr('data-purchase', e.params.data.purchase);
        estimatePrice(ele);
    });
    $(document).on('keyup', '.profit,.quantity,.purchase', function() {
        var ele = $(this).closest('.product');
        estimatePrice(ele);
    });

    function estimatePrice(ele) {
        p = ele;
        quantity = parseInt($(ele).find('.quantity').val());
        purchase = parseFloat($(ele).find('.purchase').val());
        profit = parseFloat($(ele).find('.profit').val());
        quantity = (quantity) ? quantity : 0;
        var name = $(ele).attr("data-name");
        var sq = parseInt($(ele).attr('data-quantity'));
        sq = (sq) ? sq : 0;
        var sp = parseFloat($(ele).attr("data-purchase"));
        sp = sp ? sp : 0.0;
        var sr = parseFloat($(ele).attr("data-price"));
        sr = sr ? sr : 0.0;
        $(ele).find('.help-text').html(sq + " " + name + " products available in your stock.please enter the details we will estimate the retail price of your product.");
        if (purchase && quantity && profit) {
            var retail = (((quantity * purchase) + (sq * sp)) * ((100.0 + profit) / 100.0)) / (quantity + sq);
            $(ele).find('.retail').val(retail.toFixed(2));
        } else {
            $(ele).find('.help-text').html(sq + " " + name + " products available in your stock.please enter the details we will estimate the retail price of your product.");
        }
    }
    datatable = $('#stock_table').DataTable({
         "responsive":true,
        ajax: {
            url: '/getstocks',
            type: 'POST',
            data: { 'authenticity_token': AUTH_TOKEN }
        },
        "columnDefs": [{
                "render": function(data, type, row) {
                    return "<div class='table-btn-container'><div class='table-btn view-prod'><span class='fa fa-product-hunt text-primary'></span></div><div class='table-btn view-barcodes'><span class='fa fa-barcode text-info'></span></div></div>";
                },
                "targets": -1,
            },
            {
                "render": function(data, type, row) {
                    return formatDate(new Date(parseInt(data) * 1000));
                },
                "targets": -2
            },
            {
                "targets": [0, 5],
                "orderable": false
            },
        ],
        "createdRow": function(row, data, dataIndex) {
            $(row).data('id', data[data.length - 1]);
            $(row).find("td:nth-child(3),td:nth-child(4)").addClass('text-right');
        }
    });
    $('#stock_supplier_id').select2({
        'width': '100%'
    });
    $(document).on('click', '.view-prod', function() {

        var id = $(this).closest('tr').data('id');
        var current = $('#view_prod').attr('data-current');

        if (id != current) {
            if (typeof stock_products_datatable !== 'undefined') {
                stock_products_datatable.destroy();
            }
            stock_products_datatable = $('#stock_products_table').DataTable({
                ajax: {
                    type: 'get',
                    url: 'stock/get_stock_products',
                    data: { 'stock_id': id }
                },
                'initComplete': function(settings, json) {
                    $('#view_prod').attr('data-current', id);
                    $('#view_prod').modal('show');
                },
            });
        } else {
            $('#view_prod').modal('show');
        }


        $('#view_prod').modal('show');
    });
    $(document).on("click",".view-barcodes",function(){
        var id = $(this).closest('tr').data('id');
        $.ajax({
            url: "/stock/get_barcodes",
            method: "GET",
            data: {stock_id:id},
            dataType: 'json',
            success: function(data) {
                data = data.data;
                var html = "";
               for(var i=0;i<data.length;i++){
                    code = data[i][0];
                    name = data[i][1];
                    count = data[i][2];
                    for(var j=0;j<count;j++){
                        html += "<div class='barcode'><img src='/barcodes/"+code+".png'><div class='code'>"+code+"</div><div class='title'>"+name+"</div></div>";
                    }
                    
               }
               $('.barcodes').html(html);
               $('#barcodes').modal('show');
            }
        })
            
        $('#barcodes').modal('show');
    });
    $('#print_barcodes').on('click',function(){
        $('.barcodes').print("/assets/print.scss");
    })

}
$(document).ready(ready);
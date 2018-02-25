var datatable;
var AUTH_TOKEN;
var validator_commons = {
    errorClass: 'invalid-feedback',
    validClass: 'is-valid',
    focusCleanup: true,
    onkeyup: false,
    onfocusout: false,
    focusInvalid: false,
    highlight: function(ele, errorClass) {
        $(ele).addClass('is-invalid');
    },
    unhighlight: function(ele) {
        $(ele).removeClass('is-invalid is-valid');
        var id = $.escapeSelector($(ele).attr('name'));
        $('#' + id + '-error').remove();
    },
};
var custom_ready = function() {
    $('.numerical').numeric();
    AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
    $('.loader').hide();

    $('#password_form').validate($.extend({
        rules: {
            'old': { required: true },
            'password': { required: true },
            'password_confirmation': { required: true, equalTo: '#password' }
        },
    }, validator_commons));
    $.validator.addMethod("greaterThan", function(value, element, param) {
        var $otherElement = $(param);
        return parseInt(value, 10) >= parseInt($otherElement.val(), 10);
    }, "Wrong entry");

    $.validator.addMethod("lessThan", function(value, element, param) {
        var $otherElement = $(param);
        return (parseInt(value, 10) <= parseInt($otherElement.val(), 10));
    }, "Wrong entry");

    $('.loader').addClass('d-none');
}
$(document).ready(custom_ready);
$.fn.fullScreen = function() {
    if ($(this)[0].requestFullscreen)
        $(this)[0].requestFullscreen();
    else if ($(this)[0].mozRequestFullScreen)
        $(this)[0].mozRequestFullScreen();
    else if ($(this)[0].webkitRequestFullscreen)
        $(this)[0].webkitRequestFullscreen();
    else if ($(this)[0].msRequestFullscreen)
        $(this)[0].msRequestFullscreen();
    return this;
};
jQuery.fn.selectText = function() {
    var obj = this[0];
    if ($.browser.msie) {
        var range = obj.offsetParent.createTextRange();
        range.moveToElementText(obj);
        range.select();
    } else if ($.browser.mozilla || $.browser.opera) {
        var selection = obj.ownerDocument.defaultView.getSelection();
        var range = obj.ownerDocument.createRange();
        range.selectNodeContents(obj);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if ($.browser.safari) {
        var selection = obj.ownerDocument.defaultView.getSelection();
        selection.setBaseAndExtent(obj, 0, obj, 1);
    }
    return this;
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = makeTwo(hours);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    return strTime + " " + makeTwo(date.getDate()) + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
}

function makeTwo(data) {
    data = parseInt(data);
    return (data < 10) ? ('0' + data) : data;
}
$.fn.print = function(css = "") {

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('<link href="' + css + '" rel="stylesheet"></head><body >');
    mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write($(this)[0].outerHTML);
    mywindow.document.write('</body></html>');

    // necessary for IE >= 10*/

    setTimeout(function() {
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
        mywindow.close();
    }, 2000);
    return true;
}
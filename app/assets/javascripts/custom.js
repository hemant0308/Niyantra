var datatable;
var AUTH_TOKEN;
var custom_ready = function() {
    $('.numerical').numeric();
    AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
    $('.loader').hide();
    $('#password_form').validate({
        rules: {
            'old_password': { required: true },
            'password': { required: true },
            're_password': { required: true, equalTo: '#password' }
        },
    });
    $.validator.addMethod("greaterThan", function(value, element, param) {
        var $otherElement = $(param);
        return parseInt(value, 10) >= parseInt($otherElement.val(), 10);
    }, "Wrong entry");

    $.validator.addMethod("lessThan", function(value, element, param) {
        var $otherElement = $(param);
        return parseInt(value, 10) <= parseInt($otherElement.val(), 10);
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
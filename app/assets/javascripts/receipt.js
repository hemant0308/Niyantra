var ready = function() {
    /* receipt */
    $('#print_receipt').on('click', function() {
        $('.receipt').print('/assets/print.scss');
    });
    shortcut.add('F4', function() {
        $('.receipt').print('/assets/print.scss');
    });
}
$(document).ready(ready);
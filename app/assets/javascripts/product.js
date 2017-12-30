// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var ready = function(){
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }

    $( "#properties" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
      	minLength : 1,
        source: function( request, response ) {
          $.ajax({
          	url : '/product/getProperties',
          	dataType : 'json',
          	method : 'get',
          	data : {q:extractLast(request.term)},
          	success : function(data){
          		response(data)
          	}
          })
        },
        search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 1 ) {
            return false;
          }
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join( ", " );
          var options = ui.item.data
          a=options;
          var ele = $('#properties_table tbody');
          var input;
          if(options != false){
            input = "<select class='form-control' name='product[property["+ui.item.id+"]]'>";
            for(var i=0;i<options.length;i++){
              input += "<option value='"+options[i]+"'>"+options[i]+"</option>";
            }
            input += "</select>";
          }else{
            input = "<input type='text' class='form-control'  name='product[property["+ui.item.id+"]]'>";
          }
          var html = "<tr><td>"+ui.item.value+"</td><td>"+input+"</td></tr>";
          $(ele).append(html);
          $('#properties_table').parent().removeClass('d-none');
          return false;
        }
      });

}
$(document).on('turbolinks:load',ready);

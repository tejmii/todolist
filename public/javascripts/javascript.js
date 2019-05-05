$(document).ready(function(){
    $('.task-list-check').click(function() {
        var taskStatus = "done";
        if($(this).is(":checked")){
            $(this).parent().parent().addClass('task-done');
        } else {
            $(this).parent().parent().removeClass('task-done');
            taskStatus = "new";
        }
        $.post( "update", {id: $(this).val(), status: taskStatus}, function( data ) {
            console.log(data);
            return true;
        });
    });
});
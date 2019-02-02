/*################ Function to pop up alerts in the correspondig div #############################*/
function pop_alert(msg, type)
{
  $('#alert_box').append('<div class=\"alert alert-' + type + '\" role=\"alert\">' + msg + '<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>');
};

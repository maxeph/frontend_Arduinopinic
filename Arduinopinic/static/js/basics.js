function pop_alert(msg, type)
{
  $('#alert_box').append('<div class=\"alert alert-' + type + '\" role=\"alert\">' + msg + '<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>');
};
function updateWidgets()
{
  $.getJSON( updateURL, function(data) {
    $('#vtemp').text(Number(data.tempext).toLocaleString('fr-fr'));
    $('#vhumid').text(Number(data.humid).toLocaleString('fr-fr'));
    $('#veau').text(Number(data.tempeau).toLocaleString('fr-fr'));
    $('#wtemp').css('border-color', '#428bca');
    $('#whumid').css('border-color', '#428bca');
    $('#weau').css('border-color', '#428bca');
    $('#wtemp').css('color', '#428bca');
    $('#whumid').css('color', '#428bca');
    $('#weau').css('color', '#428bca');
    if (data.status) {
      $('#vstatus').css('color', 'green');
    }
    else {
      $('#vstatus').css('color', 'red');
      pop_alert("<Strong>Alert !</Strong> The Daemon is not up. Make sure to launch the Daemon","danger")
      /*
      #######Sure there is more to implement here!!!!!!
      */
    }
    setTimeout(updateWidgets, 5000);
  })
  .fail(function(data) {
    pop_alert("<Strong>Alert !</Strong> The Server is not reachable. Make sure that the Pi or Django is correctly running. Then reload.","danger")
    $('#wtemp').css('border-color', 'red');
    $('#whumid').css('border-color', 'red');
    $('#weau').css('border-color', 'red');
    $('#wtemp').css('color', 'red');
    $('#whumid').css('color', 'red');
    $('#weau').css('color', 'red');
    $('#wlevel').css('color', 'red');
    $('#wlevel').css('border-color', 'red');
    $('#vstatus').css('color', 'red');
  });
}
updateWidgets();

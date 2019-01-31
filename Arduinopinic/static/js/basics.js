var daemonNotWorking = false;
var noDataDB = false;
var outdated = false;

/* Function to handle alerts in the correspondig div*/
function pop_alert(msg, type)
{
  $('#alert_box').append('<div class=\"alert alert-' + type + '\" role=\"alert\">' + msg + '<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>');
};
/* Function change color of widgets*/
function colorWidgets(color)
{
  $('#wtemp').css('border-color', color);
  $('#whumid').css('border-color', color);
  $('#weau').css('border-color', color);
  $('#wtemp').css('color', color);
  $('#whumid').css('color', color);
  $('#weau').css('color', color);
  $('#wlevel').css('color', color);
  $('#wlevel').css('border-color', color);
  $('#vstatus').css('color', color);
}
/* Function to update values via css*/
function valuesWidgets(pack,locales)
{
  $('#vtemp').text(Number(pack.tempext).toLocaleString(locales));
  $('#vhumid').text(Number(pack.humid).toLocaleString(locales));
  $('#veau').text(Number(pack.tempeau).toLocaleString(locales));
}
/* Function get metrics via Ajax and update widgets*/
function updateWidgets()
{
  $.getJSON( updateURL, function(data) {
    if (data.isnotempty) {
      data.date = new Date(data.date); /* Coding string date in JS date */
      valuesWidgets(data,'fr-fr')
      if (moment.duration(moment(data.date).diff()) < (-300000)) { /* if values older than 5 minutes*/
        if (outdated === false) {
          pop_alert("<Strong>Alert !</Strong> It seems that the Daemon has not been running for " + moment.duration(moment(data.date).diff()).humanize() + ". An outdated value is disclosed.","warning");
          outdated = true;
        }
      }
      else {
        colorWidgets('#428bca');
      }
    }
    else {
      if (noDataDB === false) {
        pop_alert("<Strong>Error !</Strong> No data in the database. Make sure to launch the Daemon first.","warning");
        noDataDB = true;
      }
    }

    if (data.status) {
      $('#vstatus').css('color', 'green');
    }
    else {
      if (daemonNotWorking === false) {
        $('#vstatus').css('color', 'red');
        pop_alert("<Strong>Error !</Strong> The Daemon is not running. Make sure to launch the Daemon.","danger");
        daemonNotWorking = true;
      }
    }
    setTimeout(updateWidgets, 5000);
  })
  .fail(function(data) {
    pop_alert("<Strong>Error !</Strong> The Server is not reachable. Make sure that the Pi or Django is correctly running. Then reload.","danger");
    colorWidgets('red');
  });
}
updateWidgets();

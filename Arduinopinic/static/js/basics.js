var daemonNotWorking = false;
var noDataDB = false;
var outdated = false;
var tab2 = false;
var tab3 = false;


/*################ Function to pop up alerts in the correspondig div #############################*/
function pop_alert(msg, type)
{
  $('#alert_box').append('<div class=\"alert alert-' + type + '\" role=\"alert\">' + msg + '<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>');
};

/*################ Function change color of widgets ###############################################*/
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

/*################ Function to update values via css ###############################################*/
function valuesWidgets(pack,locales)
{
  $('#vtemp').text(Number(pack.tempext).toLocaleString(locales));
  $('#vhumid').text(Number(pack.humid).toLocaleString(locales));
  $('#veau').text(Number(pack.tempeau).toLocaleString(locales));
}

/*################ Function get metrics via Ajax and update widgets ##################################*/
function updateWidgets()
{
  $.getJSON( updateURL, function(data) {
    if (data.isnotempty) {
      data.date = new Date(data.date); /* if database not empty, update widget figures  */
      valuesWidgets(data,'fr-fr')
      if (moment.duration(moment(data.date).diff()) < (-300000)) { /* if values older than 5 minutes alerte and evrything in orange*/
        if (outdated === false) {
          pop_alert("<Strong>Alert !</Strong> It seems that the Daemon has not been running for " + moment.duration(moment(data.date).diff()).humanize() + ". An outdated value is disclosed.","warning");
          colorWidgets('#f49542');
          outdated = true;
        }
      }
      else {
        colorWidgets('#428bca'); /* if ok*/
      }
    }
    else {
      if (noDataDB === false) { /* if database empty, alerte  */
        pop_alert("<Strong>Error !</Strong> No data in the database. Make sure to launch the Daemon first.","warning");
        colorWidgets('#f49542');
        noDataDB = true;
      }
    }

    if (data.status) { /* check daemon status  */
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
  .fail(function(data) { /* if ajax failed  */
    pop_alert("<Strong>Error !</Strong> The Server is not reachable. Make sure that the Pi or Django is correctly running. Then reload.","danger");
    colorWidgets('red');
  });
}

/*################ Function get metrics via Ajax and update Chart ##################################*/
function updateChart(spinner,tchart,url)
{
  $(spinner).html('<img src="http://www.mediaforma.com/sdz/jquery/ajax-loader.gif">');
  $.getJSON( url, function(data) {
    $(spinner).html('');
    for (i in data) {
      data[i].date = new Date(data[i].date);
      tchart.data.labels[i] = moment(data[i].date).format("ddd HH[h]");
      tchart.data.datasets[0].data[i] = data[i].tempext;
      tchart.data.datasets[1].data[i] = data[i].tempeau;
      tchart.data.datasets[2].data[i] = data[i].humid;
    }

    tchart.update();
  })
  .fail(function(data) {
    pop_alert("<Strong>Error !</Strong> Impossible to get graphic data's","danger");
  });
}
/*################ Setting event function for change of tab and update of hidden chart ###############*/
$('.nav-tabs a[href="#d7"]').on('show.bs.tab', function(event){
  if (tab2 === false) {
    updateChart('#spinner2',d7chart,updateChartURL2)
    tab2 = true;
  }
});
$('.nav-tabs a[href="#d30"]').on('show.bs.tab', function(event){
  if (tab3 === false) {
    updateChart('#spinner3',d30chart,updateChartURL3)
    tab3 = true;
  }
});

/*################ Start of application ###############*/
updateWidgets();
updateChart('#spinner1',d24chart,updateChartURL1)

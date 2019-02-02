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
    pop_alert(data.length,'')
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
/*################ object for Skeleton of graph #######################################################*/

class skeletonGraph {
  constructor() {
    this.options = {
      type: 'line',
      data: {
        labels: [''],
        datasets: [{
          label: "Température",
          backgroundColor: 'rgb(60, 179, 113)',
          borderColor: 'rgb(60, 179, 113)',
          fill: false,
          data: [''],
          yAxisID: 'celsius',
        },
        {
          label: "Eau",
          backgroundColor: 'rgb(30, 144, 255)',
          borderColor: 'rgb(30, 144, 255)',
          fill: false,
          data: [''],
          yAxisID: 'celsius',
        },
        {
          label: "Humidité",
          backgroundColor: 'rgb(220,220,220)',
          borderColor: 'rgb(220,220,220)',
          fill: true,
          data: [''],
          yAxisID: 'humidite',
        }
      ]
    },
    // Configuration options go here
    options: {
      maintainAspectRatio: true,
      tooltips: {
        mode: 'index',
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'celsius',
        }, {
          ticks:{
            suggestedMin: 0,
            suggestedMax: 100
          },
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'right',
          id: 'humidite',


          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }],
      },
      title: {
        display:false,
      },

    }
  };
}
}

/*################ Start of application ###############*/
updateWidgets();
var canvas1 = document.getElementById('graphique1').getContext('2d');
var canvas2 = document.getElementById('graphique2').getContext('2d');
var canvas3 = document.getElementById('graphique3').getContext('2d');
optiond24chart = new skeletonGraph;
optiond7chart = new skeletonGraph;
optiond30chart = new skeletonGraph;
var d24chart = new Chart(canvas1, optiond24chart.options);
var d7chart = new Chart(canvas2, optiond7chart.options);
var d30chart = new Chart(canvas3, optiond30chart.options);
updateChart('#spinner1',d24chart,updateChartURL1)

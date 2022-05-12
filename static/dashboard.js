/* globals Chart:false, feather:false */
const arrayColumn = (arr, n) => arr.map(x => x[n]);
var current_chart


function importRun(location) {
  console.log(location)
  preinfo=document.getElementById('preinfo')
  if (preinfo!= null){
      preinfo.remove()}
  rundata = {}
  fetch(location)
    .then(response => {
      return response.json();
    })
    .then(data => stash(data));
  function stash(data) {
    rundata = data
    data_viz(rundata,location)
  }

}




function data_viz(data_list,location) {
  'use strict'


 


  var counts_dic=data_list['output']["counts"]
  var count_array=Object.keys(counts_dic).map((key) => [key, counts_dic[key]])
 



  // Graphs
  var ctx = document.getElementById('myChart')
  if (current_chart){
    current_chart.destroy()}
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: arrayColumn(count_array,0),
      datasets: [{
        data: arrayColumn(count_array,1),
        lineTension: 0,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
  current_chart=myChart

  data_dump(data_list,location)
}

function data_dump(data_list,location){

  dataholder=document.getElementById('data-holder')
  dataholder.innerHTML=''
  var data_keys=Object.keys(data_list)


  oplist=['spam','gr', 'rz']
  dataholder.innerHTML+=
  `
  <h2> Run overview </h2>
  <div class="container m-0 p-0">
  <div class="row align-items-start">

  <div class="col">
          <div class="card" style="width: 100%;">
          <div class="card-header">
            <b>Outputs</b> 
          </div>
          <ul class="list-group list-group-flush center">
            <li class="list-group-item">Run time: ${data_list['output']['run time']}</li>
            <li class="list-group-item">Run duration: ${data_list['output']['run duration']} seconds</li>
            <li class="list-group-item">A third item</li>
          </ul>
          </div>
    </div>
    <div class="col">
          <div class="card" style="width: 100%;">
          <div class="card-header">
            <b>Parameters</b> 
          </div>
          <ul class="list-group list-group-flush center">
            <li class="list-group-item">Shots: ${data_list['parameters']['shots']}</li>
            <li class="list-group-item">Coupling map: <br> ${data_list['parameters']['coupling']} </li>
            <li class="list-group-item">Optimization: ${data_list['parameters']['optimization']}</li>
          </ul>
          </div>
    </div>
    <div class="col">
            <div class="card" style="width: 100%;">
            <div class="card-header">
              <b>Identity</b> 
            </div>
            <ul class="list-group list-group-flush center">
              <li class="list-group-item">Person: ${data_list['identity']['person']}, ${data_list['identity']['organization']}</li>
              <li class="list-group-item">project git: ${data_list['identity']['giturl']} </li>
              <li class="list-group-item">A third item</li>
            </ul>
            </div>
    </div>
  </div>
  </div>
 
  `



 mop=data_list['machine_status']['operations']
 machine_table=document.createElement('table')
 dataholder.appendChild(machine_table)
 machine_table.classList.add('table')
 machine_table.innerHTML=
 `
 <thead>
 <tr>
 <th scope="col">Quantity</th>
 <th scope="col">Q1</th>
 <th scope="col">Q2</th>
 <th scope="col">Q3</th>
 <th scope="col">Q4</th>
 </tr>
 </thead>
 `
  machine_body=document.createElement('tbody')
  machine_table.appendChild(machine_body)

 for (var quant in oplist){
   row_data=`
   <tr>
   <th scope="row">${oplist[quant]}</th>`
   for (let i= 0; i<4; i++){
     console.log(quant,i)
     row_data+=`<td> 
       <b>${mop[oplist[quant]][i]["fidelity"]["value"]} </b><br>
       (${mop[oplist[quant]][i]["fidelity"]["upper_sigma"]},
       ${mop[oplist[quant]][i]["fidelity"]["lower_sigma"]})</td>`
   }
   row_data+='</tr>'
   machine_table.innerHTML+=row_data
 }
  
 locpeices=location.split("/")
 console.log(locpeices)
 dataholder.innerHTML+=
 `
 <h2> Circuit Image </h2>
 <div class="container m-5 p-5">
 <div class="card text-center">
 <center>
 <img src='${locpeices[0]}/${locpeices[1]}/img/${locpeices[2].split('_')[1]}_${locpeices[2].split('_')[2]}.png' width="100%"></img>
 </center>
 
 </div>
 </div>

 `



  //var str = syntaxHighlight(data_list)
  //dataholder.innerHTML+='<pre id="json">'+str+'</pre>'

  
}













// Utility
function syntaxHighlight(json) {
  if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}








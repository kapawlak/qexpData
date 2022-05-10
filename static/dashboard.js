/* globals Chart:false, feather:false */

///Start by just printing out json file.

var data_dir = {}

function importData() {
  fetch("index?" + Math.floor(Math.random() * 100000))
    .then(response => {
      return response.json();
    })
    .then(data => stash(data));
  function stash(data) {
    data_dir = data
    navBar()

  }
}

function navBar() {
  datas = data_dir['qexp_data']
  navbar = document.getElementById("accordion")

  for (var proj in datas) {
    var proj_dir = datas[proj];
    if (proj != 'index.html' && proj != 'index') {
      console.log(proj, proj == 'info')
      accordion_container = ac_item()
      navbar.appendChild(accordion_container)       // Create top level accordion container
      project_node = levelone(proj)
      accordion_container.appendChild(project_node)    // Append Project header to top level accordion container
      date_collapsing_containter = leveltwocontainter(proj)
      accordion_container.appendChild(date_collapsing_containter)     // Append the collapsing container for the dates


      for (var date in proj_dir) {
        if (date != "info") {
          var date_dir = proj_dir[date];
          big_ac = document.createElement("div")
          big_ac.id = proj + date
          date_collapsing_containter.appendChild(big_ac)
          accordion_container2 = ac_item()

          big_ac.appendChild(accordion_container2)
          date_node = leveltwo(proj, date)
          accordion_container2.appendChild(date_node)


          for (var run in date_dir) {
            run_node = levelthree(proj, date, run)
            accordion_container2.appendChild(run_node)
          }

        }
      }
    }
  }
}

function ac_item() {
  node = document.createElement("div")
  node.classList.add('accordion-item')
  return node
}

function levelone(proj) {

  node = document.createElement("h2")
  node.classList.add('accordion-header')
  node.id = "heading" + proj
  node.innerHTML = `
  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${proj}" aria-expanded="true" aria-controls="collapse${proj}">
  Project: ${proj}
  </button>
  `
  return node
}

function leveltwocontainter(proj) {
  node = document.createElement("div")
  node.id = "collapse" + proj
  node.classList.add("accordion-collapse", "collapse", 'show')
  node.dataset['bsParent'] = "#accordion";
  return node

}


function leveltwo(proj, date) {
  node = document.createElement("h3")
  node.classList.add('accordion-header')
  node.id = "heading" + proj
  node.innerHTML = `
  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${date}" aria-expanded="true" aria-controls="collapse${date}">
    <small> ${date} </small>
  </button>
  `
  return node
}

function levelthree(proj, date, run) {
  node = document.createElement("div")
  node.id = "collapse" + date
  node.classList.add("accordion-collapse", "collapse")
  node.dataset['bsParent'] = `#${proj + date}`;

  node.innerHTML = `
  <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${date}" aria-expanded="true" aria-controls="collapse${date}" onclick="importRun('${proj}/${date}/${run}')">
    <small> ${run} </small>
  </a>
  `
  return node
}




function importRun(location) {
  rundata = {}
  fetch(location)
    .then(response => {
      return response.json();
    })
    .then(data => stash(data));
  function stash(data) {
    rundata = data
    data_viz(rundata)
  }

}



const arrayColumn = (arr, n) => arr.map(x => x[n]);


function data_viz(data_list) {
  'use strict'

  console.log(typeof(data_list))

  for (var item in data_list['output']){
    console.log('top: ',item, data_list['output'][item])
    for (var item2 in data_list['output'][item]){
    console.log('bottom: ', item2, data_list['output'][item][item2])}
    }
  
  var counts_dic=data_list['output'][0]["counts"]
  var count_array=Object.keys(counts_dic).map((key) => [key, counts_dic[key]])
  console.log(arrayColumn(count_array,1))

  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  var ctx = document.getElementById('myChart')
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

  data_dump(data_list)
}

function data_dump(data_list){
  dataholder=document.getElementById('data-holder')
  var str = syntaxHighlight(data_list)
  dataholder.innerHTML='<pre id="json">'+str+'</pre>'

  
}

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


importData()




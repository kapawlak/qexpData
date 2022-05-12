//Global Data Directory Object

function importDirData() {
    fetch("index?" + Math.floor(Math.random() * 100000))
        .then(response => {
            return response.json();
        })
        .then(data => stash(data));
    function stash(data) {

        navBar(data)

    }
}



function navBar(data_dir) {

    console.log(data_dir)
    datas = data_dir
    navbar = document.getElementById("accordion")
    var opened = false
    for (var proj in datas) {
        var proj_dir = datas[proj];
        if (proj.includes('.') != true && proj != 'index') {
            accordion_container = ac_item()
            navbar.appendChild(accordion_container)       // Create top level accordion container
            project_node = levelone(proj, opened)
            accordion_container.appendChild(project_node)    // Append Project header to top level accordion container
            date_collapsing_containter = leveltwocontainer(proj, opened)
            opened = true
            accordion_container.appendChild(date_collapsing_containter)     // Append the collapsing container for the dates

            dates = Object.keys(proj_dir).sort().reverse()
            for (var d in dates) {
                date = dates[d]
                if (date != "info") {
                    var date_dir = proj_dir[date];
                    big_ac = document.createElement("div")
                    big_ac.id = proj + date
                    date_collapsing_containter.appendChild(big_ac)
                    accordion_container2 = ac_item()
                    big_ac.appendChild(accordion_container2)

                    date_node = leveltwo(proj, date)
                    accordion_container2.appendChild(date_node)
                    run_container = levelthreecontainer(proj, date)
                    accordion_container2.appendChild(run_container)
                    runs = Object.keys(date_dir).sort().reverse()
                    for (var run in runs) {
                        if (runs[run] != 'img'){
                            run_node = levelthree(proj, date, runs[run])
                            run_container.appendChild(run_node)}
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

function levelone(proj, opened) {

    isCollpased = ''
    if (opened) {
        isCollpased = ' collapsed'
    }

    node = document.createElement("h2")
    node.classList.add('accordion-header')
    node.id = "heading" + proj
    node.innerHTML = `
    <button class="accordion-button lvl1 ${isCollpased}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${proj}" aria-expanded="true" aria-controls="collapse${proj}">
    <span data-feather="layers"> </span> ${proj}
    </button>
    `
    return node
}

function leveltwocontainer(proj, opened) {

    node = document.createElement("div")
    node.id = "collapse" + proj
    node.classList.add("accordion-collapse", "collapse")
    if (opened == false) {
        node.classList.add("show")
        opened = true

    }
    node.dataset['bsParent'] = "#accordion";
    return node

}


function levelthreecontainer(proj, date) {
    node = document.createElement("div")
    node.id = "collapse" + proj + date
    node.classList.add("accordion-collapse", "collapse")
    node.dataset['bsParent'] = proj + date
    return node

}


function leveltwo(proj, date) {

    text_date = date.substring(2, 4) + '/' + date.substring(4, 6) + '/' + date.substring(0, 2)
    node = document.createElement("h3")
    node.classList.add('accordion-header')
    node.id = "heading" + proj
    node.innerHTML = `
    <button class="accordion-button lvl2 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${proj + date}" aria-expanded="true" aria-controls="collapse${proj + date}">
      <small> ${text_date} </small>
    </button>
    `
    return node
}

function levelthree(proj, date, run) {
    console.log(run.split('_')[0])
    run_info=run.split('_')
    run_method = run_info[0]
    run_time = run_info[2]
    run_string = `${run_method} @ ${run_time.substring(0, 2)}:${run_time.substring(2, 4)}:${run_time.substring(4, 6)}`

    node = document.createElement("div")
    node.innerHTML = `
    <a class="nav-link lvl3" type="button"  aria-expanded="true"  onclick="importRun('${proj}/${date}/${run}')">
      <small> ${run_string} </small>
    </a>
    `
    return node
}



importDirData()



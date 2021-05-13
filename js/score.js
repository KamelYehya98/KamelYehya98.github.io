function createRow(pname, bname, pscore, bscore, pstatus, bstatus, timedate)
{
    let table = document.getElementById("table_body");
    let row = document.createElement("tr");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");

    td2.innerHTML = pname + "<br>" + bname;
    td3.innerHTML = pscore + "<br>" + bscore;
    td4.innerHTML = pstatus + "<br>" + bstatus;
    td5.innerHTML = timedate;

    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);

    table.appendChild(row);
}

function fillData(rounds, winrate, games)
{
    document.getElementById("rounds").innerHTML = rounds;
    document.getElementById("winrate").innerHTML = winrate + "%";
    document.getElementById("games").innerHTML = games;
}

function changeTable(player){
    document.getElementById("table_id").classList.remove("table-dark");
    if(player == "player"){
        document.getElementById("table_id").classList.add("table-success");
    }else{
        document.getElementById("table_id").classList.add("table-danger");
    }
}

function removeClassFromAllElements(name) {
    var elems = document.querySelectorAll("." + name);
    [].forEach.call(elems, function (el) {
        el.classList.remove(name);
    });
}
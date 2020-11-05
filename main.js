var stateTable;
var size;
function generate() {

    let inputVal;
    try {
        inputVal = parseInt(document.getElementById("amountOfNodes").value);
    } catch (error) {
        alert("No es un numero");
        return;
    }

    if (!validNodes(inputVal)) {
        alert("numero invalido...");
        return;
    }
    size = inputVal;
    //generar tabla de data

    stateTable = [];
    for(var i = 0; i < inputVal; i++){
        var row = [];
        for(var j = 0; j < inputVal; j++){
            row.push(0);
        }
        stateTable.push(row);
    }
    var table = document.getElementById("buttonTable");
    table.innerHTML = "";
    //generar tabla de botones
    var row = 0;
    for (var i = 0; i < inputVal*inputVal; i++) {
        if(i ==0){
            //imprimir fila de titulos
            let tr = document.createElement("tr");
            let corner = document.createElement("td");
            tr.appendChild(corner);
            for(var j = 0; j < inputVal; j++){
                let td = document.createElement("td");
                td.innerHTML = j;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var j = 0; j < inputVal; j++, i++) {
            if(j==0){
                if(i!=5125){
                    let td = document.createElement("td");
                    td.innerHTML = row++;
                    tr.appendChild(td);
                }
            }
            var td = document.createElement("td");
            var btn = document.createElement("button");
            btn.innerHTML = "0";
            btn.id = "btn-" + i;
            btn.className = "btn btn-secondary"
            btn.onclick = function () { toggleButton(this.id); };
            if (i >= inputVal*inputVal) {
                break;
            } else {
                td.appendChild(btn);
                tr.appendChild(td);
            }
        }
        i--;
    }
    var steps = document.getElementById("steps");
    steps.className ="input-group mb-3";
}

toggleButton = function(id){
    var btn = document.getElementById(id);
    if(btn.innerHTML=="0"){
        btn.innerHTML = "1";
    } else {
        btn.innerHTML = "0";
    }
    var pos = parseInt(id.substring(4));

    var ogVal =stateTable[Math.floor(pos/size)][pos%size];
    if(ogVal==0){
        stateTable[Math.floor(pos/size)][pos%size] = 1;
    } else {
        stateTable[Math.floor(pos/size)][pos%size] = 0;
    }
    //console.log(stateTable);
    //console.log(multiplyMatrices(stateTable,stateTable));
    drawGraph();
}

drawGraph = function(){
    var directives = "dinetwork {node[shape=circle];";
    for(var i = 0 ; i < size ; i++){
        for(var j = 0; j <size; j++){
            if(stateTable[i][j]==1&&stateTable[j][i]==1){
                directives += i + " -- " + j+"; ";
            } else if(stateTable[i][j]==1) {
                directives += i +" -> " + j + "; ";
            }
        }
    }
    directives += "}";
    //console.log(directives);
    var container = document.getElementById("graph");
    var data = vis.parseDOTNetwork(directives);
    var options = {
        autoResize: true,
        height: '700px',
        width: '500px',
        clickToUse: false
      }

    
    var network = new vis.Network(container, data);
    network.setOptions(options);
    //"dinetwork {node[shape=circle]; 1 -> 1 -> 2; 2 -> 3; 2 -- 4; 2 -> 1 }"
}


validNodes = function (num) {
    return Number.isInteger(num) && num >= 1 && num <= 15;
}

/*
function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}
*/
calculateWays = function (){
    let inputVal;
    try {
        inputVal = parseInt(document.getElementById("lengthSteps").value);
    } catch (error) {
        alert("No es un numero");
        return;
    }

    if (!validNodes(inputVal)) {
        alert("numero invalido...");
        return;
    }
    var mat = stateTable;
    for(var i = 1; i < inputVal; i++){
        mat = multiplyMatrices(mat, stateTable);
    }
    console.log(mat);
}


const multiplyMatrices = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
       throw new Error('arguments should be in 2-dimensional array format');
    }
    let x = a.length,
    z = a[0].length,
    y = b[0].length;
    if (b.length !== z) {
       // XxZ & ZxY => XxY
       throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }
    let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    let product = new Array(x);
    for (let p = 0; p < x; p++) {
       product[p] = productRow.slice();
    }
    for (let i = 0; i < x; i++) {
       for (let j = 0; j < y; j++) {
          for (let k = 0; k < z; k++) {
             product[i][j] += a[i][k] * b[k][j];
          }
       }
    }
    return product;
 }
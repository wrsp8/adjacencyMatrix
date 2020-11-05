var stateTable;
var size;
var options = {
    autoResize: true,
    height: document.documentElement.clientHeight * 0.8 + "px",
    width: document.documentElement.clientWidth / 2 + "px",
    clickToUse: false
}
var network;
var power;
var powerMat;
var powerSet;
function generate() {

    let inputVal;
    try {
        inputVal = parseInt(document.getElementById("amountOfNodes").value);
    } catch (error) {
        alert("No es un número");
        return;
    }

    if (!validNodes(inputVal)) {
        alert("número invalido...");
        return;
    }
    size = inputVal;
    //generar tabla de data

    stateTable = [];
    for (var i = 0; i < inputVal; i++) {
        var row = [];
        for (var j = 0; j < inputVal; j++) {
            row.push(0);
        }
        stateTable.push(row);
    }
    var table = document.getElementById("buttonTable");
    table.innerHTML = "";
    //generar tabla de botones
    var row = 0;
    for (var i = 0; i < inputVal * inputVal; i++) {
        if (i == 0) {
            //imprimir fila de titulos
            let tr = document.createElement("tr");
            let corner = document.createElement("td");
            tr.appendChild(corner);
            for (var j = 0; j < inputVal; j++) {
                let td = document.createElement("td");
                td.innerHTML = j;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var j = 0; j < inputVal; j++, i++) {
            if (j == 0) {
                let td = document.createElement("td");
                td.innerHTML = row++;
                tr.appendChild(td);
            }
            var td = document.createElement("td");
            var btn = document.createElement("button");
            btn.innerHTML = "0";
            btn.id = "btn-" + i;
            btn.className = "btn btn-secondary"
            btn.onclick = function () { toggleButton(this.id); };
            if (i >= inputVal * inputVal) {
                break;
            } else {
                td.appendChild(btn);
                tr.appendChild(td);
            }
        }
        i--;
    }
    var steps = document.getElementById("steps");
    steps.className = "input-group mb-3";
    drawGraph();
    fillMatMul(null);
    power = null;
    describeVal(null);
    describeMat(null);
    powerSet =false;
}

toggleButton = function (id) {
    var btn = document.getElementById(id);
    if (btn.innerHTML == "0") {
        btn.innerHTML = "1";
    } else {
        btn.innerHTML = "0";
    }
    var pos = parseInt(id.substring(4));

    var ogVal = stateTable[Math.floor(pos / size)][pos % size];
    if (ogVal == 0) {
        stateTable[Math.floor(pos / size)][pos % size] = 1;
    } else {
        stateTable[Math.floor(pos / size)][pos % size] = 0;
    }
    //console.log(stateTable);
    //console.log(multiplyMatrices(stateTable,stateTable));
    drawGraph();
    if(powerSet)
        calculateWays();
}

drawGraph = function () {
    var directives = "dinetwork {node[shape=circle];";

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (stateTable[i][j] == 1 && stateTable[j][i] == 1) {
                if (i >= j)
                    directives += i + " -- " + j + "; ";
            } else if (stateTable[i][j] == 1) {
                directives += i + " -> " + j + "; ";
            }
        }
    }
    //make sure to draw all the nodes
    for(var i = 0; i < size; i++){
        directives += i + "; "
    }
    directives += "}";
    //console.log(directives);
    var container = document.getElementById("graph");
    var data = vis.parseDOTNetwork(directives);



    network = new vis.Network(container, data);
    network.setOptions(options);
    //"dinetwork {node[shape=circle]; 1 -> 1 -> 2; 2 -> 3; 2 -- 4; 2 -> 1 }"
    resizeCanvas();
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
calculateWays = function () {
    let inputVal;
    try {
        inputVal = parseInt(document.getElementById("lengthSteps").value);
    } catch (error) {
        alert("No es un número");
        return;
    }

    if (!validNodes(inputVal)) {
        alert("número invalido...");
        return;
    }
    var mat = stateTable;
    for (var i = 1; i < inputVal; i++) {
        mat = multiplyMatrices(mat, stateTable);
    }
    console.log(mat);
    fillMatMul(mat);
    powerMat =mat;
    power = inputVal;
    describeVal(null);
    describeMat(inputVal);
    powerSet =true;
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

fillMatMul = function (data){
    var table =document.getElementById("matMul");
    if(data==null){
        table.innerHTML ="";
        return;
    }
    table.innerHTML ="";
    for(var i = 0; i < size; i++){
        var tr = document.createElement("tr");
        for(var j = 0; j < size; j++){
            var td =document.createElement("td");
            //console.log(data[i][j]);
            td.innerText = data[i][j].toString();
            td.setAttribute("data-toggle","tooltip");
            td.setAttribute("title",i+","+j);
            td.setAttribute("i",i);
            td.setAttribute("j",j);
            td.onclick= function (){
                describeVal(this.getAttribute("i"),this.getAttribute("j"));
            };
            tr.appendChild(td);
            
        }
        table.appendChild(tr);
    }
}

//cambiar el tamanio de la ventana
function resizeCanvas() {
    // Get width and height of the window excluding scrollbars
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    if (network) {
        if (w >= 768) {
            let fact = size < 10? 1: 0.7;
            options = {
                autoResize: true,
                height: h * 0.8 + "px",
                width: (w* fact / 2) + "px",
                clickToUse: false
            }
        } else {
            options = {
                autoResize: true,
                height: h * 0.8 + "px",
                width: w * 0.8 + "px",
                clickToUse: false
            }
        }

        network.setOptions(options);
    }
}
window.addEventListener("resize", resizeCanvas);

//activar tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

describeVal = function(i,j){
    //console.log(i+" "+ j);
    
    var msg = document.getElementById("msgWays");
    if(i==null){
        msg.innerHTML = "";
    } else {
        if(power==1){
            msg.innerHTML = "Existen "+powerMat[i][j]+" caminos que pasan por 1 nodo, que inician en el nodo "+i+" y terminan en el nodo "+j;
        } else {
            msg.innerHTML = "Existen "+powerMat[i][j]+" caminos que pasan por "+power+" nodos, que inician en el nodo "+i+" y terminan en el nodo "+j;
        }
    }
}

describeMat = function(val){
    var msg = document.getElementById("msgMat");
    if(val == null){
       msg.innerHtml = "";
    } else {
        msg.innerHTML ="Matriz de adyacencia elevada a la "+val+ " (A<sup>"+val+"</sup>=)";
    }
}
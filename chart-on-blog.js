function walk(node,func){
    // iterate all of childeren of node with func
    func(node);
    node = node.firstChild
    while(node){
        walk(node,func);
        node = node.nextSibling;
    }
}

function parseMD(item, seperator=":"){
    const keyValue = (element) =>{
        //recursively find key-value
        //return [key, value] at every li stage
        //generate json at <ul> tag stage

        if(element.localName == "li"){
            // return [key, value]
            // value can be json if <li> has <ul>
            let text = element.textContent;
            if(text.indexOf(seperator) == -1){
                return [null, null];
            }
            let key = text.slice(0, text.indexOf(seperator)).trim();
            let val;
            let firstElementChild = element.firstElementChild;
            if(firstElementChild){
                //<li> has <ul>
                val = keyValue(firstElementChild)[1];
            }else{
                //last endpoint <li>
                val = text.slice(text.indexOf(seperator)+seperator.length, text.length).trim();
            }
            return [key, val]
        }else if(element.localName == "ul"){
            //explicitly <ul> tag
            //return json
            let json = {};
            let key,val;
            if(element.childElementCount == 0){
                return json;
            }
            let children = Array.from(element.children)
            children.map( (liItem)=>{
                [key,val] = keyValue(liItem);
                if(key){
                    json[key] = val;
                }
            });
            return [null, json] // <ul> tag has no name
        }
    }

    ////////// json that has number key -> arr //////////
    const isJsonNumKeys = (json)=>{
        for (let key in json){
            if(Number.isNaN(Number(key))){
                return false
            }
        }
        return true
    }
    const jsonNumKey2Arr = (item)=>{
        let arr = []
        for (let key in item){
            arr[key] = item[key]
        }
        return arr
    }

    /////////// str -> arr ////////////
    const isArrFormat = (str)=>{
        if(typeof str !== "string"){
            return false
        }
        str = str.trim()
        if(str.startsWith("[") && str.endsWith("]")){
            return true
        }else{
            return false
        }
    }

    const str2arr = (str)=>{
        str = str.trim()
        str = str.slice(1, str.length-1) //remove "[", "]"
        let arr = str.split(',')
        arr = arr.map( (item) => {
            let num = Number(item)
            if(Number.isNaN(num)){
                return item
            }else{
                return num
            }
        })
        return arr
    }

    const fitJsonForChart = (item)=>{
        if(typeof item === "object"){
            //json {key : value}
            if(isJsonNumKeys(item)){
                // convert json that has number keys into array
                item = jsonNumKey2Arr(item)
            }
            for (let key in item){
                // recursively change
                item[key] = fitJsonForChart(item[key])
            }
            return item
        }else{
            //value (final state of recursion)
            if(isArrFormat(item)){
                // convert str that has array format into array
                return str2arr(item)
            }else{
                return item
            }
        }
    }

    let value
    value = keyValue(item)[1]
    value = fitJsonForChart(value)
    return value
}

function findChart(topNode, parse, indicator){
    var charts = [];
    const findNode = (node)=>{
        if(node && node.localName == "ul"){
            let firstElement = node.firstElementChild
            if(firstElement &&  firstElement.textContent.indexOf(indicator)!==-1){
                let s_idx = node.textContent.indexOf(indicator);
                let e_idx = node.textContent.lastIndexOf(indicator);
                if(s_idx !== -1 && e_idx !== -1){
                    charts.push(node)
                }
            }
        }
    }
    walk(topNode, findNode);
    charts.map((item)=>{console.log(item)})
    charts = charts.map( (item) => ( {node: item, json: parse(item)} ))
                    .filter(item => item.json != undefined)
                    .filter(item => item.json.type && item.json.data && item.json.data.datasets); //check if it is the JSON for chart.js or not
    return charts
}

function findChartMD(topNode, indicator="%%"){
    return findChart(topNode, parseMD, indicator);
}

function drawChart(chartJsons, chartIdPrefix="chart-on-"){
    //replace node with chart canvas
    const idPrefix = chartIdPrefix;

    return chartJsons.map( (element,idx)=>{
        let ctx = document.createElement("canvas");
        ctx.setAttribute("id",idPrefix + idx);
        element.node.parentNode.replaceChild(ctx, element.node);
        ctx = document.getElementById(chartIdPrefix+idx);
        return new Chart(ctx, element.json)
        })
}

var previous_onload = window.onload
window.onload = function(){
    if(previous_onload){
        previous_onload();
    }
    let body = document.getElementsByTagName("body")[0];
    let chartJsons = findChartMD(body);
    let chart = drawChart(chartJsons)
}
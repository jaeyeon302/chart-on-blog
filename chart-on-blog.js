/*
Jaeyeon-park

purpose : 
    convert the data written in markdown list style \
    into the json for chart.js and draw the chart the place where the editor wrote the data.

version change
    - 2020.07.09 : parse json text into the json object
    - 2020.07.10 : change the way to write the data (json style -> markdown list style)
*/

function walk(node,func){
    // iterate all of childeren of node with the given func
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
        //key-value string is seperated by seperator(default value is :)
        //return [key, value] at every <li> stage
        //merge [key, value] into the json at <ul> tag stage

        if(element.localName == "li"){
            //<li> stage
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
            //explicitly <ul> stage
            //return json
            let json = {};
            let key,val;
            if(element.childElementCount == 0){
                return [null,json];
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

    const isBoolean = (str)=>{
        if(typeof str !== "string"){
            return false
        }
        str = str.trim()
        if(str == "false" || str == "true" ){
            return true
        }else{
            return false
        }
    }
    const str2Bool = (str)=>{
        str = str.trim()
        return str == "true"
    }

    const fitJsonForChart = (item)=>{
        if(typeof item === "object"){
            //item is json {key : value}
            if(isJsonNumKeys(item)){
                // convert the json that has number keys into array
                item = jsonNumKey2Arr(item)
            }
            for (let key in item){
                // recursively go deep
                // pass the value 
                item[key] = fitJsonForChart(item[key])
            }
            return item
        }else{
            //item is value (final state of recursion)
            if(isArrFormat(item)){ // convert the str into the array if the str has array format
                return str2arr(item)
            }else if(isBoolean(item)){
                return str2Bool(item)
            }else if(Number(item)){
                return Number(item)
            }else{
                return item
            }
        }
    }

    let value
    value = keyValue(item)[1] //get value
    value = fitJsonForChart(value)
    return value
}

function findChart(topNode, parse, indicator){
    var charts = [];
    const findNode = (node)=>{
        // Assumption :
        // the data was written in markdown list style
        // the given node will be the <ul> generated by markdown engine (No matter which markdown engine was used)
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

    walk(topNode, findNode); // iterate all nodes with findNode function
    charts.map((item)=>{console.log(item)})
    charts = charts.map( (item) => ( {node: item, json: parse(item)} ))
                    .filter(item => item.json != undefined)
                    .filter(item => item.json.type && item.json.data && item.json.data.datasets); 
                    //check if it is the JSON for chart.js or not
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
    //render chart after markdown text is rendered by markdown engine
    if(previous_onload){
        previous_onload();
    }
    let body = document.getElementsByTagName("body")[0];
    let chartJsons = findChartMD(body);
    let chart = drawChart(chartJsons)
}
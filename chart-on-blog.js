function walk(node,func){
    // iterate all of childeren of node with func

    func(node);
    node = node.firstChild
    while(node){
        walk(node,func);
        node = node.nextSibling;
    }
}
function parseJSON(strItem){
    var err;
    var item = strItem.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '); //add quote("") to keyword
    try{
        [err,item] = [null, JSON.parse(item)];
    }catch(e){
        return [e,undefined];
    }
    if( typeof item === "object" && item !== null){
        return [null,item];
    }
    return [null, undefined];
}
function findChartJson(topNode, indicator="%%"){
    var jsons = []
    const findNode = (node)=>{
        let firstChild = node.firstChild
        if(node && firstChild && node.nodeType == 1 && firstChild.nodeType == 3){
            if(firstChild.textContent.indexOf(indicator) !== -1){
                let s_idx = node.textContent.indexOf(indicator);
                let e_idx = node.textContent.lastIndexOf(indicator);
                if(s_idx !== -1 && e_idx !== -1){
                    jsons.push({
                        node:node,
                        json:node.textContent.slice(s_idx+indicator.length,e_idx)
                    })
                }
            }
        }
    }

    walk(topNode,findNode);
    console.log(jsons)
    jsons = jsons.map(item => ({ node: item.node, json: parseJSON(item.json)[1] }))
                 .filter(item => item.json != undefined)
                 .filter(item => item.json.type && item.json.data && item.json.data.datasets); //check if it is the JSON for chart.js or not
    console.log(jsons)
    return jsons;
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
    //start automatically after loading is complete
    if(previous_onload){
        previous_onload();
    }
    let body = document.getElementsByTagName("BODY")[0];
    let chartJsons = findChartJson(body);
    let result = drawChart(chartJsons)
}

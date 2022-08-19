import { dragLock } from "./map.js";
import { parseToiletData } from "./store.js";

function parsingSubmitData(data){
    var obj = {};
    var formData =new FormData(document.getElementById("form1"));
    obj["PK"] = data[0]["PK"]["S"]
    for(let [name, value] of formData) {
        if(name == "pk") value=parseInt(value);
        else if(name == "lat" || name == "lng") value=parseFloat(value);
        else if(value == "YES") value=true;
        else if(value == "NO") value=false;
        else if(value == "선택 안함") value=false;
        obj[name] = value;
    }
    return JSON.stringify(obj)
}
export function submitData(data) {
    let jsonData = JSON.parse(parsingSubmitData(data));
    let jsonSet = { 
        "input" : jsonData,
        "user" : "user01"
    };
    console.log(jsonSet)
    alert("데이터 전송\n" + JSON.stringify(jsonSet))
    // fetch('',{
    //     method: 'POST',
    //     cache: 'no-cache',
    //     headers : {
    //         'Content-Type': 'application/json'
    //     },
    //     body:jsonData
    //     })
    //     .then((response) => response.text())
    //     .then((data) => {
    //     });
} 
export function formlists(data){
    let formlist = "";
    for(let [key, value] of parseToiletData) {
        if(['PK', 'CRS', 'lat', 'lng', 'bjdongCd'].includes(key)){
            formlist += formFixed(key, value, data)
        }else{
            formlist += formSelect(key, value)            
        }
    }
    formlist += '<div id="button-wrapper"><button id="button-markerinfo" type="button" class="btn btn-primary">SUBMIT</button></div></form>'
    return formlist;
} 
export function formFixed(key, value, data){  
    try {
        return '<div class="mb-3 mt-3">'+
        '<label class="form-label">' + value + '</label>'+
        '<input type="text" class="form-control" id='+ key+' value='+ data[0][key]['S']+' name='+ key +' disabled >'+
        '</div>'
    } catch (error) {
        console.log("fail to get markerInfo")
    }
}
 export function formSelect(key, value){
    return  '<div class="mb-3 mt-3">' + 
    '   <label for='+ key + ' class="form-label">'+value+':</label>' + 
    '   <select class="form-select" id='+ key+ ' name='+ key+ '>' +
    '       <option>선택 안함</options>' + 
    '       <option>YES</option>' + 
    '       <option>NO</option>' + 
    '   </select>' + 
    '</div>'
 }

 export function deleteNode(){
    let parentnode = document.getElementById('map_inner')
    try {
        while(parentnode.hasChildNodes){
            let element = parentnode.childNodes;
            element[0].parentNode.removeChild(element[0]);
        }
    } catch (error) {
        console.log("element is null");
    }
}
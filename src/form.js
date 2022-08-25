import { dragLock } from "./map.js";
import { parseToiletData } from "./store.js";

function parsingSubmitData(data){
    let obj = {};
    let formData =new FormData(document.getElementById("form1"));
    // obj["PK"] = data[0]["PK"]["S"]
    for(let [name, value] of formData) {
        console.log(name + " : " + value);

        if(name == "PK") value=parseInt(value);
        else if(name == "lat" || name == "lng") value=parseFloat(value);
        else if(value == "YES") value=true;
        else if(value == "NO") value=false;
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
    formlist += '<div id="button-wrapper"><input type="button" id="button-markerinfo" value ="제출"></input></div></form>'
    return formlist;
} 
export function formFixed(key, value, data){  
    try {
        return '<div class="mb-3 mt-3">'+
        '<label class="form-label" hidden>' + value + '</label>'+
        '<input type="hidden" class="form-control" id='+ key+' value='+ data[0][key]['S']+' name='+ key +'>'+
        '</div>'
    } catch (error) {
        console.log("fail to get markerInfo")
    }
}

 export function formSelect(key, value){
    return '<div class="mb-3 mt-3" id="form-radio">' 
    + '<label for=' + key + 'class="form-label">' + value +':</label>'
    + '<div><input class="form-radio" type="radio" name="'+key+'" value="YES"><label for="yes">YES</label>'
    + '<input class="form-radio" type="radio" name="'+key+'" value="NO" checked="checked"><label for="no">NO</label></div>'   
    +'</div>'
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
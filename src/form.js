import { makeFormdata } from "./formData.js";
import { formModule } from "./formModule.js";
import { localStorageHandler } from "./localStorage.js";
import { mapResize } from "./map.js";
import { knockknockHandler } from "./resource.js";
import { parseToiletData, setRequireOptions } from "./store.js";

function parsingSubmitData(){
    let obj = {};
    let formData =new FormData(document.getElementById("form1"));
    for(let [name, value] of formData) {
        if(name == "lat" || name == "lng" || name == "entryFloor") value=parseFloat(value);
        else if(name == "toiletType") {
            if(value === "개방형화장실") value="N"
            else if(value === "공공시설화장실") value="G"
            else if(value === "장애인화장실 없음") value="E"
            else value = "NULL"
        }
        else if(value == "YES") value=true;
        else if(value == "NO") value=false;
        obj[name] = value;
        console.log(value);
    }
    return JSON.stringify(obj)
}

export async function submitData(data) {
    let jsonData = JSON.parse(parsingSubmitData());
    let jsonSet = { 
        "method": "UPDATE_ITEM",
        "input" : jsonData,
        "user" : "user01",
        "PK": data[0]['PK']['S'].toString()
    };
    console.log(jsonSet)
    let response = await fetch(knockknockHandler.getUrl() + '/details',setRequireOptions(JSON.stringify(jsonSet), null));
    let result = await response.text()
} 

export async function applyData(key){
    const formObj = {
        'PK' : key,
        'user' : 'user01',
        'method' : 'APPLY_HISTORY',
        'NUM' : 0
    }
    let formData = makeFormdata(formObj);
      try {
        let response = await fetch(knockknockHandler.getUrl() + '/details', setRequireOptions(formData, null))
        let result = await response.text()
        let markerInfotmation = await JSON.parse(result)
        console.log(markerInfotmation)
        mapResize(0);   
    } catch (error) {
        console.log(error)   
    }
    localStorageHandler.clear();
}

export async function resetData(key){
    const formObj = {
        'PK' : key,
        'user' : 'user01',
        'method' : 'CLEAR_INFO'
    }
    let formData = makeFormdata(formObj);
    try {
        let response = await fetch(knockknockHandler.getUrl() + '/details', setRequireOptions(formData, null))
        if(response.ok){
            alert('초기화 되었습니다!')
            return response.text();
        }else{
            alert("초기화에 실패하였습니다. 이미 초기화 된게 아닌지 확인하십시오.")
        }
    } catch (error) {
    }
    localStorageHandler.clear();
}

export function setFormlist(){
    let parentNode = document.getElementById("marker-content");
    let newNode = document.createElement('form');
    newNode.setAttribute('id', 'form1');
    newNode.setAttribute('class', 'form1');
    newNode.innerHTML=formlists();
    parentNode.appendChild(newNode);

}
export function formlists(){
    let formlist = '';
    for(let [key, value] of parseToiletData) {
        console.log(key + " : " + value);
        if(['lat', 'lng'].includes(key)){
            formlist += formModule.formFixed(key, value)
        }else if(['toiletType'].includes(key)){
            formlist += formModule.formSelect(key, value)   
        }else if(['entryFloor'].includes(key)){
            formlist += formModule.formInput(key, value)
        }else{
            formlist += formModule.formRadio(key, value)   
        }
    }
    let buttonNode = '<div id="button-wrapper">'+ 
                     '<input type="button" id="button-marker-info" value ="제출"></input>' + 
                     '<input type="button" id="button-marker-reset" value="초기화"></input>' + 
                     '</div></form>'    
    formlist += buttonNode
    return formlist;
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

export function deleteNodeClass(val){
    let parentnode = document.querySelector(val);
    try {
        while(parentnode.hasChildNodes){
            let element = parentnode.childNodes;
            element[0].parentNode.removeChild(element[0]);
        }
    } catch (error) {
        console.log("element is null");
    }
}
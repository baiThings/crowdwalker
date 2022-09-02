import { mapResize } from "./map.js";
import { awsUrl, makeFormdata, myStorage, parseToiletData, setRequireOptions } from "./store.js";

function parsingSubmitData(){
    let obj = {};
    let formData =new FormData(document.getElementById("form1"));
    for(let [name, value] of formData) {
        if(name == "lat" || name == "lng") value=parseFloat(value);
        else if(name == "toiletType") {
            if(value === "개방화장실") value="N"
            else if(value === "공공화장실") value="G"
            else if(value === "가족화장실") value="F"
            else value = "NULL"
        }
        else if(value == "YES") value=true;
        else if(value == "NO") value=false;
        obj[name] = value;
    }
    return JSON.stringify(obj)
}

export async function submitData(data) {
    let jsonData = JSON.parse(parsingSubmitData());
    console.log(data[0]['PK']['S'].toString())
    let jsonSet = { 
        "method": "UPDATE_ITEM",
        "input" : jsonData,
        "user" : "user01",
        "PK": data[0]['PK']['S'].toString()
    };
    console.log(jsonSet)
    let response = await fetch(awsUrl + '/details',setRequireOptions(JSON.stringify(jsonSet), null));
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
        let response = await fetch(awsUrl + '/details', setRequireOptions(formData, null))
        let result = await response.text()
        let markerInfotmation = await JSON.parse(result)
        console.log(markerInfotmation)
        mapResize(0);   
    } catch (error) {
        console.log(error)   
    }
}

export async function resetData(key){
    const formObj = {
        'PK' : key,
        'user' : 'user01',
        'method' : 'CLEAR_INFO'
    }
    let formData = makeFormdata(formObj);
    try {
        let response = await fetch(awsUrl + '/details', setRequireOptions(formData, null))
        if(response.ok){
            alert('초기화 되었습니다!')
            return response.text();
        }else{
            alert("초기화에 실패하였습니다. 이미 초기화 된게 아닌지 확인하십시오.")

        }
    } catch (error) {
    }
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
        if(['lat', 'lng'].includes(key)){
            formlist += formFixed(key, value)
        }else if(['toiletType'].includes(key)){
            formlist += formSelect(key, value)   
        }else{
            formlist += formRadio(key, value)   
        }
    }
    let buttonNode = '<div id="button-wrapper">'+ 
                     '<input type="button" id="button-marker-info" value ="제출"></input>' + 
                     '<input type="button" id="button-marker-reset" value="초기화"></input>' + 
                     '</div></form>'  
                
    formlist += buttonNode
    return formlist;
} 
export function formFixed(key, value){  

    try {
        return '<div class="mb-3 mt-3 form-fixed">'+
        '<label class="form-label" >' + value + '</label>'+
        '<input type="text" class="form-control" id='+ key+' value='+ JSON.parse(myStorage.getItem(key))+' name='+ key +' readonly>'+
        '</div>'
    } catch (error) {
        console.log("fail to get markerInfo")
    }
}

 export function formRadio(key, value){

    let tmp;
    try {
        if(JSON.parse(myStorage.getItem('data'))[0][('D'+ key)]['BOOL']){
            tmp = '<input class="form-radio" type="radio" name="'+key+'" value="YES" checked="checked"><label for="yes">YES</label>'
                    + '<input class="form-radio" type="radio" name="'+key+'" value="NO"><label for="no">NO</label>'
        }else{
            tmp = '<input class="form-radio" type="radio" name="'+key+'" value="YES" ><label for="yes">YES</label>'
                    + '<input class="form-radio" type="radio" name="'+key+'" value="NO" checked="checked"><label for="no">NO</label>'
        }
    } catch (error) {
        tmp = '<input class="form-radio" type="radio" name="'+key+'" value="YES" ><label for="yes">YES</label>'
        + '<input class="form-radio" type="radio" name="'+key+'" value="NO" checked="checked"><label for="no">NO</label>'
    }
   
    let node =  '<div class="mb-3 mt-3" id="form-radio">' 
    + '<label for=' + key + 'class="form-label">' + value +':</label>'
    + '<div>' + tmp + '</div>'   
    +'</div>'

    return node;
 }
export function formSelect(key, value){
    let node = "";
    try {
        let toiletType = JSON.parse(myStorage.getItem('data'))[0]["DtoiletType"]['S']

        if(toiletType === 'N'){
            node =     
            '       <option>선택</options>' + 
            '       <option>공공화장실</options>' + 
            '       <option selected>개방화장실</option>' + 
            '       <option>가족화장실</option>' 
        }else if(toiletType === "G"){
            node =     
            '       <option>선택</options>' + 
            '       <option selected>공공화장실</options>' + 
            '       <option>개방화장실</option>' + 
            '       <option>가족화장실</option>'
        }else if(toiletType === "F"){
            node =     
            '       <option>선택</options>' + 
            '       <option>공공화장실</options>' + 
            '       <option>개방화장실</option>' + 
            '       <option selected>가족화장실</option>'
        }else{
            node =     
            '       <option selected>선택</options>' + 
            '       <option>공공화장실</options>' + 
            '       <option>개방화장실</option>' + 
            '       <option>가족화장실</option>'
        }
    } catch (error) {
        node =     
            '       <option selected>선택</options>' + 
            '       <option>공공화장실</options>' + 
            '       <option>개방화장실</option>' + 
            '       <option>가족화장실</option>'
    }
   
    return  '<div class="mb-3 mt-3 form-fixed">' + 
    '   <label for='+ key + ' class="form-label">'+value+':</label>' + 
    '   <select class="form-select-list" id='+ key+ ' name='+ key+ '>' +
        node + 
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
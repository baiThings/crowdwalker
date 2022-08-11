function parsingSubmitData(){
    var obj = {};
    var formData =new FormData(document.getElementById("form1"));
    for(let [name, value] of formData) {
        if(name == "pk") value=parseInt(value);
        else if(name == "lat" || name == "lng") value=parseFloat(value);
        else if(value == "YES") value=true;
        else if(value == "NO") value=false;
        else if(value == "선택 안함") value=null;
        obj[name] = value;
    }
    return JSON.stringify(obj)
}
export function submitData() {
    var jsonData = parsingSubmitData();
    alert("데이터 전송\n" + jsonData)
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
export function formFixed(key, value, markerInfo){  
    try {
        return '<div class="mb-3 mt-3" id="content_list">'+
        '<label class="form-label">' + value + '</label>'+
        '<input type="text" class="form-control" id='+ key+' value='+ key+' name='+ key +'>'+
        '</div>'
    } catch (error) {
        console.log("fail to get markerInfo")
    }
}
 export function formSelect(key, value){
    return  '<div class="mb-3" id="content_list">' + 
    '   <label for='+ key + ' class="form-label">'+value+':</label>' + 
    '   <select class="form-select" id='+ key+ ' name='+ key+ '>' +
    '       <option>선택 안함</options>' + 
    '       <option>YES</option>' + 
    '       <option>NO</option>' + 
    '   </select>' + 
    '</div>'
 }

 export function deleteNode(){
    var parentnode = document.getElementById('map_content')
    var element = document.getElementById('content_list')
    while(element){
        try {
            element = document.getElementById('content_list')
            element.parentNode.removeChild(element)
        } catch (error) {
            console.error("element is null");
        }
    }
    var newNodeForm = document.createElement('div')
    newNodeForm.setAttribute('id', 'content_list')
    parentnode.appendChild(newNodeForm)
 }


function auth() {
    console.log("hello world")
    var formData = new FormData(form1);
    var obj = {};
    // formData = $('#form1') // serialize 사용
    for(let [name, value] of formData) {
        console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
        if(name == "pk") value=parseInt(value)
        else if(name == "lat" || name == "lng") value=parseFloat(value)
        else if(value == "YES") value=true
        else if(value == "NO") value=false
       
        obj[name] = value;
        console.log( obj[name])
        console.log(typeof(value)) 
    }
    var jsonData = JSON.stringify(obj);
    console.log(jsonData)
     
    $.ajax({
        url: "https://icqx7s6y94.execute-api.ap-northeast-2.amazonaws.com/default/db-interface",
        type: "GET",
        cache: false,
        data: jsonData, 
        success: function(data){
            console.log(data)
        },
        error: function (request, status, error){        
            console.log(error)
        }
    }) 
} 

// export function toilet_form(chk_list){
//     var i = 0;
//     console.log(i++)
//     var mapContainer = document.getElementById('map');
//     mapContainer.style.height = '50%'; 
//     var parentnode = document.getElementById('map_content')
//     var element = document.getElementById('content_list')
//     while(element){
//         try {
//             element = document.getElementById('content_list')
//             element.parentNode.removeChild(element)
//         } catch (error) {
//             console.error("element is null");
//         }
//     }
//     for (var [key, value] of chk_list) {
//         var newNode = document.createElement('div')
//         // newNode.innerHTML="<div id='content_list'>"+ key +' : ' + value +'</div>'
//         newNode.innerHTML=                 
//             '<div class="mb-3">' + 
//             '   <label for='+ key + ' class="form-label">'+value+':</label>' + 
//             '   <select class="form-select" id='+ key+ ' name='+ key+ '>' +
//             '       <option>YES</option>' + 
//             '       <option>NO</option>' + 
//             '   </select> </div>'
//         parentnode.appendChild(newNode)
//     }
// }
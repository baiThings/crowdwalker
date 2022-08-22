import { makeCarousel } from "./component.js";
import { deleteNode,formlists,submitData } from "./form.js";
import { changeDragLock, clearMarkers, clusterer, dragLock, mapChangeSize, mapInit, mapSetCenter } from "./map.js";
import { getMarkerInformation, getMarkerKey, setRequireOptions } from "./store.js";

// 마커 이미지 
var imageSrc_RedMarker = '../resource/marker_red.png', // 마커이미지의 주소입니다
    imageSrc_GreenMarker = '../resource/marker_green.png', 
    imageSrc_GreyMarker = '../resource/marker_grey.png',
    imageSize = new kakao.maps.Size(34, 34), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(10, 20)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다. (+왼쪽, +위쪽)
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImageRedMarker = new kakao.maps.MarkerImage(imageSrc_RedMarker, imageSize, imageOption),
    markerImageGreenMarker = new kakao.maps.MarkerImage(imageSrc_GreenMarker, imageSize, imageOption),
    markerImageGreyMarker = new kakao.maps.MarkerImage(imageSrc_GreyMarker, imageSize, imageOption)

export function makeMarker(pos, pk, img){
    return new kakao.maps.Marker({
        // map: map, // 마커를 표시할 지도
        position: pos, // 마커를 표시할 위치
        title : pk, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다  
        image : img
    });
}

export function spreadMarkers(mapLat, mapLng, mapLevel){
    getMarkerKey(mapLat, mapLng, mapLevel).then((toilets) => {
        clusterer.clear();
        let markers= [];
        try {
            for(let i = 0; i < toilets.length; i++){
                let latlng = toilets[i]['geoJson']['S'].split(',')
                let marker = makeMarker(new kakao.maps.LatLng(latlng[0], latlng[1]), toilets[i]['PK']['S'], markerImageRedMarker)
                kakao.maps.event.addListener(marker, 'click', function(){
                    getMarkerInformation(marker.getTitle()).then((data)=>{
                        deleteNode();
                        setMarkerInformation(data, marker)
                        if(marker.getDraggable() != true && dragLock){
                            changeDragLock();
                            clearMarkers();
                            mapInit();
                        }else if(marker.getDraggable() && dragLock == false) changeDragLock();
                    });
                })
                markers.push(marker)
            }
        } catch (error) {
            console.log("Now not downloading Marker Information\n " + error)
        }
        clusterer.addMarkers(markers);
    })
}
function createElement(e, file) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.setAttribute('src', e.target.result);
    img.setAttribute('data-file', file.name);
    li.appendChild(img);

    return li;
  }
function getImageFiles(e, m){
    const unploadFiles = [];
    const files = e.currentTarget.files;
    console.log(files)
    const imagePreview = document.querySelector('.img-preview');

    console.log(imagePreview)
    Array.from(files).forEach(file => {
        unploadFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = createElement(e, file);
            imagePreview.appendChild(preview);
        }
        reader.readAsDataURL(file);
        console.log(file)
    })
    console.log(m)
    uploadImage(files, m)
}

async function uploadImage(files, m){
    let formdata = new FormData();
    console.log(m.getTitle())
    // formdata.append('PK', m.getTitle());
    for(let i = 0; i < files.length; i++){
        formdata.append('file'+ i, files[i]);
    }
    for (const key of formdata.keys()) {
        console.log(key + " : " + formdata.get(key).name);
    }
    console.log(formdata)
    try {
        let response = await fetch('https://10mgfgym1i.execute-api.ap-northeast-2.amazonaws.com/default/-Test', setRequireOptions(formdata, controller.signal))
        let result = await response.text();
        return result; 
    } catch (error) {
        console.log(error)
    }
}
export function setMarkerInformation(data, marker){ 
    mapChangeSize(marker.getPosition())
    let parentNode = document.getElementById("map_inner")
    parentNode.style.height='20%'
    let newNode = document.createElement("div")
    newNode.setAttribute('id', 'marker-content tmp-node')
    try {
        newNode.innerHTML = "<div id='marker-title'>" + data[0]['bldNm']['S'] + " " + data[0]['dongNm']['S'] + "</div>"
    } catch (error) {
        console.log(error)
        newNode.innerHTML = "<div id='marker-title'>" + data[0]['bldNm']['S'] + "</div>"
    }
    parentNode.appendChild(newNode)
    
    document.getElementById('marker-title').addEventListener("click", setDetailMarkerInformation(data, marker));
}

function setDetailMarkerInformation(data, marker){
    return function(){
        // mapChangeSize(50)
        // .then((pos) => function(){
        //     console.log("pos")
        //     mapSetCenter(pos);
        // })
        // .catch(function(err){
        //     console.log(err)
        // })
        let parentNode = document.getElementById("map_inner");

        parentNode.style.height='60%';
        makeCarousel();
        let imgNode = document.createElement("div");
        imgNode.setAttribute('id', "marker-toilet-img");
        imgNode.innerHTML = 
            "<input type='file' class='img-upload' required multiple></input>" +
            "<ul class='img-preview'></ul>"
        parentNode.appendChild(imgNode);
        document.querySelector('.img-upload').addEventListener('change', function(e){
            getImageFiles(e, marker);
        });
        
    
        let newNode = document.createElement('form');
        newNode.setAttribute('id', 'form1');
        newNode.setAttribute('class', 'was-validated');
        newNode.setAttribute('name', 'form1');
        newNode.innerHTML=formlists(data);
        
        parentNode.appendChild(newNode);
        document.getElementById("button-markerinfo").addEventListener('click', function(event){
            if(dragLock == true) changeDragLock();
            // clearMarkers();
            submitData(data)
            marker.setDraggable(false);
            marker.setImage(markerImageGreenMarker);
        })
        
    }
}
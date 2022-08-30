import { makeCarousel, touchScroll } from "./component.js";
import { applyData, deleteNode,formlists,setFormlist,submitData } from "./form.js";
import { changeDragLock, clearMarkers, clusterer, dragLock, mapChangeSize, mapInit, mapMove, mapReset, mapResize, mapSetCenter } from "./map.js";
import { getMarkerInformation, getMarkerKey, myStorage, setRequireOptions } from "./store.js";

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
                let markerImg = '';
                let latlng = toilets[i]['geoJson']['S'].split(',')
                if(toilets[i].hasOwnProperty(['DtoiletType'])) markerImg = markerImageGreenMarker
                else markerImg = markerImageRedMarker
                let marker = makeMarker(new kakao.maps.LatLng(latlng[0], latlng[1]), toilets[i]['PK']['S'], markerImg)
                kakao.maps.event.addListener(marker, 'click', function(){
                    getMarkerInformation(marker.getTitle()).then((data)=>{
                        myStorage.setItem("data", JSON.stringify(data));
                        myStorage.setItem("PK", data[0]["PK"]["S"])
                        mapSetCenter(marker.getPosition());
                        deleteNode();
                        setMarkerInformation()
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
    img.setAttribute('id', "img-preview-node")
    li.appendChild(img);

    return li;
  }
function getImageFiles(e){
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
    uploadImage(files)
}

async function uploadImage(files){
    let formdata = new FormData();

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
export function setMarkerInformation(){ 
    let data = JSON.parse(myStorage.getItem('data'))
    
    let parentNode = document.getElementById("map_inner")
    let toiletTitle;
    parentNode.style.height='20%'
    let newNode = document.createElement("div")
    newNode.setAttribute('id', 'marker-content')
    console.log(data[0])
    if(Object.hasOwn(data[0], 'dongNm') && Object.hasOwn(data[0], 'bldNm')){
        let dongNm = data[0]['dongNm']['S'];
        let bldNm = data[0]['bldNm']['S'];
        if(dongNm != bldNm){
            toiletTitle = data[0]['bldNm']['S'] + "  " + data[0]['dongNm']['S'];
        }else toiletTitle = data[0]['dongNm']['S'];
    }else if(Object.hasOwn(data[0], 'dongNm')){
        toiletTitle = data[0]['dongNm']['S'];
    }else{
        toiletTitle = data[0]['bldNm']['S'];
    }
    newNode.innerHTML = "<div id='marker-title'>" + toiletTitle + "</div>"
    newNode.innerHTML += "<div id='marker-summary'>" + data[0]['newPlatPlc']['S'] + "</div>"
    newNode.innerHTML += "<div id='marker-summary-button'>" + 
                            "<div id='marker-summary-button-input' type='input'>사진 등록</div>" + 
                            "<div id='marker-summary-button-input' type='input'>세부 정보 입력</div>" + 
                         "</div>";
    parentNode.appendChild(newNode)
    document.getElementById('map').style.bottom = '10%';
    touchScroll();
    document.querySelectorAll('#marker-summary-button-input')[0].addEventListener("click", uploadImageToilet);
    document.querySelectorAll('#marker-summary-button-input')[1].addEventListener("click", setDetailMarkerInformation);
}

export function setImageToilet(){
        // let data = JSON.parse(myStorage.getItem('data'))
        document.getElementById('map').style.bottom = "30%";
        let contentNode = document.getElementById("map_inner");
        let parentNode = document.getElementById("marker-content");        
        document.getElementById('marker-summary-button').remove();
        setTimeout(function(){
            makeCarousel();
            document.getElementById('carousel-wrapper').style.height='calc(100% - 4rem)';
            document.getElementById('marker-title').removeEventListener("click", setImageToilet); 
            document.getElementById('marker-title').addEventListener("click", function(){
                deleteNode();
                setMarkerInformation()
            }); 
        },250)
        contentNode.style.height='60%';
}
function uploadImageToilet(){
        document.getElementById('map').style.bottom = "20%";
        let contentNode = document.getElementById("map_inner");
        let parentNode = document.getElementById("marker-content");
        // parentNode.style.backgroundColor="#0d6efd"        
        
        document.getElementById('marker-summary-button').remove();
        let imgNode = document.createElement("div");

        imgNode.setAttribute('id', "marker-toilet-img");
        imgNode.innerHTML = 
            "<input type='file' class='img-upload' required multiple></input>" +
            "<ul class='img-preview'></ul>"
        parentNode.appendChild(imgNode);
        document.querySelector('.img-upload').addEventListener('change', function(e){
            getImageFiles(e);
        });
        document.getElementById('marker-title').removeEventListener("click", setImageToilet); 
        document.getElementById('marker-title').addEventListener("click", function(){
            deleteNode();
            setMarkerInformation();
        }); 
       
        contentNode.style.height='40%';


}


function setDetailMarkerInformation(){
        document.getElementById('map').style.bottom = "30%";
        let data = JSON.parse(myStorage.getItem('data'))
        console.log(data[0])
        document.getElementById('marker-summary-button').remove();

        setFormlist()
        document.getElementById("button-markerinfo").addEventListener('click', function(event){
            if(dragLock == true) changeDragLock();
            clearMarkers();
            submitData(data).then(() => {
                console.log(data[0]['PK']['S'])
                applyData(data[0]['PK']['S'])
                let lat = data[0]['geoJson']['S'].split(',')[0];
                let lng = data[0]['geoJson']['S'].split(',')[1];
                mapSetCenter(new kakao.maps.LatLng(lat, lng));
                mapInit();
                alert('등록되었습니다!')
            })
        })
        document.getElementById('marker-title').removeEventListener("click", setImageToilet); 
        document.getElementById('marker-title').addEventListener("click", function(){
            deleteNode();
            setMarkerInformation();
        });
        document.getElementById('map_inner').style.height='60%'
}

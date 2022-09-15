import { makeCarousel, touchScroll } from "./component.js";
import { uploadImageToilet } from "./file.js";
import { applyData, deleteNode,resetData,setFormlist,submitData } from "./form.js";
import { localStorageHandler } from "./localStorage.js";
import { changeDragLock, clearMarkers, clusterer, dragLock, mapContentChangeSize, mapInit, mapResize, mapSetCenter } from "./map.js";
import { getMarkerInformation, getMarkerKey} from "./store.js";


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
                        // myStorage.setItem("data", JSON.stringify(data));
                        localStorageHandler.clear()
                        localStorageHandler.setData(JSON.stringify(data));
                        localStorageHandler.setPosition(marker.getPosition().getLat(), marker.getPosition().getLng());
                        localStorageHandler.setPK(marker.getTitle());
                        deleteNode();
                        mapSetCenter(marker.getPosition());
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

export function setMarkerInformation(){ 
    let data = localStorageHandler.getData();
    
    let parentNode = document.getElementById("map_inner")
    let toiletTitle;
    mapContentChangeSize(20);
    setTimeout(() =>{
        mapResize(10);
    },0)
    // parentNode.style.height='20%'
    let newNode = document.createElement("div")
    newNode.setAttribute('id', 'marker-content')
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
    newNode.innerHTML += "<div class='marker-summary-button'> <div id='marker-summary-button'>" + 
                            "<div id='marker-summary-button-input' type='input'>사진 등록</div>" + 
                            "<div id='marker-summary-button-input' type='input'>세부 정보 입력</div>" + 
                         "</div></div>";
    parentNode.appendChild(newNode)
    // document.getElementById('map').style.bottom = '10%';
    touchScroll();
    document.querySelectorAll('#marker-summary-button-input')[0].addEventListener("click", uploadImageToilet);
    document.querySelectorAll('#marker-summary-button-input')[1].addEventListener("click", setDetailMarkerInformation);
}

export function setImageToilet(){
        document.getElementById('map').style.bottom = "30%";
        let contentNode = document.getElementById("map_inner");
        try {
            document.getElementById('marker-toilet-img').remove();
            document.getElementById('button-wrapper').remove();
        } catch (error) {
            console.log(error)
        }
        try {
            document.getElementById('marker-summary-button').remove();
        } catch (error) {
            console.log(error);
        }
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


export function buttonNode(){
    let wrapperNode = document.createElement('div');
    wrapperNode.setAttribute('id', 'button-wrapper');
    let buttonNode = document.createElement('div');
    buttonNode.setAttribute('id', 'button-upload-image');
    buttonNode.innerHTML="등록"
    wrapperNode.appendChild(buttonNode);
    return wrapperNode;
}
function setDetailMarkerInformation(){
        document.getElementById('map').style.bottom = "30%";
        let data = localStorageHandler.getData();
        document.getElementById('marker-summary-button').remove();

        setFormlist()
        document.getElementById("button-marker-info").addEventListener('click', function(event){
            if(dragLock == true) changeDragLock();
            clearMarkers();
            submitData(data).then(() => {
                applyData(data[0]['PK']['S'])
                let lat = data[0]['geoJson']['S'].split(',')[0];
                let lng = data[0]['geoJson']['S'].split(',')[1];
                mapSetCenter(new kakao.maps.LatLng(lat, lng));
                mapInit();
                mapResize(0);
                mapContentChangeSize(0);
                alert('등록되었습니다!')
            })
        })
        document.getElementById('button-marker-reset').addEventListener('click', function(){
            resetData(data[0]['PK']['S']).then(()=>{
                let lat = data[0]['geoJson']['S'].split(',')[0];
                let lng = data[0]['geoJson']['S'].split(',')[1];
                mapSetCenter(new kakao.maps.LatLng(lat, lng));
                mapInit();
                mapResize(0);
                mapContentChangeSize(0);
            })
        })
        document.getElementById('marker-title').removeEventListener("click", setImageToilet); 
        document.getElementById('marker-title').addEventListener("click", function(){
            deleteNode();
            setMarkerInformation();
        });
        document.getElementById('map_inner').style.height='60%'
}

import {deleteNode } from './form.js';
import { localStorageHandler } from './localStorage.js';
import {setMarkerInformation, spreadMarkers } from './marker.js';
import {getMarkerInformation} from './store.js';

let container = document.getElementById('map');
let options = {
    center: new kakao.maps.LatLng(36.479074216, 127.28465568800002),
    level: 3
};
let tmpMarker = [];

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
};

let map = new kakao.maps.Map(container, options);
let markerSrcCircle= '<svg width="60" height="60" version="1.1">' +
                     '<polygon  id="triangle" fill="red" points="20,30 40,30 30,10"/>' +
                     '<circle cx="30" cy="30" r="9" stroke="white" fill="red" stroke-width="5"/></svg>'
let circleMarker = new kakao.maps.CustomOverlay();

document.querySelector(".map-custom-geolocation").addEventListener('click', function(){
    navigator.geolocation.getCurrentPosition(successGeolocation, errorGeolocation, geolocationOptions)
})
function successGeolocation(pos) {
    let latitude = pos.coords.latitude;
    let longitude = pos.coords.longitude;
    let direction = pos.coords.heading;
    mapSetCenter(new kakao.maps.LatLng(latitude, longitude))
    circleMarker.setPosition(new kakao.maps.LatLng(latitude, longitude));
    circleMarker.setContent(markerSrcCircle)
    circleMarker.setMap(map);
    if(direction == null) document.getElementById('triangle').style.display="none";
    else document.getElementById('triangle').style.transform="rotate(" + direction+ "deg)";
}

function errorGeolocation(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

export function mapInit(){
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
}

window.onload=function(){
    mapInit();    
    let mapNode = document.getElementById('map');
    mapNode.removeChild(mapNode.childNodes[1]);
    localStorageHandler.clear();
}

export let clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    disableClickZoom : true,
});
function changeMarkerDragable(marker){
    clusterer.removeMarker(marker);
    marker.setImage(markerImageGreyMarker);
    marker.setDraggable(true);
    marker.setMap(map);
    marker.setZIndex(2);
    tmpMarker.push(marker);
    kakao.maps.event.addListener(marker, 'dragend', function() {
        try {
            // setLocalStoragePK(marker.getPosition().getLat(), marker.getPosition().getLng()).setPK(marker.getTitle())
            localStorageHandler.setPosition(marker.getPosition().getLat(), marker.getPosition().getLng());
            localStorageHandler.setPK(marker.getTitle());
            // setLocalStorage(marker.getPosition().getLat(), marker.getPosition().getLng())
            // setLocalStoragePK(marker.getTitle())
            try {
                document.getElementById('lat').value = marker.getPosition().getLat();
                document.getElementById('lng').value = marker.getPosition().getLng();

            } catch (error) {
                
            }
        } catch (error) {
            console.log(error)
        }
    });
} 

/**
 * dragLock 
 * marker한테 draggable을 설정해줬을 때, 다른 동작이 안되어야 한다. 
 * 그 때 필요한 dragLock
 */
export let dragLock = false;
export const changeDragLock = () => { 
    if(dragLock == false) dragLock = true;
    else dragLock = false;
}

export const clearMarkers = () => {
    try {
        tmpMarker.forEach((marker)=> marker.setMap(null));
    } catch (error) {
        console.log(error);
    }
}
function getMarkerList(markers){
    deleteNode();
    let newNode = ''
    let parentNode = document.getElementById('map_inner')
    let titleNode = document.createElement('div');
    titleNode.setAttribute('id', 'marker-list-title');
    titleNode.innerHTML="구역 내 화장실 목록";
    parentNode.appendChild(titleNode);
    for(let marker of markers){
        console.log(marker);
    }
    for(let marker of markers){
        let toiletNameList; 
        console.log(marker)
        getMarkerInformation(marker.getTitle()).then((data)=>{
            // console.log(i);
            toiletNameList = data[0]["bldNm"]["S"] + " " + data[0]["dongNm"]["S"]
            newNode = document.createElement('div')
            newNode.setAttribute('id', 'marker_list')
            newNode.innerHTML=toiletNameList
            newNode.addEventListener("click", function(){
                localStorageHandler.clear()
                localStorageHandler.setData(JSON.stringify(data));
                localStorageHandler.setPosition(marker.getPosition().getLat(), marker.getPosition().getLng());
                localStorageHandler.setPK(marker.getTitle());
                try {
                    deleteNode()
                    setMarkerInformation()
                    changeMarkerDragable(marker)
                    dragLock = true;
                } catch (error) {
                    console.log(error)
                    alert("클러스터를 다시 클릭해주세요.")
                }
            });
            parentNode.appendChild(newNode)
        })
        .catch((error) => {
            console.log(error)
        })
    }
}  

/**
 * 클러스터 클릭 시 이벤트
 */ 
function getMarkersPromise(cluster){
    return new Promise(function(resolve, reject){
        let markers = cluster.getMarkers();
        resolve(markers);
    })
}

kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
    let level = map.getLevel();
    mapResize(0)
    mapContentChangeSize(0);

    if(level == 1){
        mapContentChangeSize(40)
        // let markers = cluster.getMarkers()
        getMarkersPromise(cluster).then((markers)=>{
            console.log(markers)
            getMarkerList(markers)
        })
    }else level -= 1;
    map.setLevel(level, {anchor: cluster.getCenter()});
    mapSetCenter(cluster.getCenter())
});
/**
 * 지도 클릭 시 이벤트
 */ 
kakao.maps.event.addListener(map, 'click', function() {   
    deleteNode();
    dragLock = false;
    clearMarkers();
    mapResize(0);
    mapContentChangeSize(0);

    mapInit();
});


kakao.maps.event.addListener(map, 'dragend', function() {
    console.log("dragend")
    if(dragLock == false){ 
        mapInit();
        mapResize(0);
        mapContentChangeSize(0);
        
        clearMarkers();
    }
});
kakao.maps.event.addListener(map, 'zoom_changed', function() {
    console.log("zoom : " + map.getLevel())
    map.setZoomable(true)
    if(map.getLevel() > 5){
        map.setZoomable(false)
        map.setLevel(5)
    }
    if(dragLock == false) mapInit();
});

export function mapSetCenter(pos){
    map.setCenter(pos);
}
export function mapReset(){
    map.relayout();
    return Promise.resolve(map.getCenter());
}
export function mapMove(dx, dy){
    map.panBy(dx, dy);
}

export function mapResize(size) {
    try {
        document.getElementById('map').style.bottom = size + '%';
        // map.relayout();
    } catch (error) {
        console.log(error)
    }
}
export function mapContentChangeSize(size){
    let mapWrap = document.getElementById('map_inner');
    try {
        mapWrap.style.height = size + '%';  
        // map.relayout();
    } catch (error) {
        console.log(error)
    }
}

// 동별로 중심 좌표 찍어주기.
let element = document.getElementById("region_form_dong");
element.onchange = function() {
    let dongName = document.getElementById("region_form_dong");
    let dongNameValue=dongName.options[dongName.selectedIndex].value
    mapSetCenter(dongToJson.get(dongNameValue));
    mapInit()
}  

// 동 위치 정보 json
let dongToJson = new Map();
fetch("../resource/dongTojson.json")
    .then(response => {
    return response.json();
    })
    .then(jsondata => {
        var keys = Object.keys(jsondata)
        for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            dongToJson.set(key, new kakao.maps.LatLng(jsondata[key]['lat'], jsondata[key]['lng']))
        }
    })


// 마커 이미지 
var imageSrc_RedMarker = '../resource/marker_red.png', // 마커이미지의 주소입니다
    imageSrc_GreenMarker = '../resource/marker_green.png', 
    imageSrc_GreyMarker = '../resource/marker_grey.png',
    imageSrc_Circle = markerSrcCircle,
    imageSize = new kakao.maps.Size(34, 34), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(10, 20)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다. (+왼쪽, +위쪽)
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImageRedMarker = new kakao.maps.MarkerImage(imageSrc_RedMarker, imageSize, imageOption),
    markerImageGreenMarker = new kakao.maps.MarkerImage(imageSrc_GreenMarker, imageSize, imageOption),
    markerImageGreyMarker = new kakao.maps.MarkerImage(imageSrc_GreyMarker, imageSize, imageOption),
    markerImageCircleMarker = new kakao.maps.MarkerImage(imageSrc_Circle, imageSize, imageOption)
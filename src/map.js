import {deleteNode } from './form.js';
import { setMarkerInformation, spreadMarkers } from './marker.js';
import {getMarkerInformation, myStorage} from './store.js';


export function mapInit(){
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
}

window.onload=function(){
    mapInit();
    let mapNode = document.getElementById('map');
    mapNode.removeChild(mapNode.childNodes[1]);
}

let container = document.getElementById('map');
let options = {
    center: new kakao.maps.LatLng(36.479074216, 127.28465568800002),
    level: 3
};
let map = new kakao.maps.Map(container, options);

// 마커 클러스터러를 생성합니다 
export let clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    disableClickZoom : true,
});
let tmpMarker = [];
function changeMarkerDragable(marker){
    console.log(marker)
    clusterer.removeMarker(marker);
    marker.setImage(markerImageGreyMarker);
    marker.setDraggable(true);
    marker.setMap(map);
    marker.setZIndex(2);
    tmpMarker.push(marker)

    kakao.maps.event.addListener(marker, 'dragend', function() {
        try {
            document.getElementById('lat').value = marker.getPosition().getLat();
            document.getElementById('lng').value = marker.getPosition().getLng();
        } catch (error) {
            console.log(error)
        }
    });
} 


export let dragLock = false;
export const changeDragLock = () => { 
    if(dragLock == false) dragLock = true;
    else dragLock = false;
}

export const clearMarkers = () => {
    tmpMarker.forEach((marker)=> marker.setMap(null));
}
function getMarkerList(markers){
    console.log(markers)
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
            console.log(marker);
            newNode.addEventListener("click", function(){
                myStorage.setItem('data', JSON.stringify(data));
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
        console.log(marker) 
    }
}  

function clickMarkerList(data, marker){
    return function(){
        myStorage.setItem('data', JSON.stringify(data));
        try {
            deleteNode()
            setMarkerInformation()
            console.log(marker);
            clusterer.removeMarker(marker);
            changeMarkerDragable(marker)
            dragLock = true;
        } catch (error) {
            console.log(error)
            alert("클러스터를 다시 클릭해주세요.")
        }
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
    mapInit();
});


kakao.maps.event.addListener(map, 'dragend', function() {
    console.log("dragend")
    if(dragLock == false){ 
        mapInit();
        mapResize(0);
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
    console.log("change pos : " + pos);
    map.panTo(pos);
}
export function mapReset(){
    map.relayout();
    return Promise.resolve(map.getCenter());
}
export function mapMove(dx, dy){
    map.panBy(dx, dy);
}

export function mapResize(size) {
    let mapWrap = document.getElementById('map_inner');
    try {
        mapWrap.style.height = size + '%'; 
        map.relayout();
        document.getElementById('map').style.bottom = "0";
    } catch (error) {
        console.log(error)
    }
}
export function mapContentChangeSize(size){
    let mapWrap = document.getElementById('map_inner');
    try {
        mapWrap.style.height = size + '%';  
        map.relayout();
    } catch (error) {
        console.log(error)
    }
}
export function mapChangeSize(size, marker){
    let mapWrap = document.getElementById('map');
    try {
        mapWrap.style.height = size + '%';  
        map.relayout();
    } catch (error) {
        console.log(error)
    }
    mapSetCenter(marker.getPosition())
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
    imageSize = new kakao.maps.Size(34, 34), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(10, 20)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다. (+왼쪽, +위쪽)
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImageRedMarker = new kakao.maps.MarkerImage(imageSrc_RedMarker, imageSize, imageOption),
    markerImageGreenMarker = new kakao.maps.MarkerImage(imageSrc_GreenMarker, imageSize, imageOption),
    markerImageGreyMarker = new kakao.maps.MarkerImage(imageSrc_GreyMarker, imageSize, imageOption)
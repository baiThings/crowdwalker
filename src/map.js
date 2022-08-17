// import { toilet_form } from './form.js';
import {deleteNode } from './form.js';
import {setMarkerInformation, spreadMarkers } from './marker.js';
import {getMarkerInformation} from './store.js';


function mapInit(){
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
}

window.onload=function(){
    mapInit();
}

var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(36.480069682512664, 127.29019964537333),
    level: 3
};
var map = new kakao.maps.Map(container, options);

// 마커 클러스터러를 생성합니다 
export var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    disableClickZoom : true,
});
export let tmpMarker = [];
function changeMarkerDragable(marker){
    clusterer.removeMarker(marker);
    marker.setImage(markerImageGreyMarker);
    marker.setDraggable(true);
    marker.setMap(map)
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
// 마커리스트를 가져온다. 
function getMarkerList(markers){
    deleteNode();
    let newNode = ''
    let parentNode = document.getElementById('map_content')
    for(let i = 0; i < markers.length; i++){
        // let toilet_dongName_list = items.
        let toiletNameList; 
        getMarkerInformation(markers[i].getTitle()).then((data)=>{
            toiletNameList = data[0]["bldNm"]["S"] + " " + data[0]["dongNm"]["S"]
            newNode = document.createElement('div')
            newNode.setAttribute('id', 'marker_list')
            newNode.style.color='white'
            newNode.style.fontSize='3vh'
            newNode.innerHTML=toiletNameList
            newNode.addEventListener("click",function(event){
                try {
                    deleteNode()
                    setMarkerInformation(data, markers[i])
                    changeMarkerDragable(markers[i])

                } catch (error) {
                    alert("다시 클릭해주세요.")
                }
        })
            parentNode.appendChild(newNode)
        })
        .catch((error) => {
            console.log(error)
        })
     }
}  
// 클러스터 클릭 시 이벤트
// 마커 클러스터러를 생성할 때 disableClickZoom을 true로 설정하지 않은 경우
// 이벤트 헨들러로 cluster 객체가 넘어오지 않을 수도 있습니다
kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
    var level = map.getLevel();
    mapResize()
    if(level == 1){
        mapChangeSize(cluster.getMarkers()[0].getPosition())
        getMarkerList(cluster.getMarkers())
        // map.panTo(new kakao.maps.LatLng(cluster.getMarkers()[0].getPosition().getLat(), cluster.getMarkers()[0].getPosition().getLng()));            
    }else level -= 1; // 현재 지도 레벨에서 1레벨 확대한 레벨
    // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
    map.setLevel(level, {anchor: cluster.getCenter()});
});

kakao.maps.event.addListener(map, 'click', function() {   
    deleteNode();
    let markers = [];
    tmpMarker.forEach((marker) => marker.setMap(null));
    clusterer.clear();
    clusterer.addMarkers(markers);
    clusterer.redraw();
    mapResize();
    mapInit();
});

// 지도가 이동하거나 줌을 할 때 중심 좌표와 레벨을 받아옴. 
kakao.maps.event.addListener(map, 'dragend', function() {
    console.log("dragend")
    mapInit();
});
kakao.maps.event.addListener(map, 'zoom_changed', function() {
    console.log("zoom : " + map.getLevel())
    map.setZoomable(true)
    if(map.getLevel() > 5){
        map.setZoomable(false)
        map.setLevel(5)
    }
    // ### zoom이 변화하면 radius도 변화해야 하므로 코드 수정 필요!!
    mapInit();
});

// document.getElementById('map_content').addEventListener('click', function(e){
//     // console.log(document.querySelectorAll("input"))
//     let inputDiv = document.querySelectorAll("input")
//     // console.log(document.getElementById("marker_list"))
//     for(let i = 0; i < inputDiv.length;i++){
//         if(inputDiv[i] == e.target) return;
//     }
//     let selectDiv = document.querySelectorAll("select")
//     for(let i = 0; i < selectDiv.length; i++){
//         if(selectDiv[i] == e.target) return;
//     }
//     let markerList = document.getElementById("marker_list")
//     console.log(markerList)
//     // for(let i = 0; i < markerList.length; i++){
//     //     if(markerList[i] == e.target) return;
//     // }
//     // mapResize();
// })

// 지도 사이즈 변경
export function mapResize() {
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '87%'; 
    document.getElementById('map_content').style.height='0%'; 
    map.relayout();
}

export function mapChangeSize(pos){
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '50%';   
    document.getElementById('map_content').style.height='37%';
    map.relayout();
    map.setCenter(pos)
}
// 동별로 중심 좌표 찍어주기.
var element = document.getElementById("region_form_dong");
element.onchange = function() {
    var dongName = document.getElementById("region_form_dong");
    var dongNameValue=dongName.options[dongName.selectedIndex].value
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(dongToJson.get(dongNameValue));            
  
}  

// 동 위치 정보 json
var dongToJson = new Map();
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

    
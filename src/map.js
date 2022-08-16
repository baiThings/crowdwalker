// import { toilet_form } from './form.js';
import {deleteNode } from './form.js';
import { makeMarker, spreadMarkers } from './marker.js';
import {totalData} from './store.js';


window.onload=function(){
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
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
    minLevel: 2 // 클러스터 할 최소 지도 레벨 
});

function changeMarkerDragable(marker){
    return function(){
        marker.setZIndex(2);
        marker.setImage(markerImageGreyMarker);
        marker.setDraggable(true);
        map.setLevel(1)
        tmpMarker = marker.getPosition();
        // 도착 마커에 dragend 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'dragend', function() {
            try {
                document.getElementById('lat').value = marker.getPosition().getLat();
                document.getElementById('lng').value = marker.getPosition().getLng();
            } catch (error) {
                console.log(error)
            }
        });
    }
}
// 마커 정보를 가져온다. 
// function getMarkerInfo(marker){
//     return function() {
//         var markerInfo = items.get(marker.getTitle())[1]
//         mapChangeSize(marker.getPosition())
//         deleteNode()
//         var formBldNm = "<div id='marker-title'>" + markerInfo['bldNm'] + " " +  markerInfo['dongNm'] + "</div>"
//         var formlist = formBldNm + '<form id="form1" name="form1" class="was-validated">'
//         console.log(markerInfo)

//         console.log(formBldNm)
//         for (var [key, value] of parseToiletData) {
//             if(['pk', 'crs', 'lat', 'lng', 'code'].includes(key)){
//                 formlist += formFixed(key, value, markerInfo)
//             }else{
//                 formlist += formSelect(key, value, markerInfo)            
//             }
//         }
//         formlist +=
//         '<div id="button-wrapper"><button id="button-markerinfo" type="button" class="btn btn-primary">SUBMIT</button></div>' + 
//         '</form>'
//         var newNode = document.getElementById('content_list')
//         newNode.innerHTML=formlist
//         newNode.style.padding="0px 5vw"
//         document.getElementById("button-markerinfo").addEventListener('click', function(event){
//             submitData()
//             marker.setImage(markerImageGreenMarker)
//         })
//     }  
// }
export var items = new Map();

// let markers= [];
// function spreadMarkersToMap(){
//     for (let i = 0; i < totalData.length; i ++) {
//         // 마커를 생성합니다
//         if(totalData[i]['lat'] && totalData[i]['lng']){
//             let marker = makeMarker(new kakao.maps.LatLng(totalData[i]['lat'], totalData[i]['lng']),totalData[i]['pk'],markerImageRedMarker)
//             markers.push(marker);
//             items.set(totalData[i]['pk'], [marker, totalData[i]]);
//             kakao.maps.event.addListener(marker, 'click', getMarkerInfo(marker));
//         }    
//     }
// }

// 마커리스트를 가져온다. 
function getMarkerList(markers){
    deleteNode()
    var newNode = ''
    var parentNode = document.getElementById('content_list')
    for(var i = 0; i < markers.length; i++){
        var toilet_dongName_list = items.get(markers[i].getTitle())[1]["bldNm"]
        toilet_dongName_list += " " + items.get(markers[i].getTitle())[1]["dongNm"]
        newNode = document.createElement('div')
        newNode.setAttribute('id', 'content_list marker_list')
        newNode.style.color='white'
        newNode.style.fontSize='3vh'
        newNode.innerHTML=toilet_dongName_list
        newNode.addEventListener("click",getMarkerInfo(markers[i]), false)
        newNode.addEventListener("click",changeMarkerDragable(markers[i]), false)
        parentNode.appendChild(newNode)
        // markerList += '<div id="content_list marker_list onClick="getMarkerInfo(\'' + markers[i] + '\')">'+toilet_dongName_list+'</div>'
    }
}  
// 클러스터 클릭 시 이벤트
// 마커 클러스터러에 클릭이벤트를 등록합니다
// 마커 클러스터러를 생성할 때 disableClickZoom을 true로 설정하지 않은 경우
// 이벤트 헨들러로 cluster 객체가 넘어오지 않을 수도 있습니다
kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
    var level = map.getLevel();
    mapResize()
    if(level == 2){
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
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
    
    clusterer.clear();
    clusterer.addMarkers(markers);
    clusterer.redraw();
    // setTimeout(function(){

    // }, 10)
    mapResize();

});

// 지도가 이동하거나 줌을 할 때 중심 좌표와 레벨을 받아옴. 
kakao.maps.event.addListener(map, 'dragend', function() {
    console.log("dragend")
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
});
kakao.maps.event.addListener(map, 'zoom_changed', function() {
    console.log("zoom : " + map.getLevel())
    map.setZoomable(true)
    if(map.getLevel() > 5){
        map.setZoomable(false)
        map.setLevel(5)
    }
    // ### zoom이 변화하면 radius도 변화해야 하므로 코드 수정 필요!!
    spreadMarkers(map.getCenter().getLat(), map.getCenter().getLng(), map.getLevel());
});

document.getElementById('map_content').addEventListener('click', function(e){
    // console.log(document.querySelectorAll("input"))
    let inputDiv = document.querySelectorAll("input")
    // console.log(document.getElementById("marker_list"))
    for(let i = 0; i < inputDiv.length;i++){
        if(inputDiv[i] == e.target) return;
    }
    let selectDiv = document.querySelectorAll("select")
    for(let i = 0; i < selectDiv.length; i++){
        if(selectDiv[i] == e.target) return;
    }
    mapResize();
})

// 지도 사이즈 변경
export function mapResize() {
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '87%'; 
    document.getElementById('map_content').style.height='0%'; 
    // mapContainer 
    setTimeout(function(){
        map.relayout();
    }, 10)
}

export function mapChangeSize(pos){
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '50%';   
    document.getElementById('map_content').style.height='37%';
    map.relayout();
    // map.panTo(pos);
      // 중심으로 이동
    map.setCenter(pos)
}
// 동별로 중심 좌표 찍어주기.
var element = document.getElementById("region_form_dong");
element.onchange = function() {
    var dongName = document.getElementById("region_form_dong");
    var dongNameValue=dongName.options[dongName.selectedIndex].value
    // 지도 중심을 부드럽게 이동시킵니다
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

    
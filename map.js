// import { toilet_form } from './form.js';
import {submitData, deleteNode, formFixed, formSelect } from './form.js';
import parseCsv, { parseToiletData, totalData} from './parsing.js'

var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(36.480069682512664, 127.29019964537333),
    level: 5
};
var map = new kakao.maps.Map(container, options);
console.log(map)

// 마커 클러스터러를 생성합니다 
var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    disableClickZoom : true,
    minLevel: 2 // 클러스터 할 최소 지도 레벨 
});
let tmpMarker;
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
function getMarkerInfo(marker){
    return function() {
        var markerInfo = items.get(marker.getTitle())[1]
        mapChangeSize(marker.getPosition())
        deleteNode()
        var formlist = '<form id="form1" name="form1" class="was-validated">'
        for (var [key, value] of parseToiletData) {
            if(['pk', 'crs', 'lat', 'lng', 'code'].includes(key)){
                formlist += formFixed(key, value, markerInfo)
            }else{
                formlist += formSelect(key, value, markerInfo)            
            }
        }
        formlist +=
        '<button id="button-markerinfo" type="button" class="btn btn-primary">SUBMIT</button>' + 
        '</form>'
        var newNode = document.getElementById('content_list')
        newNode.innerHTML=formlist
        document.getElementById("button-markerinfo").addEventListener('click', function(event){
            submitData()
            marker.setImage(markerImageGreenMarker)
        })
    }  
}
function makeMarker(pos, pk, img){
    return new kakao.maps.Marker({
        // map: map, // 마커를 표시할 지도
        position: pos, // 마커를 표시할 위치
        title : pk, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다  
        image : img
    });
}
var items = new Map();

let markers= [];
window.onload=function(){
   makeTotalData()
   clusterer.addMarkers(markers);
}


function makeTotalData(){
    for (var i = 0; i < totalData.length; i ++) {
        // 마커를 생성합니다
        if(totalData[i]['lat'] && totalData[i]['lng']){
            var marker = makeMarker(new kakao.maps.LatLng(totalData[i]['lat'], totalData[i]['lng']),totalData[i]['pk'],markerImageRedMarker)
            markers.push(marker);
            items.set(totalData[i]['pk'], [marker, totalData[i]]);
            // kakao.maps.event.addListener(marker, 'dragend', getMarkerInfo(marker));
            kakao.maps.event.addListener(marker, 'click', getMarkerInfo(marker));
        }    
    }
}

// 마커리스트를 가져온다. 
function getMarkerList(markers){
    deleteNode()
    var newNode = ''
    var parentNode = document.getElementById('content_list')
    for(var i = 0; i < markers.length; i++){
        var toilet_dongName_list = items.get(markers[i].getTitle())[1]["dongNm"]
        newNode = document.createElement('div')
        newNode.setAttribute('id', 'content_list marker_list')
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
    markers = []
    makeTotalData()
    clusterer.clear();
    setTimeout(function(){
        clusterer.addMarkers(markers);
        clusterer.redraw();
    }, 100)
    mapResize()
});
// 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'center_changed', function() {

});
// 지도 사이즈 변경
function mapResize() {
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '100%';   
    map.relayout();
}

function mapChangeSize(pos){
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '50%';   
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
fetch("./dongTojson.json")
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
var imageSrc_RedMarker = './resource/marker_red.png', // 마커이미지의 주소입니다
    imageSrc_GreenMarker = './resource/marker_green.png', 
    imageSrc_GreyMarker = './resource/marker_grey.png',
    imageSize = new kakao.maps.Size(34, 34), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(10, 20)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다. (+왼쪽, +위쪽)
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImageRedMarker = new kakao.maps.MarkerImage(imageSrc_RedMarker, imageSize, imageOption),
    markerImageGreenMarker = new kakao.maps.MarkerImage(imageSrc_GreenMarker, imageSize, imageOption),
    markerImageGreyMarker = new kakao.maps.MarkerImage(imageSrc_GreyMarker, imageSize, imageOption)
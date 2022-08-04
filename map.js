// import { toilet_form } from './form.js';
import parseCsv, { parseToiletData } from './parsing.js'

var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(36.480069682512664, 127.29019964537333),
    level: 5
};
var map = new kakao.maps.Map(container, options);

// 마커 클러스터러를 생성합니다 
var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    disableClickZoom : true,
    minLevel: 1 // 클러스터 할 최소 지도 레벨 
});


function getMarkerInfo(marker){

    var marker_info = items.get(marker.getTitle())[1]
    return function() {
        var mapContainer = document.getElementById('map');
        mapContainer.style.height = '50%'; 
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
        for (var [key, value] of parseToiletData) {
            var newNode = document.createElement('div')
            // newNode.innerHTML="<div id='content_list'>"+ key +' : ' + value +'</div>'
            newNode.innerHTML=                 
                '<div class="mb-3">' + 
                '   <label for='+ key + ' class="form-label">'+value+':</label>' + 
                '   <select class="form-select" id='+ key+ ' name='+ key+ '>' +
                '       <option>YES</option>' + 
                '       <option>NO</option>' + 
                '   </select> </div>'
            parentnode.appendChild(newNode)
            console.log('key : ' + key);
            console.log('value : ' + value);
        }

        
        // for(var key in marker_info){
        //     var newNode = document.createElement('div')
        //     newNode.innerHTML="<div id='content_list'>"+ key +' : ' + marker_info[key] +'</div>'
        //     parentnode.appendChild(newNode)
        // }
    }  
}

var items = new Map();
var tmpdata;
fetch('./sj3.csv')
  .then((response) => response.text())
  .then((data) => {
    tmpdata = parseCsv(data);
    var markers= [];
    for (var i = 0; i < tmpdata.length; i ++) {
        // 마커를 생성합니다
        if(tmpdata[i]['lat'] && tmpdata[i]['lng']){
            var marker = new kakao.maps.Marker({
                // map: map, // 마커를 표시할 지도
                position: new kakao.maps.LatLng(tmpdata[i]['lng'], tmpdata[i]['lat']), // 마커를 표시할 위치
                title : tmpdata[i]['pk'], // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다  
                image : markerImageRedMarker
            });
            // 마커가 지도 위에 표시되도록 설정합니다
            // marker.setMap(map);
            // 마커가 드래그 가능하도록 설정합니다 
            // marker.setDraggable(true); 
            markers.push(marker);
            items.set(tmpdata[i]['pk'], [marker, tmpdata[i]]);
            // kakao.maps.event.addListener(marker, 'dragend', getMarkerInfo(marker));
            kakao.maps.event.addListener(marker, 'click', getMarkerInfo(marker));
        }    
    }
    console.log(items)
    console.log("setting done!")
    clusterer.addMarkers(markers);
  })

// 마커 클러스터러에 클릭이벤트를 등록합니다
// 마커 클러스터러를 생성할 때 disableClickZoom을 true로 설정하지 않은 경우
// 이벤트 헨들러로 cluster 객체가 넘어오지 않을 수도 있습니다
function getMarkerList(markers){
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
    for(var i = 0; i < markers.length; i++){
        console.log(items.get(markers[i].getTitle())[1]["dongNm"])
        var toilet_dongName_list = items.get(markers[i].getTitle())[1]["dongNm"]
        var newNode = document.createElement('div')
        newNode.innerHTML="<div id='content_list'>"+toilet_dongName_list+"</div>"
        parentnode.appendChild(newNode)
    }
}  
kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
    var level = map.getLevel();
    if(level == 1){
        getMarkerList(cluster.getMarkers())
        var mapContainer = document.getElementById('map');
        mapContainer.style.height = '50%'; 
    }else level -= 1; // 현재 지도 레벨에서 1레벨 확대한 레벨
    // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
    map.setLevel(level, {anchor: cluster.getCenter()});
});

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    var latlng = mouseEvent.latLng;
    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    console.log(message)
    mapResize()
});

// 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'center_changed', function() {
    // parseToiletData.forEach(function(value, key) {
    //     console.log('key : ' + key);
    //     console.log('value : ' + value);
    //   });
    for (var [key, value] of parseToiletData) {
    console.log('key : ' + key);
    console.log('value : ' + value);
    }
    // console.log(parseToiletData)
});
// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function mapResize() {
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '100%';   
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
    imageSize = new kakao.maps.Size(34, 34), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(10, 20)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다. (+왼쪽, +위쪽)
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImageRedMarker = new kakao.maps.MarkerImage(imageSrc_RedMarker, imageSize, imageOption),
    markerImageGreenMarker = new kakao.maps.MarkerImage(imageSrc_GreenMarker, imageSize, imageOption)
import { deleteNode, formFixed, formlists, formSelect, submitData } from "./form.js";
import { clusterer, mapChangeSize } from "./map.js";
import { getMarkerInformation, getMarkerKey, parseToiletData } from "./store.js";

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

export function setMarkerInformation(data, marker){
    console.log(marker.getPosition())
    mapChangeSize(marker.getPosition())

    let parentNode = document.getElementById("map_content")
    let newNode = document.createElement("div")
    newNode.setAttribute('id', 'marker-content tmp-node')
    newNode.innerHTML = "<div>" + data[0]['bldNm']['S'] + " " + data[0]['dongNm']['S'] + "</div>"
    parentNode.appendChild(newNode)
    
    newNode = document.createElement('form')
    newNode.setAttribute('id', 'form1')
    newNode.setAttribute('class', 'was-validated')
    newNode.setAttribute('name', 'form1')
    newNode.innerHTML=formlists(data)
    
    parentNode.appendChild(newNode)
    document.getElementById("button-markerinfo").addEventListener('click', function(event){
        submitData(data)
        marker.setImage(markerImageGreenMarker)
    })
}


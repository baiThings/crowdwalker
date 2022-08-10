import { clusterer } from "./map.js";

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

export function spreadMarkers(toilets){
    let markers= [];
    for(let i = 0; i < toilets.length; i++){
        let marker = makeMarker(new kakao.maps.LatLng(toilets[i]['lat']['S'], toilets[i]['lng']['S']), toilets[i]['PK']['S'], markerImageRedMarker)
        markers.push(marker)
    }
    clusterer.addMarkers(markers);
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
import { localStorageHandler } from "./localStorage.js";

var geocoder = new kakao.maps.services.Geocoder();

export function getMarkerAddress(coords){
    searchDetailAddrFromCoords(coords, function(result, status){
       if(status === kakao.maps.services.Status.OK){
            console.log(result[0]['road_address']);
            localStorageHandler.setItem('buildingNM', result[0]['road_address']['building_name']);
            localStorageHandler.setItem('addressNM', result[0]['road_address']['address_name']);
        } 
    })
}

function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

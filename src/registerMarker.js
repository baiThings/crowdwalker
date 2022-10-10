import { addPhoto } from "./app.js";
import { getMarkerAddress } from "./geoCoder.js";
import { localStorageHandler } from "./localStorage.js";
import { changeDragLock, dragLock, mapHandler } from "./map.js";
import { makeMarker, markerImageGreyMarker } from "./marker.js";

let marker;
document.getElementById('makeMarker-button').addEventListener('click', function(){
    if(dragLock){
        mapHandler.removeMarker(marker);
        changeDragLock();
        registerMarkerHadler.initDisplay();
    }
    else {
        marker = makeMarker(mapHandler.getMapCenter(), 999, markerImageGreyMarker)
        marker.setDraggable(true);
        mapHandler.setMarkerMap(marker);
        changeDragLock();
        registerMarkerHadler.dragendMarker(marker);
        registerMarkerHadler.clickMarker(marker);


    }
})

const registerMarkerHadler = {
    makeMarker(){

    },
    recordMarker(){

    },
    dragendMarker(marker){
        kakao.maps.event.addListener(marker, 'dragend', function(){
            console.log(marker.getPosition());
        })
    },
    clickMarker(marker){
        kakao.maps.event.addListener(marker, 'click', function(){
            getMarkerAddress(marker.getPosition());
            recordSheet();
        })
    },
    initDisplay(){
        console.log(document.getElementById('map-custom-content'));
        document.getElementById('map-custom-content').remove();
    },
    getAddress(marker){
        kakao.maps.event.addListener(marker, 'click', function(){
            getMarkerAddress(marker.getPosition());
        })
    }
}

function recordSheet(){
    let parentNode = document.querySelector('.map_wrap');
    let newNode = document.createElement('div');
    newNode.id = 'map-custom-content';
    newNode.appendChild(cancleBox());
    newNode.appendChild(headBox());
    newNode.appendChild(recordBox());
    parentNode.appendChild(newNode);
    
}

function cancleBox(){
    let newNode = document.createElement('div');
    newNode.id = 'map-custom-content-cancle';
    newNode.innerHTML = 'X';
    newNode.addEventListener('click', function(){
        registerMarkerHadler.initDisplay()
    });
    return newNode;
}

function headBox(){
    let newNode = document.createElement('div')
    newNode.id = 'map-custom-content-header';
    newNode.innerHTML = "새 화장실 등록"
    return newNode;
}

function recordBox(){
    let newNode = document.createElement('div');
    newNode.id = 'map-custom-content-record';
    newNode.appendChild(formBox());
    return newNode;
}

function formBox(){
    let formNode = document.createElement('form');
    formNode.id = 'map-record-form';
    let newNodeLabel = document.createElement('div');
    newNodeLabel.id = 'map-record-form-label';
    newNodeLabel.innerHTML = '장소이름';
    let newNodeInput = document.createElement('input');
    newNodeInput.id = 'map-record-form-input';
    console.log(localStorageHandler.getItem('buildingNM'));
    newNodeInput.innerText = localStorageHandler.getItem('addressNM');
    formNode.appendChild(newNodeLabel);
    formNode.appendChild(newNodeInput);
    return formNode;
}


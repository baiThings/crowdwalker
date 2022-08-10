import parseCsv from "./parsing.js";
let formdataTmp = new FormData();

// getMarkeyKey : 맵 중앙 위치와 level에 따른 주변 화장실의 프라이머리 키를 반환한다. 
export function getMarkerKey(lat, lng, radius){
    formdataTmp.append("lat", lat)
    formdataTmp.append("lng", lng)
    formdataTmp.append("radius", "400")
    return fetch('https://10mgfgym1i.execute-api.ap-northeast-2.amazonaws.com/default/-Test', requestOptions)
    .then((response) => {
        return response.text()
    })
    .then((result) => {
        const markerKeys = JSON.parse(result);
        return markerKeys;
    })
    .catch((error) => console.log(error));
}

export let parseToiletData = new Map();
fetch('../resource/toiletData.json')
    .then((response) => response.json())
    .then((data) => {
        var keys = Object.keys(data)
        for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            parseToiletData.set(key, data[key])
        }
})


var requestOptions = {
    method: 'POST',
    body: formdataTmp,
    redirect: 'follow'
};



export let totalData = "";
fetch('../resource/sj3.csv')
    .then((response) => response.text())
    .then((data) => {
        totalData = parseCsv(data);
        console.log("total data setting done!")
        console.log(totalData)
})
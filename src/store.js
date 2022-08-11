import parseCsv from "./parsing.js";
let formdataTmp = new FormData();
// export const controller = new AbortController();

// getMarkeyKey : 맵 중앙 위치와 level에 따른 주변 화장실의 프라이머리 키를 반환한다. 

// fetch가 진행중인지 검사하는 boolean 변수

// export function getMarkerKey(lat, lng, radius){
//     formdataTmp.append("lat", lat)
//     formdataTmp.append("lng", lng)
//     formdataTmp.append("radius", "100")
//     console.log(whileFetching)
//     if(whileFetching) controller.abort()
//     controller = new AbortController();
//     whileFetching = true;
//     return fetch('https://10mgfgym1i.execute-api.ap-northeast-2.amazonaws.com/default/-Test', setRequireOptions(controller.signal))
//     .then((response) => {
//         if(response.ok){
//             console.log(response)
//             whileFetching = false;
//             return response.text()
//         }
//     })
//     .then((result) => {
//         console.log(JSON.parse(result))
//         const markerKeys = JSON.parse(result);
//         return markerKeys;
//     })
//     .catch((error) => console.log(error));
// }
let controller;
let whileFetching = false;
export async function getMarkerKey(lat, lng, radius){
    formdataTmp.append("lat", lat)
    formdataTmp.append("lng", lng)
    formdataTmp.append("radius", "300")

    if(whileFetching) controller.abort()

    controller = new AbortController();
    whileFetching = true;

    try {
        let response = await fetch('https://10mgfgym1i.execute-api.ap-northeast-2.amazonaws.com/default/-Test', setRequireOptions(controller.signal))
        if(response.ok){
            whileFetching = false;
        }
        let result = await response.text()
        let markerKeys = await JSON.parse(result)
        console.log(markerKeys)
        return markerKeys
    } catch (error) {
        console.log(error)
    }
}
function setRequireOptions(signal){
    let requestOptions = {
        method: 'POST',
        body: formdataTmp,
        redirect: 'follow',
        signal: signal,
    };
    return requestOptions
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



export let totalData = "";
fetch('../resource/sj3.csv')
    .then((response) => response.text())
    .then((data) => {
        totalData = parseCsv(data);
        console.log("total data setting done!")
        console.log(totalData)
        
})
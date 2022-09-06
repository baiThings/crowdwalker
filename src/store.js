// getMarkeyKey : 맵 중앙 위치와 level에 따른 주변 화장실의 프라이머리 키를 반환한다. 

export let awsUrl = 'https://a8rksepiki.execute-api.ap-northeast-2.amazonaws.com'
let whileFetching = false;
let controller;
export async function getMarkerKey(lat, lng, radius){
    let formdataTmp = new FormData();
    formdataTmp.append("lat", lat)
    formdataTmp.append("lng", lng)
    switch(radius){
        case 5:
            formdataTmp.append("radius", "1800");
            break;
        case 4:
            formdataTmp.append("radius", "1000");
            break;
        case 3:
            formdataTmp.append("radius", "700");
            break;
        default:
            formdataTmp.append("radius", "100");
            break;
    }
    if(whileFetching) controller.abort()

    controller = new AbortController();
    whileFetching = true;

    try {
        let response = await fetch(awsUrl, setRequireOptions(formdataTmp, controller.signal))
        if(response.ok){
            whileFetching = false;
        }
        let result = await response.text()
        let markerKeys = await JSON.parse(result)
        return markerKeys
    } catch (error) {
        console.log(error)
    }
}
export function setRequireOptions(formdata, signal){
    let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        signal: signal,
    };
    return requestOptions
}

export let parseToiletData = new Map();
fetch('../resource/toiletData.json')
    .then((response) => response.json())
    .then((data) => {
        let keys = Object.keys(data)
        for (let i=0; i<keys.length; i++) {
            let key = keys[i];
            parseToiletData.set(key, data[key])
        }
})
export let markerInfotmation;

export function makeFormdata(formArray){
    let formdata = new FormData();
    for(let key in formArray){
        formdata.append(key, formArray[key]);
    } 
    return formdata;
}
export async function getMarkerInformation(key){
    let controller = new AbortController();
    const formObj = {
        'PK' : key,
        'user' : 'user01',
        'method' : 'GET_INFO'
    }
    let formData = makeFormdata(formObj);
      try {
        let response = await fetch(awsUrl + '/details', setRequireOptions(formData, controller.signal))
        let result = await response.text()
        markerInfotmation = await JSON.parse(result)
        return markerInfotmation['Items'];
    } catch (error) {
        console.log(error)   
    }
}


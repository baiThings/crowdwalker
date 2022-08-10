export default function parseCsv(data){
    const rows = data.split("\r\n")

    const jsonArray = [];

    const header = rows[0].split(",");
    for(let i = 1; i < rows.length; i++){
        let obj = {};
        let row = rows[i].split(",");
        for(let j = 0; j < header.length;j++){
            obj[header[j]] = row[j];
        }
        jsonArray.push(obj);
    }
    return jsonArray;
}

// parserToiletData
export var parseToiletData = new Map();
fetch('./resource/toiletData.json')
    .then((response) => response.json())
    .then((data) => {
        // console.log(data['pk'])
        var keys = Object.keys(data)
        for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            parseToiletData.set(key, data[key])
        }
})
export let totalData = "";
fetch('./sj3.csv')
    .then((response) => response.text())
    .then((data) => {
        totalData = parseCsv(data);
        console.log("total data setting done!")
        console.log(totalData)
})

// var formdataTmp = new FormData();
// formdataTmp.append("lat", "37.5666805");
// formdataTmp.append("lng", "126.9784147");
// formdataTmp.append("radius", "1000");

// var requestOptions = {
//     method: 'POST',
//     body: formdataTmp,
//     redirect: 'follow'
// };
    
// fetch('https://10mgfgym1i.execute-api.ap-northeast-2.amazonaws.com/default/-Test', requestOptions)
//     .then((response) => { 
//         response.text()
//     }) // .text 메소드는 프로미스 객체를 리턴하는 메소드이다.
//     .then((result) => {
//         const users = JSON.parse(result);
//         console.log(users)
//         return users[0];
//     })
//     .catch((error) => console.log('error', error));

// console.log(end - start)
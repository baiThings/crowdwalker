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

// export let totalData = "";
// fetch('../resource/sj3.csv')
//     .then((response) => response.text())
//     .then((data) => {
//         totalData = parseCsv(data);
//         console.log("total data setting done!")
//         console.log(totalData)
// })

var formdataTmp = new FormData();
formdataTmp.append("lat", "37.5666805");
formdataTmp.append("lng", "126.9784147");
formdataTmp.append("radius", "100");

var requestOptions = {
    method: 'POST',
    body: formdataTmp,
    redirect: 'follow'
};
    
fetch('https://10mgfgym1i.execute-api.ap-northeast-2.amazonaws.com/default/-Test', requestOptions)
    .then((response) => {
        return response.text()
    })
    .then((result) => {
        const markerKeys = JSON.parse(result);
        console.log(markerKeys[0]['lat']['S'])
        return markerKeys;
    })
    .catch((error) => console.log(error));


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


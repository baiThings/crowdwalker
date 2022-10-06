let myStorage = window.localStorage;

export let localStorageHandler = {
    setPosition(lat, lng){
        myStorage.setItem('lat', lat);
        myStorage.setItem('lng', lng);
    },
    setPK(pk){
        myStorage.setItem('PK', pk);
    },
    setData(data){
        myStorage.setItem('data', data);
        console.log(data);
        try {
            myStorage.setItem('entryFloor', JSON.parse(data)[0]['DentryFloor']['N']);
        } catch (error) {
            console.log("entryFloor가 기록되지 않았습니다.")
        }
    },
    getData(){
        return JSON.parse(myStorage.getItem('data'));
    },
    getItem(key){
        console.log(JSON.parse(myStorage.getItem('data')));
        return myStorage.getItem(key)
    },
    clear(){
        myStorage.clear()
    }
}

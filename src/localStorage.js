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
    },
    getData(){
        return JSON.parse(myStorage.getItem('data'));
    },
    getItem(key){
        return myStorage.getItem(key)
    }
}

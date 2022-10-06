export function makeFormdata(formArray){
    let formdata = new FormData();
    for(let key in formArray){
        formdata.append(key, formArray[key]);
    } 
    return formdata;
}

export let formdataHandler = {
    formdata : new FormData(),
    imgFormdata : new FormData(),
    init(){
        this.formdata= new FormData()
        this.imgFormdata = new FormData()
    },
    setImgFormdata(file){
        this.imgFormdata.append('file', file);
    },
    setImgOptionFormdata(formObj){
        for(let key in formObj){
            this.imgFormdata.append(key, formObj[key])
        }
    },
    getImgFormdata(){
        return this.imgFormdata;
    },
}

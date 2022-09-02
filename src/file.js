import { deleteNode, deleteNodeClass } from "./form.js";
import { buttonNode, setImageToilet, setMarkerInformation } from "./marker.js";
import { myStorage, setRequireOptions } from "./store.js";

export function uploadImageToilet(){
    document.getElementById('map').style.bottom = "20%";
    let contentNode = document.getElementById("map_inner");
    let parentNode = document.getElementById("marker-content");
    // parentNode.style.backgroundColor="#0d6efd"        
    let imgList;
    document.getElementById('marker-summary-button').remove();
    let imgNode = document.createElement("div");

    imgNode.setAttribute('id', "marker-toilet-img");
    imgNode.innerHTML = 
        "<input type='file' class='img-upload' required multiple></input>" +
        "<ul class='img-preview'></ul>"
    parentNode.appendChild(imgNode);
    document.querySelector('.img-upload').addEventListener('change', function(e){
        fileHandler.init();
       
    });
    parentNode.appendChild(buttonNode());
    document.getElementById('button-upload-image').addEventListener('click', function(){
        fileHandler.selectFile();
        fileHandler.uploadFile();
        // uploadImage(imgList)
        document.querySelector('.img-upload').value='';
        deleteNodeClass('.img-preview');
    })
    document.getElementById('marker-title').removeEventListener("click", setImageToilet); 
    document.getElementById('marker-title').addEventListener("click", function(){
        deleteNode();
        setMarkerInformation();
    }); 
    contentNode.style.height='40%';
}

let filelist = [];
let fileHandler = {
    init(){
        const files = Array.from(document.querySelector('.img-upload').files);
        const imagePreview = document.querySelector('.img-preview');
        files.forEach(file => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const preview = createImgElement(e, file);
                imagePreview.appendChild(preview);
            }
        })
        filelist = filelist.concat(files);
    },
    selectFile(){
        console.log(filelist);
    },
    uploadFile(){
        let formdata = new FormData();
        console.log(Object.values(filelist));
        // for(let i in filelist){
        //     console.log(typeof(filelist[i]));

        // }
        for(let key in filelist){
            console.log((Object.values(filelist))[key])
            formdata.append('file', (Object.values(filelist))[key]);

        }
        formdata.append('PK', myStorage.getItem('PK'));
        formdata.append('method', 'UPLOAD_IMAGES');
        formdata.append('user', 'user01');
        console.log(formdata.get('file'));
        try {
            fetch('https://a8rksepiki.execute-api.ap-northeast-2.amazonaws.com/details/images', setRequireOptions(formdata, null))
                .then((response) => {
                    if(response.ok) alert('등록되었습니다.')
                    return response.json()
                })
                .then((result) => {
                    console.log(result);
                    filelist = []
                })
        } catch (error) {
            console.log(error)
        }
    },
    removeFile(){
        document.addEventListener('click', (e) => {
            console.log(e.target.className)
        })
    }

}


export function addFilelist(files){
    filelist = filelist.concat(files);
    console.log(filelist);
}
export function getImageFiles(e){
    const unploadFiles = [];
    const files = Array.from(document.querySelector('.img-upload').files);
    const imagePreview = document.querySelector('.img-preview');
    addFilelist(files);
    Array.from(files).forEach(file => {
        const reader = new FileReader();
      
        unploadFiles.push(file);
        // filelist[file['name'].split('.')[0]] = reader.result;
        reader.onload = (e) => {
            const preview = createImgElement(file);
            imagePreview.appendChild(preview);
            // filelist[file['name'].split('.')[0]] = reader.result;
            // console.log(filelist)
            // myStorage.setItem('filelist', JSON.stringify(filelist));
        }
        reader.readAsDataURL(file);
        // reader.addEventListener("load", () => {
        //     // console.log(reader.result);
        //     // console.log(file['name'].split('.')[0])
        // });
        // console.log(file)
    })
    return files;
}

export async function uploadImage(files){
    let formdata = new FormData();
    formdata.append('file', files);
    // let filesJson = JSON.parse(myStorage.getItem('filelist'))
    // for(let key in filesJson){
    //     formdata.append('files', filesJson[key])
    // }
    try {
        let response = await fetch('https://icqx7s6y94.execute-api.ap-northeast-2.amazonaws.com/default/error-code', setRequireOptions(formdata, null))
        if(response.ok){ alert("등록되었습니다.");}
        return result; 
    } catch (error) {
        console.log(error)
    }
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    console.log(mime);
    console.log(bstr);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}


function createImgElement(e, file) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const del = document.createElement('div');


    img.setAttribute('src', e.target.result);
    img.setAttribute('data-file', file.name);
    img.setAttribute('id', "img-preview-node")

    del.setAttribute('class', 'file-remove');
    del.setAttribute('id', file.lastModified);
    del.addEventListener('click', function(e){
        fileHandler.removeFile(e);
    })
    del.innerHTML = "X"

    li.appendChild(img);
    li.appendChild(del);
    return li;
}

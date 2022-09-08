import { deleteNode, deleteNodeClass } from "./form.js";
import { formdataHandler, makeFormdata } from "./formData.js";
import { localStorageHandler } from "./localStorage.js";
import { buttonNode, setImageToilet, setMarkerInformation } from "./marker.js";
import { knockknockHandler } from "./resource.js";
import { setRequireOptions } from "./store.js";

export function uploadImageToilet(){
    document.getElementById('map').style.bottom = "20%";
    let contentNode = document.getElementById("map_inner");
    let parentNode = document.getElementById("marker-content");
    // parentNode.style.backgroundColor="#0d6efd"        
    try {
        document.getElementById('marker-summary-button').remove();
    } catch (error) {
        console.log(error);
    }
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
let formdata = new FormData();
let fileOptions = {
    meta: true, 
    orientation: true, 
    canvas: true, 
    maxWidth: 800,
    maxHeight: 300,
    minWidth: 100,
    minHeight: 50, 
}
let fileHandler = {
    init(){
        const files = Array.from(document.querySelector('.img-upload').files);
        const imagePreview = document.querySelector('.img-preview');    
        files.forEach(file => {
            let reader = new FileReader();

            loadImage(
                file,
                function(img, data){
                    loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
                    img.toBlob(function (blob) {
                        loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                            let newfile = new File([newBlob], file.name, { type: "image/jpeg"});
                            file = newfile;
                            formdataHandler.setImgFormdata(file);
                            reader.readAsDataURL(file);
                            reader.onload = (e) => {
                                const preview = createImgElement(e, file);
                                imagePreview.appendChild(preview);
                            }
                            filelist.push(file);
                        })
                  }, 'image/jpeg')
            },
            fileOptions)
        })

    },
    selectFile(){
        console.log(filelist);
    },
    uploadFile(){
        const formObj = {
            'PK' : localStorageHandler.getItem('PK'),
            'method': 'UPLOAD_IMAGES',
            'user': 'user01'
        }
        formdataHandler.setImgOptionFormdata(formObj);
        fetch(knockknockHandler.getUrl() + '/details/images', setRequireOptions(formdataHandler.getImgFormdata(), null))
            .then((response) => {
                if(response.ok) alert('등록되었습니다.')
                return response.json()
            })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                alert("실패하였습니다. " + err)
                console.log(err);
                filelist = []
            })
        filelist = []
        formdataHandler.init();
    },
    removeFile(e){
        for(let i = 0; i < filelist.length; i++){
            if(Number(e.target.id) == filelist[i].lastModified){
                filelist.splice(i, 1);
                i--;
            }
        }
        e.target.parentNode.remove()
    }
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
    del.innerHTML = "X";

    li.appendChild(img);
    li.appendChild(del);
    return li;
}

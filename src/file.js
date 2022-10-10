import { addPhoto } from "./app.js";
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
        fileHandler.init(localStorageHandler.getItem('PK'));       
    });
    parentNode.appendChild(buttonNode());
    document.getElementById('button-upload-image').addEventListener('click', function(){
        fileHandler.selectFile();
        // fileHandler.uploadFile();
        addPhoto("Ansan", localStorageHandler.getItem('PK'));

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
export let fileOptions = {
    meta: true, 
    orientation: true, 
    canvas: true, 
}
let fileHandler = {
    init(pk){
        const files = Array.from(document.querySelector('.img-upload').files);
        const imagePreview = document.querySelector('.img-preview');    
        files.forEach(file => {
            let reader = new FileReader();

            loadImage(
                file,
                function(img, data){
                    try {
                        loadImage.writeExifData(data.imageHead, data, 'Orientation', 1) 
                    } catch (error) {
                        console.log(error)
                    }

                    img.toBlob(function (blob) {
                        loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                            let newfile = new File([newBlob], pk, { type: "image/jpeg"});
                            console.log(newfile)
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
        loadingWithMask();
        //knockknockHandler.getUrl() + '/details/images'
        fetch('http://192.168.0.101:3000/single/upload', setRequireOptions(formdataHandler.getImgFormdata(), null))
            .then((response) => {
                console.log(response)
                if(response.ok) closeLoadingWithMask(true);
                else closeLoadingWithMask(false)
                return response.json()
            })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                closeLoadingWithMask(false);
                alert("실패하였습니다. " + err)

                console.log(err);
                filelist = []
            })
        filelist = []
        // localStorageHandler.clear();
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

export function loadingWithMask(){
    let maskHeight = $(document).height();
    let maskWidth = window.document.body.clientWidth;
    console.log(maskHeight);
    
    let mask = "<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; display:none; left:0; top:0;'></div>";
    let loadingImg = '';

    loadingImg += "<div id='loadingImg'>";
    loadingImg += " <img src='../resource/loading.gif' style='position: relative; display: block; margin: 0px auto;'/>";
    loadingImg += "</div>";  
    
    $('body')
        .append(mask)
        .append(loadingImg)

    $('#mask').css({
            'width' : maskWidth
            , 'height' : maskHeight
            , 'opacity' : '0.3'
    });

    $('#mask').show();

    $('#loadingImg').show();
    
}

export function closeLoadingWithMask(flag){
    console.log(flag)
    $('#mask').remove();
    $('#loadingImg').remove();
    if(flag == true) alert('등록되었습니다.')
    else alert('실패하였습니다.')
}
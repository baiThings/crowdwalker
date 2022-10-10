import { index, translateContainerLeft, translateContainerRight } from "./component.js";
import { fileOptions } from "./file.js";
import { deleteNode } from "./form.js";
import { setMarkerInformation } from "./marker.js";

var albumBucketName = 'toilet-img';
var bucketRegion = 'ap-northeast-2';
var IdentityPoolId = 'ap-northeast-2:2d2379f3-53b0-483c-b484-2a264f42c276';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});
let s3Cnt = 0;
export function addPhoto(albumName, pk) {
    let filelist = [];
    let cntArr = [];

    let cnt = 0;
    const files = Array.from(document.querySelector('.img-upload').files);
    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    s3Cnt = 0;

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
                        file = newfile;
                        reader.readAsDataURL(file);
                        let fileName = file['name'] + ':' + makeTime() + ':'+ cnt + '.jpg';
                        let albumPhotosKey = encodeURIComponent(albumName) + '/' + file['name'] + '/';      
                        let photoKey = albumPhotosKey + fileName;  
                        cnt++; 
                        uploadingS3(photoKey, file);
                    })
                }, 'image/jpeg')
        },
        fileOptions)
    })
  }


function uploadingS3(photoKey, file){
    confirmImg();
    s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
      }, function(err, data) {
        if (err) {
          console.log(err);
          return alert('There was an error uploading your photo: ', err.message);
        }
        // confirmImg(data['Location'])
        alert((++s3Cnt) + "번째 사진이 저장되었습니다.");
        closeConfirmBox();
      });  
}
// function uploadingS3(photoKey, file) {
//     // Use S3 ManagedUpload class as it supports multipart uploads
//     var upload = new AWS.S3.ManagedUpload({
//       params: {
//         Bucket: albumBucketName,
//         Key: photoKey,
//         Body: file
//       }
//     });
  
//     var promise = upload.promise();
  
//     promise.then(
//       function(data) {
//         console.log(data);
//         alert("Successfully uploaded photo.");
//         confirmImg(data['Location'])
//         // viewAlbum(albumName);
//       },
//       function(err) {
//         return alert("There was an error uploading your photo: ", err.message);
//       }
//     );
//   }
  
function makeTime(){
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const dateStr = year + 'Y' + month + 'M' + day + 'D';
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const timeStr = hours + 'H' + minutes + 'M' + seconds + 'S';
    return dateStr + timeStr;
}

function confirmImg(toiletImg){
    let maskHeight = $(document).height();
    let maskWidth = window.document.body.clientWidth;
    console.log(maskHeight);
    
    let mask = "<div id='mask'></div>";
    let loadingImg = '';

    loadingImg += "<div id='loadingImg'>";
    // loadingImg += "<div id='cancelBox'>X</div>";
    loadingImg += " <img id='loadingImgIcon' src= '../resource/loading.gif' style='position: relative; display: block; margin: 0px auto; width: 20%'/>";
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
 function closeConfirmBox(){
    $('#mask').remove();
    $('#loadingImg').remove();
}

export function viewAlbum(albumName, pk) {
    let parentNode = document.getElementById("marker-content")
    let carouselWrapperNode = document.createElement('div')
    let carouselNode = document.createElement("div");
    let leftButton = document.createElement('img')
    let rightButton = document.createElement('img')
    let carouselWidth = $('#map_inner').width();

    carouselWrapperNode.setAttribute('id', 'carousel-wrapper');
    carouselWrapperNode.style.overflow="hidden"
    carouselWrapperNode.style.width="100%";
    carouselWrapperNode.style.position="relative";

    carouselNode.setAttribute("id", "carousel");
    carouselNode.style.width= carouselWidth * 2 + "px";
    carouselNode.style.height="100%";
    var albumPhotosKey = encodeURIComponent(albumName) + '/' + pk;
    s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
        if (err) {
            return alert('There was an error viewing your album: ' + err.message);
        }
        // 'this' references the AWS.Response instance that represents the response
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + '/';
        // console.log(data)
        let srcList = [];
        console.log(data.Contents.length)
        var photos = data.Contents.map(function(photo){
                let photoKey = photo.Key;
                let photoUrl = bucketUrl + encodeURIComponent(photoKey);
                srcList.push(photoUrl);
                let newNode = document.createElement('img')
                newNode.setAttribute('id', 'img-frame')
                newNode.setAttribute('src', photoUrl);
                newNode.style.height = "100%";
                newNode.style.width = carouselWidth + "px";
                carouselNode.appendChild(newNode)
        })
        // index = 0;
        if(data.Contents.length == 0){
            alert("사진이 없습니다.")
            deleteNode();
            setMarkerInformation();
        }else{
            console.log(srcList.length)
            document.querySelectorAll('.next-button')[0].addEventListener('click', function(){
                translateContainerRight(srcList.length);
            })
            document.querySelectorAll('.prev-button')[0].addEventListener('click', function(){
                translateContainerLeft();
            })
         }
    });

    leftButton.setAttribute("class", "prev-button")
    leftButton.style.position = "absolute";
    leftButton.style.top = "100px";
    leftButton.style.left = "10px";
    leftButton.style.zIndex= "1";
    
    rightButton.setAttribute("class", "next-button")
    rightButton.style.position = "absolute";
    rightButton.style.top = "100px";
    rightButton.style.right = "10px";
    rightButton.style.zIndex= "1";

    leftButton.setAttribute('src', "../resource/left-arrow.png")
    rightButton.setAttribute('src', "../resource/right-arrow.png")
    carouselWrapperNode.appendChild(rightButton)
    carouselWrapperNode.appendChild(leftButton);
    
    carouselWrapperNode.appendChild(carouselNode);
    parentNode.appendChild(carouselWrapperNode);
  }

  
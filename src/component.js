import { viewAlbum } from "./app.js";
import { deleteNode } from "./form.js";
import { makeFormdata } from "./formData.js";
import { localStorageHandler } from "./localStorage.js";
import { setImageToilet, setMarkerInformation } from "./marker.js";
import { setRequireOptions } from "./store.js";

window.onresize = function(){
    try {
        document.getElementById('carousel').style.width = $('#map_inner').width() * 2 + 'px';
        let imgFrameNode = document.querySelectorAll('#img-frame')
        imgFrameNode.forEach(function(element){
            element.style.width = $('#map_inner').width() +'px';
        })
    } catch (error) {
     console.log("not ready : " + error)   
    }
}
export let index = 0; 
export function translateContainerLeft(){
    if(index == 0) return;
    index += 1;
    console.log(index)
    
    let dynamicWidth = $('#map_inner').width();
    const container = document.getElementById('carousel');
    console.log(`translate3d(${dynamicWidth * index}px, 0, 0)`);

    container.style.transform = `translate3d(${dynamicWidth * index}px, 0, 0)`
    container.style.transitionDuration= '500ms';
}
export function translateContainerRight(idx){
    if(index == -(idx-1)) return;
    index -= 1;

    let dynamicWidth = $('#map_inner').width();
    const container = document.getElementById('carousel');

    console.log(`translate3d(${dynamicWidth * index}px, 0, 0)`)
    container.style.transform = `translate3d(${dynamicWidth * index}px, 0, 0)`
    container.style.transitionDuration= '500ms';
}                    
 export function makeCarousel(){
    viewAlbum('Ansan', localStorageHandler.getItem('PK'));
    // let parentNode = document.getElementById("marker-content")
    // let carouselWrapperNode = document.createElement('div')
    // let carouselNode = document.createElement("div");
    // let leftButton = document.createElement('img')
    // let rightButton = document.createElement('img')
    // let carouselWidth = $('#map_inner').width();

    // carouselWrapperNode.setAttribute('id', 'carousel-wrapper');
    // carouselWrapperNode.style.overflow="hidden"
    // carouselWrapperNode.style.width="100%";
    // carouselWrapperNode.style.position="relative";

    // carouselNode.setAttribute("id", "carousel");
    // carouselNode.style.width= carouselWidth * 2 + "px";
    // carouselNode.style.height="100%";
    // getFile()
    // .then((imgSrc) =>{
    //     let imgFiles = [];
    //     console.log(imgSrc)
    //     imgFiles = imgSrc['urls']
    //     for(let i = 0; i < imgFiles.length; i++){
    //         let newNode = document.createElement('img')
    //         newNode.setAttribute('id', 'img-frame')
    //         newNode.setAttribute('src', imgFiles[i]);
    //         newNode.style.height = "100%";
    //         newNode.style.width = carouselWidth + "px";
    //         carouselNode.appendChild(newNode)
    //     }
    //     index = 0;
    //     document.querySelectorAll('.next-button')[0].addEventListener('click', function(){
    //         translateContainerRight(imgFiles.length);
    //     })
    //     document.querySelectorAll('.prev-button')[0].addEventListener('click', function(){
    //         translateContainerLeft();
    //     })
    // })
    // .catch(err => {
    //     console.log(err);
    //     alert("사진이 없습니다.")
    //     deleteNode();
    //     setMarkerInformation();
    // })
 
    // leftButton.setAttribute("class", "prev-button")
    // leftButton.style.position = "absolute";
    // leftButton.style.top = "100px";
    // leftButton.style.left = "10px";
    // leftButton.style.zIndex= "1";
   
    // rightButton.setAttribute("class", "next-button")
    // rightButton.style.position = "absolute";
    // rightButton.style.top = "100px";
    // rightButton.style.right = "10px";
    // rightButton.style.zIndex= "1";

    // leftButton.setAttribute('src', "../resource/left-arrow.png")
    // rightButton.setAttribute('src', "../resource/right-arrow.png")
    // carouselWrapperNode.appendChild(rightButton)
    // carouselWrapperNode.appendChild(leftButton);
   
    // carouselWrapperNode.appendChild(carouselNode);
    // parentNode.appendChild(carouselWrapperNode);

 }                          

export function touchScroll(){
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let di = 0;
    $("#marker-title").on('touchstart',function(event){
        startX = event.originalEvent.changedTouches[0].screenX;
        startY = event.originalEvent.changedTouches[0].screenY;
    });

    $("#marker-title").on('touchend',function(event){
        endX = event.originalEvent.changedTouches[0].screenX;
        endY = event.originalEvent.changedTouches[0].screenY;
        if(startY - endY > 10){
            setImageToilet();
        }
        else if(endY - startY > 10){
            deleteNode();
            setMarkerInformation();
        }
    });
}
 

async function getFile(){
    let pk = localStorageHandler.getItem('PK');
    const formObj = {
        'PK' : pk.toString(),
        'user' : 'user01',
        'method' : 'GET_IMAGES'
    }
    let formdata = makeFormdata(formObj)
    let response = fetch('https://a8rksepiki.execute-api.ap-northeast-2.amazonaws.com/details/images', setRequireOptions(formdata, null))
    let result = (await response).json();
    return result;
}

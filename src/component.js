import { deleteNode } from "./form.js";
import { setImageToilet, setMarkerInformation } from "./marker.js";

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
let index = 0; 
function translateContainerLeft(){
    if(index == 0) return;
    index += 1;
    console.log(index)
    
    let dynamicWidth = $('#map_inner').width();
    const container = document.getElementById('carousel');
    console.log(`translate3d(${dynamicWidth * index}px, 0, 0)`);

    container.style.transform = `translate3d(${dynamicWidth * index}px, 0, 0)`
    container.style.transitionDuration= '500ms';
}
function translateContainerRight(){
    if(index == -1) return;
    index -= 1;
    console.log(index)

    let dynamicWidth = $('#map_inner').width();
    const container = document.getElementById('carousel');

    console.log(`translate3d(${dynamicWidth * index}px, 0, 0)`)
    container.style.transform = `translate3d(${dynamicWidth * index}px, 0, 0)`
    container.style.transitionDuration= '500ms';
}                    
 export function makeCarousel(){
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

    
    for(let i = 1; i <= 2; i++){
        let newNode = document.createElement('img')
        newNode.setAttribute('id', 'img-frame')
        newNode.setAttribute('src', "../resource/test"+i+".jpg")
        newNode.style.height = "100%";
        newNode.style.width = carouselWidth + "px";
        carouselNode.appendChild(newNode)
    }
   
    leftButton.setAttribute("class", "prev-button")
    leftButton.style.position = "absolute";
    leftButton.style.top = "100px";
    leftButton.style.left = "10px";
    leftButton.style.zIndex= "1";
    leftButton.addEventListener('click', function(){
        translateContainerLeft();
    })

    rightButton.setAttribute("class", "next-button")
    rightButton.style.position = "absolute";
    rightButton.style.top = "100px";
    rightButton.style.right = "10px";
    rightButton.style.zIndex= "1";
    rightButton.addEventListener('click', function(){
        translateContainerRight();
    })
    leftButton.setAttribute('src', "../resource/left-arrow.png")
    rightButton.setAttribute('src', "../resource/right-arrow.png")
    carouselWrapperNode.appendChild(rightButton)
    carouselWrapperNode.appendChild(leftButton);
   
    carouselWrapperNode.appendChild(carouselNode);
    parentNode.appendChild(carouselWrapperNode);

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
        console.log(startY + " : " + endY)
        if(startY - endY > 10){
            setImageToilet();
        }
        else if(endY - startY > 10){
            deleteNode();
            setMarkerInformation();
        }
    });
}
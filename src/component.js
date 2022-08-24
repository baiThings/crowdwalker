// const container = document.querySelector(".container");
// const prevBtn = document.querySelector(".prev-button");
// const nextBtn = document.querySelector(".next-button"); 

// (function addEvent(){
//     console.log(prevBtn)
//   prevBtn.addEventListener('click', translateContainer.bind(this, 1));
//   nextBtn.addEventListener('click', translateContainer.bind(this, -1));
// })();

// function translateContainer(direction){
//   const selectedBtn = (direction === 1) ? 'prev' : 'next';
//   container.style.transitionDuration = '500ms';
//   container.style.transform = `translateX(${direction * (100 / 5)}%)`;
//   container.ontransitionend = () => reorganizeEl(selectedBtn);
// }

// function reorganizeEl(selectedBtn) {
//   container.removeAttribute('style');
//   (selectedBtn === 'prev') ? container.insertBefore(container.lastElementChild, container.firstElementChild): container.appendChild(container.firstElementChild);
// }

window.onresize = function(){
    console.log($('#map_inner').width())
    document.getElementById('carousel').style.width = $('#map_inner').width() * 2 + 'px';
    let imgFrameNode = document.querySelectorAll('#img-frame')
    imgFrameNode.forEach(function(element){
        element.style.width = $('#map_inner').width() +'px';
    })
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

//  <button class="btn1" type="button" onclick="javascript:sensorBtnClick('btn1');">버튼1</button>
//  <button class="btn2" type="button" onclick="javascript:sensorBtnClick('btn2');">버튼2</button>

                      
// button.btn1 {
//     position: absolute;
//     top: 170px;
//     left : 35px; 
//   }
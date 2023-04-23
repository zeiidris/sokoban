const thick = 10
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const getNum = window.getComputedStyle(canvas,null)
const next = document.getElementById('next')
const level = document.getElementById('level')
let width = getNum.getPropertyValue('width')
let height = getNum.getPropertyValue('height')
width = width.slice(0,width.length-2)
height = height.slice(0,height.length-2)
canvas.width = width
canvas.height = height
canvas.style.background = "#ded7b3"
let conter = 1
level.innerHTML = conter
let map;
let indexes;
let index ;
let heroX ;
let heroY ;
let playable = true 
let con = document.getElementById('con')
const r = (height/9 -20) / 2.5 -1
const maps = [{
    map:[[ "empty","empty","wall","wall","wall","wall","wall","empty",
    "wall","wall","wall","empty","empty","empty","wall","empty",
    "wall","empty","empty","empty","box","empty","wall","empty",
    "wall","wall","wall","empty","box","empty","wall","empty",
    "wall","empty","wall","wall","box","empty","wall","empty",
    "wall","empty","wall","empty","empty","empty","wall","wall",
    "wall","box","empty","box","box","box","empty","wall",
    "wall","empty","empty","empty","empty","empty","empty","wall",
    "wall","wall","wall","wall","wall","wall","wall","wall"],[17,29,33,44,51,54,60],[18],[width*2/8 + width/16 +thick/2 -2],[height*2/9 + height/18]]},
    {
    map: [[
        "empty","empty","wall","wall","wall","wall","wall","empty",
        "wall","wall","wall","empty","empty","empty","wall","empty",
        "wall","empty","empty","box","empty","empty","wall","wall",
        "wall","empty","empty","empty","box","empty","empty","wall",
        "wall","wall","wall","empty","box","box","empty","wall",
        "empty","empty","wall","empty","empty","empty","wall","wall",
        "empty","empty","wall","wall","wall","wall","wall","empty",
        "wall","wall","wall","wall","wall","wall","wall","wall",
        "wall","wall","wall","wall","wall","wall","wall","wall"],[20,27,29,36],[21],[width*5/8 + width/16],[height*2/9 + height/18]]
    }
        ,
      {  
    map:[[
        "empty","empty","wall","wall","wall","wall","empty","empty",
        "empty","empty","wall","empty","empty","wall","empty","empty",
        "empty","wall","wall","empty","empty","wall","wall","empty",
        "empty","wall","empty","empty","box","empty","wall","empty",
        "wall","wall","empty","box","empty","empty","wall","wall",
        "wall","empty","empty","wall","box","box","empty","wall",
        "wall","empty","empty","empty","empty","empty","empty","wall",
        "wall","wall","wall","wall","wall","wall","wall","wall"
        ,"wall","wall","wall","wall","wall","wall","wall","wall"
    ],[11,12,20,29],[51],[width*3/8 + width/16],[height*6/9 +height/18]]}
]
function getMap(){
    const maps1 =  JSON.parse(JSON.stringify(maps));
    maps1.forEach((mp ,idx)=>{
        if(idx + 1 == conter){
            map = mp.map[0]
            indexes = mp.map[1]
            index = +(mp.map[2].join(''))
            heroX = +(mp.map[3].join(''))
            heroY = +(mp.map[4].join(''))
        }
    })

}
getMap()
const restart = document.getElementById('restart')
let boxes = []
let dots = []
let x =thick / 2
let y =thick/2
window.scrollTo(0,0)
const textEl = document.getElementById('text')
const text = `Your character in this game is <img src="1.png">. You have to put all of yellow boxes <img src="2.png"> on the red dots <img src="3.png">. You can push yellow boxes and you CANNOT pull it. if box is on a dot, it becomes green. Use → to move your character to right, ← to move to the left, ↑ to move up, ↓ to move down.
There are three levels in this game that differ in difficulity and that you cannot finish it.`
let num = 1
let grennBoxes = []
const play = document.getElementById('play')
const gameContainer = document.querySelector('.game-container'),
    winner_container = document.querySelector('.winner-container'),
    winner = document.querySelector('.winner')
play.addEventListener('click',()=>{window.scrollTo(0,window.innerHeight)})
setTimeout(writeText, 2300)
function writeText(){
    textEl.innerHTML = text.slice(0,num)
    num++
    if(text[num]=="<"){
        num+=17
    }
    if(num > text.length){
        play.style.display = "flex"
        clearTimeout(writeText)
    }
    setTimeout(writeText, 50)
}
class rectangle{
    constructor(xpos,ypos,wallColor,lineWallColor,boxColor,lineBoxColor,xc,yc,radius){
        this.xpos = xpos
        this.ypos = ypos
        this.wallColor = wallColor
        this.boxColor = boxColor
        this.lineWallColor = lineWallColor
        this.lineBoxColor = lineBoxColor
        this.xc = xc
        this.yc = yc
        this.wdt = width/8-thick
        this.hgt = height/9-thick
        this.radius = radius
        this.boxIdx = 0
    }
    drawWall(context){
        context.fillStyle = this.wallColor
        context.lineWidth = thick
        context.strokeStyle = this.lineWallColor
        context.fillRect(this.xpos,this.ypos,this.wdt, this.hgt)
        context.strokeRect(this.xpos,this.ypos,this.wdt, this.hgt)    
    }
    drawBox(context){
        context.fillStyle = this.boxColor
        context.lineWidth = thick
        context.strokeStyle  = this.lineBoxColor
        context.fillRect(this.xpos,this.ypos,this.wdt, this.hgt )
        context.strokeRect(this.xpos,this.ypos,this.wdt, this.hgt )
    }
    drawDots(context){
        context.beginPath()
        context.lineWidth = 20
        context.strokeStyle = "#ca8e7d"
        context.arc(this.xc,this.yc,5,0,Math.PI*2,false)
        context.stroke()
        context.fillStyle = "#dfbbb1"
        context.fill()
        context.closePath()
    }

}
class Hero{
    constructor(xpos,ypos,radius,color,lineColor,index){
        this.xpos = xpos
        this.ypos = ypos
        this.radius = radius
        this.color = color
        this.lineColor = lineColor
        this.index = index
    }
    draw(context){
        context.beginPath()
        context.lineWidth = 20
        context.strokeStyle = "#3f7ab9"
        context.arc(this.xpos,this.ypos,this.radius,0,Math.PI * 2,false)
        context.stroke()
        context.fillStyle = "#4f99e8"
        context.fill()
        context.closePath()
    }
}
function createMap(element,rect,idx){
    if(element == "wall"){
        rect.drawWall(context)
        x+= width/8 
        if(x >= width){
            x = thick/2
            y+=height/9
        }
    }
    else if(element == "box"){
        boxes.push(rect)
        rect.boxIdx = idx
        rect.drawBox(context)
        x+=width/8 
        if(x >= width){
            x = thick / 2
            y+=height/9 
        }
    }
    else if (element == "empty"){
        x+= width/8 
        if(x >= width){
            x = thick / 2
            y+=height/9 
        } 
    }
}
function createDots(rect , idx){
        let xc = x - width/8 +(width/8)/2 -thick/2
        let yc = y + (height/9)/2 -thick/2
        rect = new rectangle(x,y,"#868687","#505051","#d9ae0a","#c79300",xc,yc,5)
        rect.dotIdx = idx
        rect.drawDots(context)
        dots.push(rect)
}
// create map
function CreateAllMap(){
    map.forEach((element,idx) =>{
        let rect = new rectangle(x,y,"#868687","#505051","#d9ae0a","#c79300",0,0,5)
        createMap(element ,rect , idx)
        indexes.forEach(c =>{
            if(idx == c){
                createDots(rect,idx)
            }})
    }) 
}
CreateAllMap()
function checkBoxOnDot(box){
    dots.forEach(dot =>{
        const Mx = box.xpos+width/16
        const My = box.ypos+height/18
        const distance = Math.sqrt((Mx-dot.xc)*(Mx-dot.xc)+(My-dot.yc)*(My-dot.yc))
        if(distance < (box.wdt+dot.radius-thick)){
            context.clearRect(box.xpos-thick/2,box.ypos-thick/2-1,box.wdt+thick,box.hgt+thick+1.7)
            rect = new rectangle(box.xpos,box.ypos,"#868687","#505051","#4ccd5a","#3ca448",dot.xc,dot.yc,5)
            rect.boxIdx = box.boxIdx
            boxes[boxes.indexOf(box)] = rect
            rect.drawBox(context)
        }else  if(distance > (box.wdt+dot.radius-thick)) {
            box.boxColor = "#d9ae0a"
            box.lineBoxColor = "#c79300"
        }
    })
}
function checkHeroOnDot(sign){
    dots.forEach(dot =>{
        if(sign == "right"){
            if(dot.dotIdx == index-1){
                rect = new rectangle(x,y,"#868687","#505051","#d9ae0a","#c79300",dot.xc,dot.yc,5)
                rect.drawDots(context)
            }
        }else if(sign == "left"){
            if(dot.dotIdx == index+1){
                rect = new rectangle(x,y,"#868687","#505051","#d9ae0a","#c79300",dot.xc,dot.yc,5)
                rect.drawDots(context)
            }
        }
        else if(sign == "up"){
            if(dot.dotIdx == index+8 ){
                rect = new rectangle(x,y,"#868687","#505051","#d9ae0a","#c79300",dot.xc,dot.yc,5)
            rect.drawDots(context)
            }
        }else if(sign == "down"){ 
        if( dot.dotIdx == index-8 ){
            rect = new rectangle(x,y,"#868687","#505051","#d9ae0a","#c79300",dot.xc,dot.yc,5)
            rect.drawDots(context)
        }}
    })
}
function checkOnLoadBoxOnDots(){
    boxes.forEach(box=>{
        dots.forEach(dot =>{
            const Mx = box.xpos+width/16
            const My = box.ypos+height/18
            const distance = Math.sqrt((Mx-dot.xc)*(Mx-dot.xc)+(My-dot.yc)*(My-dot.yc))
            if(distance < (box.wdt+dot.radius)-thick){
                context.clearRect(box.xpos-thick/2,box.ypos-thick/2-1,box.wdt+thick,box.hgt+thick+1.7)
                rect = new rectangle(box.xpos,box.ypos,"#868687","#505051","#4ccd5a","#3ca448",dot.xc,dot.yc,5)
                /* rect.drawDots(context) */
                rect.boxIdx = box.boxIdx
                rect.drawBox(context)
                boxes[boxes.indexOf(box)] = rect
            }
        })
    })
}

let hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
hero.draw(context)
function moveHeroOnX(sign){
    if(sign =="right"){
        removeHero()
        index++ 
        heroX+=width/8
        hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
        hero.draw(context)
}
    if(sign == "left"){
       removeHero()
        heroX=heroX-width/8
        index--
        hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
        hero.draw(context)
    }    
    checkHeroOnDot(sign)
    console.log(map[20]);
    console.log(maps);
}
function moveHeroOnY(sign){
    if(sign == "down"){
    removeHero()    
    index+=8 
    heroY+=height/9
    hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
    hero.draw(context)
} else if(sign == "up"){
    removeHero()
    heroY-=height/9
    index-=8
    hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
    hero.draw(context)
}
checkHeroOnDot(sign)

}
function removeHero(){
    context.clearRect(hero.xpos-hero.radius - thick-1,hero.ypos-thick - hero.radius-1,hero.radius*2+thick*2+2,hero.radius*2+thick*2+2)
}
function moveBoxOnX(sign,box){
    if(sign == "right"){
        context.clearRect(box.xpos-thick/2,box.ypos-thick/2-1,box.wdt+thick,box.hgt+thick+1.7)
        box.xpos += width/8
        box.boxIdx++
        rect = new rectangle(box.xpos,box.ypos,"#868687","#505051","#d9ae0a","#c79300",0,0,5)
        rect.drawBox(context)
    }
    if(sign == "left"){
        context.clearRect(box.xpos-thick/2,box.ypos-thick/2-1,box.wdt+thick,box.hgt+thick+1.7)
        box.xpos -= width/8
        box.boxIdx--
        rect = new rectangle(box.xpos,box.ypos,"#868687","#505051","#d9ae0a","#c79300",0,0,5)

        rect.drawBox(context)
    }
    checkBoxOnDot(box)
}
function moveBoxOnY(sign,box){
    if(sign == "down"){
        context.clearRect(box.xpos-thick/2,box.ypos-thick/2-1,box.wdt+thick,box.hgt+thick+1.7)
        box.ypos += height/9
        box.boxIdx+=8
        rect = new rectangle(box.xpos,box.ypos,"#868687","#505051","#d9ae0a","#c79300",0,0,5)
        rect.drawBox(context)
    }else if(sign == "up"){
        context.clearRect(box.xpos-thick/2,box.ypos-thick/2-1,box.wdt+thick,box.hgt+thick+1.7)
        box.ypos -= height/9
        box.boxIdx-=8
        rect = new rectangle(box.xpos,box.ypos,"#868687","#505051","#d9ae0a","#c79300",0,0,5)
        rect.drawBox(context)
    }
   checkBoxOnDot(box)
}
window.addEventListener('keydown',(e)=>{
    if(playable){
    if(e.key == "ArrowRight"){
        if(map[index+1] == "empty" ){
            moveHeroOnX("right")
    }else if(map[index+1] == "box" && map[index+2] == "empty"){
        map[index+1] = "empty"
        map[index+2] = "box"
        console.log(map[20]);
        console.log(maps);
        boxes.forEach(box =>{
            if(box.boxIdx == index+1 ){
                moveBoxOnX("right",box)
                checkBoxOnDot(box)
        }}) 
        moveHeroOnX("right")
        checkWin()
    }else if(map[index+1]=="box" && map[index+2]=="box" && map[index+3]=="empty"){
        boxes.reverse()
        for(let i = 3;i>=1 ;i--){
            i==1? map[index+1]="empty": map[index+i]="box"
            if(i<3){
            boxes.forEach((box) =>{
                if(box.boxIdx == index+i ){
                   moveBoxOnX('right',box)
                   checkBoxOnDot(box)  
            }
        })
        }
        }
    boxes.reverse()
    moveHeroOnX("right")
    checkWin()
    }
    }
    else if(e.key == "ArrowLeft"){
        if(map[index-1] == "empty" ){
           moveHeroOnX("left")
    }else if(map[index-1] == "box" && map[index-2] == "empty"){
        map[index-1] = "empty"
        map[index-2] = "box"
        boxes.forEach((box) =>{
            if(box.boxIdx == index-1 ){
                moveBoxOnX("left",box)
                checkBoxOnDot(box) 
        }}) 
      moveHeroOnX("left")
      checkWin()
    }else if(map[index-1]=="box" && map[index-2]=="box" && map[index-3]=="empty"){
        boxes.reverse()
        for(let i = -3;i<0;i++){
            i==-1?map[index+i]="empty":map[index+i]="box"
            if(i>-3){
            boxes.forEach((box) =>{
                if(box.boxIdx == index+i ){
                    moveBoxOnX("left",box)
                    checkBoxOnDot(box)
            } })}
        }
        boxes.reverse()
        moveHeroOnX("left")
        checkWin()
    }  
    }
    else if(e.key == "ArrowDown"){
        if(map.at(index+8) == "empty" ){

           moveHeroOnY("down")
    }
    else if(map[index+8] == "box" && map[index+16] == "empty"){
        map[index+8] = "empty"
        map[index+16] = "box"
        boxes.forEach((box) =>{
            if(box.boxIdx == index+8 ){
                moveBoxOnY("down",box)
                checkBoxOnDot(box)
        }}) 
        moveHeroOnY("down")
        checkWin()
    }
    else if(map[index+8]=="box" && map[index+16]=="box" && map[index+24]=="empty"){
        boxes.reverse()
        for(let i = 24;i>7;i-=8){i==8? map[index+i] = "empty": map[index+i] = "box" 
        if(i<17){
        boxes.forEach(box =>{
                if(box.boxIdx == index+i ){
                    moveBoxOnY("down",box)
                    checkBoxOnDot(box)
              }
            })
        }
    }
    boxes.reverse()
    moveHeroOnY("down")
    checkWin()
    }
    else if(map[index+8]=="box" && map[index+16]=="box" && map[index+24]=="box" && map[index+32] == "empty"){
        boxes.reverse()
        for(let i = 32;i>7;i-=8){i==8? map[index+i] = "empty": map[index+i] = "box"
        if(i<25){
        boxes.forEach(box =>{
            if(box.boxIdx == index+i ){
              moveBoxOnY("down",box)
              checkBoxOnDot(box)
              
        }})}
    }
    boxes.reverse()
    moveHeroOnY("down")
    checkWin()
    }
    else if(map[index+8]=="box" && map[index+16]=="box" && map[index+24]=="box" && map[index+32] == "box" && map[index+40]=="empty"){
        boxes.reverse()
        for(let i = 40;i>7;i-=8){i==8? map[index+i] = "empty": map[index+i] = "box"
        if(i<33){
        boxes.forEach(box =>{
            if(box.boxIdx == index+i ){
              moveBoxOnY("down",box)
              checkBoxOnDot(box)
              
        }})}
    }
    boxes.reverse()
    moveHeroOnY("down")
    checkWin()
    }
    }
    else if(e.key == "ArrowUp"){
        if(map[index-8] == "empty" ){
            moveHeroOnY("up")
     }else if(map[index-8] == "box" && map[index-16] == "empty"){
         map[index-8] = "empty"
         map[index-16] = "box"
         boxes.forEach((box) =>{
             if(box.boxIdx == index-8 ){
                 moveBoxOnY("up",box)
                 checkBoxOnDot(box)
         }}) 
         moveHeroOnY("up")
         checkWin()
     }
     else if(map[index-8]=="box" && map[index-16]=="box" && map[index-24]=="empty"){
         boxes.reverse()
         for(let i = -24;i<-7;i+=8){i==-8? map[index+i] = "empty": map[index+i] = "box" 
         if(i>=-16){
         boxes.forEach(box =>{
                 if(box.boxIdx == index+i ){
                     moveBoxOnY("up",box)
                     checkBoxOnDot(box)
               }
            })
        }
     }
     boxes.reverse()
     moveHeroOnY("up")
     checkWin()
     }
     else if(map[index-8]=="box" && map[index-16]=="box" && map[index-24]=="box" && map[index-32] == "empty"){
         boxes.reverse()
         for(let i = -32;i<-7;i+=8){i==-8? map[index+i] = "empty": map[index+i] = "box"
         if(i> -25){
         boxes.forEach(box =>{
             if(box.boxIdx == index+i ){
               moveBoxOnY("up",box)
               checkBoxOnDot(box)
         }})}
     }
     boxes.reverse()
     moveHeroOnY("up")  
     checkWin()
     }
    }}
})
function checkWin(){
    grennBoxes.splice("")
    grennBoxes = boxes.filter(box => box.boxColor == "#4ccd5a")
    if(grennBoxes.length == dots.length){
        gameContainer.classList.add('won')
        winner_container.classList.add('won')
        winner.classList.add('animate__fadeIn')
        playable =false
    }
    if(grennBoxes.length == dots.length && conter == 3){
        gameContainer.classList.add('won')
        winner_container.classList.add('won')
        winner.classList.add('animate__fadeIn')
        con.innerHTML = "Congratulations, didn't expect that from you. you are so intelligent!"
        next.style.display = "none"
    }
}
restart.addEventListener('click',() =>{
    x =thick / 2
    y =thick/2
    context.clearRect(0,0,width,height)
    boxes.splice('')
    dots.splice("")
    getMap()
    CreateAllMap()
    hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
    hero.draw(context)
    checkOnLoadBoxOnDots()
    console.log(maps);
})
next.addEventListener('click',()=>{
    playable = true
    conter++
    gameContainer.classList.remove('won')
    winner_container.classList.remove('won')
    winner.classList.remove('animate__fadeIn')
    x =thick / 2
    y =thick/2
    context.clearRect(0,0,width,height)
    boxes.splice('')
    dots.splice("")
    getMap()
    CreateAllMap()
    hero = new Hero(heroX,heroY,r,"#3f7ab9","#4f99e8",index)
    hero.draw(context)
    checkOnLoadBoxOnDots()
    level.innerHTML = conter
})
checkOnLoadBoxOnDots()
document.addEventListener("keydown", function (e) {
  if (
    e.ctrlKey &&
    (e.keyCode == "61" ||
      e.keyCode == "107" ||
      e.keyCode == "173" ||
      e.keyCode == "109" ||
      e.keyCode == "187" ||
      e.keyCode == "189")
  ) {
    e.preventDefault();
  }
});
document.addEventListener(
  "wheel",
  function (e) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  {
    passive: false
  }
);
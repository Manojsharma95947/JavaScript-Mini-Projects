let gameSeq = [];
let userSeq = [];

let color = ["red","yellow","green","purple"];

let start =  false;
let level = 0;

let startBtn = document.querySelector("#startBtn");

startBtn.addEventListener("click",function(){
    if(start == false){
        console.log("Game Started");
        start = true;
    }
    levelUp();
    startBtn.style.display = "none";
})


function btnFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash")
    },200);
}

function userBtnFlash(btn){
    btn.classList.add("userFlash");
    setTimeout(function(){
        btn.classList.remove("userFlash")
    },200);
}

function levelUp(){
    userSeq = [];
    level++;

    let h2 = document.querySelector("h2");
    h2.innerText = `Level ${level}`;

    let rdnIdx = Math.floor(Math.random()*3);
    // console.log(rdnIdx);

    let rdnClr = color[rdnIdx];
    // console.log(rdnClr);

    gameSeq.push(rdnClr);
    console.log(gameSeq);

    let rndBtn = document.querySelector(`.${rdnClr}`);
    btnFlash(rndBtn);
}



function checkAns(idx){

    if(gameSeq[idx] === userSeq[idx]){
        if(gameSeq.length == userSeq.length){
            setTimeout(levelUp,1000);
        }   
    }
    else{
        let h2 = document.querySelector("h2");
        h2.innerHTML = `Game Over !! Your Score was <b>${level}</b>. <br>
        Press PlayAgain to replay the game`;
        document.querySelector("body").style.backgroundColor="red";
        setTimeout(function(){
             document.querySelector("body").style.backgroundColor="#819ff9";
        },200)
        console.log("Game over");
        reset();
    }
}

function btnPress(){
    
    let btn = this;
    userBtnFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length-1);




}

let btns = document.querySelectorAll(".btn");
for(let btn of btns){
    btn.addEventListener("click",btnPress);
}

function reset(){
    start = false;
    level = 0;
    gameSeq = [];
    userSeq= [];
    startBtn.style.display="inline-block";
    startBtn.innerText = "Play Again";
}
const holes = document.querySelectorAll(".hole");
let scoreDisplay = document.querySelector("#score");
let missDisplay = document.querySelector("#miss");
let score =0;
let misses =0;

let start = document.querySelector("#startGame");
let over;

start.addEventListener("click", function(){
     over =setInterval(showMoles,1000);
    start.style.display = "none"

    let h3 = document.querySelector("h3");
    h3.innerText = "Game On";

})

function gameover(){

    setTimeout(() => {
  missDisplay.textContent= 0;
}, 1000);
    
    misses = 0;
    let h3 = document.querySelector("h3");
    h3.innerText = "Game Over!! your score is "+ score;
    const sound = document.getElementById("gameOverSound");
        sound.play();

        document.querySelector("body").style.backgroundColor="red";
        setTimeout(function(){
             document.querySelector("body").style.backgroundColor="#819ff9";
        },250)
    
    clearInterval(over);
    start.style.display = "inline-block";
    start.innerText = "Replay"
    
}

function showMoles(){
    holes.forEach(holes=>{holes.innerHTML=""})
    let randomHole = holes[Math.floor(Math.random()*6)];

    let moles = document.createElement("div");
    moles.classList.add("mole");

    moles.addEventListener("click",()=>{
        score++;
        scoreDisplay.innerHTML = score;
        moles.remove();
    })

    randomHole.appendChild(moles);

    setTimeout(function(){
       if(randomHole.contains(moles)){
        moles.remove();
        misses++;
        // console.log(misses)
        
        if(missDisplay){
            missDisplay.textContent = misses;
        }
        if(misses>= 5){
            gameover();
        }
        
       } 
    },900)  
}



 
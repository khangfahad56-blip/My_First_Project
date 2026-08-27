// tick &#10004; and cross &#10008;

// Box variables

let container = document.querySelector(".container");

let box1 = document.querySelector("#box1");
let box2 = document.querySelector("#box2");
let box3 = document.querySelector("#box3");
let box4 = document.querySelector("#box4");
let box5 = document.querySelector("#box5");
let box6 = document.querySelector("#box6");
let box7 = document.querySelector("#box7");
let box8 = document.querySelector("#box8");
let box9 = document.querySelector("#box9");

// True is Player 1 and False is Player 2

let turn = 1;
function put_mark(event){
    let box_num = event.target
    if(turn === 1){
        box_num.innerHTML = "&#10004";
        box_num.classList.add("tick");
        box_num.classList.remove("cross")
        turn = 0;
    }else{
        box_num.innerHTML = "&#10008";
        box_num.classList.add("cross");
        box_num.classList.remove("tick")
        turn = 1;
    };
    
};

// box1.addEventListener("click", put_mark);
// box2.addEventListener("click", put_mark);
// box3.addEventListener("click", put_mark);
// box4.addEventListener("click", put_mark);
// box5.addEventListener("click", put_mark);
// box6.addEventListener("click", put_mark);
// box7.addEventListener("click", put_mark);
// box8.addEventListener("click", put_mark);
// box9.addEventListener("click", put_mark);

for (let box of container.children) {
    if(box.innerHTML !== "&#10008" || box.innerHTML !== "&#10004"){
        console.dir(box.innerHTML);
        box.addEventListener("click", put_mark);
    };
}
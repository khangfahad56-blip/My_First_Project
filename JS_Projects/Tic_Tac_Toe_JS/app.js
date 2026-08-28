let boxes = document.querySelectorAll(".box");
let msg_p = document.querySelector(".msg");
let msg_container = document.querySelector(".msg_container");
let start_btn = document.querySelector(".start_btn");
let rest_btn = document.querySelector(".rest_btn");
let turn = 0; // PlayerO is 0 and PlayerX is 1
const winning_parttern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const putting_marks = (box) => {
  if (turn === 0) {
    box.innerText = "O";
    box.classList.add("circle");
    box.classList.remove("cross");
    turn = 1;
    box.disabled = true;
  } else {
    box.innerText = "X";
    box.classList.add("cross");
    box.classList.remove("circle");
    turn = 0;
    box.disabled = true;
  }
};
const checking_parttern = () => {
  for (let parttern of winning_parttern) {
    let pos_val1 = boxes[parttern[0]].innerHTML;
    let pos_val2 = boxes[parttern[1]].innerHTML;
    let pos_val3 = boxes[parttern[2]].innerHTML;
    if (pos_val1 != "" && pos_val2 != "" && pos_val3 != "") {
      if (pos_val1 === pos_val2 && pos_val2 === pos_val3) {
        showing_msg(pos_val1);
        return true;
      }
    }
  }
};

const showing_msg = (winner) => {
  msg_container.classList.remove("hide");
  msg_p.innerText = `The Winner is ${winner}`;
  disable_btns();
};

const disable_btns = () => {
  for (box of boxes) {
    box.disabled = "true";
  }
};

const enable_btns = () => {
  for (box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

for (let box of boxes) {
  box.addEventListener("click", () => {
    putting_marks(box);
    checking_parttern();
  });
}
start_btn.addEventListener("click", () => {
  enable_btns();
  msg_container.classList.add("hide");
});

rest_btn.addEventListener("click", () => {
  enable_btns();
  msg_container.classList.add("hide");
});

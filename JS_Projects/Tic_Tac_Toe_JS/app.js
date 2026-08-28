let container = document.querySelector(".container");
let turn = 1;
let boxes = ["", "", "", "", "", "", "", "", ""];
let is_running = false;
function put_mark(event) {
  if (is_running) {
    return;
  }
  let box_num = event.target;
  let box_id = event.currentTarget.id;
  if (box_num.textContent.trim() === "") {
    if (turn === 1) {
      box_num.innerHTML = "O";
      box_num.classList.add("circle");
      box_num.classList.remove("cross");
      turn = 0;
      boxes[box_id] = "O";
    } else {
      box_num.innerHTML = "X";
      box_num.classList.add("cross");
      box_num.classList.remove("circle");
      turn = 1;
      boxes[box_id] = "X";
    }
  } else {
    console.log("You Click again");
  }
  if (
    (boxes[0] === "O" && boxes[1] === "O" && boxes[2] === "O") ||
    (boxes[3] === "O" && boxes[4] === "O" && boxes[5] === "O") ||
    (boxes[6] === "O" && boxes[7] === "O" && boxes[8] === "O") ||
    (boxes[0] === "O" && boxes[3] === "O" && boxes[6] === "O") ||
    (boxes[1] === "O" && boxes[4] === "O" && boxes[7] === "O") ||
    (boxes[2] === "O" && boxes[5] === "O" && boxes[8] === "O") ||
    (boxes[0] === "O" && boxes[4] === "O" && boxes[8] === "O") ||
    (boxes[2] === "O" && boxes[4] === "O" && boxes[6] === "O")
  ) {
    console.log("Circle Win");
    is_running = true;
  } else if (
    (boxes[0] === "X" && boxes[1] === "X" && boxes[2] === "X") ||
    (boxes[3] === "X" && boxes[4] === "X" && boxes[5] === "X") ||
    (boxes[6] === "X" && boxes[7] === "X" && boxes[8] === "X") ||
    (boxes[0] === "X" && boxes[3] === "X" && boxes[6] === "X") ||
    (boxes[1] === "X" && boxes[4] === "X" && boxes[7] === "X") ||
    (boxes[2] === "X" && boxes[5] === "X" && boxes[8] === "X") ||
    (boxes[0] === "X" && boxes[4] === "X" && boxes[8] === "X") ||
    (boxes[2] === "X" && boxes[4] === "X" && boxes[6] === "X")
  ) {
    console.log("Cross Win");
    is_running = true;
  }

  //   let winning_statement = document.createElement("p");
  //   winning_statement.innerText()
}

for (let box of container.children) {
  box.addEventListener("click", put_mark);
}

// 0-1-2
// 3-4-5
// 6-7-8
// 0-3-6
// 1-4-7
// 2-5-8
// 0-4-8
// 2-4-6

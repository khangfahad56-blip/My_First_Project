const showcount = document.getElementById("scorevalue");
let count = 0; 
function add(){
    count += 1;
    showcount.innerText = count;
    return count;
};
function subtract(){
    count -= 1;
    showcount.innerText = count;
    return count;
};
function rest(){
    count = 0;
    showcount.innerText = count;
    return count;
};

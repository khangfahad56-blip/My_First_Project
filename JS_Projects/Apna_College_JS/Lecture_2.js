// let num = prompt("Write a Number:");
// if(num%5 == 0){
//     console.log(`The number ${num} is Multiple of 5`);
// }
// else{
//     console.log(`The number ${num} is not Multiple of 5`);
// };

let marks = prompt("Write your Marks");

if(marks >= 90 && marks <= 100){
    console.log("You got A Grade");
}
else if(marks >= 70 && marks <=89){
    console.log("You got B Grade");
}
else if(marks >= 60 && marks <= 69){
    console.log("You got C Grade");
}
else if(marks >= 50 && marks <=59){
    console.log("You got D Grade");
}
else if(marks >=0 && marks <=49){
    console.log("You got F Grade");
};
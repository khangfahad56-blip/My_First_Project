let theme_btn = document.querySelector("#theme_btn");
let header1 = document.querySelector("#header1");
let para1 = document.querySelector("#para1");
let body = document.querySelector("body");
let theme = "dark";

theme_btn.addEventListener("click", () => {
  if (theme == "dark") {
    theme_btn.setAttribute("class", "dark_mode");
    header1.setAttribute("class", "dark_mode");
    para1.setAttribute("class", "dark_mode");
    body.setAttribute("class", "dark_mode");
    theme_btn.innerText = "Dark Mode";
    theme = "ligth";
  } else{
    theme_btn.setAttribute("class", "light_mode");
    header1.setAttribute("class", "light_mode");
    para1.setAttribute("class", "light_mode");
    body.setAttribute("class", "light_mode");
    theme_btn.innerText = "Light Mode";
    theme = "dark";
  }
});

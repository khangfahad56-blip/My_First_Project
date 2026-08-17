function age_check() {
    const age_input = document.getElementById("age_input");
    const result_text = document.getElementById("result_text");
    const submit_btn = document.getElementById("submit_btn");
    let age = age_input.value;
    age = Number(age);
    let result;
    if (age >= 100) {
        result = "You are Too old to Used this Website";
    }
    else if (age >= 18){
        result = "You can Use This Website as You are 18+";
    }
    else if (age == 0){
        result = "You can not Used this Website as You are just Born"
    }
    else if (age < 0){
        result = "You can not Used this Website as You are not Born"
    }
    else if (age < 18){
        result = "You can not Used this Website as You are not 18+"
    }
    result_text.innerText = result
}
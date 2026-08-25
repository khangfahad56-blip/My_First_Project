let student_json = `{
    "Name": "Muhammad Fahad Khan",
    "Age": 17,
    "Course": "Full Stack Development",
    "Marks": 1048,
    "Skills": ["HTML","CSS","JS","PHP","MYSQL"]
}`;
console.log(student_json);
let student_obj = JSON.parse(student_json);
console.log(`Name: ${student_obj.Name}`);
console.log(`Age: ${student_obj.Age}`);
console.log(`Course: ${student_obj.Course}`);
console.log(`Marks: ${student_obj.Marks}`);
console.log(`Skills: ${student_obj.Skills}`);
student_obj.Skills.push("Python");
student_obj.Age = 18;
student_obj.Marks = 1068;
let new_student_json = JSON.stringify(student_obj);
console.log(new_student_json);
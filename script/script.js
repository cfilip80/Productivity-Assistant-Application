const todoTitle = document.getElementById("todo-title");
const todoCategory = document.getElementById("category");
const todoTimeEstimate = document.getElementById("todo-time-estimate");
const todoDeadline = document.getElementById("todo-deadline");
const todoDescription = document.getElementById("description");
const todoDoneBox = document.getElementById("todo-done-status");
const todoNotDoneBox = document.getElementById("todo-notDone-status");
const form = document.querySelector(".todo-form");
const todosAndActivitis= []


const todoClearForm = () => {
    todoTitle.value = '';
    todoCategory.value = '';
    todoTimeEstimate.value = '';
    todoDeadline.value = '';
    todoDescription.value = '';
    todoDoneBox.checked = false;
    todoNotDoneBox.checked = false;
}
//function to todoDoneBox
// let todoIsChecked = () => {
//     if (todoDoneBox.checked)
//         return todoDoneBox.value;
//     else if(todoNotDoneBox.checked)
//         return todoNotDoneBox.value;
// }

form.addEventListener("submit", function(event) {
    event.preventDefault(); // Förhindra att sidan laddas om
    
    const todoData = {
        title: todoTitle.value,
        category: todoCategory.value,
        timeEstimate: todoTimeEstimate.value,
        deadline: todoDeadline.value,
        description: todoDescription.value, 
        statustoe: todoDoneBox.checked ? "Done" : todoNotDoneBox.checked ? "Not Done" : "No status selected".value
        
    };
    todosAndActivitis.push(todoData);
    console.log("New Todo:", todoData);
    console.log(todosAndActivitis);
    todoClearForm();
});


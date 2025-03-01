const todoTitle = document.getElementById("todo-title");
const todoCategory = document.getElementById("todo-category");
const todoTimeEstimate = document.getElementById("todo-time-estimate");
const todoDeadline = document.getElementById("todo-deadline");
const todoDescription = document.getElementById("description");
const todoDoneBox = document.getElementById("todo-done-status");
const todoNotDoneBox = document.getElementById("todo-notDone-status");
const form = document.querySelector(".todo-form");
const todosAndActivitis= []

// Clear form Function
const todoClearForm = () => {
    // set data to empty
    todoTitle.value = '';
    todoCategory.value = '';
    todoTimeEstimate.value = '';
    todoDeadline.value = '';
    todoDescription.value = '';
    todoDoneBox.checked = false;
    todoNotDoneBox.checked = false;
}
 
function addFormInputToLocalStorage(newObject) {
    // Retrieve existing data from localStorage
    let storedData = localStorage.getItem("formInputs");

    // Parse it to an array or initialize an empty array if there's no data
    let formInputs = storedData ? JSON.parse(storedData) : [];

    // Assign a unique key (ID) to the new object
    newObject.id = crypto.randomUUID();

    // Add the new object to the array
    formInputs.push(newObject);

    // Save updated array back to localStorage
    localStorage.setItem("formInputs", JSON.stringify(formInputs));
    console.log("-------Data har skickats till LocalStorage-------")

    console.log("New object added successfully!");
    return newObject.id;
}


form.addEventListener("submit", function(event) {
    event.preventDefault(); // Förhindra att sidan laddas om
    // svae data in object 
    const todoData = {
        title: todoTitle.value,
        category: todoCategory.value,
        timeEstimate: todoTimeEstimate.value,
        deadline: todoDeadline.value,
        description: todoDescription.value, 
        statustoe: todoDoneBox.checked ? "Done" : todoNotDoneBox.checked ? "Not Done" : "No status selected".value
        
    };
    todoClearForm();

    const newId =  addFormInputToLocalStorage(todoData);
    getDataByIdFromLocalstotage(newId);
    
});




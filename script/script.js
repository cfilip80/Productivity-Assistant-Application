const todoTitle = document.getElementById("todo-title");
const todoCategory = document.getElementById("todo-category");
const todoTimeEstimate = document.getElementById("todo-time-estimate");
const todoDeadline = document.getElementById("todo-deadline");
const todoDescription = document.getElementById("description");
const todoDoneBox = document.getElementById("todo-done-status");
const todoNotDoneBox = document.getElementById("todo-notDone-status");
const form = document.querySelector(".todo-form");
const todoAndActivitiList = document.querySelector("todo-and-activities-list");
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

function displayDataFromLocalStorage() {
    // Retrieve existing data from localStorage
    let storedData = localStorage.getItem("formInputs");

    // Parse the data or use an empty array if no data exists
    let formInputs = storedData ? JSON.parse(storedData) : [];

    // Get the container where the divs will be appended
    const todoHistoryListContainer = document.querySelector(".todo-history-list-container");

    // Clear existing content to prevent duplication
    todoHistoryListContainer.innerHTML = "";

    // Loop through stored objects and create divs for each
    formInputs.forEach(item => {
        // Create a new div history
        let dataDiv = document.createElement("div");
        dataDiv.classList.add("todo-and-activities-list"); // Add a class for styling (optional)
        // Create a new div for button
        // let dataDivButtonToHistory = document.createElement("div");
        // dataDivButtonToHistory.classList.add("button-histori-container");
        // Insert data into the div
        dataDiv.innerHTML = `
            <div class="todo-history-data">
                <p><strong>Title:</strong> ${item.title}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Time Estimate:</strong> ${item.timeEstimate}</p>
                <p><strong>Deadline:</strong> ${item.deadline}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Status:</strong> ${item.statustoe}</p>
            </div>    
            <div class="button-histori-container">
                <button type="button" name="Edit" id="todoEdit">Edit</button>
                <button type="button" name="Delet" id="todoDelet">Delet</button>
                <button type="button" name="ompleted" id="todoCompleted">completed</button>
            </div>
         `;
        // Append the new div to the container
        todoHistoryListContainer.appendChild(dataDiv);

        // todoHistoryListContainer.appendChild(dataDivButtonToHistory);
    });
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
    displayDataFromLocalStorage();
     
});




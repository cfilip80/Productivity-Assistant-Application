const todoTitle = document.getElementById("todo-title");
const todoCategory = document.getElementById("todo-category");
const todoTimeEstimate = document.getElementById("todo-time-estimate");
const todoDeadline = document.getElementById("todo-deadline");
const todoDescription = document.getElementById("description");
const todoDoneBox = document.getElementById("todo-done-status");
const todoNotDoneBox = document.getElementById("todo-notDone-status");
const todoForm = document.querySelector(".todo-form");
const todoAndActivitiList = document.querySelector("todo-and-activities-list");
const todoSubmitButton = document.getElementById("subId");
const todoSaveButtonContainer = document.querySelector("todo-save-submit-button-container");
const todoSaveChangesButton = document.getElementById("saveChanges");
const todoClearButton = document.getElementById("clearButton");

document.addEventListener('DOMContentLoaded', todoDisplayDataFromLocalStorage);

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

function todoGetDataFromLocal(){
    // Retrieve existing data from localStorage
    let storedData = localStorage.getItem("formInputs");
    // Parse it to an array or initialize an empty array if there's no data
    let formInputs = storedData ? JSON.parse(storedData) : [];
    console.log(formInputs);
    
    return formInputs;
}
 
function todoAddFormInputToLocalStorage(newObject) {

    let formInputs = todoGetDataFromLocal();
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

function todoDisplayDataFromLocalStorage() {
    let formInputs = todoGetDataFromLocal();

    // Get the filter and sorting values from the dropdowns
    const statusFilterValue = document.getElementById('filter-status-filter').value;
    const categoryFilterValue = document.getElementById('category-filter').value;
    const timeEstimateFilterValue = document.getElementById('time-estimate-filter').value;
    const deadlineFilterValue = document.getElementById('deadline-filter').value;
    const statusSortValue = document.getElementById('sorting-status-filter').value;

    // Filter by status
    if (statusFilterValue !== "all") {
        const status = statusFilterValue === 'Completed' ? 'Completed' : 'Incomplete';
        formInputs = formInputs.filter(item => item.status === status);
    }

    // Filter by category
    if (categoryFilterValue !== "all") {
        formInputs = formInputs.filter(item => item.category === categoryFilterValue);
    }

    // Apply sorting logic
    // Sort by status
    if (statusSortValue !== "all") {
        formInputs = formInputs.sort((a, b) => {
            if (statusSortValue === "Status-asc") {
                // Sort "Completed" first, then "Incomplete"
                return a.status === "Completed" ? -1 : 1; // Ascending order
            } else if (statusSortValue === "Status-desc") {
                // Sort "Incomplete" first, then "Completed"
                return a.status === "Incomplete" ? -1 : 1; // Descending order
            }
            return 0;
        });
    }

    // Sort by time estimate
    if (timeEstimateFilterValue !== "all") {
        formInputs = formInputs.sort((a, b) => {
            if (timeEstimateFilterValue === "TimeEstimate-asc") {
                return a.timeEstimate - b.timeEstimate; // Ascending order
            } else if (timeEstimateFilterValue === "TimeEstimate-desc") {
                return b.timeEstimate - a.timeEstimate; // Descending order
            }
            return 0;
        });
    }

    // Sort by deadline
    if (deadlineFilterValue !== "all") {
        formInputs = formInputs.sort((a, b) => {
            let dateA = new Date(a.deadline);
            let dateB = new Date(b.deadline);
            if (deadlineFilterValue === "Deadline-asc") {
                return dateA - dateB; // Ascending order
            } else if (deadlineFilterValue === "Deadline-desc") {
                return dateB - dateA; // Descending order
            }
            return 0;
        });
    }

    // Get the container where the divs will be appended
    const todoHistoryListContainer = document.querySelector(".todo-history-list-container");

    // Clear existing content to prevent duplication
    todoHistoryListContainer.innerHTML = "";

    // Loop through the filtered and sorted data and create divs for each item
    formInputs.forEach(item => {
        let dataDiv = document.createElement("div");
        dataDiv.classList.add("todo-and-activities-list");

        dataDiv.innerHTML = `
            <div class="todo-history-data">
                <p class ="todo-p"><strong>Title:</strong> ${item.title}</p>
                <p class ="todo-p"><strong>Category:</strong> ${item.category}</p>
                <p class ="todo-p"><strong>Time Estimate:</strong> ${item.timeEstimate}</p>
                <p class ="todo-p"><strong>Deadline:</strong> ${item.deadline}</p>
                <p class ="todo-p"><strong>Description:</strong> ${item.description}</p>
                <p class ="todo-p"><strong>Status:</strong> ${item.status}</p>
            </div>
            <div class="button-histori-container">
                <button type="button" name="Edit" class="todoEdit" id="todoEdit" data-id="${item.id}">Edit</button>
                <button type="button" name="Delete" class="todoDelete" id="todoDelete" data-id="${item.id}">Delete</button>
            </div>
        `;

        todoHistoryListContainer.appendChild(dataDiv);
    });

    // Add event listeners dynamically for edit and delete buttons
    document.querySelectorAll(".todoDelete").forEach(button => {
        button.addEventListener("click", function () {
            let itemId = this.getAttribute("data-id");
            todoDeleteItemFromLocalStorage(itemId);
        });
    });

    document.querySelectorAll(".todoEdit").forEach(button => {
        button.addEventListener("click", function () {
            let itemId = this.getAttribute("data-id");
            todoEditItemInLocalStorage(itemId);
        });
    });
}


function todoEditItemInLocalStorage(id){
    let formInputs = todoGetDataFromLocal();
    let foundObject = formInputs.find(item => item.id === id);

    if (!foundObject) {
        console.log('The ID is not found:', id);
        return;
    }

    // Sätta formulärets värden
    todoTitle.value = foundObject.title; 
    todoCategory.value = foundObject.category;
    todoTimeEstimate.value = foundObject.timeEstimate;
    todoDeadline.value = foundObject.deadline;
    todoDescription.value = foundObject.description;
    todoDoneBox.checked = foundObject.status === "Completed";
    todoNotDoneBox.checked = foundObject.status === "Incomplete";

    // Visa och gömma knappar
    todoSubmitButton.style.display = "none";
    todoSaveChangesButton.style.display = "block";
    todoClearButton.style.display = "block";

    // Spara ändringar när man klickar "Save Changes"
    todoSaveChangesButton.onclick = function () {
        const updatedTodo = {
            id: id,  // Behåll samma ID
            title: todoTitle.value,
            category: todoCategory.value,
            timeEstimate: todoTimeEstimate.value,
            deadline: todoDeadline.value,
            description: todoDescription.value,
            status: todoDoneBox.checked ? "Completed" : 
                   todoNotDoneBox.checked ? "Incomplete" : "",
        };

        // Uppdatera rätt objekt i listan
        formInputs = formInputs.map(item => item.id === id ? { ...item, ...updatedTodo } : item);

        // Spara den uppdaterade listan i localStorage
        localStorage.setItem("formInputs", JSON.stringify(formInputs));

        // Rensa formuläret och visa listan igen
        todoClearForm();
        todoDisplayDataFromLocalStorage();
        todoSubmitButton.style.display = "block";
        todoSaveChangesButton.style.display = "none";
        todoClearButton.style.display = "none";
    };

}


function todoDeleteItemFromLocalStorage(id) {

    let formInputs = todoGetDataFromLocal();

    // Filter out the item with the matching ID
    formInputs = formInputs.filter(item => item.id !== id);

    // Save the updated array back to localStorage
    localStorage.setItem("formInputs", JSON.stringify(formInputs));

    console.log(`Item with ID ${id} deleted successfully!`);

    // saveChangesButton.setAttribute('data-id', id);
    console.log(todoSaveChangesButton);
    

    // Refresh the displayed data
    todoDisplayDataFromLocalStorage();
}
todoForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Förhindra att sidan laddas om
    // svae data in object 
    const todoData = {
        title: todoTitle.value,
        category: todoCategory.value,
        timeEstimate: todoTimeEstimate.value,
        deadline: todoDeadline.value,
        description: todoDescription.value, 
        status: todoDoneBox.checked ? "Completed" : todoNotDoneBox.checked ? "Incomplete" : "No status selected".value 
    };
    todoClearForm();

    todoAddFormInputToLocalStorage(todoData);
    todoDisplayDataFromLocalStorage();
    console.log(todoGetDataFromLocal());
    // console.log(todoEditItemInLocalStorage(), "detta är todos id");
    //console.log(typeof(todoData.statustoe));
     
});

document.getElementById('filter-status-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('time-estimate-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('deadline-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('category-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('sorting-status-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
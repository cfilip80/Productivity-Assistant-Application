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
const loggedInUser = sessionStorage.getItem("loggedInUser");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

document.addEventListener("DOMContentLoaded", () => {

    if (loggedInUser) {
        loginBtn.style.display = "none"; 
        logoutBtn.style.display = "block";
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none"; 
        alert("You need to log in first!");
        window.location.href = "user-login.html"; 
    }

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "user-login.html"; 
    });
    todoDisplayDataFromLocalStorage();
});


const todoClearForm = () => {
    todoTitle.value = '';
    todoCategory.value = '';
    todoTimeEstimate.value = '';
    todoDeadline.value = '';
    todoDescription.value = '';
    todoDoneBox.checked = false;
    todoNotDoneBox.checked = false;
}

function todoGetDataFromLocal(){
    const userData = JSON.parse(localStorage.getItem(loggedInUser)) || { password: "", todos: [], habits: [] };
    return userData;
}
 
function todoAddFormInputToLocalStorage(newObject) {

    let formInputs = todoGetDataFromLocal();
     if (!formInputs.todos) {
        formInputs.todos = [];
    }

    newObject.id = crypto.randomUUID();

    formInputs.todos.push(newObject);

    localStorage.setItem(loggedInUser, JSON.stringify(formInputs));
    console.log("-------Data har skickats till LocalStorage-------")

    console.log("New object added successfully!");
    return newObject.id;
}

function todoDisplayDataFromLocalStorage() {
    let formInputs = todoGetDataFromLocal();
    let todosArray = formInputs.todos;

    const statusFilterValue = document.getElementById('filter-status-filter').value;
    const categoryFilterValue = document.getElementById('category-filter').value;
    const timeEstimateFilterValue = document.getElementById('time-estimate-filter').value;
    const deadlineFilterValue = document.getElementById('deadline-filter').value;
    const statusSortValue = document.getElementById('sorting-status-filter').value;

    if (statusFilterValue !== "all") {
        const status = statusFilterValue === 'Completed' ? 'Completed' : 'Incomplete';
        todosArray = todosArray.filter(item => item.status === status);
    }

    if (categoryFilterValue !== "all") {
        todosArray = todosArray.filter(item => item.category === categoryFilterValue);
    }

    if (statusSortValue !== "all") {
        todosArray = todosArray.sort((a, b) => {
            if (statusSortValue === "Status-asc") {
                return a.status === "Completed" ? -1 : 1;
            } else if (statusSortValue === "Status-desc") {
                return a.status === "Incomplete" ? -1 : 1;
            }
            return 0;
        });
    }

    if (timeEstimateFilterValue !== "all") {
        todosArray = todosArray.sort((a, b) => {
            if (timeEstimateFilterValue === "TimeEstimate-asc") {
                return a.timeEstimate - b.timeEstimate;
            } else if (timeEstimateFilterValue === "TimeEstimate-desc") {
                return b.timeEstimate - a.timeEstimate;
            }
            return 0;
        });
    }

    if (deadlineFilterValue !== "all") {
        todosArray = todosArray.sort((a, b) => {
            let dateA = new Date(a.deadline);
            let dateB = new Date(b.deadline);
            if (deadlineFilterValue === "Deadline-asc") {
                return dateA - dateB;
            } else if (deadlineFilterValue === "Deadline-desc") {
                return dateB - dateA;
            }
            return 0;
        });
    }

    const todoHistoryListContainer = document.querySelector(".todo-history-list-container");

    todoHistoryListContainer.innerHTML = "";

    todosArray.forEach(item => {
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


function todoEditItemInLocalStorage(id) {
    let userData = todoGetDataFromLocal();
    let todosArray = userData.todos || [];
    
    let foundObject = todosArray.find(item => item.id === id);

    if (!foundObject) {
        console.log('The ID is not found:', id);
        return;
    }

    todoTitle.value = foundObject.title; 
    todoCategory.value = foundObject.category;
    todoTimeEstimate.value = foundObject.timeEstimate;
    todoDeadline.value = foundObject.deadline;
    todoDescription.value = foundObject.description;
    todoDoneBox.checked = foundObject.status === "Completed";
    todoNotDoneBox.checked = foundObject.status === "Incomplete";

    todoSubmitButton.style.display = "none";
    todoSaveChangesButton.style.display = "block";
    todoClearButton.style.display = "block";

    todoSaveChangesButton.onclick = function () {
        const updatedTodo = {
            id: id,  
            title: todoTitle.value,
            category: todoCategory.value,
            timeEstimate: todoTimeEstimate.value,
            deadline: todoDeadline.value,
            description: todoDescription.value,
            status: todoDoneBox.checked ? "Completed" : 
                   todoNotDoneBox.checked ? "Incomplete" : "",
        };

        todosArray = todosArray.map(item => item.id === id ? { ...item, ...updatedTodo } : item);
        localStorage.setItem(loggedInUser, JSON.stringify(userData));

        todoClearForm();
        todoDisplayDataFromLocalStorage();
        
        todoSubmitButton.style.display = "block";
        todoSaveChangesButton.style.display = "none";
        todoClearButton.style.display = "none";
    };
}

function todoDeleteItemFromLocalStorage(id) {
    let userData = todoGetDataFromLocal();
    let data = userData.todos;
    if (!data) {
        data = [];
    }

    let updatedTodos = todosArray.filter(item => item.id !== id);

    // Uppdatera användardata med den nya listan
    userData.todos = updatedTodos;

    // Save the updated object back under the logged-in user's key
    localStorage.setItem(loggedInUser, JSON.stringify(userData));

    console.log(`Item with ID ${id} deleted successfully!`);

    todoDisplayDataFromLocalStorage();
}

todoForm.addEventListener("submit", function(event) {
    event.preventDefault();
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
    todoDisplayDataFromLocalStorage()
});

document.getElementById('filter-status-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('time-estimate-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('deadline-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('category-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
document.getElementById('sorting-status-filter').addEventListener('change', todoDisplayDataFromLocalStorage);
const loggedInUser = sessionStorage.getItem("loggedInUser");

document.addEventListener("DOMContentLoaded", () => {

    const username = sessionStorage.getItem("loggedInUser");
    const welcomeMessageDiv = document.getElementById("welcome-message");
    const quoteContainer = document.getElementById("quote-container");

    if (username) {
        welcomeMessageDiv.innerHTML = `<p>You are logged in as: <strong>${username}</strong>.</p>`;
    } else {
        welcomeMessageDiv.innerHTML = `<p>You are not logged in.</p>`;
    }

    // Fetch a random quote from Quotable API
    fetch("https://dummyjson.com/quotes/random")
        .then(response => response.json())
        .then(data => {
            quoteContainer.innerHTML = `<p><i>"${data.quote}"</i> - ${data.author}</p>`;
        })
        .catch(error => {
            quoteContainer.innerHTML = `<p>Could not load quote. Try again later.</p>`;
            console.error("Error fetching quote:", error);
        });

    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

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

    renderHabits();
});

const getHabitsDataFromLocalStorage = () => {
    let storedData = localStorage.getItem("habits");
    let habits = storedData ? JSON.parse(storedData) : [];
    return habits
}

function renderHabits() {
    let habits = getHabitsDataFromLocalStorage();

    habits.sort((a, b) => b.repetitions - a.repetitions);
    const topHabits = habits.slice(0, 3);

    const habitsListContainer = document.querySelector(".home-habits-wrapper");

    habitsListContainer.innerHTML = '';

    topHabits.forEach(habit => {
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('incompleted-habits');
        habitDiv.innerHTML = `
                <p><b>Title:</b> ${habit.title}</p>
                <p><b>Repetitions:</b> ${habit.repetitions}</p>
                <p><b>Priority:</b> ${habit.priority}</p>
        `;
        habitsListContainer.appendChild(habitDiv);
    });
}

document.addEventListener('DOMContentLoaded', todoDisplayData);

function todoGetLastThreePendingTasks() {
    const userData = JSON.parse(localStorage.getItem(loggedInUser)) || { password: "", todos: [], habits: [] };
    let storedData = userData.todos;
    let pendingTasks = storedData.filter(task => task.status !== "Completed");
    // Sortera efter tid om objektet har en timestamp (nyaste först)
    pendingTasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    // Hämta de tre senaste ärendena
    let lastThreeTasks = pendingTasks.slice(0, 3);

    return lastThreeTasks;
}
 

function todoDisplayData(){
   let data = todoGetLastThreePendingTasks();

    let incompletedTodos = document.querySelector(".home-todos-wrapper");
    if (!incompletedTodos) {
        console.error("Element with class 'home-todos-wrapper' not found.");
        return;
    }

    incompletedTodos.innerHTML = "";
   data.forEach(item => {
    let dataDiv = document.createElement("div");
    dataDiv.classList.add("incompleted-todos");
    
    dataDiv.innerHTML = `
                <p class ="todo-p"><strong>Title:</strong> ${item.title}</p>
                <p class ="todo-p"><strong>Category:</strong> ${item.category}</p>
                <p class ="todo-p"><strong>Time Estimate:</strong> ${item.timeEstimate}</p>
                <p class ="todo-p"><strong>Deadline:</strong> ${item.deadline}</p>
                <p class ="todo-p"><strong>Description:</strong> ${item.description}</p>
                <p class ="todo-p"><strong>Status:</strong> ${item.status}</p>
        `;

        incompletedTodos.appendChild(dataDiv);
    });

}





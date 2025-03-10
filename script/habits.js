const habitsTitle = document.getElementById("habits-title");
const habitsRepetitions = document.getElementById("habits-repetitions");
const loggedInUser = sessionStorage.getItem("loggedInUser");

document.addEventListener("DOMContentLoaded", () => {
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

function saveUserData(updatedData) {
    localStorage.setItem(loggedInUser, JSON.stringify(updatedData));
}

const getHabitsDataFromLocalStorage = () => {
    const userData = JSON.parse(localStorage.getItem(loggedInUser)) || { password: "", todos: [], habits: [] };
    return userData;
}


let habitsSortOptions = "priority";
let habitsFilterOptions = "";

document.getElementById("sort-options").addEventListener("change", () => {
    renderHabits();
});

document.getElementById("filter-low").addEventListener("click", () => {
    habitsFilterOptions = "Low";
    renderHabits();
});

document.getElementById("filter-medium").addEventListener("click", () => {
    habitsFilterOptions = "Medium";
    renderHabits();
});

document.getElementById("filter-high").addEventListener("click", () => {
    habitsFilterOptions = "High";
    renderHabits();
});

document.querySelector('.clear-btn').addEventListener('click', habitsClearForm);

// Reset sort and filter
document.querySelector('.reset-btn').addEventListener('click', () => {
    habitsSortOptions = "priority";
    habitsFilterOptions = "";       
    renderHabits();                 
});

// Radiobuttons checker
let habitsRadioButtonIsChecked = () => {
    let low = document.getElementById("priority-low");
    let medium = document.getElementById("priority-medium");
    let high = document.getElementById("priority-high");
    if (low.checked)
        return low.value;
    else if(medium.checked)
        return medium.value;
    else if(high.checked)
        return high.value;
}

function habitsClearForm() {
    document.getElementById("new-habit").reset();
    const submitButton = document.querySelector(".habit-btn");
    submitButton.removeAttribute('data-id');
    submitButton.textContent = "Add Habit";
}


function renderHabits() {
    let userData = getHabitsDataFromLocalStorage();
    let habits = userData.habits;

    if (habitsFilterOptions) {
        habits = habits.filter(habit => habit.priority === habitsFilterOptions);
    }

    const selectedSortOption = document.getElementById("sort-options").value;
    if (selectedSortOption === "priority-asc") {
        habits.sort((a, b) => {
            const priorities = ["Low", "Medium", "High"];
            return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
        });
    } else if (selectedSortOption === "priority-desc") {
        habits.sort((a, b) => {
            const priorities = ["Low", "Medium", "High"];
            return priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
        });
    } else if (selectedSortOption === "repetitions-asc") {
        habits.sort((a, b) => a.repetitions - b.repetitions);
    } else if (selectedSortOption === "repetitions-desc") {
        habits.sort((a, b) => b.repetitions - a.repetitions);
    }

    const habitsListContainer = document.querySelector(".habits-list-wrapper");
    // habitsListContainer.innerHTML = '<h2 class="h2-list-title">List of Habits</h2>';

    // Render each habit in the list
    habits.forEach(habit => {
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');
        habitDiv.id = habit.id;
        habitDiv.innerHTML = `
            <div class="habits-text-container">
                <p><b>Title:</b> ${habit.title}</p>
                <p><b>Repetitions:</b> ${habit.repetitions}</p>
                <p><b>Priority:</b> ${habit.priority}</p>
            </div>
            <div class="habits-button-container">
                <button class="habit-list-button-edit" onclick="editHabit('${habit.id}')">Edit</button>
                <button class="habit-list-button-remove" onclick="removeHabit('${habit.id}')">Delete</button>
            </div>
        `;
        habitsListContainer.appendChild(habitDiv);
    });
}

function removeHabit(habitId) {
    let userData = getHabitsDataFromLocalStorage();
    userData.habits = userData.habits.filter(habit => habit.id !== habitId);

    saveUserData(userData);
    renderHabits();
}


function editHabit(habitId) {
    let userData = getHabitsDataFromLocalStorage();
    let habit = userData.habits.find(h => h.id === habitId);

    if (!habit) return;

    // Populate form fields
    document.getElementById("habits-title").value = habit.title;
    document.getElementById("habits-repetitions").value = habit.repetitions;
    
    if (habit.priority === "Low") {
        document.getElementById("priority-low").checked = true;
    } else if (habit.priority === "Medium") {
        document.getElementById("priority-medium").checked = true;
    } else if (habit.priority === "High") {
        document.getElementById("priority-high").checked = true;
    }

    const submitButton = document.querySelector(".habit-btn");
    submitButton.textContent = "Update Habit";
    submitButton.setAttribute('data-id', habit.id);
}

document.querySelector('#new-habit').addEventListener('submit', function (e) {
    e.preventDefault();

    const habitId = e.target.querySelector('.habit-btn').getAttribute('data-id');
    let userData = getHabitsDataFromLocalStorage();

    const habit = {
        id: habitId ? habitId : crypto.randomUUID(),
        title: e.target.elements['habits-title'].value,
        repetitions: e.target.elements['habits-repetitions'].value,
        priority: habitsRadioButtonIsChecked(),
    };

    if (habitId) {
        userData.habits = userData.habits.map(h => (h.id === habitId ? { ...h, ...habit } : h));
    } else {
        userData.habits.push(habit);
    }
    saveUserData(userData);
    e.target.reset();
    const submitButton = document.querySelector(".habit-btn");
    submitButton.textContent = "Add Habit";
    submitButton.removeAttribute('data-id');
    renderHabits();
});
const habitsTitle = document.getElementById("habits-title");
const habitsRepetitions = document.getElementById("habits-repetitions");

// Display list of habits from local storage when page is loaded
document.addEventListener('DOMContentLoaded', renderHabits);

const getHabitsDataFromLocalStorage = () => {
    let storedData = localStorage.getItem("habits");
    let habits = storedData ? JSON.parse(storedData) : [];
    return habits
}

let sortOptions = "priority";  // Default sort by priority
let filterOptions = "";  // Default filter is empty (no filter)

document.getElementById("sort-priority").addEventListener("click", () => {
    sortOptions = "priority";
    renderHabits();
});

document.getElementById("sort-repetitions").addEventListener("click", () => {
    sortOptions = "repetitions";
    renderHabits();
});

document.getElementById("filter-low").addEventListener("click", () => {
    filterOptions = "Low";
    renderHabits();
});

document.getElementById("filter-medium").addEventListener("click", () => {
    filterOptions = "Medium";
    renderHabits();
});

document.getElementById("filter-high").addEventListener("click", () => {
    filterOptions = "High";
    renderHabits();
});

document.querySelector('.clear-btn').addEventListener('click', clearForm);

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

function clearForm() {
    document.getElementById("new-habit").reset();
    const submitButton = document.querySelector(".habit-btn");
    submitButton.removeAttribute('data-id');
    submitButton.textContent = "Add Habit";
}

function renderHabits() {
    let habits = getHabitsDataFromLocalStorage();

    // Apply filter if there's a selected priority
    if (filterOptions) {
        habits = habits.filter(habit => habit.priority === filterOptions);
    }

    // Apply sorting based on selected criteria
    if (sortOptions === "priority") {
        habits.sort((a, b) => {
            const priorities = ["Low", "Medium", "High"];
            return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
        });
    } else if (sortOptions === "repetitions") {
        habits.sort((a, b) => a.repetitions - b.repetitions);
    }

    const habitsListContainer = document.querySelector(".habits-list-wrapper");
    habitsListContainer.innerHTML = "<h1>List of Habits</h1>";  // Reset the container

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
                <button class="habit-list-button-remove" onclick="removeHabit('${habit.id}')">Remove</button>
            </div>
        `;
        habitsListContainer.appendChild(habitDiv);
    });
}

// Remove habit
function removeHabit(habitId) {
    let habits = getHabitsDataFromLocalStorage();
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
    renderHabits();
}

// Populates the form with current values for editing a habit
function editHabit(habitId) {
    let habits = getHabitsDataFromLocalStorage();
    let habit = habits.find(h => h.id === habitId);

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

// Eventlistener function that creates a new habit OR updates an existing habit after editing
document.querySelector('#new-habit').addEventListener('submit', function (e) {
    e.preventDefault();

    const habitId = e.target.querySelector('.habit-btn').getAttribute('data-id');
    const habit = {
        title: e.target.elements['habits-title'].value,
        repetitions: e.target.elements['habits-repetitions'].value,
        priority: habitsRadioButtonIsChecked()
    };

    let habits = getHabitsDataFromLocalStorage();

    if (habitId) {
        habits = habits.map(h => {
            if (h.id === habitId) {
                return { ...h, ...habit };
            }
            return h;
        });
    } else {
        habit.id = crypto.randomUUID();
        habit.list = "habits";
        habits.push(habit);
    }

    localStorage.setItem("habits", JSON.stringify(habits));
    e.target.reset();
    const submitButton = document.querySelector(".habit-btn");
    submitButton.textContent = "Add Habit";
    submitButton.removeAttribute('data-id');
    renderHabits();
});
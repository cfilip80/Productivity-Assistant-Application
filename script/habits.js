const habitsTitle = document.getElementById("habits-title");
const habitsRepetitions = document.getElementById("habits-repetitions");

// Display list of habits from local storage when page is loaded
document.addEventListener('DOMContentLoaded', renderHabits);

const getHabitsDataFromLocalStorage = () => {
    let storedData = localStorage.getItem("habits");
    let habits = storedData ? JSON.parse(storedData) : [];
    return habits
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
    let habits = getHabitsDataFromLocalStorage();

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
    habitsListContainer.innerHTML = '<h2 class="h2-list-title">List of Habits</h2>';

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

// Remove habit by id
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

// Eventlistener function that creates a new habit OR updates an existing habit after editing in the form
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
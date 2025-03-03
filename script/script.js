let habitsList = [];
const habitsTitle = document.getElementById("habits-title");
const habitsRepetitions = document.getElementById("habits-repetitions");

// Call renderHabits when the page loads to display the list
document.addEventListener('DOMContentLoaded', renderHabits);

// const getStoredDataOrCreateEmptyArray = () => {
//     // Retrieve existing data from localStorage
//     let storedData = localStorage.getItem("formInputs");

//     // Parse it to an array or initialize an empty array if there's no data
//     let habitInputs = storedData ? JSON.parse(storedData) : [];
// }


// function addFormInputToLocalStorage(newObject) {
//     // Retrieve existing data from localStorage
//     let storedData = localStorage.getItem("formInputs");

//     // Parse it to an array or initialize an empty array if there's no data
//     let habitInputs = storedData ? JSON.parse(storedData) : [];

//     // Assign a unique key (ID) to the new object
//     newObject.id = crypto.randomUUID();

//     newObject.list = "Habits";

//     // Add the new object to the array
//     habitInputs.push(newObject);

//     // Save updated array back to localStorage
//     localStorage.setItem("formInputs", JSON.stringify(habitInputs));
//     console.log("-------Data har skickats till LocalStorage-------")
// }

// Radiobuttons
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


// -----------------------

// Function to render the habits from localStorage
function renderHabits() {
    // Get habits data from localStorage
    let storedData = localStorage.getItem("formInputs");

    // If data exists, parse it into an array
    let habits = storedData ? JSON.parse(storedData) : [];

    // Get the container element where habits will be listed
    const habitsListContainer = document.querySelector(".habits-list-history-container");

    // Clear the container before appending the new list
    habitsListContainer.innerHTML = "<h1>List of Habits</h1>";

    // Loop through each habit and display it
    habits.forEach(habit => {
        // Create the structure for each habit
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');
        habitDiv.id = habit.id;  // Set unique ID to the div

        habitDiv.innerHTML = `
            <div class="habits-text-container">
                <p><b>Title:</b> ${habit.title}</p>
                <p><b>Repetitions:</b> ${habit.repetitions}</p>
                <p><b>Priority:</b> ${habit.priority}</p>
            </div>
            <div class="habits-button-container">
                <button class="habit-list-button" onclick="editHabit('${habit.id}')">Edit</button>
                <button class="habit-list-button" onclick="removeHabit('${habit.id}')">Remove</button>
            </div>
        `;

        // Append the habit div to the list container
        habitsListContainer.appendChild(habitDiv);
    });
}

// Function to remove a habit by its id
function removeHabit(habitId) {
    // Retrieve the stored data from localStorage
    let storedData = localStorage.getItem("formInputs");
    let habits = storedData ? JSON.parse(storedData) : [];

    // Filter out the habit with the given id
    const updatedHabits = habits.filter(habit => habit.id !== habitId);

    // Save the updated list back to localStorage
    localStorage.setItem("formInputs", JSON.stringify(updatedHabits));

    // Re-render the habits list
    renderHabits();
}

// Function to populate the form for editing a habit
function editHabit(habitId) {
    // Retrieve the habit from localStorage
    let storedData = localStorage.getItem("formInputs");
    let habits = storedData ? JSON.parse(storedData) : [];
    let habit = habits.find(h => h.id === habitId);

    // Populate the form with the habit's data
    document.getElementById("habits-title").value = habit.title;
    document.getElementById("habits-repetitions").value = habit.repetitions;

    // Set the selected priority radio button
    if (habit.priority === "Low") {
        document.getElementById("priority-low").checked = true;
    } else if (habit.priority === "Medium") {
        document.getElementById("priority-medium").checked = true;
    } else if (habit.priority === "High") {
        document.getElementById("priority-high").checked = true;
    }

    // Change the form's submit button text to "Update Habit"
    const submitButton = document.querySelector(".habit-btn");
    submitButton.textContent = "Update Habit";

    // Store the habit's ID for later use
    submitButton.setAttribute('data-id', habit.id);
}

// Function to update the habit after editing
document.querySelector('#new-habit').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the ID of the habit being updated (if any)
    const habitId = e.target.querySelector('.habit-btn').getAttribute('data-id');

    const habit = {
        title: e.target.elements['habits-title'].value,
        repetitions: e.target.elements['habits-repetitions'].value,
        priority: habitsRadioButtonIsChecked()
    };

    let storedData = localStorage.getItem("formInputs");
    let habits = storedData ? JSON.parse(storedData) : [];

    // If habitId exists, update the habit
    if (habitId) {
        // Find the habit to update and update its values
        habits = habits.map(h => {
            if (h.id === habitId) {
                return { ...h, ...habit };  // Merge the updated data
            }
            return h;
        });
    } else {
        // If no habitId exists, it's a new habit, so add it
        habit.id = crypto.randomUUID();
        habits.push(habit);
    }

    // Save the updated habits list to localStorage
    localStorage.setItem("formInputs", JSON.stringify(habits));

    // Reset form and change button text back to "Add Habit"
    e.target.reset();
    const submitButton = document.querySelector(".habit-btn");
    submitButton.textContent = "Add Habit";
    submitButton.removeAttribute('data-id');

    // Re-render the habits list
    renderHabits();
});

// document.querySelector('#new-habit').addEventListener('submit', function (e) {
//     e.preventDefault();
//     const habit = {
//         title: e.target.elements['habits-title'].value,
//         repetitions: e.target.elements['habits-repetitions'].value,
//         priority: habitsRadioButtonIsChecked()
//     };
//     document.getElementById("new-habit").reset();
//     const newId =  addFormInputToLocalStorage(habit);
//     renderHabits();
// });
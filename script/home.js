document.addEventListener('DOMContentLoaded', renderHabits);

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

//document.addEventListener('DOMContentLoaded', todoDisplayData);

function todoGetLastThreePendingTasks() {
    // Hämta lagrad data från localStorage
    let storedData = localStorage.getItem("formInputs");
    // Om det finns data, omvandla det till en array, annars använd en tom array
    let formInputs = storedData ? JSON.parse(storedData) : [];
    // Filtrera ut alla ej utförda ärenden (inte "Done")
    let pendingTasks = formInputs.filter(task => task.status !== "Completed");
    // Sortera efter tid om objektet har en timestamp (nyaste först)
    pendingTasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    // Hämta de tre senaste ärendena
    let lastThreeTasks = pendingTasks.slice(0, 3);

    return lastThreeTasks;
}
console.log(todoGetLastThreePendingTasks());

// Anropa funktionen och visa resultat i konsolen
console.log(todoGetLastThreePendingTasks());
function todoDisplayData(){
   let data = todoGetLastThreePendingTasks ();
   incompletedTodos = document.querySelector(".home-todos-wrapper");
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
console.log(todoDisplayData());



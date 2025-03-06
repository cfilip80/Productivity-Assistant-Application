document.addEventListener('DOMContentLoaded', renderHabits);

const getHabitsDataFromLocalStorage = () => {
    let storedData = localStorage.getItem("habits");
    let habits = storedData ? JSON.parse(storedData) : [];
    return habits
}

function renderHabits() {
    let habits = getHabitsDataFromLocalStorage();

    

    const habitsListContainer = document.querySelector(".home-habits-wrapper");
    // habitsListContainer.innerHTML = '';

    habits.forEach(habit => {
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
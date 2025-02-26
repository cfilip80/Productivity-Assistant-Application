let habitsList = [];
const habitsTitle = document.getElementById("habits-title");
const habitsRepetitions = document.getElementById("habits-repetitions");

// Radiobuttons
let radioButtons = document.querySelectorAll("input[name='priority']");
let isChecked = () => {
    let low = document.getElementById("priority-low");
    let medium = document.getElementById("priority-medium");
    let high = document.getElementById("priority-high");
    if (low.checked)
        return low.value;
    else if(medium.checked)
        return medium.value;
    else if(high.checked)
        return high.value;
    else alert("You must choose a priority");
}

const clearForm = () => {
    habitsTitle.value = '';
    habitsRepetitions.value = '';
    ["priority-low", "priority-medium", "priority-high"].forEach(function(id) {
        document.getElementById(id).checked = false;
    });
}

document.querySelector('#new-habit').addEventListener('submit', function (e) {
    e.preventDefault();
    const habit = {
        title: e.target.elements['habits-title'].value,
        repetitions: e.target.elements['habits-repetitions'].value,
        priority: isChecked()
    };

    habitsList.push(habit);
    clearForm();
    console.log(habitsList);
});

console.log(habitsList);
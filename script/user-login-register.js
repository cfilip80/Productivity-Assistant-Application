document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const formTitle = document.getElementById("form-title");
    const legendText = document.querySelector(".fieldset-login-container legend");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    showRegisterLink.addEventListener("click", () => {
        loginForm.style.display = "none";
        registerForm.style.display = "flex";
        registerForm.style.flexDirection = "column";
        legendText.innerText = "Register";
        formTitle.innerText = "Register";
    });

    showLoginLink.addEventListener("click", () => {
        registerForm.style.display = "none";
        loginForm.style.display = "flex";
        legendText.innerText = "Login";
        formTitle.innerText = "Login";
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value.trim();
        const password = document.getElementById("register-password").value.trim();

        if (localStorage.getItem(username)) {
            alert("User already exists!");
            return;
        }

        const userData = { password, todos: [], habits: [] };
        localStorage.setItem(username, JSON.stringify(userData));

        alert("Registration successful! Please login.");
        registerForm.reset();
        showLoginLink.click();
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const storedUser = localStorage.getItem(username);
        if (!storedUser) {
            alert("User not found!");
            return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.password !== password) {
            alert("Incorrect password!");
            return;
        }

        sessionStorage.setItem("loggedInUser", username);
        window.location.href = "index.html";
    });
});
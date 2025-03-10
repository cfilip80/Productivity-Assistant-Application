document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const formTitle = document.getElementById("form-title");
    const legendText = document.querySelector(".fieldset-login-container legend");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    // Switch between login and register forms
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

    // Register New User
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value.trim();
        const password = document.getElementById("register-password").value.trim();

        if (localStorage.getItem(username)) {
            alert("User already exists!");
            return;
        }

        // Store user credentials in localStorage
        const userData = { password, todos: [], habits: [] };
        localStorage.setItem(username, JSON.stringify(userData));

        alert("Registration successful! Please login.");
        registerForm.reset();
        showLoginLink.click();
    });

    // Login User
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

        // Save logged-in user in sessionStorage
        sessionStorage.setItem("loggedInUser", username);
        // alert("Login successful!");
        window.location.href = "index.html"; // Redirect to index page
    });
});
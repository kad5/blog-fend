import { authCalls } from "../services/authApi.js";

export function authFormsHTML(signup = null) {
  const container = document.createElement("div");
  container.classList.add("main-container");
  container.innerHTML = `
            <div class="form-wrapper">
              <div class="form-content">

                <form id="loginForm" class="form login-form active">
                  <h2>Welcome Back!</h2>
                  <p>Login to your account to continue</p>
                  <div class="input-group">
                    <input type="text" placeholder="Username" name="username" required/>
                    <span class="input-icon">👤</span>
                  </div>
                  <div class="input-group">
                    <input type="password" placeholder="Password" name="password" required />
                    <span class="input-icon">🔒</span>

                  </div>
                  <button type="submit" class="btn">Login</button>
                  <p class="switch-text">
                    Don’t have an account?
                    <span class="toggle-form">Sign Up</span>
                  </p>
                </form>

                <form id="signupForm" class="form signup-form">
                  <h2>Create Account</h2>
                  <p>Sign up to explore new opportunities</p>
                  <div class="input-group">
                    <input type="text" placeholder="Choose a username" name="username" required />
                    <span class="input-icon">👤</span>
                  </div>
                  <div class="input-group">
                    <input type="password" placeholder="Choose a password" name="password" required />
                    <span class="input-icon">🔒</span>
                  </div>
                  <div class="input-group">
                    <input type="password" placeholder="Confirm your password" name="confirmPassword" required />
                    <span class="input-icon">🔒</span>
                  </div>
                  <button type="submit" class="btn">Sign Up</button>
                  <p class="switch-text">
                    Already have an account?
                    <span class="toggle-form">Login</span>
                  </p>
                </form>
              </div>
            </div>
          `;

  container
    .querySelector("#loginForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData);
      await authCalls.login(payload);
      window.location.href = "/";
    });

  container
    .querySelector("#signupForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData);
      await authCalls.signup(payload);
      window.location.href = "/";
    });
  setLoginListeners(container, signup);
  return container;
}

const setLoginListeners = (container, signup = null) => {
  const toggleButtons = container.querySelectorAll(".toggle-form");
  const formContent = container.querySelector(".form-content");
  const loginForm = container.querySelector(".login-form");
  const signupForm = container.querySelector(".signup-form");

  if (signup !== null) toggle();

  function toggle() {
    loginForm.classList.toggle("active");
    signupForm.classList.toggle("active");

    if (signupForm.classList.contains("active")) {
      formContent.style.transform = "translateX(-50%)";
    } else {
      formContent.style.transform = "translateX(0%)";
    }
  }

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggle();
    });
  });
};

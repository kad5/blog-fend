import { Router } from "./src/utils/router.js";
import { State } from "./src/utils/state.js";
//import "./src/styles/styles.css";

const state = new State();
window.state = state;
const router = new Router();
window.router = router;

state.updateState();

const dialog = document.getElementById("modal");
const wrapper = document.getElementById("modal-body");
dialog.addEventListener(
  "click",
  (e) => !wrapper.contains(e.target) && dialog.close()
);
document
  .getElementById("closeModal")
  .addEventListener("click", () => dialog.close());

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (savedTheme === "dark") {
    setTheme("dark");
  } else if (savedTheme === "light") {
    setTheme("light");
  } else if (savedTheme === "auto") {
    setTheme("auto");
  } else {
    setTheme(systemPrefersDark ? "dark" : "light");
  }
}

document.getElementById("auto").addEventListener("click", (e) => {
  setTheme("auto");
});
document.getElementById("light").addEventListener("click", (e) => {
  setTheme("light");
});
document.getElementById("dark").addEventListener("click", (e) => {
  setTheme("dark");
});

loadTheme();

import { authFormsHTML } from "../components/authForms.js";
import { articleHTML } from "../components/article.js";
import { mainPageHTML } from "../components/main.js";
import { userProfileHTML } from "../components/profileSummary.js";

const app = document.getElementById("app");

export async function renderHomePage() {
  app.innerHTML = "";
  const mainPage = await mainPageHTML();
  app.appendChild(mainPage);
}

export function renderLoginPage() {
  app.innerHTML = "";
  const loginPage = authFormsHTML();
  app.appendChild(loginPage);
}
export function renderSignupPage() {
  app.innerHTML = "";
  const loginPage = authFormsHTML("signup");
  app.appendChild(loginPage);
}

export async function renderArticlePage(articleId) {
  app.innerHTML = "";
  const articlePage = await articleHTML(articleId);
  app.appendChild(articlePage);
}

export async function renderProfilePage(userId) {
  app.innerHTML = "";
  const profilePage = await userProfileHTML(userId);
  app.append(profilePage);
}
export function render404Page() {}

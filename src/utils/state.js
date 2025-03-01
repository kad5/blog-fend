import { authCalls } from "../services/authApi.js";
import {
  newArticleDialog,
  becomeAnAuthorDialog,
  subscribeDialog,
} from "../components/dialogs.js";

export class State {
  constructor() {
    this.state = JSON.parse(localStorage.getItem("appState")) || {
      isAuthenticated: false,
      username: null,
      userId: null,
      role: null,
      isPaying: false,
    };
    this.headerLi = document.getElementById("dynamic");

    // manage state on intial load
    this.renderHeader();
    document.addEventListener("DOMContentLoaded", this.renderHeader.bind(this));
  }

  getState() {
    return { ...this.state };
  }
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    localStorage.setItem("appState", JSON.stringify(this.state));
    this.renderHeader();
    this.renderRoleBtn();
    this.renderSubBtn();
  }
  renderHeader() {
    if (this.state.isAuthenticated) {
      this.headerLi.innerHTML = this.getAuthenticatedHeader();
      document
        .getElementById("logout-btn")
        .addEventListener("click", this.logout.bind(this));
    } else {
      this.headerLi.innerHTML = this.getUnauthenticatedHeader();
    }
  }
  getAuthenticatedHeader() {
    return `
    <ul>
      <li><a href="/user/${this.state.userId}">${this.state.username}</a></li>
      <li><button id="logout-btn">Log out</button></li>
    </ul>
    `;
  }
  getUnauthenticatedHeader() {
    return `
    <ul>
      <li><a href="/login">Log in</a></li>
      <li><a href="/signup">Sign up</a></li>
    </ul>
    `;
  }
  renderRoleBtn() {
    const roleBtn = document.getElementById("authorship");
    if (this.state.isAuthenticated) {
      if (this.state.role === "AUTHOR") {
        roleBtn.textContent = "Write a new article";
        roleBtn.removeEventListener("click", becomeAnAuthorDialog);
        roleBtn.addEventListener("click", () => newArticleDialog(null));
      } else {
        roleBtn.textContent = "Become an author";
        roleBtn.removeEventListener("click", newArticleDialog);
        roleBtn.addEventListener("click", becomeAnAuthorDialog);
      }
    } else {
      roleBtn.textContent = "";
    }
  }

  renderSubBtn() {
    const subBtn = document.getElementById("subscription");
    if (this.state.isAuthenticated) {
      if (this.state.isPaying) {
        subBtn.textContent = "Full access";
        subBtn.removeEventListener("click", subscribeDialog);
      } else {
        subBtn.textContent = "Subscribe";
        subBtn.addEventListener("click", subscribeDialog);
      }
    } else {
      subBtn.textContent = "";
    }
  }

  async logout() {
    await authCalls.logout();
    this.updateState({
      isAuthenticated: false,
      username: null,
      userId: null,
      role: null,
      isPaying: false,
    });
    window.location.href = "/";
  }
}

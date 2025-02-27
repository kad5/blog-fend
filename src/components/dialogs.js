import { authCalls } from "../services/authApi.js";
import { appCalls } from "../services/appApi.js";

const dialog = document.getElementById("modal");
const wrapper = document.getElementById("modal-body");

export const newArticleDialog = (edit = null, articleId) => {
  wrapper.innerHTML = `
        <form id="newArticleForm" >
          <h3>Your new Article</h3>
          <input type="text" name="title" required />
          <div>
            <label for="publish">Make it public</label>
            <input type="checkbox" id="publish" name="isPublished" />
          </div>
          <div>
            <label for="prem">For subscribers only</label>
            <input type="checkbox" id="prem" name="isPremium" checked />
          </div>
          <textarea name="body" id="mytextarea">Hello, World!</textarea>
          <button type="submit">Post the article 🔥🔥</button>
        </form>
  `;
  wrapper
    .querySelector("#newArticleForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData);
      payload.isPremium
        ? (payload.isPremium = true)
        : (payload.isPremium = false);
      payload.isPublished
        ? (payload.isPublished = true)
        : (payload.isPublished = false);
      edit
        ? appCalls.editArticle(payload, articleId)
        : appCalls.addArticle(payload);
      dialog.close();
      window.router.navTo(window.location.pathname);
    });
  dialog.showModal();
};
export const becomeAnAuthorDialog = () => {
  wrapper.innerHTML = `
        <h3>Become an Author</h3>
        <p>By becoming an author you can start contributing to this blog immediately 🤩🤩</p>
        <button id="becomeAnAuthorBtn">Get author status 🚀</button>
  `;
  wrapper
    .querySelector("#becomeAnAuthorBtn")
    .addEventListener("click", async () => {
      const data = { role: "AUTHOR" };
      const response = await authCalls.updateProfile(
        data,
        window.state.state.userId
      );
      if (response) window.state.updateState({ role: "AUTHOR" });
      dialog.close();
    });
  dialog.showModal();
};
export const subscribeDialog = () => {
  wrapper.innerHTML = `
        <h3>Become a Meber</h3>
        <p>By becoming a member you can view all the preimuim articles we have 🫰🫰</p>
        <button id="getPremium">Pay 💵💵 and get premium</button>
  `;
  wrapper.querySelector("#getPremium").addEventListener("click", async () => {
    const data = { isPaying: true };
    const response = await authCalls.updateProfile(
      data,
      window.state.state.userId
    );
    if (response) window.state.updateState({ isPaying: true });
    dialog.close();
  });
  dialog.showModal();
};

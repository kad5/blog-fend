import { appCalls } from "../services/appApi.js";

export async function articleHTML(articleId) {
  const articlePage = document.createElement("div");
  articlePage.classList.add("article");
  const articleCont = await appCalls.getArticle(articleId);
  const commnetsCont = await commentsContainerHTML(articleId);

  const article = articleCont?.article;
  if (!article) window.location.href = "/";
  articlePage.innerHTML = `
    <h1>${article.title}</h1>
    <p>by : <a href="/user/${article.author.id}"><span>${article.author.username}</span></a></p>
    <div class="article-body">${article.body}</div>
  `;
  articlePage.appendChild(commnetsCont);
  return articlePage;
}

async function commentsContainerHTML(articleId) {
  const articleComments = document.createElement("div");
  articleComments.classList.add("article-comments");
  const hr = document.createElement("hr");
  const h2 = document.createElement("h2");
  h2.textContent = "Comments :";
  articleComments.appendChild(hr);
  articleComments.appendChild(h2);
  const commentsObj = await appCalls.getAllComments(articleId);
  const comments = commentHTML(commentsObj, articleId);
  const form = formHTML(articleId);
  articleComments.appendChild(comments);
  articleComments.appendChild(form);
  return articleComments;
}

export function commentHTML(commentsObj, articleId) {
  const comments = commentsObj;
  const container = document.createElement("div");
  container.classList.add("comment-container");
  if (!comments || comments.comments.length < 1) {
    container.textContent = "No commnets added yet";
    return container;
  }
  comments.comments.forEach((comment) => {
    if (window.state.state.userId === comment.author.id) {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-card");
      commentDiv.innerHTML = `
        <h3>
          <span><a href="/user/${comment.author.id}">${comment.author.username}</a></span>
          <button id="editCommnetBtn">edit</button>
          <button id="deleteCommnetBtn">delete</button>
        </h3>
        <span>${comment.createdAt}</span>
        <p>${comment.content}</p>
      `;

      commentDiv
        .querySelector("#editCommnetBtn")
        .addEventListener("click", async () => {
          const content = window.prompt("edit your comment");
          if (!content) return;
          await appCalls.editCommnet({ content }, articleId, comment.id);
          reloadComments(articleId);
        });
      commentDiv
        .querySelector("#deleteCommnetBtn")
        .addEventListener("click", async () => {
          await appCalls.deleteCommnet(articleId, comment.id);
          reloadComments(articleId);
        });

      container.appendChild(commentDiv);
    } else {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-card");
      commentDiv.innerHTML = `      
        <h3><a href="/user/${comment.author.id}">${comment.author.username}</a></h3>
        <span>${comment.createdAt}</span>
        <p>${comment.content}</p>
      `;
      container.appendChild(commentDiv);
    }
  });
  return container;
}

function formHTML(articleId) {
  const container = document.createElement("div");
  container.classList.add("add-comment");
  container.innerHTML = window.state.state.isAuthenticated
    ? `
    <div class="add-comment">
      <form id="newCommentForm">
        <textarea
          name="content"
          placeholder="your comment goes here"
          required
        ></textarea>
        <button>Add comment</button>
      </form>
    </div>`
    : `
    <div class="add-comment">
      <h2>Only logged in Users can add comments</h2>
      <a href="/login">Log in</a>
    </div>
    `;
  if (container.querySelector("#newCommentForm")) {
    container
      .querySelector("#newCommentForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);
        await appCalls.addCommnet(payload, articleId);
        reloadComments(articleId);
      });
  }
  return container;
}

export async function reloadComments(articleId) {
  const oldCommnetsCont = document.querySelector(".article-comments");
  oldCommnetsCont.remove();
  const newCommnetsCont = await commentsContainerHTML(articleId);
  const page = document.querySelector(".article");
  page.appendChild(newCommnetsCont);
}

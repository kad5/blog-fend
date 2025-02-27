import { authCalls } from "../services/authApi.js";
import { articleCardHTML } from "./main.js";
import { newArticleDialog } from "./dialogs.js";
import { appCalls } from "../services/appApi.js";

export async function userProfileHTML(userId) {
  const container = document.createElement("div");
  container.classList.add("profile");
  const userObjectCont = await authCalls.getProfile(userId);
  const profile = userObjectCont.profile;
  const userHTML = userSummaryHTML(profile);
  const tabsHTML = tabsSummaryHTML(userObjectCont);
  container.appendChild(userHTML);
  container.appendChild(tabsHTML);
  return container;
}

function userSummaryHTML(profile) {
  const container = document.createElement("div");
  container.classList.add("user");
  const name = document.createElement("h1");
  name.textContent = profile.username;
  const motto = document.createElement("h2");
  motto.textContent =
    profile.motto !== null ? profile.motto : "When life gives you lemons";
  container.append(name, motto);
  return container;
}
function tabsSummaryHTML(userObjectCont) {
  if (userObjectCont.state === "public") {
    const container = document.createElement("div");
    container.classList.add("tabs");
    container.innerHTML = `<h4>Please log in / sign up to view this profile details</h4>`;
    return container;
  }
  const container = document.createElement("div");
  container.classList.add("tabs");
  container.innerHTML = `
    <div class="tab-controls">
      <button class="tab-btn" id="articlesTab">Articles</button>
      <button class="tab-btn" id="commentsTab">Comments</button>
      <button class="tab-btn" id="favoritesTab">Favorites</button>
    </div>   
  `;

  const ownArticles = userObjectCont.profile.articles;
  const username = userObjectCont.profile.username;

  const articlesTab = document.createElement("div");
  articlesTab.classList.add("tab-content");
  articlesTab.id = "articlesContent";
  const articlesH3 = document.createElement("h3");
  articlesH3.textContent = "Articles Written";
  articlesTab.appendChild(articlesH3);
  console.log(userObjectCont);
  if (userObjectCont.profile.role !== "AUTHOR") {
    const pElement = document.createElement("p");
    pElement.textContent = "This user is not an author yet.";
    articlesTab.appendChild(pElement);
  } else {
    if (!ownArticles || ownArticles.length < 1) {
      const pElement = document.createElement("p");
      pElement.textContent = "No articles written yet.";
      articlesTab.appendChild(pElement);
    } else {
      ownArticles.forEach((article) => {
        const a = ownArticleHTML(article, username);
        articlesTab.appendChild(a);
      });
    }
  }

  const comments = userObjectCont.profile.comments;

  const commentsTab = document.createElement("div");
  commentsTab.classList.add("tab-content");
  commentsTab.id = "commentsContent";
  const commentsH3 = document.createElement("h3");
  commentsH3.textContent = "Comments Written";
  commentsTab.appendChild(commentsH3);
  if (!comments || comments.length < 1) {
    const pElement = document.createElement("p");
    pElement.textContent = "No comments added yet.";
    commentsTab.appendChild(pElement);
  } else {
    const c = commentHTML(userObjectCont);
    commentsTab.appendChild(c);
  }

  const favArticles = userObjectCont.profile.favorites;

  const favTab = document.createElement("div");
  favTab.classList.add("tab-content");
  favTab.id = "favoritesContent";
  const favH3 = document.createElement("h3");
  favH3.textContent = "Articles liked";
  favTab.appendChild(favH3);
  if (!favArticles || favArticles.length < 1) {
    const pElement = document.createElement("p");
    pElement.textContent = "No articles liked yet.";
    favTab.appendChild(pElement);
  } else {
    favArticles.forEach((article) => {
      const a = articleCardHTML(article);
      favTab.appendChild(a);
    });
    const POSBug = favTab.querySelectorAll("#favThisBtn");
    if (POSBug && POSBug.length > 0) POSBug.forEach((btn) => btn.remove());
  }

  container.appendChild(articlesTab);
  container.appendChild(commentsTab);
  container.appendChild(favTab);

  const tabs = container.querySelectorAll(".tab-btn");
  const tabContents = container.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((tab) => tab.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and its content
      this.classList.add("active");
      const contentId = `#${this.id.replace("Tab", "Content")}`;
      const cont = container.querySelector(contentId);

      cont.classList.add("active");
    });
  });

  // set default tab to Articles
  container.querySelector("#articlesTab").click();

  return container;
}

function ownArticleHTML(article, username) {
  const container = document.createElement("div");
  container.classList.add("card");
  container.classList.add("glass");
  article.isPremium && container.classList.add("premArticle");
  !article.isPublished && container.classList.add("draft");
  container.innerHTML = `
                <button id="editArticle">Edit</button>
                <button id="deleteArticle" >Delete</button>
                <div>
                  <p>${article.createdAt}</p>
                </div>
                <h2>${article.title}</h2>
                <div>
                  <div>
                    <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
                      fill="var(--heart-full)">
                      <path
                        d="M14.88 4.78079C14.7993 4.46498 14.6748 4.16202 14.51 3.88077C14.3518 3.58819 14.1493 3.3217 13.91 3.09073C13.563 2.74486 13.152 2.46982 12.7 2.28079C11.7902 1.90738 10.7698 1.90738 9.85999 2.28079C9.43276 2.46163 9.04027 2.71541 8.70002 3.03079L8.65003 3.09073L8.00001 3.74075L7.34999 3.09073L7.3 3.03079C6.95975 2.71541 6.56726 2.46163 6.14002 2.28079C5.23018 1.90738 4.20984 1.90738 3.3 2.28079C2.84798 2.46982 2.43706 2.74486 2.09004 3.09073C1.85051 3.32402 1.64514 3.59002 1.48002 3.88077C1.32258 4.1644 1.20161 4.46682 1.12 4.78079C1.03522 5.10721 0.994861 5.44358 1.00001 5.78079C1.00053 6.09791 1.04084 6.41365 1.12 6.72073C1.20384 7.03078 1.32472 7.32961 1.48002 7.61075C1.64774 7.89975 1.85285 8.16542 2.09004 8.40079L8.00001 14.3108L13.91 8.40079C14.1471 8.16782 14.3492 7.90169 14.51 7.61075C14.6729 7.33211 14.7974 7.03272 14.88 6.72073C14.9592 6.41365 14.9995 6.09791 15 5.78079C15.0052 5.44358 14.9648 5.10721 14.88 4.78079Z"/>
                    </svg>
                    <span>${article._count.favorites}</span>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960"
                      fill="var(--comments)"
                    >
                      <path
                        d="M240-400h480v-80H240zm0-120h480v-80H240zm0-120h480v-80H240zM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800zM160-320h594l46 45v-525H160zm0 0v-480z"/>
                    </svg>
                    <span>${article._count.comments}</span>
                  </div>
                </div>
                <div>
                  <p>by : <span>${username}</span></p>
                  <a href="/article/${article.id}"><button>Read</button><a>
                </div>
  `;
  container.querySelector("#editArticle").addEventListener("click", () => {
    newArticleDialog(true, article.id);
    document.querySelector("#newArticleForm h3").textContent =
      "Edit your article";
    document.querySelector("#newArticleForm input[type='text']").value =
      article.title;
  });

  container.querySelector("#deleteArticle").addEventListener("click", () => {
    appCalls.deletetArticle(article.id);
    window.router.navTo(window.location.pathname);
  });

  return container;
}

function commentHTML(userObjectCont) {
  const comments = userObjectCont.profile.comments;
  const container = document.createElement("div");
  container.classList.add("comment-container");
  comments.forEach((comment) => {
    if (userObjectCont.state === "owner") {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-card");
      commentDiv.innerHTML = `
        <h3>
          <span>${userObjectCont.profile.username}</span>
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
          await appCalls.editCommnet(
            { content },
            comment.article.id,
            comment.id
          );
        });
      commentDiv
        .querySelector("#deleteCommnetBtn")
        .addEventListener("click", async () => {
          await appCalls.deleteCommnet(comment.article.id, comment.id);
        });

      container.appendChild(commentDiv);
    } else {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-card");
      commentDiv.innerHTML = `      
        <h3>${userObjectCont.profile.username}</h3>
        <span>${comment.createdAt}</span>
        <p>${comment.content}</p>
      `;
      container.appendChild(commentDiv);
    }
  });
  return container;
}

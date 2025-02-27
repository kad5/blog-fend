import { appCalls } from "../services/appApi.js";

export async function mainPageHTML() {
  const container = document.createElement("div");
  container.classList.add("page");
  const div1 = document.createElement("div");
  const showcase = document.createElement("p");
  showcase.classList.add("showcase");
  showcase.textContent = "<a> blog by learners for learners";
  div1.appendChild(showcase);
  const div2 = document.createElement("div");
  const grid = document.createElement("div");
  grid.classList.add("grid");
  const articles = await appCalls.getAllArticles();
  if (!articles || articles.length < 1) return `<p>No articles yet</p>`;
  articles.viewableArticles.forEach((article) => {
    const card = articleCardHTML(article);
    grid.appendChild(card);
  });
  div2.appendChild(grid);
  container.appendChild(div1);
  container.appendChild(div2);
  return container;
}

export function articleCardHTML(article) {
  const container = document.createElement("div");
  container.classList.add("card");
  container.classList.add("glass");
  article.isPremium === true && container.classList.add("premArticle");
  article.isPublished === false && container.classList.add("draft");
  container.innerHTML = `
                <button id="favThisBtn" class="fav"></button>
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
                  <p>by : <a href="/user/${article.author.id}"><span>${article.author.username}</span></a></p>
                  <a href="/article/${article.id}"><button>Read</button><a>
                </div>
  `;
  if (window.state.state.isAuthenticated) {
    const favBtn = container.querySelector("#favThisBtn");
    favBtn.innerHTML = `
      <svg
        width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" >
          <path d="M14.88 4.78079C14.7993 4.46498 14.6748 4.16202 14.51 3.88077C14.3518 3.58819 14.1493 3.3217 13.91 3.09073C13.563 2.74486 13.152 2.46982 12.7 2.28079C11.7902 1.90738 10.7698 1.90738 9.85999 2.28079C9.43276 2.46163 9.04027 2.71541 8.70002 3.03079L8.65003 3.09073L8.00001 3.74075L7.34999 3.09073L7.3 3.03079C6.95975 2.71541 6.56726 2.46163 6.14002 2.28079C5.23018 1.90738 4.20984 1.90738 3.3 2.28079C2.84798 2.46982 2.43706 2.74486 2.09004 3.09073C1.85051 3.32402 1.64514 3.59002 1.48002 3.88077C1.32258 4.1644 1.20161 4.46682 1.12 4.78079C1.03522 5.10721 0.994861 5.44358 1.00001 5.78079C1.00053 6.09791 1.04084 6.41365 1.12 6.72073C1.20384 7.03078 1.32472 7.32961 1.48002 7.61075C1.64774 7.89975 1.85285 8.16542 2.09004 8.40079L8.00001 14.3108L13.91 8.40079C14.1471 8.16782 14.3492 7.90169 14.51 7.61075C14.6729 7.33211 14.7974 7.03272 14.88 6.72073C14.9592 6.41365 14.9995 6.09791 15 5.78079C15.0052 5.44358 14.9648 5.10721 14.88 4.78079Z" />
      </svg>`;
    const isFav = article.favorites?.some(
      (favorite) => favorite.userId === window.state.state.userId
    );
    isFav
      ? favBtn.querySelector("svg").setAttribute("fill", "var(--heart-full)")
      : favBtn.querySelector("svg").setAttribute("fill", "var(--heart-empty)");

    container.querySelector("#favThisBtn").addEventListener("click", () => {
      !isFav
        ? appCalls.addFav({ articleId: article.id }, window.state.state.userId)
        : appCalls.deleteFav(
            { articleId: article.id },
            window.state.state.userId
          );
    });
  }

  return container;
}

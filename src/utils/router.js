import * as pages from "./pages.js";

export class Router {
  constructor() {
    this.routes = [
      { path: "/", page: pages.renderHomePage },
      { path: "/login", page: pages.renderLoginPage },
      { path: "/signup", page: pages.renderSignupPage },
    ];
    // binding methods to preserve 'this' context to this class router rather than window
    this.handleRoute = this.handleRoute.bind(this);
    this.navTo = this.navTo.bind(this);

    window.addEventListener("popstate", this.handleRoute);
    window.addEventListener("DOMContentLoaded", this.handleRoute);
    document.addEventListener("click", (e) => {
      const target = e.target.closest("a");
      if (!target) return;

      if (target.getAttribute("href").startsWith("/")) {
        e.preventDefault();
        this.navTo(target.getAttribute("href"));
      }
    });
  }

  navTo(path) {
    window.history.pushState({}, "", path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;

    const matchingRoute = this.routes.find((route) => route.path === path);
    if (matchingRoute) {
      matchingRoute.page();
      return;
    }
    //this is for dynamic routes
    if (path.startsWith("/article/")) {
      const articleId = path.split("/article/")[1];
      pages.renderArticlePage(articleId);
    } else if (path.startsWith("/user/")) {
      const userId = path.split("/user/")[1];
      pages.renderProfilePage(userId);
    } else {
      pages.render404Page();
    }
  }
}

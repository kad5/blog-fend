import { apiRequest } from "./apiConfig.js";

export const appCalls = {
  async getAllArticles() {
    return apiRequest(`/articles`);
  },

  async getArticle(articleId) {
    return apiRequest(`/articles/${articleId}`);
  },

  async getAllComments(articleId) {
    return apiRequest(`/articles/${articleId}/comments`);
  },

  async addArticle(content) {
    return apiRequest(`/articles`, {
      method: "POST",
      body: JSON.stringify(content),
    });
  },

  async editArticle(content, articleId) {
    console.log(content);
    return apiRequest(`/articles/${articleId}`, {
      method: "PUT",
      body: JSON.stringify(content),
    });
  },

  async deletetArticle(articleId) {
    return apiRequest(`/articles/${articleId}`, {
      method: "DELETE",
    });
  },

  async addFav(content, id) {
    return apiRequest(`/users/${id}/favorites`, {
      method: "POST",
      body: JSON.stringify(content),
    });
  },

  async deleteFav(content, id) {
    return apiRequest(`/users/${id}/favorites`, {
      method: "DELETE",
      body: JSON.stringify(content),
    });
  },

  async addCommnet(content, articleId) {
    return apiRequest(`/articles/${articleId}/comments`, {
      method: "POST",
      body: JSON.stringify(content),
    });
  },
  async editCommnet(content, articleId, commentId) {
    return apiRequest(`/articles/${articleId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(content),
    });
  },
  async deleteCommnet(articleId, commentId) {
    return apiRequest(`/articles/${articleId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },
};

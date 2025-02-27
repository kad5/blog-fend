import { apiRequest } from "./apiConfig.js";

export const authCalls = {
  async signup(credentials) {
    const response = await apiRequest("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    console.log(`response is `, response);
    let list = "";
    if (response) {
      response.message ? (list = response.message) : null;
      response.errors?.forEach((error) => {
        list = list + "\n" + error.msg;
      });
    }

    if (list !== "") alert(list);
  },

  async login(credentials) {
    const response = await apiRequest("/auth/log-in", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    window.state.updateState({
      isAuthenticated: true,
      username: response.username,
      userId: response.id,
      role: response.role,
      isPaying: response.isPaying,
    });

    //window.location.href = "/";
  },

  async logout() {
    return apiRequest("/auth/log-out", {
      method: "POST",
    });
  },

  async getProfile(id) {
    return apiRequest(`/users/${id}`);
  },

  async updateProfile(data, id) {
    const response = await apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  },
};

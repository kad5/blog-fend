const BASE_URL = "https://top-blog-jwt-api-bend-production.up.railway.app/api";

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    //make sure to sync local storage state with the server
    if (window.state.isAuthenticated !== false) {
      if (
        response.status === 401 ||
        response.headers.get("X-auth-custom") === "not-verified"
      ) {
        // reset state
        window.state.updateState({
          isAuthenticated: false,
          username: null,
          userId: null,
          role: null,
          isPaying: false,
        });
      }
    }

    if (response.status === 204) {
      window.state.updateState({
        isAuthenticated: false,
        username: null,
        userId: null,
        role: null,
        isPaying: false,
      });
    }

    if (response.status === 400) {
      console.log("bad request");
    }

    if (response.status === 404) {
      console.log("Oops, page doesnt exist");
    }

    if (response.status === 401) {
      console.log("not allowed");
    }

    if (response.status === 403) {
      console.log("not allowed");
    }

    if (response.status === 500) {
      console.log("server error");
    }
    try {
      return await response.json();
    } catch {
      return null; // No JSON body
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

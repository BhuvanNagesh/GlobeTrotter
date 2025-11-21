export const authService = {
  getCurrentUser: async () => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const userName = localStorage.getItem("userName");

    if (isAuth === "true" && userName) {
      return { name: userName };
    }

    return null;
  },

  login: (email: string, name: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", name);
  },

  logout: () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
  }
};

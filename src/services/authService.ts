import api from "axios";

export const login = async (email: string, password: string) => {
  await api.get("/sanctum/csrf-cookie");
  return api.post("/api/login", { email, password });
};

export const logout = async () => {
  return api.post("/api/logout");
};
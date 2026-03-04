import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/login",
    {
      email,
      password,
    }
  );

  return response.data; // 🔥 WAJIB RETURN INI
};
import axios from "axios";

// Bisa gunakan variable untuk base URL agar lebih rapi
const API_URL = "http://127.0.0.1:8000/api"; 

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data; // 🔥 WAJIB RETURN INI
};

// 🔥 FUNGSI BARU UNTUK MENYIMPAN USER BESERTA PERMISSIONS-NYA
export const createUser = async (userData: any) => {
  // Ambil token dari penyimpanan lokal (sesuaikan jika kamu menyimpannya di tempat lain)
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/v1/users`, // Sesuaikan dengan route API Laravel kamu
    userData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Wajib untuk route yang di-protect
      },
    }
  );

  return response.data;
};
import api from "axios";
import { type DocumentType } from "../types/documentType";

export const getDocuments = async (): Promise<DocumentType[]> => {
  const res = await api.get("/api/documents");
  return res.data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/api/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDocument = async (id: number) => {
  return api.delete(`/api/documents/${id}`);
};

export const downloadDocument = (id: number) => {
  window.open(`http://localhost:8000/api/documents/${id}/download`);
};
import api from "../API/axios";

export interface DashboardStats {
  documents_count: number;
  files_count: number;
  free_space: number;
  total_space: number;
  usage: {
    verified: number;
    pending: number;
    rejected: number;
  };
  upload_stats: number[];
  top_documents: {
    name: string;
    views: number;
  }[];
  activities: {
    description: string;
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/api/dashboard-stats");
  return response.data;
};
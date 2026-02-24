export interface DocumentType {
  id: number;
  name: string;
  path: string;
  folder_id: number | null;
  mime_type: string;
  size: number;
  created_at: string;
}
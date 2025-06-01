export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface SummarizationRequest {
  id: number;
  filename: string;
  transcript: string;
  summary: string;
  created_at: string;
}

export interface FileUploadResponse {
  id: number;
  filename: string;
  status: string;
} 
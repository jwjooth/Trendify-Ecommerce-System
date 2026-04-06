export interface User {
  page?: number;
  limit?: number;
  sort_of?: string;
  sort_by?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface putUserRequest {
  active: boolean;
  avatar: string;
  bio: string;
  name: string;
  role: string;
}

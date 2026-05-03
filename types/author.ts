export interface Author {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    profileUrl: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

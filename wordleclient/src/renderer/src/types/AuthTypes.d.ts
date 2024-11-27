export interface LoginRequest {
  username: string;
  password: string;
  audienceURI: string;
}

export interface LoginResponse {
  token: string;
}

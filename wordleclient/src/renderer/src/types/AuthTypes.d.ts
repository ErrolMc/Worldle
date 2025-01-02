export interface LoginRequest {
  username: string;
  password: string;
  audienceURI: string;
}

export interface LoginResponse {
  userID: string;
  token: string;
}

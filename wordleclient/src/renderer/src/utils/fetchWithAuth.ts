import { AuthService } from "../services/AuthService";
import { LOGIN_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@renderer/types/LocalStorageKeys";
import { LoginResponse } from "@renderer/types/AuthTypes";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem(LOGIN_TOKEN_KEY);

  // merge the auth header with any existing headers
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };

  // make request with all original options (method, body, etc.) plus auth header
  let response: Response = await fetch(url, {
    ...options, 
    headers
  });

  // handle 401 with refresh token
  if (response.status === 401) {
    const refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        const refreshResponse: LoginResponse = await AuthService.refreshToken(refreshToken);
        localStorage.setItem(LOGIN_TOKEN_KEY, refreshResponse.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshResponse.refreshToken);

        // retry original request with new token
        headers.Authorization = `Bearer ${refreshResponse.token}`;
        response = await fetch(url, {
          ...options, 
          headers
        });
      } catch (error) {
        localStorage.removeItem(LOGIN_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        throw new Error("Session expired. Please login again.");
      }
    }
  }

  return response;
}

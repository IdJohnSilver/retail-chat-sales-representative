import { httpClient } from './httpClient';

interface LoginResponse {
  access_token: string;
}

export async function login(login: string, password: string): Promise<string> {
  const response = await httpClient.post<LoginResponse>('auth/login', {
    login,
    password,
  });
  return response.access_token;
}

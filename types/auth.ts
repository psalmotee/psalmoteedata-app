export type AuthUser = {
  id: number;
  username: string;
  display_name: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  token_type: "Bearer";
  access_token: string;
  expires_at: string;
  user: AuthUser;
};

export type MeResponse = {
  success: boolean;
  user: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

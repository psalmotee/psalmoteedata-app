export type AuthUser = {
  id: number;
  username: string;
  display_name: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type RegistrationCredentials = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  first_name: string;
  last_name: string;
  pin: string;
  country: string;
  referral?: string;
  bvn_nin_type?: "bvn" | "nin";
  bvn_nin_value?: string;
};

export type RegistrationResponse = {
  success: boolean;
  message: string;
  verification_required: boolean;
  email_sent: boolean;
  user: {
    username: string;
    email: string;
  };
};

export type CountryOption = {
  value: string;
  label: string;
};

export type CountriesResponse = {
  success: boolean;
  countries: CountryOption[];
};

export type RegistrationConfig = {
  request_bvn_nin: boolean;
  request_bvn_nin_required: boolean;
};

export type RegistrationConfigResponse = {
  success: boolean;
  registration: RegistrationConfig;
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

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type HeartbeatResponse = {
  success: boolean;
  message: string;
  server_time: string;
};
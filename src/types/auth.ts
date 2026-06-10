export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
  department?: string | null;
  phone?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type UpdateProfilePayload = {
  name: string;
  department?: string;
  phone?: string;
};

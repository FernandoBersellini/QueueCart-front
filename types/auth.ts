export type Role = "CUSTOMER" | "ADMIN";

export interface AuthResponseDTO {
  userId: number;
  email: string;
  name: string;
  role: Role;
  token: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface SignUpDTO {
  email: string;
  password: string;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  gender?: boolean;
  heightCm?: number;
  weightKg?: number;
  role: "USER" | "ADMIN";
}

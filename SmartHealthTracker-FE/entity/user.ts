export interface UserProfile {
  data: {
    id: string;
    email: string;
    fullName?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    gender?: string;
    heightCm?: number;
    weightKg?: number;
    role: "USER" | "ADMIN";
  };
}

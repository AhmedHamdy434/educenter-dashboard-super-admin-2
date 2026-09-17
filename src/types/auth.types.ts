export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: 'SUPER_ADMIN' | 'OWNER' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  centerId: string | null;
  mustChangePassword?: boolean;
}

export interface LoginResponseData {
  accessToken: string;
  user: AuthUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}


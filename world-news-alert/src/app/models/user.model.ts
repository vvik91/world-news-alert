export type UserRole = 'USER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
}
export const USER_ROLES = ["Admin", "Sales", "Viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  user_id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
}

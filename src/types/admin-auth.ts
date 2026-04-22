export type AdminUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
};

export type AdminTokenResponse = {
  access: string;
  refresh: string;
  user: AdminUser;
};

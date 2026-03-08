export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'sales_executive' | 'sales_manager' | 'project_manager' | 'procurement_officer' | 'site_engineer' | 'finance_officer' | 'qc_officer' | 'workshop_supervisor' | 'hr_officer';
  organizationId?: number;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: number | null;
  };
  token: string;
  refreshToken: string;
}
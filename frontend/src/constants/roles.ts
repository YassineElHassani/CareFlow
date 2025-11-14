export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient',
  SECRETARY: 'secretary',
  PHARMACIST: 'pharmacist',
  LAB_STAFF: 'lab_staff',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role hierarchy (for permission checks)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.ADMIN]: 100,
  [ROLES.DOCTOR]: 80,
  [ROLES.NURSE]: 60,
  [ROLES.SECRETARY]: 60,
  [ROLES.PHARMACIST]: 50,
  [ROLES.LAB_STAFF]: 50,
  [ROLES.PATIENT]: 10,
};

// Check if user has required role
export const hasRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Check if user has minimum role level
export const hasMinimumRole = (userRole: UserRole, minimumRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
};
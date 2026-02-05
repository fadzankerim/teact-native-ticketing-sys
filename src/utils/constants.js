// Ticket Status
export const TICKET_STATUS = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  AWAITING_CUSTOMER: 'AWAITING_CUSTOMER',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUS.NEW]: 'New',
  [TICKET_STATUS.OPEN]: 'Open',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.AWAITING_CUSTOMER]: 'Awaiting Customer',
  [TICKET_STATUS.RESOLVED]: 'Resolved',
  [TICKET_STATUS.CLOSED]: 'Closed',
};

export const TICKET_STATUS_COLORS = {
  [TICKET_STATUS.NEW]: 'bg-gray-100 text-gray-800',
  [TICKET_STATUS.OPEN]: 'bg-blue-100 text-blue-800',
  [TICKET_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [TICKET_STATUS.AWAITING_CUSTOMER]: 'bg-cyan-100 text-cyan-800',
  [TICKET_STATUS.RESOLVED]: 'bg-green-100 text-green-800',
  [TICKET_STATUS.CLOSED]: 'bg-purple-100 text-purple-800',
};

// Ticket Priority
export const TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const TICKET_PRIORITY_LABELS = {
  [TICKET_PRIORITY.LOW]: 'Low',
  [TICKET_PRIORITY.MEDIUM]: 'Medium',
  [TICKET_PRIORITY.HIGH]: 'High',
  [TICKET_PRIORITY.URGENT]: 'Urgent',
};

export const TICKET_PRIORITY_COLORS = {
  [TICKET_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [TICKET_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TICKET_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [TICKET_PRIORITY.URGENT]: 'bg-red-100 text-red-800',
};

// Ticket Categories
export const TICKET_CATEGORIES = {
  TECHNICAL: 'TECHNICAL',
  BILLING: 'BILLING',
  FEATURE_REQUEST: 'FEATURE_REQUEST',
  BUG_REPORT: 'BUG_REPORT',
  ACCOUNT: 'ACCOUNT',
  OTHER: 'OTHER',
};

export const TICKET_CATEGORY_LABELS = {
  [TICKET_CATEGORIES.TECHNICAL]: 'Technical Support',
  [TICKET_CATEGORIES.BILLING]: 'Billing',
  [TICKET_CATEGORIES.FEATURE_REQUEST]: 'Feature Request',
  [TICKET_CATEGORIES.BUG_REPORT]: 'Bug Report',
  [TICKET_CATEGORIES.ACCOUNT]: 'Account',
  [TICKET_CATEGORIES.OTHER]: 'Other',
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  AGENT: 'AGENT',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.CUSTOMER]: 'Customer',
  [USER_ROLES.AGENT]: 'Agent',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.ADMIN]: 'Admin',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  TICKET_ASSIGNED: 'TICKET_ASSIGNED',
  TICKET_UPDATED: 'TICKET_UPDATED',
  NEW_COMMENT: 'NEW_COMMENT',
  TICKET_RESOLVED: 'TICKET_RESOLVED',
  MENTION: 'MENTION',
  SLA_WARNING: 'SLA_WARNING',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id) => `/tickets/${id}`,
    ASSIGN: (id) => `/tickets/${id}/assign`,
    COMMENTS: (id) => `/tickets/${id}/comments`,
    ATTACHMENTS: (id) => `/tickets/${id}/attachments`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    AGENTS: '/users/agents',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    TICKETS: '/analytics/tickets',
    AGENTS: '/analytics/agents',
  },
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';
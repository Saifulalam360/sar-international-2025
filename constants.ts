import { faHome, faCalendar, faCog, faCubes, faDollarSign, faComments } from '@fortawesome/free-solid-svg-icons';

export const NAV_LINKS = [
  { name: 'Dashboard', icon: faHome },
  { name: 'Calendar', icon: faCalendar },
  { name: 'Apps', icon: faCubes },
  { name: 'Finance', icon: faDollarSign },
  { name: 'Messages', icon: faComments },
  { name: 'Settings', icon: faCog },
];

export const PERMISSION_CATEGORIES: Record<string, string[]> = {
  'User Management': [
    'manage_users',
    'sudo_access',
  ],
  'App Control': [
    'deploy_apps',
    'access_logs',
    'manage_database',
  ],
  'Billing & Reports': [
    'manage_billing',
    'view_reports',
  ],
  'Content & Support': [
    'delete_content',
    'moderate_comments',
    'manage_support_tickets',
  ],
  'General': [
    'edit_settings',
    'api_access',
  ],
};

export const ALL_PERMISSIONS = Object.values(PERMISSION_CATEGORIES).flat();

import { faHome, faCalendar, faTasks, faCog, faCubes, faDollarSign, faComments } from '@fortawesome/free-solid-svg-icons';

export const NAV_LINKS = [
  { name: 'Dashboard', icon: faHome },
  { name: 'Calendar', icon: faCalendar },
  // { name: 'Tasks', icon: faTasks }, // Tasks are shown with Calendar
  { name: 'Apps', icon: faCubes },
  { name: 'Finance', icon: faDollarSign },
  { name: 'Messages', icon: faComments },
  { name: 'Settings', icon: faCog },
];

export const PERMISSIONS_LIST = [
    'manage_users',
    'view_reports',
    'edit_settings',
    'manage_billing',
    'access_logs',
    'deploy_apps',
    'manage_database',
    'sudo_access',
    'api_access',
    'delete_content',
    'moderate_comments',
    'manage_support_tickets',
];

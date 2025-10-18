import React, { useState, useRef } from 'react';
import type { Administrator } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faShieldAlt, faKey, faHistory, faDatabase, faChartBar, faSave, faExclamationTriangle, faLock, faCamera, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PERMISSION_CATEGORIES } from '../constants';
import Tabs, { Tab } from './common/Tabs';
import Button from './ui/Button';
import ToggleSwitch from './ui/ToggleSwitch';
import { useToast } from '../../contexts/ToastContext';
import { useDataContext } from '../../contexts/DataContext';
import CollapsibleCard from './ui/CollapsibleCard';

interface AdminProfileProps {
    admin: Administrator;
    onUpdateAdmin: (admin: Administrator) => void;
    onBack: () => void;
}

const STATUS_STYLES: Record<Administrator['status'], string> = {
    'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Inactive': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Suspended': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const AdminProfile: React.FC<AdminProfileProps> = ({ admin, onUpdateAdmin, onBack }) => {
    const [editableAdmin, setEditableAdmin] = useState<Administrator>({ ...admin });
    const { addToast } = useToast();
    const { isLoading } = useDataContext();
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditableAdmin(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (permission: string) => {
        const newPermissions = editableAdmin.permissions.includes(permission)
            ? editableAdmin.permissions.filter(p => p !== permission)
            : [...editableAdmin.permissions, permission];
        setEditableAdmin(prev => ({ ...prev, permissions: newPermissions }));
    };
    
    const handleCategoryPermissionChange = (categoryPermissions: string[], select: boolean) => {
        setEditableAdmin(prev => {
            const currentPermissions = new Set(prev.permissions);
            if (select) {
                categoryPermissions.forEach(p => currentPermissions.add(p));
            } else {
                categoryPermissions.forEach(p => currentPermissions.delete(p));
            }
            return { ...prev, permissions: Array.from(currentPermissions) };
        });
    };
    
    const handle2FAToggle = (isChecked: boolean) => {
        setEditableAdmin(prev => ({ ...prev, twoFactorEnabled: isChecked }));
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateAdmin(editableAdmin);
            setIsSaving(false);
            addToast({ message: 'Administrator profile saved!', type: 'success' });
        }, 1000);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditableAdmin(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerAvatarUpload = () => {
        fileInputRef.current?.click();
    };
    
    const TABS: Tab[] = [
        { 
            id: 'profile', 
            label: 'Profile & Account', 
            icon: faUser,
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Profile & Account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input type="text" id="name" name="name" value={editableAdmin.name} onChange={handleInputChange} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <input type="email" id="email" name="email" value={editableAdmin.email} onChange={handleInputChange} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                        </div>
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <select id="role" name="role" value={editableAdmin.role} onChange={handleInputChange} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                                <option>System Administrator</option>
                                <option>Manager</option>
                                <option>Support Staff</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">Account Status</label>
                            <select id="status" name="status" value={editableAdmin.status} onChange={handleInputChange} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'security', 
            label: 'Security', 
            icon: faShieldAlt,
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Security & Verification</h3>
                     <div className="p-4 bg-[#0D1117] rounded-lg border border-gray-800">
                        <p className="text-gray-400 text-sm">Last Login: <span className="font-semibold text-white">{editableAdmin.lastLogin.toLocaleString()}</span></p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#0D1117] rounded-lg border border-gray-800">
                        <div>
                            <h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                            <p className="text-sm text-gray-400">Enhance account security with 2FA.</p>
                        </div>
                        <ToggleSwitch checked={editableAdmin.twoFactorEnabled} onChange={handle2FAToggle} />
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#0D1117] rounded-lg border border-gray-800">
                        <div>
                            <h4 className="font-semibold text-white">Account Password</h4>
                            <p className="text-sm text-gray-400">It's recommended to periodically reset passwords.</p>
                        </div>
                         <Button variant="secondary">Reset Password</Button>
                    </div>
                     {editableAdmin.status === 'Suspended' && <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 h-6 w-6"/>
                        <div>
                            <h4 className="font-bold text-red-300">Account Suspended</h4>
                            <p className="text-sm text-red-400">This account is currently suspended. Some actions may be restricted.</p>
                        </div>
                     </div>}
                </div>
            ) 
        },
        { 
            id: 'permissions', 
            label: 'Permissions', 
            icon: faKey,
            content: (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Role & Permissions</h3>
                    <div className="space-y-4">
                        {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => {
                            const allInCategorySelected = permissions.every(p => editableAdmin.permissions.includes(p));
                            
                            return (
                                <CollapsibleCard 
                                    key={category} 
                                    title={category}
                                    defaultOpen={false}
                                >
                                    <div className="flex justify-end mb-4 -mt-2">
                                        <button
                                            onClick={() => handleCategoryPermissionChange(permissions, !allInCategorySelected)}
                                            className="text-xs font-semibold text-purple-400 hover:underline"
                                        >
                                            {allInCategorySelected ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {permissions.map(permission => (
                                            <label key={permission} htmlFor={permission} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id={permission}
                                                    checked={editableAdmin.permissions.includes(permission)}
                                                    onChange={() => handlePermissionChange(permission)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#0D1117] border-2 border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex-shrink-0">
                                                    <svg className="w-3 h-3 text-white hidden peer-checked:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-300 font-mono select-none">{permission}</span>
                                            </label>
                                        ))}
                                    </div>
                                </CollapsibleCard>
                            )
                        })}
                    </div>
                </div>
            ) 
        },
        { 
            id: 'activity', 
            label: 'Activity', 
            icon: faHistory,
            content: (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Activity Logs</h3>
                    <div className="bg-[#0D1117] rounded-lg border border-gray-800 max-h-96 overflow-y-auto">
                       <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-[#161B22] sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Action</th>
                                    <th className="px-6 py-3">Details</th>
                                    <th className="px-6 py-3">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {editableAdmin.activityLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
                                        <td className="px-6 py-4">{log.action}</td>
                                        <td className="px-6 py-4 text-gray-400">{log.details}</td>
                                        <td className="px-6 py-4 font-mono">{log.ipAddress}</td>
                                    </tr>
                                ))}
                                {editableAdmin.activityLogs.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-6 text-gray-500">No activity logs found.</td></tr>
                                )}
                            </tbody>
                       </table>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'data', 
            label: 'Data & Storage', 
            icon: faDatabase,
            content: (
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4">Data & Storage</h3>
                     <div className="p-6 bg-[#0D1117] rounded-lg border border-gray-800">
                        <h4 className="font-semibold text-white mb-2">Storage Usage</h4>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>{editableAdmin.storageUsage.used} GB Used</span>
                            <span>{editableAdmin.storageUsage.total} GB Total</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                           <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(editableAdmin.storageUsage.used / editableAdmin.storageUsage.total) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'reports', 
            label: 'Reports', 
            icon: faChartBar,
            content: (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Reports</h3>
                    {['System Administrator', 'Manager'].includes(editableAdmin.role) ? (
                        <div className="p-6 bg-[#0D1117] rounded-lg border border-gray-800">
                            <h4 className="font-semibold text-white mb-2">Generate Activity Report</h4>
                            <p className="text-sm text-gray-400 mb-4">Select a date range to generate a downloadable report of user activities.</p>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label htmlFor="start-date" className="text-xs text-gray-500">Start Date</label>
                                    <input type="date" id="start-date" className="w-full bg-[#0D1117] border border-gray-700 rounded-lg p-2 text-sm text-gray-300" />
                                </div>
                                <div>
                                    <label htmlFor="end-date" className="text-xs text-gray-500">End Date</label>
                                    <input type="date" id="end-date" className="w-full bg-[#0D1117] border border-gray-700 rounded-lg p-2 text-sm text-gray-300" />
                                </div>
                                <div className="self-end">
                                    <Button>Generate Report</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-[#0D1117] rounded-lg border-2 border-dashed border-gray-800">
                            <FontAwesomeIcon icon={faLock} className="text-5xl text-gray-600 mb-4"/>
                            <h4 className="text-lg font-bold text-gray-400">Access Denied</h4>
                            <p className="text-sm text-gray-500">You do not have the required permissions to access this feature.</p>
                        </div>
                    )}
                </div>
            )
        },
    ];

  return (
    <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to All Administrators
                </button>
                 <div className="flex items-center gap-4">
                    <div className="relative group">
                        <img src={editableAdmin.avatarUrl} alt={editableAdmin.name} className="w-16 h-16 rounded-full"/>
                        <button 
                            onClick={triggerAvatarUpload}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Change profile picture"
                        >
                            <FontAwesomeIcon icon={faCamera} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{editableAdmin.name}</h1>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${STATUS_STYLES[editableAdmin.status]}`}>{editableAdmin.status}</span>
                    </div>
                </div>
            </div>
             <Button 
                onClick={handleSaveChanges} 
                leftIcon={isSaving ? faSpinner : faSave}
                disabled={isSaving || isLoading}
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
        
        <Tabs tabs={TABS} />
    </div>
  );
};

export default AdminProfile;
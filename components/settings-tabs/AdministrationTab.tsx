import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import type { Administrator } from '../../types';
import { useDataContext } from '../../contexts/DataContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable, { ColumnDefinition } from '../common/DataTable';
import AdminManagementModal from '../AdminManagementModal';

interface AdministrationTabProps {
  onSelectAdmin: (admin: Administrator) => void;
}

const ADMIN_STATUS_STYLES: Record<Administrator['status'], string> = {
    'Active': 'bg-green-500/20 text-green-400',
    'Inactive': 'bg-gray-500/20 text-gray-400',
    'Suspended': 'bg-red-500/20 text-red-400',
};

const AdministrationTab: React.FC<AdministrationTabProps> = ({ onSelectAdmin }) => {
  const { administrators, handleAddAdmin, handleDeleteAdmin } = useDataContext();
  const confirm = useConfirmation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

  const filteredAdmins = useMemo(() => {
    if (!adminSearchTerm.trim()) {
        return administrators;
    }
    const lowercasedFilter = adminSearchTerm.toLowerCase();
    return administrators.filter(admin =>
        admin.name.toLowerCase().includes(lowercasedFilter) ||
        admin.email.toLowerCase().includes(lowercasedFilter)
    );
  }, [administrators, adminSearchTerm]);

  const handleAddAdminClick = useCallback((newAdminData: Parameters<typeof handleAddAdmin>[0]) => {
    handleAddAdmin(newAdminData);
    setIsModalOpen(false);
  }, [handleAddAdmin]);

  const toggleActionMenu = useCallback((id: number) => {
    setActiveActionMenu(prev => prev === id ? null : id);
  }, []);

  const handleSelectAndCloseMenu = useCallback((admin: Administrator) => {
    onSelectAdmin(admin);
    setActiveActionMenu(null);
  }, [onSelectAdmin]);

  const handleDeleteAndCloseMenu = useCallback(async (admin: Administrator) => {
    setActiveActionMenu(null);
    const confirmed = await confirm({
        title: `Delete ${admin.name}?`,
        message: 'Are you sure you want to delete this administrator? This action cannot be undone.',
        confirmText: 'Delete',
        confirmVariant: 'danger'
    });
    if (confirmed) {
        handleDeleteAdmin(admin.id);
    }
  }, [confirm, handleDeleteAdmin]);
  
  const adminColumns: ColumnDefinition<Administrator>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (admin) => (
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src={admin.avatarUrl} alt={admin.name} />
          <div>
            <div className="font-semibold text-white">{admin.name}</div>
            <div className="text-xs text-gray-400">{admin.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role' },
    {
      key: 'status',
      header: 'Status',
      render: (admin) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${ADMIN_STATUS_STYLES[admin.status]}`}>
          {admin.status}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (admin) => <span className="whitespace-nowrap">{admin.lastLogin.toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (admin) => (
        <div className="relative inline-block text-right">
            <button onClick={() => toggleActionMenu(admin.id)} className="p-2 rounded-full hover:bg-gray-700" aria-label="Actions">
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {activeActionMenu === admin.id && (
                <div 
                  className="absolute right-0 mt-2 w-40 bg-[#161B22] border border-gray-700 rounded-md shadow-lg z-10 origin-top-right transition-all duration-100 ease-out animate-fade-in-sm"
                >
                    <button onClick={() => handleSelectAndCloseMenu(admin)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700">
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4"/>
                        View Profile
                    </button>
                    <button onClick={() => handleDeleteAndCloseMenu(admin)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
                        Delete
                    </button>
                </div>
            )}
        </div>
      )
    }
  ];

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Manage Administrator Accounts</h3>
            <p className="text-sm text-gray-400">Add, remove, or edit administrator privileges.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} leftIcon={faPlus}>
            Add Administrator
          </Button>
        </div>
        <div className="relative mb-4">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
                type="text"
                placeholder="Search administrators..."
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                className="w-full max-w-sm bg-[#0D1117] border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
        </div>
        <DataTable columns={adminColumns} data={filteredAdmins} />
      </Card>
      {isModalOpen && (
        <AdminManagementModal
          mode="add"
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddAdminClick}
        />
      )}
    </>
  );
};

export default AdministrationTab;
import React from 'react';
import Modal from './ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faUsersCog, faReceipt, faTasks, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
// Fix: Use relative path for local module import.
import type { ManagedApp, Administrator, Transaction, Task, SearchResults, Notification } from '../types';

interface SearchResultsModalProps {
    query: string;
    results: SearchResults;
    onClose: () => void;
    onNavigate: (view: string, params?: Record<string, any>) => void;
}

const ResultRow: React.FC<{
    icon: any;
    title: string;
    subtitle: string;
    onClick: () => void;
}> = ({ icon, title, subtitle, onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-[#0D1117] transition-colors duration-150"
    >
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#161B22] rounded-md">
            <FontAwesomeIcon icon={icon} className="text-gray-400" />
        </div>
        <div className="overflow-hidden">
            <p className="font-semibold text-white truncate">{title}</p>
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
    </div>
);

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ query, results, onClose, onNavigate }) => {
    
    const handleAppClick = (app: ManagedApp) => {
        onNavigate('Apps', { appId: app.id });
        onClose();
    };
    
    const handleAdminClick = (admin: Administrator) => {
        onNavigate('Settings', { adminId: admin.id });
        onClose();
    };

    const handleTransactionClick = (transaction: Transaction) => {
        onNavigate('Finance');
        onClose();
    };

    const handleTaskClick = (task: Task) => {
        onNavigate('Calendar');
        onClose();
    };

    const totalResults = results.apps.length + results.administrators.length + results.transactions.length + results.tasks.length + results.notifications.length;

    return (
        <Modal title={`Search Results for "${query}"`} onClose={onClose}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {totalResults > 0 ? (
                    <>
                        {results.apps.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-2">Applications</h3>
                                <div className="space-y-1">
                                    {results.apps.map(app => (
                                        <ResultRow key={`app-${app.id}`} icon={faCubes} title={app.name} subtitle={app.platform} onClick={() => handleAppClick(app)} />
                                    ))}
                                </div>
                            </section>
                        )}
                        {results.administrators.length > 0 && (
                             <section>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-2">Administrators</h3>
                                <div className="space-y-1">
                                    {results.administrators.map(admin => (
                                        <ResultRow key={`admin-${admin.id}`} icon={faUsersCog} title={admin.name} subtitle={admin.email} onClick={() => handleAdminClick(admin)} />
                                    ))}
                                </div>
                            </section>
                        )}
                         {results.transactions.length > 0 && (
                             <section>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-2">Transactions</h3>
                                <div className="space-y-1">
                                    {results.transactions.map(t => (
                                        <ResultRow key={`t-${t.id}`} icon={faReceipt} title={t.description} subtitle={`$${t.amount.toFixed(2)} on ${t.date.toLocaleDateString()}`} onClick={() => handleTransactionClick(t)} />
                                    ))}
                                </div>
                            </section>
                        )}
                         {results.tasks.length > 0 && (
                             <section>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-2">Tasks</h3>
                                <div className="space-y-1">
                                    {results.tasks.map(task => (
                                        <ResultRow key={`task-${task.id}`} icon={faTasks} title={task.title} subtitle={`Due: ${task.dueDate.toLocaleDateString()}`} onClick={() => handleTaskClick(task)} />
                                    ))}
                                </div>
                            </section>
                        )}
                        {results.notifications.length > 0 && (
                             <section>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-2">Notifications</h3>
                                <div className="space-y-1">
                                    {results.notifications.map(n => (
                                        <ResultRow key={`n-${n.id}`} icon={faBell} title={n.title} subtitle={n.description} onClick={onClose} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <FontAwesomeIcon icon={faSearch} className="text-4xl mb-4" />
                        <h3 className="font-semibold">No Results Found</h3>
                        <p className="text-sm">Try a different search term.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default SearchResultsModal;

import React from 'react';
import type { Deployment } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

interface DeploymentsTabProps {
    deployments: Deployment[];
}

const DeploymentsTab: React.FC<DeploymentsTabProps> = ({ deployments }) => {
    return (
        <div className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-[#161B22]">
                    <tr>
                        <th className="px-6 py-3">Version</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Timestamp</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {deployments.length > 0 ? (
                        deployments.map(d => (
                            <tr key={d.id}>
                                <td className="px-6 py-4 font-mono font-semibold">{d.version}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${d.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">{d.timestamp.toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center py-16 text-gray-500">
                                <FontAwesomeIcon icon={faRocket} className="text-5xl mb-4" />
                                <h3 className="font-semibold text-lg text-gray-400">No Deployments Found</h3>
                                <p>This application has not been deployed yet.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeploymentsTab;
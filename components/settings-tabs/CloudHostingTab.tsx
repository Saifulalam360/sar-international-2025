import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faFire, faCubes, faGlobe, faTerminal, faPlus, faSpinner, faTrash, faCopy, faCheck, faSync } from '@fortawesome/free-solid-svg-icons';
import type { CloudProvider, CustomDomain } from '../../types';
import { useDataContext } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import Card from '../ui/Card';
import CollapsibleCard from '../ui/CollapsibleCard';
import Button from '../ui/Button';
import DomainVerificationModal from '../DomainVerificationModal';

const DOMAIN_STATUS_STYLES: Record<CustomDomain['status'], string> = {
    'Verified': 'bg-green-500/20 text-green-400',
    'Pending': 'bg-yellow-500/20 text-yellow-400',
    'Verifying': 'bg-blue-500/20 text-blue-400',
};

const CloudHostingTab: React.FC = () => {
    const { customDomains, handleAddDomain, handleDeleteDomain, handleVerifyDomain } = useDataContext();
    const { addToast } = useToast();
    const confirm = useConfirmation();

    const [cloudProviders, setCloudProviders] = useState<Record<string, CloudProvider>>({
        render: { name: 'Render', description: 'Deploy and scale applications with auto-deploys from Git.', connected: true, projectUrl: 'sar-international-dashboard.onrender.com', icon: faServer },
        firebase: { name: 'Firebase', description: 'Build and run successful apps backed by Google.', connected: false, projectUrl: null, icon: faFire },
        vercel: { name: 'Vercel', description: 'Develop, preview, and ship with the frontend cloud.', connected: false, projectUrl: null, icon: faCubes },
        netlify: { name: 'Netlify', description: 'The fastest way to build the fastest sites.', connected: false, projectUrl: null, icon: faCubes },
        awsAmplify: { name: 'AWS Amplify', description: 'Build, deploy, and host full-stack applications.', connected: false, projectUrl: null, icon: faServer },
    });
      
    const [newDomainName, setNewDomainName] = useState('');
    const [domainToVerify, setDomainToVerify] = useState<CustomDomain | null>(null);
    const [deploymentToken, setDeploymentToken] = useState('sardt_live_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456');
    const [copiedToken, setCopiedToken] = useState(false);

    const handleConnectProvider = async (key: string) => {
        addToast({ message: `Connecting to ${cloudProviders[key].name}...`, type: 'info' });
        await new Promise(res => setTimeout(res, 1500));
        setCloudProviders(prev => ({
            ...prev,
            [key]: { ...prev[key], connected: true, projectUrl: `${key}-project.dev` }
        }));
        addToast({ message: `Successfully connected to ${cloudProviders[key].name}!`, type: 'success' });
    };
    
    const handleAddDomainFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomainName.trim() || !newDomainName.includes('.')) {
            addToast({ message: 'Please enter a valid domain name.', type: 'error' });
            return;
        }
        handleAddDomain(newDomainName);
        addToast({ message: `Domain "${newDomainName}" added for verification.`, type: 'success' });
        setNewDomainName('');
    };

    const handleDeleteDomainClick = async (domain: CustomDomain) => {
        const confirmed = await confirm({
            title: `Delete ${domain.domainName}?`,
            message: 'Are you sure you want to delete this domain? This action cannot be undone.',
            confirmText: 'Delete Domain',
            confirmVariant: 'danger'
        });
        if (confirmed) {
            handleDeleteDomain(domain.id);
            addToast({ message: `Domain ${domain.domainName} deleted.`, type: 'info' });
        }
    };
    
    const generateRandomString = (length: number) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleRegenerateToken = async () => {
        const confirmed = await confirm({
            title: 'Regenerate Token?',
            message: 'Are you sure? The old deployment token will be permanently invalidated.',
            confirmText: 'Regenerate'
        });
        if (confirmed) {
            setDeploymentToken(`sardt_live_${generateRandomString(32)}`);
            addToast({ message: 'Deployment token regenerated successfully.', type: 'success' });
        }
    };
    
    const handleCopyToken = () => {
        navigator.clipboard.writeText(deploymentToken).then(() => {
            setCopiedToken(true);
            addToast({ message: 'Deployment token copied to clipboard!', type: 'info' });
            setTimeout(() => setCopiedToken(false), 2000);
        });
    };

    return (
        <>
        <div className="space-y-6">
            <Card title="Cloud Hosting Providers" icon={faServer} subtitle="Connect your dashboard to a cloud provider for seamless deployment.">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(cloudProviders).map(key => {
                        const provider = cloudProviders[key as keyof typeof cloudProviders];
                        return (
                            <CollapsibleCard
                                key={key}
                                title={provider.name}
                                icon={provider.icon}
                                defaultOpen={false}
                            >
                                <p className="text-sm text-gray-400 mb-4">{provider.description}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                    {provider.connected ? (
                                        <div className="text-sm text-green-400 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Connected
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">Not Connected</div>
                                    )}
                                    <Button
                                        disabled={provider.connected}
                                        onClick={() => handleConnectProvider(key)}
                                        className="text-xs py-1 px-3"
                                    >
                                        {provider.connected ? 'Connected' : 'Connect'}
                                    </Button>
                                </div>
                                 {provider.connected && provider.projectUrl && (
                                    <div className="mt-2 text-xs text-gray-400">
                                        Project URL: <a href={`https://${provider.projectUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate block" title={provider.projectUrl}>{provider.projectUrl}</a>
                                    </div>
                                )}
                            </CollapsibleCard>
                        );
                    })}
                </div>
            </Card>

            <CollapsibleCard title="Custom Domains" icon={faGlobe}>
                <form onSubmit={handleAddDomainFormSubmit} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <input
                        type="text"
                        value={newDomainName}
                        onChange={(e) => setNewDomainName(e.target.value)}
                        placeholder="e.g., app.yourdomain.com"
                        className="flex-1 w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                    <Button type="submit" leftIcon={faPlus} className="w-full sm:w-auto">Add Domain</Button>
                </form>
                <div className="space-y-3">
                    {customDomains.map(domain => (
                        <div key={domain.id} className="flex justify-between items-center bg-[#161B22] p-3 rounded-lg border border-gray-800">
                            <div>
                                <p className="font-semibold text-white">{domain.domainName}</p>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${DOMAIN_STATUS_STYLES[domain.status]}`}>{domain.status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {domain.status === 'Pending' && <Button variant="secondary" onClick={() => setDomainToVerify(domain)}>Verify</Button>}
                                {domain.status === 'Verifying' && <Button variant="secondary" disabled><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />Verifying</Button>}
                                <Button variant="ghost" className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteDomainClick(domain)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleCard>

            <CollapsibleCard title="Streamline with CLI" icon={faTerminal} subtitle="Use the SAR International CLI to deploy and manage your applications from your local terminal.">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Deployment Token</label>
                    <div className="flex items-center gap-2 bg-[#161B22] border border-gray-700 rounded-lg p-2">
                        <input type="text" value={deploymentToken} readOnly className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-mono text-gray-400" />
                        <Button variant="secondary" onClick={handleCopyToken} leftIcon={copiedToken ? faCheck : faCopy}>{copiedToken ? 'Copied' : 'Copy'}</Button>
                        <Button variant="secondary" onClick={handleRegenerateToken} leftIcon={faSync}>Regenerate</Button>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Example Usage</label>
                    <div className="bg-[#010409] font-mono text-sm text-gray-300 p-4 rounded-lg border border-gray-800">
                        <span className="text-purple-400">sar-cli</span> deploy --token {deploymentToken}
                    </div>
                </div>
            </CollapsibleCard>
        </div>
        {domainToVerify && (
            <DomainVerificationModal
                domain={domainToVerify}
                onClose={() => setDomainToVerify(null)}
                onVerify={(domainId) => {
                    handleVerifyDomain(domainId);
                    setDomainToVerify(null);
                }}
            />
        )}
        </>
    );
};

export default CloudHostingTab;
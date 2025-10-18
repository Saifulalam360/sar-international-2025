import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFolder, faChartLine, faMapMarkedAlt, faBrain, faCodeBranch, faRobot, faCogs } from '@fortawesome/free-solid-svg-icons';
import type { Integration } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CollapsibleCard from '../ui/CollapsibleCard';

const IntegrationsTab: React.FC = () => {
    const { addToast } = useToast();
    const confirm = useConfirmation();
    
    const [integrations, setIntegrations] = useState<Record<string, Integration>>({
        gmail: { name: 'Gmail', description: 'Sync emails and contacts directly into your workflow.', connected: true, account: 'saiful@example.com', icon: faEnvelope },
        googleDrive: { name: 'Google Drive', description: 'Access and manage your cloud storage files.', connected: true, account: 'saiful@example.com', icon: faFolder },
        googleAnalytics: { name: 'Google Analytics', description: 'Track website traffic and user engagement.', connected: false, account: null, icon: faChartLine },
        googleMaps: { name: 'Google Maps', description: 'Embed maps and location services.', connected: false, account: null, icon: faMapMarkedAlt },
        github: { name: 'GitHub', description: 'Connect repositories and track code changes.', connected: true, account: 'sar-international', icon: faCodeBranch },
        openai: { name: 'OpenAI', description: 'Leverage powerful AI models like GPT-4.', connected: true, account: 'API Key Added', icon: faRobot },
        gemini: { name: 'Google Gemini', description: 'Access Google\'s next-generation AI models.', connected: false, account: null, icon: faBrain },
        googleAiPro: { name: 'Google AI Pro', description: 'Utilize advanced AI capabilities from Google.', connected: false, account: null, icon: faBrain },
        veo: { name: 'Google Veo', description: 'Generate high-quality videos from text.', connected: false, account: null, icon: faBrain },
        flow: { name: 'Flow', description: 'Automate tasks and create complex workflows.', connected: false, account: null, icon: faCogs },
        huggingFace: { name: 'Hugging Face', description: 'Integrate a wide range of open-source models.', connected: false, account: null, icon: faRobot },
        deepseek: { name: 'DeepSeek', description: 'Connect with DeepSeek\'s coding AI models.', connected: false, account: null, icon: faRobot },
        claude: { name: 'Claude', description: 'Utilize Anthropic\'s conversational AI.', connected: false, account: null, icon: faRobot },
        grok: { name: 'Grok', description: 'Integrate xAI\'s real-time conversational AI.', connected: false, account: null, icon: faRobot },
    });

    const handleToggleIntegration = async (key: keyof typeof integrations) => {
        const current = integrations[key];
        const isConnecting = !current.connected;
        
        if (isConnecting) {
          addToast({ message: `Connecting to ${current.name}...`, type: 'info' });
          // Simulate API call
          await new Promise(res => setTimeout(res, 1000));
          setIntegrations(prev => ({
            ...prev,
            [key]: { ...current, connected: true, account: current.name.toLowerCase().includes('google') ? 'saiful@example.com' : 'API Key Configured' },
          }));
          addToast({ message: `${current.name} connected successfully!`, type: 'success' });
        } else {
          const confirmed = await confirm({
            title: `Disconnect from ${current.name}?`,
            message: 'Are you sure you want to disconnect this integration?',
            confirmText: 'Disconnect'
          });
          if (confirmed) {
            setIntegrations(prev => ({
              ...prev,
              [key]: { ...current, connected: false, account: null },
            }));
            addToast({ message: `${current.name} disconnected.`, type: 'info' });
          }
        }
    };

    return (
        <Card title="Connect Your Apps" subtitle="Integrate third-party services to extend the functionality of your dashboard.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(integrations).map(key => {
                const details = integrations[key as keyof typeof integrations];
                return (
                    <CollapsibleCard
                        key={key}
                        title={details.name}
                        icon={details.icon}
                        defaultOpen={false}
                    >
                        <p className="text-sm text-gray-400 mb-4">{details.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                          <div className="flex-1 overflow-hidden pr-2">
                            {details.connected ? (
                              <>
                                <div className="text-sm text-green-400 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  Connected
                                </div>
                                {details.account && (
                                  <p className="text-xs text-gray-500 mt-1 truncate" title={details.account}>{details.account}</p>
                                )}
                              </>
                            ) : (
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                                Not Connected
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleToggleIntegration(key as keyof typeof integrations)}
                            variant={details.connected ? 'danger' : 'primary'}
                            className="text-xs py-1 px-3"
                          >
                            {details.connected ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                    </CollapsibleCard>
                );
              })}
            </div>
        </Card>
    );
};

export default IntegrationsTab;
import React, { useState, useEffect } from 'react';
// Fix: Use relative path for local module import.
import type { Conversation } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPen, faSave, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from './ui/Button';

interface ContactDetailsProps {
    contact: Conversation;
    onUpdate: (updatedContact: Conversation) => void;
    onBack: () => void;
}

const DetailRow: React.FC<{ icon: any; value: string }> = ({ icon, value }) => (
    <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={icon} className="text-gray-500 w-4" />
        <span className="text-gray-300">{value}</span>
    </div>
);

const EditInput: React.FC<{ name: keyof Conversation; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ name, value, onChange }) => (
    <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0D1117] border border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
    />
);


const ContactDetails: React.FC<ContactDetailsProps> = ({ contact, onUpdate, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableContact, setEditableContact] = useState(contact);
    
    useEffect(() => {
        setEditableContact(contact);
        setIsEditing(false);
    }, [contact]);

    // Fix: Add type safety by checking the input name before setting state to avoid assigning a string to a non-string property.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'contactName' || name === 'email' || name === 'phone') {
            setEditableContact(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        onUpdate(editableContact);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableContact(contact);
        setIsEditing(false);
    };

    return (
        <aside className="w-full lg:w-80 border-l border-gray-700 flex flex-col h-full bg-[#161B22] lg:bg-transparent">
             {/* Mobile Header */}
            <div className="lg:hidden w-full flex items-center p-4 border-b border-gray-700 flex-shrink-0">
                <button onClick={onBack} className="text-gray-400 hover:text-white p-2 -ml-2">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h3 className="text-lg font-bold mx-auto">Contact Info</h3>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            <div className="p-6 w-full overflow-y-auto flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <img src={contact.avatarUrl} alt={contact.contactName} className="w-24 h-24 rounded-full mb-4" />
                    {isEditing ? (
                        <input
                            type="text"
                            name="contactName"
                            value={editableContact.contactName}
                            onChange={handleInputChange}
                            className="w-full bg-[#0D1117] border border-gray-600 rounded-md py-1 px-2 text-xl text-center font-bold focus:outline-none focus:ring-1 focus:ring-purple-500 mb-1"
                        />
                    ) : (
                        <h3 className="text-xl font-bold">{contact.contactName}</h3>
                    )}
                    <p className="text-sm text-gray-400">Lead Designer</p>

                    <div className="mt-4">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button onClick={handleSave} leftIcon={faSave} className="text-xs !px-3 !py-1.5">Save</Button>
                                <Button onClick={handleCancel} leftIcon={faTimes} variant="secondary" className="text-xs !px-3 !py-1.5">Cancel</Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} leftIcon={faPen} variant="secondary" className="text-xs !px-3 !py-1.5">Edit Contact</Button>
                        )}
                    </div>
                </div>

                <div className="w-full border-t border-gray-700 my-6"></div>
                <div className="w-full space-y-4 text-sm">
                    {isEditing ? (
                        <>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 w-4" />
                                <EditInput name="email" value={editableContact.email || ''} onChange={handleInputChange} />
                            </div>
                             <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faPhone} className="text-gray-500 w-4" />
                                <EditInput name="phone" value={editableContact.phone || ''} onChange={handleInputChange} />
                            </div>
                        </>
                    ) : (
                        <>
                            <DetailRow icon={faEnvelope} value={contact.email || 'No email provided'} />
                            <DetailRow icon={faPhone} value={contact.phone || 'No phone provided'} />
                        </>
                    )}
                    <DetailRow icon={faMapMarkerAlt} value="New York, USA" />
                </div>
            </div>
        </aside>
    );
};

export default ContactDetails;
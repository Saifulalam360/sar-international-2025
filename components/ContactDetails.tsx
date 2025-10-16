
import React from 'react';
import type { Conversation } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface ContactDetailsProps {
    contact: Conversation;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact }) => {
    return (
        <aside className="w-80 p-6 border-l border-gray-700 flex flex-col items-center">
            <img src={contact.avatarUrl} alt={contact.contactName} className="w-24 h-24 rounded-full mb-4" />
            <h3 className="text-xl font-bold">{contact.contactName}</h3>
            <p className="text-sm text-gray-400">Lead Designer</p>
            <div className="w-full border-t border-gray-700 my-6"></div>
            <div className="w-full space-y-4 text-sm">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 w-4" />
                    <span className="text-gray-300">jane.cooper@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-500 w-4" />
                    <span className="text-gray-300">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 w-4" />
                    <span className="text-gray-300">New York, USA</span>
                </div>
            </div>
        </aside>
    );
};

export default ContactDetails;

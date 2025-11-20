/**
 * Consultations Page
 * View active and past consultations
 */

import { useState } from 'react';
import { MessageCircle, Phone, Video, Calendar } from 'lucide-react';
import ConsultationChat from '@/components/organisms/ConsultationChat/ConsultationChat';
import { toast, logger } from '@/utils';

interface Consultation {
    id: string;
    doctorName?: string;
    patientName?: string;
    startedAt: Date;
    status: 'active' | 'completed' | 'scheduled';
    type: 'text' | 'phone' | 'video';
    notes?: string;
}

// Mock consultations
const MOCK_CONSULTATIONS: Consultation[] = [
    {
        id: 'consult-001',
        doctorName: 'Dr. Smith',
        patientName: 'John Anderson',
        startedAt: new Date(Date.now() - 60 * 60000),
        status: 'active',
        type: 'text',
        notes: 'Consultation regarding persistent headaches',
    },
    {
        id: 'consult-002',
        doctorName: 'Dr. Johnson',
        patientName: 'Mary Davis',
        startedAt: new Date(Date.now() - 24 * 60 * 60000),
        status: 'completed',
        type: 'video',
        notes: 'Follow-up on hypertension treatment',
    },
    {
        id: 'consult-003',
        doctorName: 'Dr. Brown',
        patientName: 'Robert Wilson',
        startedAt: new Date(Date.now() + 2 * 60 * 60000),
        status: 'scheduled',
        type: 'phone',
        notes: 'Diabetes management review',
    },
];

export default function Consultations() {
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(
        MOCK_CONSULTATIONS[0]
    );
    const currentUserType: 'doctor' | 'patient' = 'patient';

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'phone':
                return <Phone size={16} />;
            case 'video':
                return <Video size={16} />;
            case 'text':
            default:
                return <MessageCircle size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
                <p className="text-gray-600 mt-1">
                    Manage your consultations with healthcare providers
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Consultations List */}
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {MOCK_CONSULTATIONS.length} Consultations
                    </h2>
                    {MOCK_CONSULTATIONS.map((consultation) => (
                        <button
                            key={consultation.id}
                            onClick={() => setSelectedConsultation(consultation)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedConsultation?.id === consultation.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">
                                    {consultation.doctorName || consultation.patientName}
                                </h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(consultation.status)}`}>
                                    {consultation.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                                {getTypeIcon(consultation.type)}
                                <span className="capitalize">{consultation.type}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{consultation.notes}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar size={14} />
                                {consultation.startedAt.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Chat Area */}
                {selectedConsultation && (
                    <div className="lg:col-span-2 h-96 lg:h-auto">
                        <ConsultationChat
                            consultationId={selectedConsultation.id}
                            currentUserType={currentUserType}
                            currentUserName={currentUserType === 'patient' ? 'John Anderson' : 'Dr. Smith'}
                            otherUserName={
                                currentUserType === 'patient'
                                    ? selectedConsultation.doctorName || 'Doctor'
                                    : selectedConsultation.patientName || 'Patient'
                            }
                            onCall={(type) => {
                                logger.debug(`Starting ${type} call`);
                                toast.info(`${type.toUpperCase()} call initiated`);
                            }}
                            onSendMessage={(message) => {
                                logger.debug('Message sent:', message);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Consultation Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Provide detailed descriptions of your symptoms</li>
                    <li>• Share relevant medical history and medications</li>
                    <li>• Ask questions about treatment and follow-up care</li>
                    <li>• Keep records of all consultations for reference</li>
                </ul>
            </div>
        </div>
    );
}

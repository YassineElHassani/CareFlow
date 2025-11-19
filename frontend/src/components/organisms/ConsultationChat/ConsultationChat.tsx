/**
 * Consultation Chat Component
 * Real-time consultation between doctors and patients
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';
import Button from '@/components/atoms/Button';

export interface Message {
    id: string;
    sender: 'doctor' | 'patient';
    senderName: string;
    senderAvatar?: string;
    text: string;
    timestamp: Date;
    attachments?: Attachment[];
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document' | 'file';
}

interface ConsultationChatProps {
    consultationId: string;
    currentUserType: 'doctor' | 'patient';
    currentUserName: string;
    otherUserName: string;
    onSendMessage?: (message: string) => void;
    onCall?: (type: 'phone' | 'video') => void;
}

// Mock messages for demonstration
const MOCK_MESSAGES: Message[] = [
    {
        id: 'msg-001',
        sender: 'patient',
        senderName: 'John Anderson',
        text: 'Hello Dr. Smith, I have been experiencing persistent headaches for the past week.',
        timestamp: new Date(Date.now() - 60 * 60000),
    },
    {
        id: 'msg-002',
        sender: 'doctor',
        senderName: 'Dr. Smith',
        text: 'Hello John! Thank you for reaching out. Can you describe the nature of the headaches? Are they continuous or intermittent?',
        timestamp: new Date(Date.now() - 55 * 60000),
    },
    {
        id: 'msg-003',
        sender: 'patient',
        senderName: 'John Anderson',
        text: 'They are intermittent, usually starting in the morning and getting worse by afternoon. The pain is usually on the right side of my head.',
        timestamp: new Date(Date.now() - 50 * 60000),
    },
    {
        id: 'msg-004',
        sender: 'doctor',
        senderName: 'Dr. Smith',
        text: 'I see. Have you noticed any triggers - like stress, certain foods, or screen time? Any nausea or sensitivity to light?',
        timestamp: new Date(Date.now() - 45 * 60000),
    },
    {
        id: 'msg-005',
        sender: 'patient',
        senderName: 'John Anderson',
        text: 'Yes, I notice it gets worse when I work on the computer for long periods. Sometimes I feel a bit nauseous but no light sensitivity.',
        timestamp: new Date(Date.now() - 30 * 60000),
    },
    {
        id: 'msg-006',
        sender: 'doctor',
        senderName: 'Dr. Smith',
        text: 'Based on your description, this sounds like tension headaches. I recommend:\n1. Taking breaks from screen time\n2. Practicing relaxation techniques\n3. Staying hydrated\n\nLet\'s schedule an appointment for a physical examination if symptoms persist.',
        timestamp: new Date(Date.now() - 15 * 60000),
    },
];

export default function ConsultationChat({
    currentUserType,
    currentUserName,
    otherUserName,
    onSendMessage,
    onCall,
}: ConsultationChatProps) {
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            sender: currentUserType,
            senderName: currentUserName,
            text: newMessage,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, message]);
        onSendMessage?.(newMessage);
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex items-center justify-between">
                <div>
                    <h2 className="font-semibold">{otherUserName}</h2>
                    <p className="text-sm opacity-90">
                        {currentUserType === 'patient' ? 'Doctor' : 'Patient'} Consultation
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onCall?.('phone')}
                        className="p-2 hover:bg-blue-500 rounded-full transition"
                    >
                        <Phone size={20} />
                    </button>
                    <button
                        onClick={() => onCall?.('video')}
                        className="p-2 hover:bg-blue-500 rounded-full transition"
                    >
                        <Video size={20} />
                    </button>
                    <button className="p-2 hover:bg-blue-500 rounded-full transition">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === currentUserType ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === currentUserType
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                        >
                            <p className="text-sm font-semibold mb-1">{message.senderName}</p>
                            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                            <p
                                className={`text-xs mt-2 ${message.sender === currentUserType
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                                    }`}
                            >
                                {message.timestamp.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="flex gap-2">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Shift+Enter for new line)"
                        className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => { }}
                            className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Attach file"
                        >
                            <Paperclip size={20} />
                        </Button>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3"
                        >
                            <Send size={20} />
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-gray-500">
                    Messages are secure and encrypted. Consultation history is maintained for medical records.
                </p>
            </div>
        </div>
    );
}

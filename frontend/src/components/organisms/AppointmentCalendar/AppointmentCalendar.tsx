/**
 * Appointment Calendar Component
 * Interactive calendar for viewing and scheduling appointments
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import Button from '@/components/atoms/Button';

interface Appointment {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    patient?: string;
    doctor?: string;
    type: 'consultation' | 'follow-up' | 'preventive' | 'specialist' | 'surgery' | 'other';
    status: 'scheduled' | 'completed' | 'cancelled';
    location?: string;
}

interface AppointmentCalendarProps {
    appointments?: Appointment[];
    onDateSelect?: (date: string) => void;
    onAppointmentClick?: (appointment: Appointment) => void;
    onCreateClick?: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// Mock appointments for demonstration
const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'apt-001',
        title: 'Routine Checkup',
        date: '2024-02-15',
        time: '09:00',
        patient: 'John Anderson',
        doctor: 'Dr. Smith',
        type: 'consultation',
        status: 'scheduled',
        location: 'Room 101',
    },
    {
        id: 'apt-002',
        title: 'Hypertension Follow-up',
        date: '2024-02-15',
        time: '14:30',
        patient: 'Mary Johnson',
        doctor: 'Dr. Johnson',
        type: 'follow-up',
        status: 'scheduled',
        location: 'Room 203',
    },
    {
        id: 'apt-003',
        title: 'Diabetes Screening',
        date: '2024-02-16',
        time: '10:00',
        patient: 'Robert Wilson',
        doctor: 'Dr. Brown',
        type: 'preventive',
        status: 'scheduled',
        location: 'Lab 1',
    },
    {
        id: 'apt-004',
        title: 'Surgery Consultation',
        date: '2024-02-17',
        time: '11:30',
        patient: 'Sarah Davis',
        doctor: 'Dr. Miller',
        type: 'specialist',
        status: 'scheduled',
        location: 'Surgery Wing',
    },
    {
        id: 'apt-005',
        title: 'Post-op Checkup',
        date: '2024-02-14',
        time: '13:00',
        patient: 'James Martin',
        doctor: 'Dr. Taylor',
        type: 'follow-up',
        status: 'completed',
        location: 'Room 105',
    },
];

const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        consultation: 'bg-blue-100 text-blue-800 border-blue-300',
        'follow-up': 'bg-purple-100 text-purple-800 border-purple-300',
        preventive: 'bg-green-100 text-green-800 border-green-300',
        specialist: 'bg-orange-100 text-orange-800 border-orange-300',
        surgery: 'bg-red-100 text-red-800 border-red-300',
        other: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[type] || colors.other;
};

const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        scheduled: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export default function AppointmentCalendar({
    appointments = MOCK_APPOINTMENTS,
    onDateSelect,
    onAppointmentClick,
    onCreateClick,
}: AppointmentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // February 2024
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (year: number, month: number, day: number): string => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays: (number | null)[] = Array(firstDay).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (day: number) => {
        const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(dateStr);
        onDateSelect?.(dateStr);
    };

    const selectedDateAppointments = selectedDate
        ? appointments.filter((apt) => apt.date === selectedDate)
        : [];

    return (
        <div className="space-y-6">
            {/* Calendar Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Month/Year Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100"
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <Button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100"
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {DAYS.map((day) => (
                        <div key={day} className="text-center font-semibold text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dayAppointments = appointments.filter((apt) => apt.date === dateStr);
                        const isSelected = selectedDate === dateStr;

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`aspect-square p-2 rounded-lg border-2 transition-all ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    } ${dayAppointments.length > 0 ? 'bg-blue-50' : 'bg-white'}`}
                            >
                                <div className="h-full flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{day}</span>
                                    {dayAppointments.length > 0 && (
                                        <div className="mt-1 flex-1 flex items-end">
                                            <div className="flex gap-1 flex-wrap">
                                                {dayAppointments.slice(0, 2).map((apt) => (
                                                    <div
                                                        key={apt.id}
                                                        className="w-1.5 h-1.5 rounded-full bg-blue-500"
                                                    />
                                                ))}
                                                {dayAppointments.length > 2 && (
                                                    <span className="text-xs text-gray-600">+{dayAppointments.length - 2}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Appointments for Selected Date */}
            {selectedDate && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h3>
                        <Button onClick={onCreateClick} className="bg-blue-600 text-white hover:bg-blue-700">
                            New Appointment
                        </Button>
                    </div>

                    {selectedDateAppointments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600">No appointments scheduled for this date</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedDateAppointments
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((appointment) => (
                                    <button
                                        key={appointment.id}
                                        onClick={() => onAppointmentClick?.(appointment)}
                                        className="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-left"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{appointment.title}</h4>
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-1 rounded border ${getTypeColor(
                                                            appointment.type
                                                        )}`}
                                                    >
                                                        {appointment.type}
                                                    </span>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>{appointment.time}</span>
                                                    </div>
                                                    {appointment.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={16} />
                                                            <span>{appointment.location}</span>
                                                        </div>
                                                    )}
                                                    {appointment.patient && (
                                                        <div className="flex items-center gap-2">
                                                            <User size={16} />
                                                            <span>{appointment.patient}</span>
                                                        </div>
                                                    )}
                                                    {appointment.doctor && (
                                                        <div className="flex items-center gap-2">
                                                            <User size={16} />
                                                            <span>Dr. {appointment.doctor}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

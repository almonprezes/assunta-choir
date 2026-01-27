import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Music, Calendar, Users, FileAudio, FileText, Clock, MapPin, TrendingUp } from 'lucide-react';

const fetchDashboardData = async () => {
    const [rehearsalsRes, recordingsRes, sheetMusicRes] = await Promise.all([
        axios.get('/api/rehearsals'),
        axios.get('/api/recordings'),
        axios.get('/api/sheet-music')
    ]);

    return {
        rehearsals: rehearsalsRes.data,
        recordings: recordingsRes.data,
        sheetMusic: sheetMusicRes.data
    };
};

const Dashboard = () => {
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery(
        'dashboardData',
        fetchDashboardData,
        {
            refetchOnWindowFocus: false,
        }
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

        if (isToday) return 'Dziś';
        if (isTomorrow) return 'Jutro';

        return date.toLocaleDateString('pl-PL', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const upcomingRehearsals = data?.rehearsals
        ?.filter(rehearsal => new Date(rehearsal.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3) || [];

    const recentRecordings = data?.recordings?.slice(0, 3) || [];
    const recentSheetMusic = data?.sheetMusic?.slice(0, 3) || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Wystąpił błąd podczas ładowania danych.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Witaj, {user.firstName}!
                            </h1>
                            <p className="opacity-90 mt-1">
                                Panel członka chóru Assunta
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-75">Twój głos</p>
                            <p className="text-lg font-semibold">
                                {user.voicePart || 'Nieokreślony'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {upcomingRehearsals.length}
                        </h3>
                        <p className="text-gray-600">Nadchodzące próby</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                                <FileAudio className="h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {data?.recordings?.length || 0}
                        </h3>
                        <p className="text-gray-600">Dostępne nagrania</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                <FileText className="h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {data?.sheetMusic?.length || 0}
                        </h3>
                        <p className="text-gray-600">Dostępne partytury</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {user.role === 'admin' ? 'Admin' : 'Członek'}
                        </h3>
                        <p className="text-gray-600">Twoja rola</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Nadchodzące próby
                                </h2>
                                <a
                                    href="/próby"
                                    className="text-choir-primary hover:text-choir-secondary font-medium"
                                >
                                    Zobacz wszystkie
                                </a>
                            </div>

                            {upcomingRehearsals.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Brak nadchodzących prób</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingRehearsals.map((rehearsal) => (
                                        <div key={rehearsal.id} className="border-l-4 border-choir-primary pl-4 py-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {rehearsal.title}
                                                    </h3>
                                                    {rehearsal.description && (
                                                        <p className="text-gray-600 text-sm mt-1">
                                                            {rehearsal.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {formatDate(rehearsal.date)} {formatTime(rehearsal.date)}
                                                        </div>
                                                        {rehearsal.location && (
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                {rehearsal.location}
                                                            </div>
                                                        )}
                                                        {rehearsal.duration && (
                                                            <div className="flex items-center">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                {rehearsal.duration} min
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Ostatnie nagrania
                                </h2>
                                <a
                                    href="/nagrania"
                                    className="text-choir-primary hover:text-choir-secondary font-medium"
                                >
                                    Zobacz wszystkie
                                </a>
                            </div>

                            {recentRecordings.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileAudio className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Brak nagrań</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentRecordings.map((recording) => (
                                        <div key={recording.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-choir-primary text-white p-2 rounded">
                                                    <Music className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {recording.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {recording.uploaded_by_username} • {new Date(recording.upload_date).toLocaleDateString('pl-PL')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-choir-primary hover:text-choir-secondary">
                                                <FileAudio className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Nowe partytury
                                </h2>
                                <a
                                    href="/partytury"
                                    className="text-choir-primary hover:text-choir-secondary font-medium"
                                >
                                    Zobacz wszystkie
                                </a>
                            </div>

                            {recentSheetMusic.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Brak partytur</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentSheetMusic.map((sheet) => (
                                        <div key={sheet.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {sheet.title}
                                            </h4>
                                            {sheet.composer && (
                                                <p className="text-sm text-gray-500 mb-1">
                                                    {sheet.composer}
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(sheet.upload_date).toLocaleDateString('pl-PL')}
                                                </span>
                                                {sheet.voice_part && (
                                                    <span className="text-xs bg-choir-primary text-white px-2 py-1 rounded">
                                                        {sheet.voice_part}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-choir-gradient rounded-lg p-6 text-white">
                            <h3 className="text-lg font-bold mb-3">
                                Porady dla członków
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-2">
                                    <div className="bg-white bg-opacity-20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs">✓</span>
                                    </div>
                                    <p className="text-sm">
                                        Regularnie ćwicz partie w domu przy użyciu dostępnych nagrań
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="bg-white bg-opacity-20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs">✓</span>
                                    </div>
                                    <p className="text-sm">
                                        Przygotowuj nuty przed każdą próbą
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="bg-white bg-opacity-20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs">✓</span>
                                    </div>
                                    <p className="text-sm">
                                        Dbaj o higienę głosu i regularne nawadnianie
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

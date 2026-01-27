import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, Users } from 'lucide-react';

const fetchRehearsals = async () => {
    const { data } = await axios.get('/api/rehearsals');
    return data;
};

const deleteRehearsal = async (id) => {
    await axios.delete(`/api/rehearsals/${id}`);
};

const Rehearsals = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingRehearsal, setEditingRehearsal] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        duration: 120
    });

    const queryClient = useQueryClient();

    const { data: rehearsals, isLoading, error } = useQuery(
        'rehearsals',
        fetchRehearsals,
        {
            refetchOnWindowFocus: false,
        }
    );

    const deleteMutation = useMutation(deleteRehearsal, {
        onSuccess: () => {
            queryClient.invalidateQueries('rehearsals');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingRehearsal) {
                await axios.put(`/api/rehearsals/${editingRehearsal.id}`, formData);
            } else {
                await axios.post('/api/rehearsals', formData);
            }

            queryClient.invalidateQueries('rehearsals');
            setShowForm(false);
            setEditingRehearsal(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                duration: 120
            });
        } catch (error) {
            console.error('Error saving rehearsal:', error);
        }
    };

    const handleEdit = (rehearsal) => {
        setEditingRehearsal(rehearsal);
        setFormData({
            title: rehearsal.title,
            description: rehearsal.description || '',
            date: rehearsal.date,
            location: rehearsal.location || '',
            duration: rehearsal.duration || 120
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę próbę?')) {
            deleteMutation.mutate(id);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

        if (isToday) return 'Dziś';
        if (isTomorrow) return 'Jutro';

        return date.toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    const sortedRehearsals = rehearsals?.sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

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
                <p className="text-red-600">Wystąpił błąd podczas ładowania prób.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Próby chóru</h1>
                            <p className="opacity-90 mt-1">Terminarz i informacje o próbach</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-white text-choir-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Dodaj próbę
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingRehearsal ? 'Edytuj próbę' : 'Dodaj nową próbę'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tytuł
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                        placeholder="np. Próba generalna"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data i godzina
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lokalizacja
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                        placeholder="np. Sala parafialna"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Czas trwania (minuty)
                                    </label>
                                    <input
                                        type="number"
                                        min="30"
                                        max="240"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opis
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                    placeholder="Dodatkowe informacje o próbie..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingRehearsal(null);
                                        setFormData({
                                            title: '',
                                            description: '',
                                            date: '',
                                            location: '',
                                            duration: 120
                                        });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-choir-primary text-white rounded-md hover:bg-choir-secondary"
                                >
                                    {editingRehearsal ? 'Zapisz zmiany' : 'Dodaj próbę'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {sortedRehearsals.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Brak prób
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Dodaj pierwszą próbę, aby rozpocząć planowanie.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-choir-primary text-white px-6 py-2 rounded-md hover:bg-choir-secondary transition-colors"
                        >
                            Dodaj próbę
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sortedRehearsals.map((rehearsal) => {
                            const rehearsalDate = new Date(rehearsal.date);
                            const isPast = rehearsalDate < new Date();
                            const isToday = rehearsalDate.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={rehearsal.id}
                                    className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${isPast ? 'border-gray-300 opacity-75' :
                                            isToday ? 'border-green-500' :
                                                'border-choir-primary'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {rehearsal.title}
                                            </h3>
                                            {rehearsal.description && (
                                                <p className="text-gray-600 mt-1">
                                                    {rehearsal.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(rehearsal)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rehearsal.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-choir-primary" />
                                            <span className="font-medium">{formatDate(rehearsal.date)}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <Clock className="h-4 w-4 mr-2 text-choir-primary" />
                                            <span>{formatTime(rehearsal.date)}</span>
                                            {rehearsal.duration && (
                                                <span className="ml-2 text-sm">
                                                    ({rehearsal.duration} min)
                                                </span>
                                            )}
                                        </div>

                                        {rehearsal.location && (
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2 text-choir-primary" />
                                                <span>{rehearsal.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {isToday && (
                                        <div className="mt-4 bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium inline-block">
                                            Dziś
                                        </div>
                                    )}

                                    {isPast && (
                                        <div className="mt-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm inline-block">
                                            Zakończona
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rehearsals;

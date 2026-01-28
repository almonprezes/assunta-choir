import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { User, Mail, Phone, Save, Edit2, Check, X } from 'lucide-react';

const updateProfile = async (profileData) => {
    const { data } = await axios.put('/api/members/profile', profileData);
    return data;
};

const Profile = () => {
    const { user, updateUser } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        voicePart: user?.voicePart || ''
    });
    const [originalData, setOriginalData] = useState({ ...formData });

    const updateMutation = useMutation(updateProfile, {
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            queryClient.invalidateQueries('members');
            setIsEditing(false);
            setOriginalData({ ...formData });
        }
    });

    const handleEdit = () => {
        setOriginalData({ ...formData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({ ...originalData });
        setIsEditing(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const voiceParts = [
        { value: 'Sopran', label: 'Sopran' },
        { value: 'Alt', label: 'Alt' },
        { value: 'Tenor', label: 'Tenor' },
        { value: 'Bas', label: 'Bas' }
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Proszę się zalogować, aby zobaczyć profil.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <User className="h-8 w-8" />
                            <h1 className="text-3xl font-bold">Mój profil</h1>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="bg-white text-choir-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edytuj profil
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Anuluj
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={updateMutation.isLoading}
                                    className="bg-choir-primary text-white px-4 py-2 rounded-md hover:bg-choir-secondary transition-colors flex items-center disabled:opacity-50"
                                >
                                    {updateMutation.isLoading ? (
                                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Zapisz
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informacje podstawowe */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">Informacje podstawowe</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Imię
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                                required
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">{user.firstName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nazwisko
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                                required
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">{user.lastName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                                required
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">{user.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon (opcjonalnie)
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                                placeholder="+48 123 456 789"
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">
                                                    {formData.phone || 'Nie podano'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Informacje o chórze */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">Informacje o chórze</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Głos
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={formData.voicePart}
                                                onChange={(e) => handleInputChange('voicePart', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                            >
                                                <option value="">Wybierz głos</option>
                                                {voiceParts.map(part => (
                                                    <option key={part.value} value={part.value}>
                                                        {part.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="flex items-center">
                                                <Music className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">
                                                    {voiceParts.find(p => p.value === user.voicePart)?.label || 'Nie określono'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rola
                                        </label>
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role === 'admin' ? 'Administrator' : 'Członek'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nazwa użytkownika
                                        </label>
                                        <div className="flex items-center">
                                            <span className="text-gray-900">@{user.username}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data dołączenia
                                        </label>
                                        <div className="flex items-center">
                                            <span className="text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString('pl-PL', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status konta */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">Status konta</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                                            }`}></div>
                                        <span className="text-gray-700">
                                            {user.role === 'admin'
                                                ? 'Konto administratora - pełne uprawnienia'
                                                : 'Konto członka - dostęp do strefy członka'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Users, Edit, Trash2, Shield, User, Mail, Music, Crown, Clock, AlertCircle, Check, X } from 'lucide-react';

const fetchMembers = async () => {
    const { data } = await axios.get('/api/members');
    return data;
};

const fetchPendingMembers = async () => {
    const { data } = await axios.get('/api/members/pending');
    return data;
};

const approveMember = async (id) => {
    const { data } = await axios.put(`/api/members/${id}/approve`);
    return data;
};

const rejectMember = async (id) => {
    const { data } = await axios.delete(`/api/members/${id}/reject`);
    return data;
};

const updateMemberRole = async ({ id, role }) => {
    const { data } = await axios.put(`/api/members/${id}/role`, { role });
    return data;
};

const deleteMember = async (id) => {
    await axios.delete(`/api/members/${id}`);
};

const Members = () => {
    const { user: currentUser } = useAuth();
    const [editingMember, setEditingMember] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [activeTab, setActiveTab] = useState('approved'); // 'approved' lub 'pending'

    const queryClient = useQueryClient();

    const { data: members, isLoading, error } = useQuery(
        'members',
        fetchMembers,
        {
            refetchOnWindowFocus: false,
        }
    );

    const { data: pendingMembers, isLoading: pendingLoading } = useQuery(
        'pendingMembers',
        fetchPendingMembers,
        {
            refetchOnWindowFocus: false,
        }
    );

    const updateRoleMutation = useMutation(updateMemberRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('members');
            setShowRoleModal(false);
            setEditingMember(null);
        },
    });

    const deleteMemberMutation = useMutation(deleteMember, {
        onSuccess: () => {
            queryClient.invalidateQueries('members');
        },
    });

    const approveMutation = useMutation(approveMember, {
        onSuccess: () => {
            queryClient.invalidateQueries('pendingMembers');
            queryClient.invalidateQueries('members');
        },
    });

    const rejectMutation = useMutation(rejectMember, {
        onSuccess: () => {
            queryClient.invalidateQueries('pendingMembers');
        },
    });

    const handleRoleChange = (member) => {
        setEditingMember(member);
        setNewRole(member.role);
        setShowRoleModal(true);
    };

    const handleApprove = (id) => {
        if (window.confirm('Czy na pewno zatwierdzić tego członka?')) {
            approveMutation.mutate(id);
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Czy na pewno odrzucić to zgłoszenie?')) {
            rejectMutation.mutate(id);
        }
    };

    const handleRoleUpdate = () => {
        if (editingMember && newRole) {
            updateRoleMutation.mutate({ id: editingMember.id, role: newRole });
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Czy na pewno chcesz usunąć członka "${name}"?`)) {
            deleteMemberMutation.mutate(id);
        }
    };

    const getVoicePartColor = (voicePart) => {
        const colors = {
            'Sopran': 'bg-pink-100 text-pink-800',
            'Alt': 'bg-purple-100 text-purple-800',
            'Tenor': 'bg-blue-100 text-blue-800',
            'Bas': 'bg-green-100 text-green-800',
        };
        return colors[voicePart] || 'bg-gray-100 text-gray-800';
    };

    const getRoleIcon = (role) => {
        if (role === 'admin') return <Crown className="h-4 w-4" />;
        return <User className="h-4 w-4" />;
    };

    if (currentUser?.role !== 'admin' && currentUser?.username !== 'norbert') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Dostęp ograniczony
                    </h2>
                    <p className="text-gray-600">
                        Tylko administratorzy mają dostęp do tej strony.
                    </p>
                </div>
            </div>
        );
    }

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
                <p className="text-red-600">Wystąpił błąd podczas ładowania członków.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-3xl font-bold">Zarządzanie członkami</h1>
                        <p className="opacity-90 mt-1">Administracja członkami chóru Assunta</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('approved')}
                            className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'approved'
                                ? 'bg-choir-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Zatwierdzeni ({members?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-2 rounded-md transition-colors flex items-center ${activeTab === 'pending'
                                ? 'bg-choir-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Oczekujący ({pendingMembers?.length || 0})
                        </button>
                    </div>
                </div>

                {/* Approved members */}
                {activeTab === 'approved' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Zatwierdzeni członkowie
                                </h2>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        Administrator
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                        Członek
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Członek
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kontakt
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Głos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rola
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dołączył
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Akcje
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members?.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-choir-gradient rounded-full flex items-center justify-center">
                                                        <span className="text-white font-medium">
                                                            {member.first_name?.[0]}{member.last_name?.[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.first_name} {member.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            @{member.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                    {member.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.voice_part ? (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoicePartColor(member.voice_part)}`}>
                                                        <Music className="h-3 w-3 mr-1" />
                                                        {member.voice_part}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Nieokreślony</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${member.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'
                                                        }`}></div>
                                                    <span className="inline-flex items-center text-sm font-medium text-gray-900">
                                                        {getRoleIcon(member.role)}
                                                        <span className="ml-1">
                                                            {member.role === 'admin' ? 'Administrator' : 'Członek'}
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(member.created_at).toLocaleDateString('pl-PL')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleRoleChange(member)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Zmień rolę"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    {member.id !== currentUser.id && (
                                                        <button
                                                            onClick={() => handleDelete(member.id, `${member.first_name} ${member.last_name}`)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Usuń członka"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pending members */}
                {activeTab === 'pending' && (
                    <div className="space-y-4">
                        {pendingLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : pendingMembers?.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Brak oczekujących członków
                                </h3>
                                <p className="text-gray-500">
                                    Wszystkie zgłoszenia zostały już rozpatrzone.
                                </p>
                            </div>
                        ) : (
                            pendingMembers?.map((member) => (
                                <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-12 h-12 bg-choir-gradient rounded-full flex items-center justify-center">
                                                    <Music className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {member.first_name} {member.last_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">@{member.username}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{member.email}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Music className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{member.voice_part}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(member.created_at).toLocaleDateString('pl-PL')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleApprove(member.id)}
                                                disabled={approveMutation.isLoading}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center disabled:opacity-50"
                                            >
                                                <Check className="h-4 w-4 mr-2" />
                                                Zatwierdź
                                            </button>
                                            <button
                                                onClick={() => handleReject(member.id)}
                                                disabled={rejectMutation.isLoading}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center disabled:opacity-50"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Odrzuć
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Całkowita liczba członków</h3>
                            <Users className="h-6 w-6 text-choir-primary" />
                        </div>
                        <div className="text-3xl font-bold text-choir-primary">
                            {members?.length || 0}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Administratorzy</h3>
                            <Crown className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-500">
                            {members?.filter(m => m.role === 'admin').length || 0}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Członkowie</h3>
                            <User className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-blue-500">
                            {members?.filter(m => m.role === 'member').length || 0}
                        </div>
                    </div>
                </div>
            </div>

            {showRoleModal && editingMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">
                            Zmień rolę dla {editingMember.first_name} {editingMember.last_name}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nowa rola
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                >
                                    <option value="member">Członek</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Uwaga:</strong> Administratorzy mają pełny dostęp do zarządzania stroną,
                                    w tym do usuwania członków i zmiany ról.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowRoleModal(false);
                                    setEditingMember(null);
                                    setNewRole('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleRoleUpdate}
                                disabled={updateRoleMutation.isLoading}
                                className="px-4 py-2 bg-choir-primary text-white rounded-md hover:bg-choir-secondary disabled:opacity-50"
                            >
                                {updateRoleMutation.isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;

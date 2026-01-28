import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Users, Clock, Mail, Phone, Check, X, AlertCircle, Music } from 'lucide-react';

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

const PendingMembers = () => {
    const queryClient = useQueryClient();
    const [selectedMember, setSelectedMember] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [action, setAction] = useState(null);

    const { data: pendingMembers, isLoading, error } = useQuery(
        'pendingMembers',
        fetchPendingMembers,
        {
            refetchOnWindowFocus: false,
        }
    );

    const approveMutation = useMutation(approveMember, {
        onSuccess: () => {
            queryClient.invalidateQueries('pendingMembers');
            queryClient.invalidateQueries('members');
            setShowConfirmDialog(false);
            setSelectedMember(null);
        }
    });

    const rejectMutation = useMutation(rejectMember, {
        onSuccess: () => {
            queryClient.invalidateQueries('pendingMembers');
            setShowConfirmDialog(false);
            setSelectedMember(null);
        }
    });

    const handleApprove = (member) => {
        setSelectedMember(member);
        setAction('approve');
        setShowConfirmDialog(true);
    };

    const handleReject = (member) => {
        setSelectedMember(member);
        setAction('reject');
        setShowConfirmDialog(true);
    };

    const confirmAction = () => {
        if (action === 'approve') {
            approveMutation.mutate(selectedMember.id);
        } else if (action === 'reject') {
            rejectMutation.mutate(selectedMember.id);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getVoicePartLabel = (voicePart) => {
        const labels = {
            'Sopran': 'Sopran',
            'Alt': 'Alt',
            'Tenor': 'Tenor',
            'Bas': 'Bas'
        };
        return labels[voicePart] || voicePart;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Wystąpił błąd podczas ładowania oczekujących członków.</p>
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
                            <Users className="h-8 w-8" />
                            <h1 className="text-3xl font-bold">Oczekujący członkowie</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <span className="text-lg font-semibold">
                                {pendingMembers?.length || 0} oczekujących
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {pendingMembers?.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Brak oczekujących członków
                        </h3>
                        <p className="text-gray-500">
                            Wszystkie zgłoszenia zostały już rozpatrzone.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingMembers?.map((member) => (
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{member.email}</span>
                                            </div>

                                            {member.phone && (
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{member.phone}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-2">
                                                <Music className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {getVoicePartLabel(member.voice_part)}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(member.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleApprove(member)}
                                            disabled={approveMutation.isLoading}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center disabled:opacity-50"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Zatwierdź
                                        </button>
                                        <button
                                            onClick={() => handleReject(member)}
                                            disabled={rejectMutation.isLoading}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Odrzuć
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal potwierdzenia */}
            {showConfirmDialog && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${action === 'approve' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {action === 'approve' ? (
                                    <Check className="h-8 w-8 text-green-600" />
                                ) : (
                                    <X className="h-8 w-8 text-red-600" />
                                )}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {action === 'approve' ? 'Zatwierdzić członka?' : 'Odrzucić członka?'}
                            </h3>

                            <p className="text-gray-600 mb-6">
                                {action === 'approve'
                                    ? `Czy na pewno chcesz zatwierdzić ${selectedMember.first_name} ${selectedMember.last_name} jako członka chóru?`
                                    : `Czy na pewno chcesz odrzucić zgłoszenie ${selectedMember.first_name} ${selectedMember.last_name}?`
                                }
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowConfirmDialog(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Anuluj
                                </button>
                                <button
                                    onClick={confirmAction}
                                    disabled={approveMutation.isLoading || rejectMutation.isLoading}
                                    className={`flex-1 px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${action === 'approve'
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                >
                                    {(approveMutation.isLoading || rejectMutation.isLoading) ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mx-auto"></div>
                                    ) : (
                                        action === 'approve' ? 'Zatwierdź' : 'Odrzuć'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingMembers;

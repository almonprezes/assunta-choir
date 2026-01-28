import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { FileAudio, Plus, Edit, Trash2, Play, Pause, Download, Eye, EyeOff, Upload } from 'lucide-react';

const fetchRecordings = async () => {
    const { data } = await axios.get('/api/recordings');
    return data;
};

const deleteRecording = async (id) => {
    await axios.delete(`/api/recordings/${id}`);
};

const Recordings = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingRecording, setEditingRecording] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPublic: false
    });
    const [audioFile, setAudioFile] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [audioRef, setAudioRef] = useState({});

    const queryClient = useQueryClient();

    const { data: recordings, isLoading, error } = useQuery(
        'recordings',
        fetchRecordings,
        {
            refetchOnWindowFocus: false,
        }
    );

    const deleteMutation = useMutation(deleteRecording, {
        onSuccess: () => {
            queryClient.invalidateQueries('recordings');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('isPublic', formData.isPublic);

            if (audioFile) {
                formDataToSend.append('audioFile', audioFile);
            }

            if (editingRecording) {
                await axios.put(`/api/recordings/${editingRecording.id}`, {
                    title: formData.title,
                    description: formData.description,
                    isPublic: formData.isPublic
                });
            } else {
                await axios.post('/api/recordings', formDataToSend);
            }

            queryClient.invalidateQueries('recordings');
            setShowForm(false);
            setEditingRecording(null);
            setFormData({
                title: '',
                description: '',
                isPublic: false
            });
            setAudioFile(null);
        } catch (error) {
            console.error('Error saving recording:', error);
        }
    };

    const handleEdit = (recording) => {
        setEditingRecording(recording);
        setFormData({
            title: recording.title,
            description: recording.description || '',
            isPublic: recording.is_public
        });
        setShowForm(true);
        setAudioFile(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć to nagranie?')) {
            deleteMutation.mutate(id);
        }
    };

    const handlePlayPause = (recordingId) => {
        const audio = audioRef[recordingId];
        if (!audio) return;

        if (playingId === recordingId) {
            audio.pause();
            setPlayingId(null);
        } else {
            // Stop any currently playing audio
            Object.values(audioRef).forEach(a => {
                if (a && a !== audio) {
                    a.pause();
                    a.currentTime = 0;
                }
            });

            audio.play();
            setPlayingId(recordingId);
        }
    };

    const handleAudioRef = (recordingId, element) => {
        if (element && !audioRef[recordingId]) {
            setAudioRef(prev => ({
                ...prev,
                [recordingId]: element
            }));

            element.addEventListener('ended', () => {
                setPlayingId(null);
            });
        }
    };

    const handleDownload = (recording) => {
        const cleanTitle = recording.title
            .replace(/[^\w\sąęćśźżółńĄĘĆŚŹŻÓŁŃ-]/g, '') // Usuń znaki specjalne, zachowaj polskie znaki
            .replace(/\s+/g, '_') // Zamień spacje na podkreślenia
            .replace(/_{2,}/g, '_') // Usuń podwójne podkreślenia
            .replace(/^_|_$/g, '') // Usuń podkreślenia na początku/końcu
            .substring(0, 50); // Ogranicz długość

        fetch(`/uploads/recordings/${recording.file_path}`)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${cleanTitle}.mp3`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Download error:', error);
                // Fallback: prosta metoda
                const link = document.createElement('a');
                link.href = `/uploads/recordings/${recording.file_path}`;
                link.target = '_blank';
                link.click();
            });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                <p className="text-red-600">Wystąpił błąd podczas ładowania nagrań.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Nagrania chóru</h1>
                            <p className="opacity-90 mt-1">Biblioteka nagrań audio z prób i koncertów</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-white text-choir-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Dodaj nagranie
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingRecording ? 'Edytuj nagranie' : 'Dodaj nowe nagranie'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="np. Ave Maria - próba 15.10.2024"
                                />
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
                                    placeholder="Dodatkowe informacje o nagraniu..."
                                />
                            </div>

                            {!editingRecording && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Plik audio
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                            <Upload className="h-4 w-4 mr-2" />
                                            <span>Wybierz plik</span>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={(e) => setAudioFile(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                        {audioFile && (
                                            <span className="text-sm text-gray-600">
                                                {audioFile.name} ({formatFileSize(audioFile.size)})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="h-4 w-4 text-choir-primary focus:ring-choir-primary border-gray-300 rounded"
                                />
                                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                                    Publicznie dostępne
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingRecording(null);
                                        setFormData({
                                            title: '',
                                            description: '',
                                            isPublic: false
                                        });
                                        setAudioFile(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    disabled={!editingRecording && !audioFile}
                                    className="px-4 py-2 bg-choir-primary text-white rounded-md hover:bg-choir-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingRecording ? 'Zapisz zmiany' : 'Dodaj nagranie'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {recordings?.length === 0 ? (
                    <div className="text-center py-12">
                        <FileAudio className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Brak nagrań
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Dodaj pierwsze nagranie, aby rozpocząć budowanie biblioteki.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-choir-primary text-white px-6 py-2 rounded-md hover:bg-choir-secondary transition-colors"
                        >
                            Dodaj nagranie
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recordings?.map((recording) => (
                            <div key={recording.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="bg-choir-gradient h-32 flex items-center justify-center">
                                    <FileAudio className="h-16 w-16 text-white opacity-50" />
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 flex-1 mr-2">
                                            {recording.title}
                                        </h3>
                                        <div className="flex space-x-1">
                                            {recording.is_public ? (
                                                <Eye className="h-4 w-4 text-green-600" title="Publiczne" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 text-gray-400" title="Prywatne" />
                                            )}
                                        </div>
                                    </div>

                                    {recording.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {recording.description}
                                        </p>
                                    )}

                                    <div className="text-xs text-gray-500 mb-3">
                                        <div>Przez: {recording.uploaded_by_username}</div>
                                        <div>{formatDate(recording.upload_date)}</div>
                                        {recording.file_size && (
                                            <div>Rozmiar: {formatFileSize(recording.file_size)}</div>
                                        )}
                                    </div>

                                    {/* Audio element */}
                                    <audio
                                        ref={(el) => handleAudioRef(recording.id, el)}
                                        src={`/uploads/recordings/${recording.file_path}`}
                                        preload="metadata"
                                        className="hidden"
                                    />

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePlayPause(recording.id)}
                                            className="flex-1 bg-choir-primary text-white py-2 px-3 rounded hover:bg-choir-secondary transition-colors flex items-center justify-center text-sm"
                                        >
                                            {playingId === recording.id ? (
                                                <Pause className="h-4 w-4 mr-1" />
                                            ) : (
                                                <Play className="h-4 w-4 mr-1" />
                                            )}
                                            {playingId === recording.id ? 'Pauza' : 'Odtwórz'}
                                        </button>

                                        <button
                                            onClick={() => handleDownload(recording)}
                                            className="bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
                                            title="Pobierz"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>

                                        <button
                                            onClick={() => handleEdit(recording)}
                                            className="bg-blue-100 text-blue-700 py-2 px-3 rounded hover:bg-blue-200 transition-colors"
                                            title="Edytuj"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(recording.id)}
                                            className="bg-red-100 text-red-700 py-2 px-3 rounded hover:bg-red-200 transition-colors"
                                            title="Usuń"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recordings;

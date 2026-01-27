import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { FileText, Plus, Edit, Trash2, Download, Upload, Filter, Music } from 'lucide-react';

const fetchSheetMusic = async () => {
    const { data } = await axios.get('/api/sheet-music');
    return data;
};

const deleteSheetMusic = async (id) => {
    await axios.delete(`/api/sheet-music/${id}`);
};

const SheetMusic = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingSheet, setEditingSheet] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        composer: '',
        description: '',
        voicePart: ''
    });
    const [sheetFile, setSheetFile] = useState(null);
    const [filter, setFilter] = useState('');

    const queryClient = useQueryClient();

    const { data: sheetMusic, isLoading, error } = useQuery(
        'sheetMusic',
        fetchSheetMusic,
        {
            refetchOnWindowFocus: false,
        }
    );

    const deleteMutation = useMutation(deleteSheetMusic, {
        onSuccess: () => {
            queryClient.invalidateQueries('sheetMusic');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('composer', formData.composer);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('voicePart', formData.voicePart);

            if (sheetFile) {
                formDataToSend.append('sheetFile', sheetFile);
            }

            if (editingSheet) {
                await axios.put(`/api/sheet-music/${editingSheet.id}`, {
                    title: formData.title,
                    composer: formData.composer,
                    description: formData.description,
                    voicePart: formData.voicePart
                });
            } else {
                await axios.post('/api/sheet-music', formDataToSend);
            }

            queryClient.invalidateQueries('sheetMusic');
            setShowForm(false);
            setEditingSheet(null);
            setFormData({
                title: '',
                composer: '',
                description: '',
                voicePart: ''
            });
            setSheetFile(null);
        } catch (error) {
            console.error('Error saving sheet music:', error);
        }
    };

    const handleEdit = (sheet) => {
        setEditingSheet(sheet);
        setFormData({
            title: sheet.title,
            composer: sheet.composer || '',
            description: sheet.description || '',
            voicePart: sheet.voice_part || ''
        });
        setShowForm(true);
        setSheetFile(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę partyturę?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleDownload = (filePath, title) => {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = title;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    const filteredSheetMusic = sheetMusic?.filter(sheet => {
        if (!filter) return true;
        return sheet.voice_part === filter;
    }) || [];

    const voiceParts = [...new Set(sheetMusic?.map(sheet => sheet.voice_part).filter(Boolean))] || [];

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
                <p className="text-red-600">Wystąpił błąd podczas ładowania partytur.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Partytury</h1>
                            <p className="opacity-90 mt-1">Biblioteka nut i materiałów muzycznych</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-white text-choir-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Dodaj partyturę
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingSheet ? 'Edytuj partyturę' : 'Dodaj nową partyturę'}
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
                                        placeholder="np. Ave Maria"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kompozytor
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.composer}
                                        onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                        placeholder="np. Franz Schubert"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Głos
                                    </label>
                                    <select
                                        value={formData.voicePart}
                                        onChange={(e) => setFormData({ ...formData, voicePart: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                                    >
                                        <option value="">Wszystkie głosy</option>
                                        <option value="Sopran">Sopran</option>
                                        <option value="Alt">Alt</option>
                                        <option value="Tenor">Tenor</option>
                                        <option value="Bas">Bas</option>
                                        <option value="Chór">Chór</option>
                                    </select>
                                </div>

                                {!editingSheet && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Plik (PDF lub obraz)
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                                <Upload className="h-4 w-4 mr-2" />
                                                <span>Wybierz plik</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                                                    onChange={(e) => setSheetFile(e.target.files[0])}
                                                    className="hidden"
                                                />
                                            </label>
                                            {sheetFile && (
                                                <span className="text-sm text-gray-600">
                                                    {sheetFile.name} ({formatFileSize(sheetFile.size)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                    placeholder="Dodatkowe informacje o partyturze..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingSheet(null);
                                        setFormData({
                                            title: '',
                                            composer: '',
                                            description: '',
                                            voicePart: ''
                                        });
                                        setSheetFile(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    disabled={!editingSheet && !sheetFile}
                                    className="px-4 py-2 bg-choir-primary text-white rounded-md hover:bg-choir-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingSheet ? 'Zapisz zmiany' : 'Dodaj partyturę'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-choir-primary focus:border-choir-primary"
                        >
                            <option value="">Wszystkie głosy</option>
                            {voiceParts.map(part => (
                                <option key={part} value={part}>{part}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-sm text-gray-600">
                        {filteredSheetMusic.length} {filteredSheetMusic.length === 1 ? 'partytura' : 'partyturek'}
                    </div>
                </div>

                {filteredSheetMusic.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {filter ? `Brak partytur dla głosu: ${filter}` : 'Brak partytur'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {filter ? 'Spróbuj zmienić filtr lub dodaj nowe partytury.' : 'Dodaj pierwszą partyturę, aby rozpocząć budowanie biblioteki.'}
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-choir-primary text-white px-6 py-2 rounded-md hover:bg-choir-secondary transition-colors"
                        >
                            Dodaj partyturę
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSheetMusic.map((sheet) => (
                            <div key={sheet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-40 flex items-center justify-center">
                                    <FileText className="h-20 w-20 text-purple-400" />
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-1 truncate">
                                        {sheet.title}
                                    </h3>

                                    {sheet.composer && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            {sheet.composer}
                                        </p>
                                    )}

                                    {sheet.voice_part && (
                                        <div className="inline-block bg-choir-primary text-white text-xs px-2 py-1 rounded mb-2">
                                            {sheet.voice_part}
                                        </div>
                                    )}

                                    {sheet.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {sheet.description}
                                        </p>
                                    )}

                                    <div className="text-xs text-gray-500 mb-3">
                                        <div>Przez: {sheet.uploaded_by_username}</div>
                                        <div>{formatDate(sheet.upload_date)}</div>
                                        {sheet.file_size && (
                                            <div>Rozmiar: {formatFileSize(sheet.file_size)}</div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleDownload(sheet.file_path, sheet.title)}
                                            className="flex-1 bg-choir-primary text-white py-2 px-3 rounded hover:bg-choir-secondary transition-colors flex items-center justify-center text-sm"
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            Pobierz
                                        </button>

                                        <button
                                            onClick={() => handleEdit(sheet)}
                                            className="bg-blue-100 text-blue-700 py-2 px-3 rounded hover:bg-blue-200 transition-colors"
                                            title="Edytuj"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(sheet.id)}
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

export default SheetMusic;

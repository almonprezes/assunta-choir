import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Calendar, MapPin, Music } from 'lucide-react';

const fetchConcerts = async () => {
    const { data } = await axios.get('/api/concerts');
    return data;
};

const Concerts = () => {
    const { data: concerts, isLoading, error } = useQuery('concerts', fetchConcerts);
    const [filter, setFilter] = useState('all');
    const [selectedConcert, setSelectedConcert] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    const filteredConcerts = concerts?.filter(concert => {
        const concertDate = new Date(concert.date);
        const now = new Date();

        if (filter === 'upcoming') {
            return concertDate >= now;
        } else if (filter === 'past') {
            return concertDate < now;
        }
        return true;
    }) || [];

    const sortedConcerts = filteredConcerts.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleShowReport = (concert) => {
        setSelectedConcert(concert);
        setShowReportModal(true);
    };

    const getConcertReport = (concertTitle) => {
        const reports = {
            'Wielkanocny Koncert Paschalny': {
                date: '15 grudnia 2025',
                attendees: 150,
                highlights: [
                    'Wykonanie "Halleluja" G.F. Händla',
                    'Udział solistów instrumentalnych',
                    'Standing ovation na zakończenie',
                    'Wspólne śpiewanie "Zmartwychwstał Pan"'
                ],
                photos: [
                    'Chór podczas wykonania utworu głównego',
                    'Publiczność wypełniła kościół po brzegi',
                    'Soliści z dyrygentem po koncercie',
                    'Ostatnia akord i owacje na stojąco'
                ]
            },
            'Adwentowy Koncert Świąteczny': {
                date: '8 grudnia 2025',
                attendees: 120,
                highlights: [
                    'Premiera nowego utworu kompozycji Magdaleny Kozierskiej',
                    'Współpraca z dziecięcą scholą parafialną',
                    'Atmosfera adwentowego oczekiwania',
                    'Zbiórka na rzecz potrzebujących'
                ],
                photos: [
                    'Wspólne wykonanie z dziećmi',
                    'Magdalena Kozierska dyryguje chórowi',
                    'Publiczność z zapalonymi świecami',
                    'Zdjęcie grupowe wszystkich wykonawców'
                ]
            },
            'Koncert z okazji Dnia Papieża Jana Pawła II': {
                date: '22 października 2025',
                attendees: 200,
                highlights: [
                    'Wykonanie polskich pieśni patriotycznych',
                    'Homilia o życiu i nauczaniu Jana Pawła II',
                    'Udział lokalnych władz samorządowych',
                    'Modlitwa o beatyfikację sługi Bożego'
                ],
                photos: [
                    'Chór w strojach galowych',
                    'Ksiądz proboszcz z delegacją',
                    'Publiczność z flagami papieskimi',
                    'Zakończenie koncertu przy ołtarzu głównym'
                ]
            }
        };

        return reports[concertTitle] || null;
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
                <p className="text-red-600">Wystąpił błąd podczas ładowania koncertów.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="choir-gradient text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Music className="h-16 w-16 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Nasze koncerty
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Dołącz nas na naszych koncertach i posłuchaj pięknej muzyki sakralnej
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-6 py-2 rounded-md transition-colors ${filter === 'upcoming'
                                ? 'bg-choir-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Nadchodzące
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-6 py-2 rounded-md transition-colors ${filter === 'past'
                                ? 'bg-choir-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Minione
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-md transition-colors ${filter === 'all'
                                ? 'bg-choir-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Wszystkie
                        </button>
                    </div>
                </div>

                {sortedConcerts.length === 0 ? (
                    <div className="text-center py-12">
                        <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {filter === 'upcoming' ? 'Brak nadchodzących koncertów' : 'Brak koncertów'}
                        </h3>
                        <p className="text-gray-500">
                            {filter === 'upcoming'
                                ? 'Sprawdź później lub skontaktuj się z nami, aby dowiedzieć się więcej o planowanych wydarzeniach.'
                                : 'Zmień filtr, aby zobaczyć inne koncerty.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedConcerts.map((concert) => (
                            <div
                                key={concert.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                            >
                                <div className="h-48 choir-gradient flex items-center justify-center">
                                    <Music className="h-20 w-20 text-white opacity-50" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-choir-primary font-semibold mb-2">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {formatDate(concert.date)}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {concert.title}
                                    </h3>
                                    {concert.description && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {concert.description}
                                        </p>
                                    )}
                                    <div className="space-y-2">
                                        {concert.location && (
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2 text-choir-primary" />
                                                <span className="text-sm">{concert.location}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        {new Date(concert.date) >= new Date() ? (
                                            <button className="w-full bg-choir-primary text-white py-2 px-4 rounded-md hover:bg-choir-secondary transition-colors">
                                                Zapisz się
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleShowReport(concert)}
                                                className="w-full bg-choir-primary text-white py-2 px-4 rounded-md hover:bg-choir-secondary transition-colors"
                                            >
                                                Zobacz relację
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal z relacją koncertu */}
            {showReportModal && selectedConcert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Relacja z koncertu
                                    </h2>
                                    <h3 className="text-xl text-choir-primary">
                                        {selectedConcert.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {(() => {
                                const report = getConcertReport(selectedConcert.title);
                                if (!report) {
                                    return (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Relacja z tego koncertu jest w przygotowaniu.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="space-y-6">
                                        {/* Podstawowe informacje */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Data koncertu</p>
                                                    <p className="font-semibold">{report.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Liczba uczestników</p>
                                                    <p className="font-semibold">{report.attendees} osób</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Lokalizacja</p>
                                                    <p className="font-semibold">{selectedConcert.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Najważniejsze momenty */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-3">Najważniejsze momenty</h4>
                                            <ul className="space-y-2">
                                                {report.highlights.map((highlight, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-choir-primary mr-2">•</span>
                                                        <span className="text-gray-700">{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Galeria zdjęć */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-3">Galeria zdjęć</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {report.photos.map((photo, index) => (
                                                    <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                                                        <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                                            <Music className="h-12 w-12 text-gray-400" />
                                                        </div>
                                                        <p className="text-sm text-gray-600">{photo}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Podziękowania */}
                                        <div className="bg-choir-primary bg-opacity-10 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold mb-2">Podziękowania</h4>
                                            <p className="text-gray-700">
                                                Dziękujemy wszystkim uczestnikom za obecność i wspólną modlitwę poprzez muzykę.
                                                Szczególne podziękowania dla solistów, instrumentalistów i wszystkich, którzy przyczynili się
                                                do organizacji tego koncertu.
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="bg-choir-primary text-white px-6 py-2 rounded-md hover:bg-choir-secondary transition-colors"
                                >
                                    Zamknij
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Concerts;

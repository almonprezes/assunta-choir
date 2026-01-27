import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Calendar, MapPin, Clock, Music } from 'lucide-react';

const fetchConcerts = async () => {
    const { data } = await axios.get('/api/concerts');
    return data;
};

const Concerts = () => {
    const [filter, setFilter] = useState('upcoming');

    const { data: concerts, isLoading, error } = useQuery(
        'concerts',
        fetchConcerts,
        {
            refetchOnWindowFocus: false,
        }
    );

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
                                        <button className="w-full bg-choir-primary text-white py-2 px-4 rounded-md hover:bg-choir-secondary transition-colors">
                                            {new Date(concert.date) >= new Date()
                                                ? 'Zapisz się'
                                                : 'Zobacz relację'
                                            }
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

export default Concerts;

import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Calendar, Users, Heart, ArrowRight, Play } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            <section className="choir-gradient text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
                            Parafialny Chór Assunta
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 fade-in">
                            Pasja, muzyka i wspólnota w służbie Bogu
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
                            <Link
                                to="/koncerty"
                                className="bg-white text-choir-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Nadchodzące koncerty
                            </Link>
                            <Link
                                to="/o-chorze"
                                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-choir-primary transition-colors flex items-center justify-center"
                            >
                                Dowiedz się więcej
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            O naszym chórze
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Chór Assunta to zespół utworzony z pasjonatów muzyki sakralnej,
                            którzy od lat wzbogacają liturgię i koncertują na terenie całej Polski.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center card-hover bg-gray-50 p-8 rounded-lg">
                            <div className="bg-choir-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Music className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Bogaty repertuar</h3>
                            <p className="text-gray-600">
                                Od muzyki renesansowej po współczesne utwory sakralne
                            </p>
                        </div>

                        <div className="text-center card-hover bg-gray-50 p-8 rounded-lg">
                            <div className="bg-choir-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Profesjonalizm</h3>
                            <p className="text-gray-600">
                                Doświadczeni dyrygenci i regularne próby gwarantują wysoką jakość
                            </p>
                        </div>

                        <div className="text-center card-hover bg-gray-50 p-8 rounded-lg">
                            <div className="bg-choir-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Wspólnota</h3>
                            <p className="text-gray-600">
                                Zgrany zespół, który tworzy muzykę z sercem i pasją
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Dołącz do nas
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Jeśli kochasz muzykę i chcesz rozwijać swoje pasje w gronie wspaniałych ludzi,
                                chór Assunta jest miejscem dla Ciebie. Poszukujemy osób z głosem i sercem do śpiewu.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <div className="bg-choir-accent text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                        ✓
                                    </div>
                                    <span className="text-gray-700">Regularne próby i warsztaty wokalne</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="bg-choir-accent text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                        ✓
                                    </div>
                                    <span className="text-gray-700">Możliwość udziału w koncertach i nagraniach</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="bg-choir-accent text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                        ✓
                                    </div>
                                    <span className="text-gray-700">Dostęp do partytur i nagrań</span>
                                </li>
                            </ul>
                            <Link
                                to="/rejestracja"
                                className="bg-choir-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-choir-secondary transition-colors inline-flex items-center"
                            >
                                Dołącz do chóru
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                        <div className="bg-choir-gradient rounded-lg p-8 text-white">
                            <div className="text-center">
                                <Play className="h-16 w-16 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-4">Posłuchaj nas</h3>
                                <p className="mb-6">
                                    Zapraszamy do wysłuchania naszych nagrań i obejrzenia koncertów
                                </p>
                                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                    <p className="text-sm">
                                        Nagrania dostępne dla członków chóru po zalogowaniu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Najnowsze wydarzenia
                        </h2>
                        <p className="text-lg text-gray-600">
                            Bądź na bieżąco z naszymi koncertami i wydarzeniami
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white border rounded-lg overflow-hidden card-hover">
                            <div className="h-48 bg-choir-gradient"></div>
                            <div className="p-6">
                                <div className="text-sm text-choir-primary font-semibold mb-2">
                                    25 stycznia 2026
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Koncert Bożonarodzeniowy w Nietrzanowie</h3>
                                <p className="text-gray-600 mb-4">
                                    Kościół parafialny w Nietrzanowie, po Mszy Św.
                                </p>
                                <Link
                                    to="/koncerty"
                                    className="text-choir-primary font-semibold hover:text-choir-secondary"
                                >
                                    Dowiedz się więcej →
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg overflow-hidden card-hover">
                            <div className="h-48 bg-choir-gradient"></div>
                            <div className="p-6">
                                <div className="text-sm text-choir-primary font-semibold mb-2">
                                    22 grudnia 2024
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Pasterka</h3>
                                <p className="text-gray-600 mb-4">
                                    Uroczysta msza święta, godz. 24:00
                                </p>
                                <Link
                                    to="/koncerty"
                                    className="text-choir-primary font-semibold hover:text-choir-secondary"
                                >
                                    Dowiedz się więcej →
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg overflow-hidden card-hover">
                            <div className="h-48 bg-choir-gradient"></div>
                            <div className="p-6">
                                <div className="text-sm text-choir-primary font-semibold mb-2">
                                    6 stycznia 2025
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Orszak Trzech Króli</h3>
                                <p className="text-gray-600 mb-4">
                                    Centrum miasta, godz. 12:00
                                </p>
                                <Link
                                    to="/koncerty"
                                    className="text-choir-primary font-semibold hover:text-choir-secondary"
                                >
                                    Dowiedz się więcej →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

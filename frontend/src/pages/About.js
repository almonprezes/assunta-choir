import React from 'react';
import { Music, Users, Heart, Award, Clock, MapPin } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="choir-gradient text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            O chórze Assunta
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Poznaj naszą historię, misję i pasję do muzyki sakralnej
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Nasza historia
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            Parafialny chór Assunta został założony w 2020 roku z inicjatywy Magdaleny
                            Matuszewskiej-Bryłkaoraz grupy pasjonatów muzyki sakralnej , przy zgodzie i wielkim 
                            wsparciu ówczesnego proboszcza ks. Proboszcza Grzegorza Gałkowskiego .
                            Od początku istnienia nasz zespół stawiał sobie za cel uświetnianie liturgii
                            oraz krzewienie kultury muzycznej w lokalnej społeczności.
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            Przez lata działalności chór rozwinął się od małej grupy śpiewaków
                            po profesjonalny zespół liczący ponad 20 członków. Regularnie uczestniczymy
                            w najważniejszych uroczystościach parafialnych oraz koncertujemy na terenie
                            całego kraju i za granicą.
                        </p>
                        <p className="text-lg text-gray-700">
                            Nasza nazwa "Assunta" pochodzi od łacińskiego słowa oznaczającego
                            "Wniebowzięta" i symbolizuje nasze oddanie Matce Bożej oraz dążenie
                            do doskonałości w służbie Bogu przez muzykę.
                        </p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-choir-primary mb-2">25+</div>
                                <div className="text-gray-600">lat działalności</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-choir-primary mb-2">30+</div>
                                <div className="text-gray-600">członków chóru</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-choir-primary mb-2">100+</div>
                                <div className="text-gray-600">koncertów</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-choir-primary mb-2">15+</div>
                                <div className="text-gray-600">nagrań</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Nasza misja i wartości
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-choir-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Służba Bogu</h3>
                            <p className="text-gray-600">
                                Poprzez muzykę oddajemy chwałę Bogu i wspieramy liturgię
                                w naszej parafii, tworząc atmosferę modlitwy i kontemplacji.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-choir-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Wspólnota</h3>
                            <p className="text-gray-600">
                                Budujemy więzi oparte na wzajemnym szacunku, pomocy i wspólnej pasji
                                do muzyki, tworząc prawdziwą duchową rodzinę.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-choir-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Doskonałość</h3>
                            <p className="text-gray-600">
                                Dążymy do artystycznego doskonałości poprzez regularne próby,
                                warsztaty i ciągły rozwój naszych umiejętności wokalnych.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Nasz repertuar
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-choir-primary">Muzyka sakralna</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Msze i utwory liturgiczne</li>
                                    <li>• Pieśni maryjne</li>
                                    <li>• Kolędy i pastorałki</li>
                                    <li>• Utwory wielkanocne</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-choir-primary">Klasyczne arcydzieła</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Mozart, Haydn, Schubert</li>
                                    <li>• Bach, Vivaldi, Palestrina</li>
                                    <li>• Polscy kompozytorzy romantyczni</li>
                                    <li>• Utwory renesansowe i barokowe</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-choir-primary">Muzyka współczesna</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Utwory polskich kompozytorów</li>
                                    <li>• Muzyka gospel i spirituals</li>
                                    <li>• Arrangements tradycyjnych pieśni</li>
                                    <li>• Kompozycje na zamówienie</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Nasi dyrygenci
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-20 h-20 bg-choir-gradient rounded-full mr-4"></div>
                                <div>
                                    <h3 className="text-xl font-semibold">Magdalena Kozierska</h3>
                                    <p className="text-choir-primary">Dyrygent główny</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                Absolwentka Akademii Muzycznej w Poznaniu. Z chórem Assunta
                                związana od początku. Specjalizuje się w muzyce sakralnej i
                                prowadzi liczne warsztaty wokalne.
                            </p>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-20 h-20 bg-choir-gradient rounded-full mr-4"></div>
                                <div>
                                    <h3 className="text-xl font-semibold">Norbert Bryłka</h3>
                                    <p className="text-choir-primary">Asystent techniczny chóru</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                Informatyk, programista, mechatronik, wsparcie w wielu tematach. Od początku 
                                wspiera pracę chóru, dbając o wszystko, w czym potrafi pomóc
                                Pasjonat Web 3.0. Konserwatysta.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-choir-gradient rounded-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Dołącz do nas!</h2>
                    <p className="text-xl mb-6 max-w-2xl mx-auto">
                        Jeśli kochasz muzykę i chcesz rozwijać swoje pasje w gronie wspaniałych ludzi,
                        chór Assunta jest miejscem dla Ciebie.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/rejestracja"
                            className="bg-white text-choir-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Zapisz się na przesłuchanie
                        </a>
                        <a
                            href="/koncerty"
                            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-choir-primary transition-colors"
                        >
                            Przyjdź na koncert
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

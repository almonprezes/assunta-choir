import React from 'react';
import { Music, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Music className="h-8 w-8 text-choir-accent" />
                            <span className="text-xl font-bold">Chór Assunta</span>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Parafialny chór Assunta to zespół pasjonatów muzyki sakralnej,
                            który od lat piękni liturgię i koncertuje na terenie całej Polski.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.facebook.com/pages/category/Choir/Assunta-Ch%C3%B3r-parafialny-ze-Lw%C3%B3wka-107889747367053/"
                                className="text-gray-300 hover:text-choir-accent transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Facebook Chóru Assunta"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-choir-accent transition-colors"
                                title="Instagram (wkrótce)"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Szybkie linki</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-300 hover:text-choir-accent transition-colors">
                                    Strona główna
                                </a>
                            </li>
                            <li>
                                <a href="/koncerty" className="text-gray-300 hover:text-choir-accent transition-colors">
                                    Koncerty
                                </a>
                            </li>
                            <li>
                                <a href="/o-chorze" className="text-gray-300 hover:text-choir-accent transition-colors">
                                    O chórze
                                </a>
                            </li>
                            <li>
                                <a href="/login" className="text-gray-300 hover:text-choir-accent transition-colors">
                                    Strefa członka
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-choir-accent" />
                                <span className="text-gray-300">assunta@lwowek.net</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-choir-accent" />
                                <span className="text-gray-300">+48 61 441-41-84</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-choir-accent" />
                                <span className="text-gray-300">ul. Świętojańska 1<br />64-310 Lwówek</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-300">
                        © {new Date().getFullYear()} Chór Assunta. Wszelkie prawa zastrzeżone.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music, Menu, X, LogOut, User, Calendar, FileAudio, FileText, Users } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Music className="h-8 w-8 text-choir-primary" />
                            <span className="text-xl font-bold choir-text-gradient">Chór Assunta</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-choir-primary transition-colors">
                            Strona główna
                        </Link>
                        <Link to="/koncerty" className="text-gray-700 hover:text-choir-primary transition-colors">
                            Koncerty
                        </Link>
                        <Link to="/o-chorze" className="text-gray-700 hover:text-choir-primary transition-colors">
                            O chórze
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <div className="relative group">
                                    <button className="flex items-center space-x-1 text-gray-700 hover:text-choir-primary transition-colors">
                                        <User className="h-4 w-4" />
                                        <span>{user.firstName}</span>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Panel
                                        </Link>
                                        <Link to="/próby" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Calendar className="inline h-4 w-4 mr-2" />
                                            Próby
                                        </Link>
                                        <Link to="/nagrania" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <FileAudio className="inline h-4 w-4 mr-2" />
                                            Nagrania
                                        </Link>
                                        <Link to="/partytury" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <FileText className="inline h-4 w-4 mr-2" />
                                            Partytury
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/członkowie" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <Users className="inline h-4 w-4 mr-2" />
                                                Członkowie
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="inline h-4 w-4 mr-2" />
                                            Wyloguj
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-choir-primary transition-colors">
                                    Logowanie
                                </Link>
                                <Link to="/rejestracja" className="bg-choir-primary text-white px-4 py-2 rounded-md hover:bg-choir-secondary transition-colors">
                                    Rejestracja
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-choir-primary"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                            Strona główna
                        </Link>
                        <Link to="/koncerty" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                            Koncerty
                        </Link>
                        <Link to="/o-chorze" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                            O chórze
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                    Panel
                                </Link>
                                <Link to="/próby" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                    Próby
                                </Link>
                                <Link to="/nagrania" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                    Nagrania
                                </Link>
                                <Link to="/partytury" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                    Partytury
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/członkowie" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                        Członkowie
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-choir-primary"
                                >
                                    Wyloguj
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                    Logowanie
                                </Link>
                                <Link to="/rejestracja" className="block px-3 py-2 text-gray-700 hover:text-choir-primary" onClick={() => setIsMenuOpen(false)}>
                                    Rejestracja
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

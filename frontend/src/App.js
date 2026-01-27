import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Concerts from './pages/Concerts';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rehearsals from './pages/Rehearsals';
import Recordings from './pages/Recordings';
import SheetMusic from './pages/SheetMusic';
import Members from './pages/Members';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/koncerty" element={<Concerts />} />
                        <Route path="/o-chorze" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/rejestracja" element={<Register />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/próby" element={
                            <PrivateRoute>
                                <Rehearsals />
                            </PrivateRoute>
                        } />
                        <Route path="/nagrania" element={
                            <PrivateRoute>
                                <Recordings />
                            </PrivateRoute>
                        } />
                        <Route path="/partytury" element={
                            <PrivateRoute>
                                <SheetMusic />
                            </PrivateRoute>
                        } />
                        <Route path="/członkowie" element={
                            <PrivateRoute>
                                <Members />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Learn from './components/Learn';
import Test from './components/Test';
import Upload from './components/Upload';
import Flashcards from './components/Flashcards';
import VoiceLearning from './components/VoiceLearning';
import VAPITeacher from './components/VAPITeacher';
import Conversations from './components/Conversations';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Braillience...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/learn" element={user ? <Learn /> : <Navigate to="/login" />} />
          <Route path="/test" element={user ? <Test /> : <Navigate to="/login" />} />
                  <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
                  <Route path="/flashcards" element={user ? <Flashcards /> : <Navigate to="/login" />} />
                  <Route path="/voice-learning" element={user ? <VoiceLearning /> : <Navigate to="/login" />} />
                  <Route path="/vapi-teacher" element={user ? <VAPITeacher /> : <Navigate to="/login" />} />
                  <Route path="/conversations" element={user ? <Conversations /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

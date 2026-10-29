import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SetupGuideModal } from './components/SetupGuideModal';
import { HomePage } from './pages/HomePage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ResultsPage } from './pages/ResultsPage';
import { TransformationsPage } from './pages/TransformationsPage';
import { RecyclingGuidePage } from './pages/RecyclingGuidePage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalysisRecord } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(null);
  const [sampleImageUrl, setSampleImageUrl] = useState<string | undefined>(undefined);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  // Sync scroll on page transition
  const navigateTo = (page: string, params?: any) => {
    if (params?.analysis) {
      setCurrentAnalysis(params.analysis);
    }
    if (params?.sampleUrl) {
      setSampleImageUrl(params.sampleUrl);
    } else if (page === 'analyzer' && !params?.preserveSample) {
      setSampleImageUrl(undefined);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (record: AnalysisRecord) => {
    setCurrentAnalysis(record);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sample: { imageUrl: string; name: string }) => {
    setSampleImageUrl(sample.imageUrl);
    setCurrentPage('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-700">Initializing EcoCycle AI System...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSetupModal={() => setShowSetupModal(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectSampleImage={handleSelectSample}
          />
        )}

        {currentPage === 'analyzer' && (
          <AnalyzerPage
            initialImageUrl={sampleImageUrl}
            onAnalysisComplete={handleAnalysisComplete}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'results' && currentAnalysis && (
          <ResultsPage
            analysis={currentAnalysis}
            onNavigate={navigateTo}
            onUpdateAnalysis={(updated) => setCurrentAnalysis(updated)}
          />
        )}

        {currentPage === 'transformations' && currentAnalysis && (
          <TransformationsPage
            analysis={currentAnalysis}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'guide' && (
          <RecyclingGuidePage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={navigateTo}
            onSelectRecord={(rec) => setCurrentAnalysis(rec)}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            onNavigate={navigateTo}
            onSelectRecord={(rec) => setCurrentAnalysis(rec)}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenSetupModal={() => setShowSetupModal(true)}
      />

      {/* VS Code Setup Guide Modal */}
      {showSetupModal && (
        <SetupGuideModal
          onClose={() => setShowSetupModal(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

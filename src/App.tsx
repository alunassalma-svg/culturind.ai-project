import { useEffect, useState } from 'react';
import { KilaMascot } from '@/components/KilaMascot';
import { Button } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthScreen } from '@/components/AuthScreen';
import { AgeCheck } from '@/components/AgeCheck';
import { Layout } from '@/components/Layout';
import { AIAssistant } from '@/components/AIAssistant';
import { HomePage } from '@/pages/HomePage';
import { LegendsPage } from '@/pages/LegendsPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { LanguagePage } from '@/pages/LanguagePage';
import { CommunityPage } from '@/pages/CommunityPage';
import { DancePage } from '@/pages/DancePage';
import { OutfitPage } from '@/pages/OutfitPage';
import { TakeItIRLPage } from '@/pages/TakeItIRLPage';
import { ClubsPage } from '@/pages/ClubsPage';
import { ImpactPage } from '@/pages/ImpactPage';
import { ModeratorPage } from '@/pages/ModeratorPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { ageGroup, currentPage, restoring, routeMissing, setPage } = useApp();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  useEffect(() => { const open=()=>setShowAuth(true); window.addEventListener('open-account',open); return()=>window.removeEventListener('open-account',open); },[]);
  useEffect(() => {if(user)setShowAuth(false);},[user]);

  // When the "Why" page is selected, render the homepage and scroll to the section
  useEffect(() => {
    if (currentPage === 'why') {
      const section = document.getElementById('why-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentPage]);

  // 1. Supabase is resolving the session — show a branded loader.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg">
        <div className="text-center">
          <h1 className="text-4xl font-display font-black text-ink-50 mb-4">
            Cultur<span className="shimmer-text">Ind</span>.ai
          </h1>
          <KilaMascot size={100} /><p role="status">Opening your storybook…</p>
        </div>
      </div>
    );
  }

  // 2. Not logged in — show the email auth screen.
  if (!user && showAuth) {
    return <AuthScreen onExplore={()=>setShowAuth(false)} />;
  }

  // 3. Logged in but restoring progress — brief loader so we don't flash
  //    default state before the saved state arrives.
  if (restoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg">
        <div className="text-center">
          <h1 className="text-4xl font-display font-black text-ink-50 mb-4">
            Cultur<span className="shimmer-text">Ind</span>.ai
          </h1>
          <Loader2 size={32} className="animate-spin text-batik-700 mx-auto" />
          <p className="text-ink-400 text-sm mt-3">Restoring your progress…</p>
        </div>
      </div>
    );
  }

  // 4. Logged in but hasn't completed birthday onboarding yet.
  if (user && !ageGroup) {
    return <AgeCheck />;
  }

  // Moderator dashboard is a standalone private page (no public layout/header)
  if (currentPage === 'moderator') {
    return <ModeratorPage />;
  }

  // All other pages use the standard layout with header, nav, footer
  return (
    <Layout>
      {routeMissing ? <div className="py-20 text-center"><KilaMascot size={130}/><h1 className="text-3xl font-bold my-5">This page wandered off.</h1><Button onClick={()=>setPage('home')}>Back to home</Button></div> : <>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'legends' && <LegendsPage />}
      {currentPage === 'gallery' && <GalleryPage />}
      {currentPage === 'language' && <LanguagePage />}
      {currentPage === 'community' && <CommunityPage />}
      {currentPage === 'dance' && <DancePage />}
      {currentPage === 'outfit' && <OutfitPage />}
      {currentPage === 'takeitirl' && <TakeItIRLPage />}
      {currentPage === 'clubs' && <ClubsPage />}
      {currentPage === 'impact' && <ImpactPage />}
      {currentPage === 'why' && <HomePage />}
      </>}
      <AIAssistant />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

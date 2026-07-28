import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for browser PWA Install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user previously dismissed banner
      const dismissed = localStorage.getItem('neumo_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback detection for mobile browsers where beforeinstallprompt didn't trigger yet
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isMobile && !isStandalone && !localStorage.getItem('neumo_pwa_dismissed')) {
      // Auto show mobile prompt tip
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show mobile instruction if native prompt unavailable
      alert('📱 To install on Mobile:\n\n1. Tap your browser menu (3 dots or Share icon)\n2. Tap "Add to Home Screen" or "Install App"');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('neumo_pwa_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div 
      className="neu-card"
      style={{
        borderRadius: '0 0 20px 20px',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
          <Smartphone size={20} color="#ffffff" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
            Install NeumoStudio App
          </h4>
          <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>
            Add to Home Screen for instant 1-Click access on your phone!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={handleInstallClick}
          className="neu-btn"
          style={{
            background: '#ffffff',
            color: '#4f46e5',
            fontWeight: '800',
            fontSize: '0.85rem',
            padding: '8px 16px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}
        >
          <Download size={16} /> Install App 📲
        </button>

        <button 
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            opacity: 0.8,
            padding: '4px'
          }}
          title="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

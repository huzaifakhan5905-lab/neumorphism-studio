import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div className="neu-card" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        position: 'relative',
        borderRadius: '28px',
        padding: '32px'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={22} />
        </button>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
          <ShieldCheck /> Privacy Policy & Terms of Service
        </h2>

        <div style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginTop: '16px' }}>1. 100% Client-Side Privacy Guarantee</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            NeumoStudio AI respects your privacy. All image processing, background removal, PDF compression, and password encryption run locally inside your web browser. No uploaded photos or confidential PDF documents are ever stored or uploaded to remote servers.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginTop: '16px' }}>2. Data Collection & Analytics</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            We use Google Analytics to measure aggregate web traffic and usage statistics (such as page views and browser device type). No personally identifiable information (PII) is tracked or collected.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginTop: '16px' }}>3. Advertisements & Google AdSense</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            NeumoStudio AI serves advertisements via Google AdSense and third-party ad vendors. Third-party vendors use cookies to serve ads based on user visits to this website. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginTop: '16px' }}>4. Limitation of Liability</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            All visual tools and PDF utilities are provided "as is" without warranty. Users are responsible for verifying compressed PDF sizes and formatted passport photo dimensions prior to submitting official form applications.
          </p>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="neu-btn neu-btn-primary" onClick={onClose}>
            I Agree & Accept
          </button>
        </div>
      </div>
    </div>
  );
}

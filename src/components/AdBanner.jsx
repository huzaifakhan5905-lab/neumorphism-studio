import React, { useEffect } from 'react';

export default function AdBanner({ slotId = "default-ad-slot" }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, []);

  return (
    <div 
      className="neu-card-sm" 
      style={{
        margin: '24px 0',
        padding: '16px',
        textAlign: 'center',
        background: 'var(--neu-bg)',
        boxShadow: 'var(--neu-shadow-inset)',
        borderRadius: '20px',
        overflow: 'hidden'
      }}
    >
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-9331762642864417"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>
        $ SPONSORED ADVERTISEMENT
      </div>
    </div>
  );
}

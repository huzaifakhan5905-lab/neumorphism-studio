import React, { useEffect } from 'react';
import { DollarSign } from 'lucide-react';

export default function AdBanner({ slotId = 'default-ad-slot', style = {} }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore adsbygoogle load errors when running locally
    }
  }, []);

  return (
    <div 
      className="neu-inset" 
      style={{
        margin: '20px 0',
        padding: '16px',
        textAlign: 'center',
        borderRadius: '20px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed rgba(113, 128, 150, 0.3)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
        <DollarSign size={14} color="var(--accent-color)" /> Sponsored Advertisement
      </div>

      {/* AdSense Unit Slot (Will display real AdSense Ads when Publisher ID is added) */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '60px' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense Publisher ID
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Ad Space • Keeps NeumoStudio 100% Free
      </p>
    </div>
  );
}

import React, { useState } from 'react';
import { Box, Copy, Check } from 'lucide-react';

export default function NeumorphicGen() {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [distance, setDistance] = useState(9);
  const [blur, setBlur] = useState(16);
  const [shape, setShape] = useState('flat'); // flat, inset
  const [copied, setCopied] = useState(false);

  // Generate CSS box-shadow snippet
  const getBoxShadow = () => {
    if (shape === 'inset') {
      return `inset ${distance}px ${distance}px ${blur}px rgba(163, 177, 198, 0.6), inset -${distance}px -${distance}px ${blur}px rgba(255, 255, 255, 0.8)`;
    }
    return `${distance}px ${distance}px ${blur}px rgba(163, 177, 198, 0.6), -${distance}px -${distance}px ${blur}px rgba(255, 255, 255, 0.8)`;
  };

  const cssCode = `background: ${bgColor};\nbox-shadow: ${getBoxShadow()};\nborder-radius: 20px;`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box color="var(--primary-color)" /> Live CSS Neumorphism Shadow Generator
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Designers & Developers Tool: Generate custom Soft UI Neumorphic box-shadow CSS code live.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Controls */}
        <div>
          <div className="neu-card-sm" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Background Color</label>
            <input 
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)}
              style={{ width: '100%', height: '40px', border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'none' }} 
            />
          </div>

          <div className="neu-card-sm" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Distance ({distance}px)</label>
            <input type="range" min="3" max="30" value={distance} className="neu-slider" onChange={(e) => setDistance(e.target.value)} />
          </div>

          <div className="neu-card-sm" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Blur Radius ({blur}px)</label>
            <input type="range" min="5" max="50" value={blur} className="neu-slider" onChange={(e) => setBlur(e.target.value)} />
          </div>

          <div className="neu-card-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Shape Type</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className={`neu-btn ${shape === 'flat' ? 'active' : ''}`} onClick={() => setShape('flat')} style={{ flex: 1 }}>Flat Outset</button>
              <button className={`neu-btn ${shape === 'inset' ? 'active' : ''}`} onClick={() => setShape('inset')} style={{ flex: 1 }}>Concave Inset</button>
            </div>
          </div>
        </div>

        {/* Live Preview Box & Generated CSS Code */}
        <div>
          <div 
            style={{
              height: '200px',
              backgroundColor: bgColor,
              boxShadow: getBoxShadow(),
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              fontWeight: '800',
              color: 'var(--text-main)'
            }}
          >
            Neumorphic Preview
          </div>

          <div className="neu-inset" style={{ padding: '16px', borderRadius: '16px', position: 'relative' }}>
            <button className="neu-btn" onClick={copyCode} style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', fontSize: '0.75rem' }}>
              {copied ? <Check size={14} color="var(--accent-color)" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy CSS'}
            </button>
            <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--primary-color)' }}>
              {cssCode}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}

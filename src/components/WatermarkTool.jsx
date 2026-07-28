import React, { useState, useRef } from 'react';
import { Upload, Download, Type } from 'lucide-react';
import { applyWatermark } from '../utils/canvasEngine';

export default function WatermarkTool() {
  const [imageSrc, setImageSrc] = useState(null);
  const [watermarkText, setWatermarkText] = useState('© NeumoStudio');
  const [opacity, setOpacity] = useState(70);
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState(28);
  const [watermarkedResult, setWatermarkedResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setImageSrc(url);
        updateWatermark(url, watermarkText, opacity, position, fontSize);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateWatermark = (url, txt, op, pos, fs) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const res = applyWatermark(img, { text: txt, opacity: op, position: pos, fontSize: fs });
      setWatermarkedResult(res);
    };
    img.src = url || imageSrc;
  };

  const downloadWatermarked = () => {
    if (!watermarkedResult) return;
    const link = document.createElement('a');
    link.download = `watermarked-${Date.now()}.png`;
    link.href = watermarkedResult;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Type color="var(--primary-color)" /> Watermark & Branding Studio
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Protect your creative photos by overlaying custom text watermarks or brand copyright stamps.
        </p>
      </div>

      {!imageSrc ? (
        <div 
          className="neu-inset" 
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: '48px 24px', textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--primary-color)', borderRadius: '24px' }}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
          <Upload size={32} color="var(--primary-color)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload Image for Watermark</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select file to add watermark</p>
        </div>
      ) : (
        <div>
          {/* Watermark Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Watermark Text</label>
              <input 
                type="text" 
                value={watermarkText} 
                className="neu-input"
                onChange={(e) => { setWatermarkText(e.target.value); updateWatermark(imageSrc, e.target.value, opacity, position, fontSize); }} 
              />
            </div>

            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Position</label>
              <select 
                value={position} 
                className="neu-select"
                onChange={(e) => { setPosition(e.target.value); updateWatermark(imageSrc, watermarkText, opacity, e.target.value, fontSize); }}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Opacity ({opacity}%)</label>
              <input 
                type="range" min="10" max="100" value={opacity} className="neu-slider"
                onChange={(e) => { setOpacity(e.target.value); updateWatermark(imageSrc, watermarkText, e.target.value, position, fontSize); }} 
              />
            </div>

            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Font Size ({fontSize}px)</label>
              <input 
                type="range" min="14" max="72" value={fontSize} className="neu-slider"
                onChange={(e) => { setFontSize(e.target.value); updateWatermark(imageSrc, watermarkText, opacity, position, e.target.value); }} 
              />
            </div>

          </div>

          {/* Preview */}
          <div className="neu-inset" style={{ textAlign: 'center', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
            <img src={watermarkedResult || imageSrc} alt="Watermark Preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '16px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>New Image</button>
            <button className="neu-btn neu-btn-primary" onClick={downloadWatermarked}>
              <Download size={16} /> Download Watermarked Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

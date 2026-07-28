import React, { useState, useRef } from 'react';
import { Upload, Download, Sliders, Sparkles, RefreshCw } from 'lucide-react';
import { applyPhotoFilters } from '../utils/canvasEngine';

export default function PhotoEnhancer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [filteredResult, setFilteredResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setImageSrc(url);
        updateFilter(url, 100, 100, 100, 0);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateFilter = (url, b, c, s, bl) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const res = applyPhotoFilters(img, { brightness: b, contrast: c, saturation: s, blur: bl });
      setFilteredResult(res);
    };
    img.src = url || imageSrc;
  };

  const autoEnhance = () => {
    setBrightness(110);
    setContrast(115);
    setSaturation(120);
    setBlur(0);
    updateFilter(imageSrc, 110, 115, 120, 0);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    updateFilter(imageSrc, 100, 100, 100, 0);
  };

  const downloadFiltered = () => {
    if (!filteredResult) return;
    const link = document.createElement('a');
    link.download = `enhanced-${Date.now()}.png`;
    link.href = filteredResult;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders color="var(--primary-color)" /> Studio Photo Enhancer & Filter Sliders
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Fine-tune brightness, contrast, saturation, and blur with Neumorphic tactile sliders.
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload Photo to Enhance</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select file to edit filters</p>
        </div>
      ) : (
        <div>
          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button className="neu-btn neu-btn-primary" onClick={autoEnhance}>
              <Sparkles size={16} /> Auto AI Color Fix
            </button>
            <button className="neu-btn" onClick={resetFilters}>
              <RefreshCw size={16} /> Reset Sliders
            </button>
          </div>

          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Brightness ({brightness}%)</label>
              <input 
                type="range" min="30" max="180" value={brightness} className="neu-slider"
                onChange={(e) => { setBrightness(e.target.value); updateFilter(imageSrc, e.target.value, contrast, saturation, blur); }} 
              />
            </div>

            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Contrast ({contrast}%)</label>
              <input 
                type="range" min="30" max="180" value={contrast} className="neu-slider"
                onChange={(e) => { setContrast(e.target.value); updateFilter(imageSrc, brightness, e.target.value, saturation, blur); }} 
              />
            </div>

            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Saturation ({saturation}%)</label>
              <input 
                type="range" min="0" max="200" value={saturation} className="neu-slider"
                onChange={(e) => { setSaturation(e.target.value); updateFilter(imageSrc, brightness, contrast, e.target.value, blur); }} 
              />
            </div>

            <div className="neu-card-sm">
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Soft Blur ({blur}px)</label>
              <input 
                type="range" min="0" max="15" value={blur} className="neu-slider"
                onChange={(e) => { setBlur(e.target.value); updateFilter(imageSrc, brightness, contrast, saturation, e.target.value); }} 
              />
            </div>
          </div>

          {/* Preview */}
          <div className="neu-inset" style={{ textAlign: 'center', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
            <img src={filteredResult || imageSrc} alt="Enhanced Result" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '16px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>New Image</button>
            <button className="neu-btn neu-btn-primary" onClick={downloadFiltered}>
              <Download size={16} /> Download Enhanced Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

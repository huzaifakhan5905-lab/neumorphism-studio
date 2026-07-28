import React, { useState, useRef } from 'react';
import { Upload, Download, Crop, RefreshCw, UserCheck, Smartphone, Frame } from 'lucide-react';
import { resizeAndCropImage } from '../utils/canvasEngine';

const DP_PRESETS = [
  { label: 'WhatsApp DP (1:1)', width: 500, height: 500, icon: '📱' },
  { label: 'Instagram Profile DP (1:1)', width: 320, height: 320, icon: '📸' },
  { label: 'LinkedIn Profile DP (1:1)', width: 400, height: 400, icon: '💼' },
  { label: 'Twitter / X Profile DP (1:1)', width: 400, height: 400, icon: '🐦' },
  { label: 'YouTube Channel DP (1:1)', width: 800, height: 800, icon: '▶️' },
  { label: 'Facebook Profile DP (1:1)', width: 500, height: 500, icon: '👤' },
];

const PASSPORT_PRESETS = [
  { label: 'Official Passport Size (3.5x4.5cm)', width: 413, height: 531, icon: '📜' },
  { label: 'Govt Exam / SSC / UPSC Photo', width: 350, height: 450, icon: '📑' },
  { label: 'Visa / ID Card Square (2x2 inch)', width: 600, height: 600, icon: '🆔' },
];

const POST_PRESETS = [
  { label: 'Instagram Post (1:1)', width: 1080, height: 1080, icon: '🖼️' },
  { label: 'Instagram Story / Reels (9:16)', width: 1080, height: 1920, icon: '📱' },
  { label: 'YouTube Thumbnail (16:9)', width: 1280, height: 720, icon: '🎬' },
  { label: 'Twitter / LinkedIn Header (3:1)', width: 1500, height: 500, icon: '🎨' },
];

export default function ResizerCrop() {
  const [imageSrc, setImageSrc] = useState(null);
  const [category, setCategory] = useState('dp'); // 'dp', 'passport', 'posts'
  const [targetWidth, setTargetWidth] = useState(500);
  const [targetHeight, setTargetHeight] = useState(500);
  const [resizedResult, setResizedResult] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(DP_PRESETS[0].label);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setImageSrc(url);
        processResize(url, targetWidth, targetHeight);
      };
      reader.readAsDataURL(file);
    }
  };

  const processResize = (url, w, h) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Smart center-crop scaling so face is never stretched!
      const res = resizeAndCropImage(img, parseInt(w), parseInt(h));
      setResizedResult(res);
    };
    img.src = url || imageSrc;
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.label);
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    if (imageSrc) {
      processResize(imageSrc, preset.width, preset.height);
    }
  };

  const activePresets = category === 'dp' ? DP_PRESETS : category === 'passport' ? PASSPORT_PRESETS : POST_PRESETS;

  const downloadResized = () => {
    if (!resizedResult) return;
    const link = document.createElement('a');
    link.download = `dp-resized-${targetWidth}x${targetHeight}-${Date.now()}.png`;
    link.href = resizedResult;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crop color="var(--primary-color)" /> Profile Picture (DP) & Passport Photo Resizer
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Resize & center-crop photos for WhatsApp DP, Instagram, LinkedIn, Passport size & Govt Exam photos without stretching faces!
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload Photo for DP / Passport Resize</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Supports WhatsApp, Instagram, LinkedIn DP & Passport Photos</p>
        </div>
      ) : (
        <div>
          {/* Category Selector Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button 
              className={`neu-btn ${category === 'dp' ? 'active neu-btn-primary' : ''}`}
              onClick={() => { setCategory('dp'); handlePresetSelect(DP_PRESETS[0]); }}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              <Smartphone size={16} /> Profile DP Sizes
            </button>
            <button 
              className={`neu-btn ${category === 'passport' ? 'active neu-btn-primary' : ''}`}
              onClick={() => { setCategory('passport'); handlePresetSelect(PASSPORT_PRESETS[0]); }}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              <UserCheck size={16} /> Passport & Exam Photos
            </button>
            <button 
              className={`neu-btn ${category === 'posts' ? 'active neu-btn-primary' : ''}`}
              onClick={() => { setCategory('posts'); handlePresetSelect(POST_PRESETS[0]); }}
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              <Frame size={16} /> Social Posts & Banners
            </button>
          </div>

          {/* Preset Buttons */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {activePresets.map((preset) => (
                <button
                  key={preset.label}
                  className={`neu-btn ${selectedPreset === preset.label ? 'active' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                  style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{preset.icon}</span> {preset.label} ({preset.width}x{preset.height})
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimension Inputs */}
          <div className="neu-card-sm" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Width (px)</label>
              <input 
                type="number" 
                value={targetWidth} 
                className="neu-input"
                onChange={(e) => { setTargetWidth(e.target.value); processResize(imageSrc, e.target.value, targetHeight); }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px', display: 'block' }}>Height (px)</label>
              <input 
                type="number" 
                value={targetHeight} 
                className="neu-input"
                onChange={(e) => { setTargetHeight(e.target.value); processResize(imageSrc, targetWidth, e.target.value); }} 
              />
            </div>
          </div>

          {/* Canvas Preview (Smart Center-Cropped) */}
          <div className="neu-inset" style={{ textAlign: 'center', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
            <img 
              src={resizedResult || imageSrc} 
              alt="Resized DP Preview" 
              style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '16px' }} 
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>
              <RefreshCw size={16} /> Change Photo
            </button>
            <button className="neu-btn neu-btn-primary" onClick={downloadResized}>
              <Download size={16} /> Download {selectedPreset.split(' ')[0]} DP ({targetWidth}x{targetHeight})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

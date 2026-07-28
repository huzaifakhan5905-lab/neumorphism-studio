import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Layers, Sparkles, Check } from 'lucide-react';
import { removeBackgroundAi, replaceBackground } from '../utils/canvasEngine';

export default function BgRemover() {
  const [imageFile, setImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [processedSrc, setProcessedSrc] = useState(null);
  const [finalSrc, setFinalSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [bgType, setBgType] = useState('transparent'); // 'transparent', 'color', 'gradient'
  const [selectedBg, setSelectedBg] = useState('#ffffff');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      processAiRemoval(file);
    }
  };

  const processAiRemoval = async (fileObj) => {
    setIsProcessing(true);
    setProgressPct(10);
    try {
      const removedUrl = await removeBackgroundAi(fileObj, (pct) => {
        setProgressPct(pct);
      });
      setProcessedSrc(removedUrl);
      setFinalSrc(removedUrl);
    } catch (err) {
      console.error('AI removal failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBgChange = (type, val) => {
    setBgType(type);
    setSelectedBg(val);

    if (type === 'transparent') {
      setFinalSrc(processedSrc);
    } else {
      replaceBackground(processedSrc, type, val, (newUrl) => {
        setFinalSrc(newUrl);
      });
    }
  };

  const downloadImage = () => {
    if (!finalSrc) return;
    const link = document.createElement('a');
    link.download = `neumostudio-ai-cutout-${Date.now()}.png`;
    link.href = finalSrc;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="var(--primary-color)" /> Studio AI Background Remover (HD Neural Model)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Uses Neural AI WebAssembly model to detect hair, face, & body edges with 100% precision.
        </p>
      </div>

      {!imageSrc ? (
        /* Upload Area */
        <div 
          className="neu-inset" 
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed var(--primary-color)',
            borderRadius: '24px'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <div className="neu-badge" style={{ padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <Upload size={32} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
            Click or Drag & Drop Photo Here
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            HD AI Cutout for Portraits, Products, E-Commerce & Studio Photos
          </p>
        </div>
      ) : (
        /* Processing & Workspace */
        <div>
          {/* Comparison View */}
          <div className="neu-inset" style={{ position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '20px', marginBottom: '24px' }}>
            
            {isProcessing ? (
              <div style={{ textAlign: 'center', padding: '40px', maxWidth: '320px' }}>
                <RefreshCw size={40} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px' }}>
                  Neural AI Processing Subject...
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Detecting human face, hair edges, & clothes for 100% clean cutout
                </p>
                {/* Progress Bar */}
                <div className="neu-inset" style={{ height: '12px', borderRadius: '6px', padding: '2px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${progressPct || 40}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
              </div>
            ) : (
              /* Before/After Slider */
              <div style={{ position: 'relative', width: '100%', height: '400px', userSelect: 'none' }}>
                
                {/* Processed (After) Image */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  borderRadius: '16px'
                }}>
                  <img 
                    src={finalSrc || processedSrc} 
                    alt="AI Cutout Result" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>

                {/* Original (Before) Image Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: `${sliderPos}%`, height: '100%', overflow: 'hidden', borderRight: '3px solid var(--primary-color)' }}>
                  <img 
                    src={imageSrc} 
                    alt="Original Photo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: 'none' }} 
                  />
                </div>

                {/* Interactive Slider Input */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPos} 
                  onChange={(e) => setSliderPos(e.target.value)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: '100%',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    cursor: 'ew-resize',
                    height: '100%',
                    margin: 0
                  }}
                />

                <span className="neu-badge" style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.75rem' }}>Original</span>
                <span className="neu-badge" style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.75rem' }}>AI Cutout ✨</span>
              </div>
            )}
          </div>

          {/* Background Replacement Controls */}
          <div className="neu-card-sm" style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={18} color="var(--primary-color)" /> Replace Background Studio
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className={`neu-btn ${bgType === 'transparent' ? 'active neu-btn-primary' : ''}`}
                onClick={() => handleBgChange('transparent', null)}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Transparent PNG
              </button>
              <button 
                className={`neu-btn ${bgType === 'color' && selectedBg === '#ffffff' ? 'active neu-btn-primary' : ''}`}
                onClick={() => handleBgChange('color', '#ffffff')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Studio White
              </button>
              <button 
                className={`neu-btn ${bgType === 'color' && selectedBg === '#000000' ? 'active neu-btn-primary' : ''}`}
                onClick={() => handleBgChange('color', '#000000')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Dark Mode
              </button>
              <button 
                className={`neu-btn ${bgType === 'gradient' && selectedBg === 'sunset' ? 'active neu-btn-primary' : ''}`}
                onClick={() => handleBgChange('gradient', 'sunset')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Sunset Gradient
              </button>
              <button 
                className={`neu-btn ${bgType === 'gradient' && selectedBg === 'neon' ? 'active neu-btn-primary' : ''}`}
                onClick={() => handleBgChange('gradient', 'neon')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Neon Gradient
              </button>
              <button 
                className={`neu-btn ${bgType === 'gradient' && selectedBg === 'pastel' ? 'active neu-btn-primary' : ''}`}
                onClick={() => handleBgChange('gradient', 'pastel')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Pastel Pink
              </button>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>
              <RefreshCw size={16} /> Choose New Photo
            </button>
            <button className="neu-btn neu-btn-primary" onClick={downloadImage} disabled={isProcessing}>
              <Download size={16} /> Download HD Cutout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

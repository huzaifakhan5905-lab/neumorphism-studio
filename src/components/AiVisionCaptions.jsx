import React, { useState, useRef } from 'react';
import { Upload, Eye, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { generateVisionCaptions } from '../utils/openrouter';

export default function AiVisionCaptions() {
  const [imageSrc, setImageSrc] = useState(null);
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setImageSrc(url);
        runAiVisionAnalysis(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiVisionAnalysis = async (imgDataUrl) => {
    setIsAnalyzing(true);
    try {
      const result = await generateVisionCaptions(imgDataUrl);
      setAnalysisText(result);
    } catch (err) {
      setAnalysisText('Failed to analyze image with AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!analysisText) return;
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye color="var(--primary-color)" /> AI Vision Caption & Hashtag Generator
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Upload any photo to automatically generate viral Instagram captions, trending hashtags, and SEO alt-text.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Upload & Preview */}
        <div>
          {!imageSrc ? (
            <div 
              className="neu-inset" 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '40px 20px', textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--primary-color)', borderRadius: '20px' }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
              <Upload size={32} color="var(--primary-color)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>Upload Image for AI Vision Analysis</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click or drag photo here</p>
            </div>
          ) : (
            <div className="neu-inset" style={{ textAlign: 'center', padding: '12px', borderRadius: '20px' }}>
              <img src={imageSrc} alt="Vision Input" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '14px', marginBottom: '12px' }} />
              <button className="neu-btn" onClick={() => { setImageSrc(null); setAnalysisText(''); }} style={{ width: '100%' }}>
                Upload Different Image
              </button>
            </div>
          )}
        </div>

        {/* AI Output Analysis */}
        <div className="neu-inset" style={{ padding: '20px', borderRadius: '20px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--primary-color)" /> AI Vision Insights
            </h3>
            {analysisText && (
              <button className="neu-btn" onClick={copyToClipboard} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                {copied ? <Check size={14} color="var(--accent-color)" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy All'}
              </button>
            )}
          </div>

          {isAnalyzing ? (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '40px' }}>
              <RefreshCw size={32} className="spin" color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '12px', fontWeight: '600', fontSize: '0.9rem' }}>Analyzing Image Visuals...</p>
            </div>
          ) : analysisText ? (
            <div style={{ flex: 1, whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.6', overflowY: 'auto', color: 'var(--text-main)' }}>
              {analysisText}
            </div>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.85rem' }}>Upload a photo to see instant AI captions, hashtags, and SEO tags.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

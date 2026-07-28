import React, { useState, useRef } from 'react';
import { Upload, Download, FileCheck2, Sliders, Info } from 'lucide-react';

export default function ConverterCompress() {
  const [imageSrc, setImageSrc] = useState(null);
  const [format, setFormat] = useState('jpg');
  const [quality, setQuality] = useState(70);
  const [originalSize, setOriginalSize] = useState(0);
  const [actualCompressedSize, setActualCompressedSize] = useState(0);
  const [convertedResult, setConvertedResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setImageSrc(url);
        convertImage(url, format, quality);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = (srcUrl, fmt, q) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let targetW = img.naturalWidth || img.width;
      let targetH = img.naturalHeight || img.height;

      // HTML5 Canvas PNG is lossless, so we scale resolution for PNG compression when slider is lowered
      if (fmt === 'png' && q < 95) {
        // Scale dimensions dynamically based on quality slider (e.g. 50% quality = 0.7 scale)
        const scale = Math.max(0.25, Math.sqrt(q / 100));
        targetW = Math.round(targetW * scale);
        targetH = Math.round(targetH * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill white background for JPG conversion
      if (fmt === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const mimeType = fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, q / 100);

      // Calculate EXACT actual byte size from generated base64 DataURL
      const base64Str = dataUrl.split(',')[1];
      const actualBytes = Math.round((base64Str.length * 3) / 4);
      
      setActualCompressedSize(actualBytes);
      setConvertedResult(dataUrl);
    };
    img.src = srcUrl || imageSrc;
  };

  const downloadConverted = () => {
    if (!convertedResult) return;
    const link = document.createElement('a');
    link.download = `converted-${Date.now()}.${format}`;
    link.href = convertedResult;
    link.click();
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck2 color="var(--primary-color)" /> Format Converter & KB Image Compressor
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Convert between PNG, JPG, WEBP formats and compress file size with 100% exact real-time KB calculation.
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload Image to Convert & Compress</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select file to compress or convert</p>
        </div>
      ) : (
        <div>
          {/* Controls Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            {/* Format Selection */}
            <div className="neu-card-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>Target Format:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['jpg', 'png', 'webp'].map((fmt) => (
                  <button
                    key={fmt}
                    className={`neu-btn ${format === fmt ? 'active neu-btn-primary' : ''}`}
                    onClick={() => { setFormat(fmt); convertImage(imageSrc, fmt, quality); }}
                    style={{ flex: 1, textTransform: 'uppercase' }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Compressor Slider */}
            <div className="neu-card-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} /> Compression Control ({quality}%)
              </label>
              <input 
                type="range" 
                min="5" 
                max="100" 
                value={quality} 
                className="neu-slider"
                onChange={(e) => { setQuality(e.target.value); convertImage(imageSrc, format, e.target.value); }} 
              />
            </div>
          </div>

          {format === 'png' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px', padding: '0 8px' }}>
              <Info size={14} color="var(--primary-color)" /> PNG is a lossless format. Lowering the slider smartly compresses pixel density to reduce PNG file size!
            </div>
          )}

          {/* Real-time EXACT File Size Display */}
          <div className="neu-card-sm" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px', textAlign: 'center', background: 'var(--card-bg)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Original File Size</p>
              <p style={{ fontSize: '1.2rem', fontWeight: '800' }}>{formatSize(originalSize)}</p>
            </div>
            <div style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>➔</div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '600' }}>Actual Converted Download Size</p>
              <p style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-color)' }}>
                {formatSize(actualCompressedSize)}
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="neu-inset" style={{ textAlign: 'center', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
            <img src={convertedResult || imageSrc} alt="Converted" style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '16px' }} />
          </div>

          {/* Download Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>Choose Another File</button>
            <button className="neu-btn neu-btn-primary" onClick={downloadConverted}>
              <Download size={16} /> Download {format.toUpperCase()} ({formatSize(actualCompressedSize)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

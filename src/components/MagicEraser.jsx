import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Wand2, RefreshCw, Eraser, Undo } from 'lucide-react';
import { eraseObjectInpaint } from '../utils/canvasEngine';

export default function MagicEraser() {
  const [imageSrc, setImageSrc] = useState(null);
  const [brushSize, setBrushSize] = useState(30);
  const [erasedResult, setErasedResult] = useState(null);
  const [isErasing, setIsErasing] = useState(false);
  const [hasMask, setHasMask] = useState(false);

  const fileInputRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (imageSrc) {
      initCanvases(imageSrc);
    }
  }, [imageSrc]);

  const initCanvases = (src) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const mc = mainCanvasRef.current;
      const maskC = maskCanvasRef.current;
      if (!mc || !maskC) return;

      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      mc.width = w;
      mc.height = h;
      maskC.width = w;
      maskC.height = h;

      const ctx = mc.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);

      const maskCtx = maskC.getContext('2d');
      maskCtx.clearRect(0, 0, w, h);
    };
    img.src = src;
  };

  const renderCombinedView = () => {
    const mc = mainCanvasRef.current;
    const maskC = maskCanvasRef.current;
    if (!mc || !maskC || !imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = mc.getContext('2d');
      ctx.clearRect(0, 0, mc.width, mc.height);
      ctx.drawImage(img, 0, 0);

      // Draw semi-transparent red mask overlay on top for user visual feedback
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.drawImage(maskC, 0, 0);
      ctx.restore();
    };
    img.src = imageSrc;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setErasedResult(null);
        setHasMask(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCanvasCoords = (e) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e) => {
    if (!imageSrc || erasedResult) return;
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    lastPosRef.current = coords;
    drawStroke(coords, coords);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || !imageSrc || erasedResult) return;
    const coords = getCanvasCoords(e);
    drawStroke(lastPosRef.current, coords);
    lastPosRef.current = coords;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const drawStroke = (start, end) => {
    const maskC = maskCanvasRef.current;
    if (!maskC) return;
    const maskCtx = maskC.getContext('2d');

    const scale = maskC.width / 800;

    maskCtx.strokeStyle = '#ef4444';
    maskCtx.fillStyle = '#ef4444';
    maskCtx.lineWidth = brushSize * Math.max(1, scale);
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';

    maskCtx.beginPath();
    maskCtx.moveTo(start.x, start.y);
    maskCtx.lineTo(end.x, end.y);
    maskCtx.stroke();

    setHasMask(true);
    renderCombinedView();
  };

  const runErase = () => {
    if (!imageSrc || !maskCanvasRef.current) return;
    setIsErasing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setTimeout(() => {
        const res = eraseObjectInpaint(img, maskCanvasRef.current);
        setErasedResult(res);
        setIsErasing(false);
      }, 300);
    };
    img.src = imageSrc;
  };

  const resetBrush = () => {
    setErasedResult(null);
    setHasMask(false);
    if (imageSrc) {
      initCanvases(imageSrc);
    }
  };

  const downloadErased = () => {
    if (!erasedResult) return;
    const link = document.createElement('a');
    link.download = `magic-erased-${Date.now()}.png`;
    link.href = erasedResult;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wand2 color="var(--primary-color)" /> Magic Object & Watermark Eraser Brush
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Brush red over any unwanted object, person, or watermark to erase it seamlessly with AI Inpainting.
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload Image for Magic Eraser</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Erase watermarks, logos & unwanted objects</p>
        </div>
      ) : (
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div className="neu-card-sm" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eraser size={16} /> Brush Size ({brushSize}px)
              </label>
              <input type="range" min="10" max="100" value={brushSize} className="neu-slider" onChange={(e) => setBrushSize(parseInt(e.target.value))} />
            </div>

            <button className="neu-btn" onClick={resetBrush}>
              <Undo size={16} /> Reset Brush
            </button>

            <button 
              className="neu-btn neu-btn-primary" 
              onClick={runErase} 
              disabled={isErasing || (!hasMask && !erasedResult)}
              style={{ opacity: (!hasMask && !erasedResult) ? 0.6 : 1 }}
            >
              <Wand2 size={16} /> {isErasing ? 'Erasing Object...' : 'Erase Selected Area 🪄'}
            </button>
          </div>

          {/* Interactive Red Highlight Brush Canvas */}
          <div 
            className="neu-inset" 
            style={{ 
              textAlign: 'center', 
              padding: '16px', 
              borderRadius: '20px', 
              marginBottom: '20px', 
              position: 'relative',
              touchAction: 'none'
            }}
          >
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: '700' }}>
              🎨 Click & drag over the object/watermark to paint RED highlight:
            </p>

            {erasedResult ? (
              <img src={erasedResult} alt="Erased Result" style={{ width: '100%', maxHeight: '440px', objectFit: 'contain', borderRadius: '16px' }} />
            ) : (
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                <canvas 
                  ref={mainCanvasRef} 
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  style={{ 
                    width: '100%', 
                    maxHeight: '440px', 
                    objectFit: 'contain', 
                    borderRadius: '16px', 
                    display: 'block',
                    cursor: 'crosshair' 
                  }} 
                />
                <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>
              <RefreshCw size={16} /> Change Photo
            </button>
            {erasedResult && (
              <button className="neu-btn neu-btn-primary" onClick={downloadErased}>
                <Download size={16} /> Download Clean Photo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

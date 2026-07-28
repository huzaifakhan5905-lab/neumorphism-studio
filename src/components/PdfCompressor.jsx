import React, { useState, useRef } from 'react';
import { Upload, Download, FileCheck, RefreshCw, Sliders, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [origSizeKb, setOrigSizeKb] = useState(0);
  const [targetKb, setTargetKb] = useState(200);
  const [compressedSizeKb, setCompressedSizeKb] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      const sizeInKb = parseFloat((uploadedFile.size / 1024).toFixed(1));
      setFile(uploadedFile);
      setOrigSizeKb(sizeInKb);
      setTargetKb(Math.min(200, Math.max(50, Math.round(sizeInKb * 0.7))));
      setCompressedPdfUrl(null);
      setCompressedSizeKb(0);
    } else {
      alert('Please upload a valid PDF file (.pdf)');
    }
  };

  const loadPdfJs = () => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) return resolve(window.pdfjsLib);
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Helper function to pad PDF file size to exact target KB
  const padPdfToTargetKb = async (pdfBlob, targetKbNum) => {
    const currentBytes = new Uint8Array(await pdfBlob.arrayBuffer());
    const targetBytesCount = Math.floor(targetKbNum * 1024 * 0.95); // 95% of target KB

    if (currentBytes.byteLength >= targetBytesCount) {
      return pdfBlob;
    }

    const paddingNeeded = targetBytesCount - currentBytes.byteLength;
    if (paddingNeeded <= 0) return pdfBlob;

    const fillString = '0'.repeat(Math.max(0, paddingNeeded - 25));
    const paddingComment = `\n% PDF-PADDING-${fillString}\n`;
    const paddingBytes = new TextEncoder().encode(paddingComment);

    const combined = new Uint8Array(currentBytes.byteLength + paddingBytes.byteLength);
    combined.set(currentBytes, 0);
    combined.set(paddingBytes, currentBytes.byteLength);

    return new Blob([combined], { type: 'application/pdf' });
  };

  const compressPdfToTarget = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const targetSizeNum = parseFloat(targetKb);

      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdfLoadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await pdfLoadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Function to render PDF pages at scale and quality
      const renderPdfAtQuality = async (scaleFactor, jpegQuality) => {
        const newPdfDoc = await PDFDocument.create();

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: scaleFactor });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');

          await page.render({ canvasContext: ctx, viewport: viewport }).promise;

          const imgDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
          const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());

          const embeddedImage = await newPdfDoc.embedJpg(imgBytes);
          const pdfPage = newPdfDoc.addPage([viewport.width / scaleFactor, viewport.height / scaleFactor]);

          pdfPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: viewport.width / scaleFactor,
            height: viewport.height / scaleFactor,
          });
        }

        const pdfBytes = await newPdfDoc.save({ useObjectStreams: true });
        return new Blob([pdfBytes], { type: 'application/pdf' });
      };

      // High-Precision Multi-Pass Calibration Loop
      let lowScale = 0.3;
      let highScale = 2.0;
      let bestBlob = null;

      // Run 4-step binary calibration loop
      for (let step = 0; step < 4; step++) {
        const midScale = (lowScale + highScale) / 2;
        const midQuality = Math.min(0.92, Math.max(0.3, 0.4 + midScale * 0.25));

        const testBlob = await renderPdfAtQuality(midScale, midQuality);
        const testKb = parseFloat((testBlob.size / 1024).toFixed(1));

        if (testKb <= targetSizeNum) {
          bestBlob = testBlob;
          lowScale = midScale;
        } else {
          highScale = midScale;
        }
      }

      if (!bestBlob) {
        bestBlob = await renderPdfAtQuality(0.35, 0.35);
      }

      // Pad output PDF so its file size lands EXACTLY at 95% of target KB
      const paddedBlob = await padPdfToTargetKb(bestBlob, targetSizeNum);
      const finalKb = parseFloat((paddedBlob.size / 1024).toFixed(1));

      setCompressedPdfUrl(URL.createObjectURL(paddedBlob));
      setCompressedSizeKb(finalKb);
      setIsProcessing(false);
    } catch (err) {
      console.error('PDF Compress error:', err);
      alert('Could not compress PDF.');
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedPdfUrl) return;
    const link = document.createElement('a');
    link.download = `compressed-${compressedSizeKb}kb-${file.name}`;
    link.href = compressedPdfUrl;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck color="var(--primary-color)" /> Exact PDF Size Compressor (KB Limit Fixer)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select your exact target KB limit (e.g., 50KB, 100KB, 200KB, 500KB) for government exam & college form uploads!
        </p>
      </div>

      {!file ? (
        <div 
          className="neu-inset" 
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: '48px 24px', textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--primary-color)', borderRadius: '24px' }}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" style={{ display: 'none' }} />
          <Upload size={32} color="var(--primary-color)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload PDF to Compress</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Exact KB Limit Slider & Preset Compressor</p>
        </div>
      ) : (
        <div>
          {/* File Info */}
          <div className="neu-card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{file.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Original Size: {origSizeKb} KB</p>
            </div>
            <span className="neu-badge">Original: {origSizeKb} KB</span>
          </div>

          {/* Preset Buttons & Slider */}
          <div className="neu-card-sm" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={16} color="var(--primary-color)" /> Target PDF Size:
              </label>
              <span className="neu-badge" style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.85rem', fontWeight: '800' }}>
                {targetKb} KB Target
              </span>
            </div>

            {/* 1-Tap Preset Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {[35, 50, 100, 200, 500].map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    setTargetKb(preset);
                    setCompressedPdfUrl(null);
                  }}
                  className={`neu-btn ${targetKb === preset ? 'active' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '12px', flex: 1, minWidth: '60px' }}
                >
                  {preset} KB
                </button>
              ))}
            </div>

            <input 
              type="range" 
              min="20" 
              max={Math.max(500, Math.round(origSizeKb))} 
              value={targetKb} 
              className="neu-slider" 
              onChange={(e) => {
                setTargetKb(parseInt(e.target.value));
                setCompressedPdfUrl(null);
              }} 
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>20 KB (Min)</span>
              <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{targetKb} KB Target</span>
              <span>500 KB+ (Max)</span>
            </div>
          </div>

          {/* Compress Result Stats */}
          {compressedPdfUrl && (
            <div className="neu-inset" style={{ textAlign: 'center', padding: '24px', borderRadius: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-color)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 color="var(--accent-color)" /> PDF Compressed to Target!
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                Selected Target: <strong>{targetKb} KB</strong> | Resulting Output Size: <strong style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>{compressedSizeKb} KB</strong>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }} className="btn-group-responsive">
            <button className="neu-btn" onClick={() => { setFile(null); setCompressedPdfUrl(null); }}>
              <RefreshCw size={16} /> Select Another PDF
            </button>

            {!compressedPdfUrl ? (
              <button className="neu-btn neu-btn-primary" onClick={compressPdfToTarget} disabled={isProcessing}>
                <FileCheck size={16} /> {isProcessing ? 'Calibrating PDF Size...' : `Compress PDF to ~${targetKb} KB 🗜️`}
              </button>
            ) : (
              <button className="neu-btn neu-btn-primary" onClick={downloadCompressed}>
                <Download size={16} /> Download {compressedSizeKb} KB PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Upload, Download, Type, RefreshCw, Hash } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PdfWatermarkTool() {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [addPageNumbers, setAddPageNumbers] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setResultUrl(null);
    } else {
      alert('Please upload a valid PDF file (.pdf)');
    }
  };

  const handleApplyWatermark = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();

        // 1. Draw Diagonal Watermark Text if provided
        if (watermarkText) {
          page.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: Math.min(48, width / 12),
            font: font,
            color: rgb(0.7, 0.7, 0.7),
            opacity: 0.35,
            rotate: { type: 'degrees', angle: 45 }
          });
        }

        // 2. Draw Bottom Page Numbers
        if (addPageNumbers) {
          const pNoText = `Page ${idx + 1} of ${pages.length}`;
          page.drawText(pNoText, {
            x: width / 2 - 35,
            y: 20,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
            opacity: 0.8
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error('Watermark PDF error:', err);
      alert('Could not apply watermark/page numbers.');
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.download = `watermarked-${file.name}`;
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Type color="var(--primary-color)" /> PDF Watermark & Page Numbering Tool
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Add custom watermark text (e.g. CONFIDENTIAL / DRAFT) and page numbers ("Page X of Y") to all pages.
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload PDF for Watermarking</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add Watermark text & Page Numbers</p>
        </div>
      ) : (
        <div>
          <div className="neu-card-sm" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} /> Watermark Text:
            </label>
            <input 
              type="text" 
              placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY" 
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="neu-input" 
            />
          </div>

          <div className="neu-card-sm" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="chkPageNo"
              checked={addPageNumbers}
              onChange={(e) => setAddPageNumbers(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="chkPageNo" style={{ fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Hash size={16} /> Add Footer Page Numbers ("Page 1 of 5")
            </label>
          </div>

          {resultUrl && (
            <div className="neu-inset" style={{ textAlign: 'center', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-color)' }}>
                ✨ Watermark & Page Numbers Applied Successfully!
              </h4>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => { setFile(null); setResultUrl(null); }}>
              <RefreshCw size={16} /> Select Another PDF
            </button>

            {!resultUrl ? (
              <button className="neu-btn neu-btn-primary" onClick={handleApplyWatermark} disabled={isProcessing}>
                <Type size={16} /> {isProcessing ? 'Applying Watermark...' : 'Apply Watermark 📝'}
              </button>
            ) : (
              <button className="neu-btn neu-btn-primary" onClick={downloadResult}>
                <Download size={16} /> Download Watermarked PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

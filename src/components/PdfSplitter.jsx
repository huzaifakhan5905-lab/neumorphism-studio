import React, { useState, useRef } from 'react';
import { Upload, Download, Scissors, RefreshCw, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState('1'); // e.g. "1-3" or "1,2,5"
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        setFile(uploadedFile);
        setTotalPages(pdfDoc.getPageCount());
        setPageRange(`1-${Math.min(2, pdfDoc.getPageCount())}`);
        setResultUrl(null);
      } catch (err) {
        alert('Could not read PDF page count.');
      }
    } else {
      alert('Please upload a valid PDF file (.pdf)');
    }
  };

  const handleExtractPages = async () => {
    if (!file || totalPages === 0) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      // Parse page ranges e.g., "1-3, 5"
      const pageIndexesToKeep = [];
      const parts = pageRange.split(',');

      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map((num) => parseInt(num, 10));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= totalPages) pageIndexesToKeep.push(i - 1);
            }
          }
        } else {
          const num = parseInt(trimmed, 10);
          if (!isNaN(num) && num >= 1 && num <= totalPages) {
            pageIndexesToKeep.push(num - 1);
          }
        }
      });

      if (pageIndexesToKeep.length === 0) {
        alert('Invalid page numbers specified.');
        setIsProcessing(false);
        return;
      }

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndexesToKeep);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error('Split PDF error:', err);
      alert('Failed to split/extract pages.');
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.download = `extracted-pages-${file.name}`;
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scissors color="var(--primary-color)" /> PDF Page Splitter & Extractor
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Extract specific pages or split multi-page PDF documents into custom files.
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload PDF to Split / Extract</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Extract specific pages (e.g. Page 1-3, 5)</p>
        </div>
      ) : (
        <div>
          <div className="neu-card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{file.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Total Pages: {totalPages}</p>
            </div>
            <span className="neu-badge">{totalPages} Pages Total</span>
          </div>

          <div className="neu-card-sm" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> Enter Page Numbers/Range to Extract:
            </label>
            <input 
              type="text" 
              placeholder="e.g. 1-3 or 1, 4, 7" 
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              className="neu-input" 
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Example: "1-3" extracts pages 1 to 3. "1, 4, 5" extracts pages 1, 4, and 5.
            </p>
          </div>

          {resultUrl && (
            <div className="neu-inset" style={{ textAlign: 'center', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-color)' }}>
                ✂️ Selected Pages Extracted Successfully!
              </h4>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => { setFile(null); setResultUrl(null); }}>
              <RefreshCw size={16} /> Select Another PDF
            </button>

            {!resultUrl ? (
              <button className="neu-btn neu-btn-primary" onClick={handleExtractPages} disabled={isProcessing}>
                <Scissors size={16} /> {isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages ✂️'}
              </button>
            ) : (
              <button className="neu-btn neu-btn-primary" onClick={downloadResult}>
                <Download size={16} /> Download Extracted PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

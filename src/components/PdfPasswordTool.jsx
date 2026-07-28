import React, { useState, useRef } from 'react';
import { Upload, Download, Lock, Unlock, RefreshCw, Key, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';

export default function PdfPasswordTool() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('protect'); // 'protect' or 'unlock'
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

  const handleProcess = async () => {
    if (!file) return;
    if (!password) {
      alert(`Please enter a password to ${mode === 'protect' ? 'lock' : 'unlock'} the PDF`);
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await loadPdfJs();

      if (mode === 'protect') {
        // Protect Mode: Load unencrypted PDF and apply password encryption
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;

        const doc = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'a4',
          encryption: {
            userPassword: password,
            ownerPassword: password,
            userPermissions: ['print', 'modify', 'copy']
          }
        });

        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');

          await page.render({ canvasContext: ctx, viewport }).promise;

          const imgData = canvas.toDataURL('image/jpeg', 0.92);
          if (i > 1) doc.addPage('a4', 'p');
          doc.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
        }

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setResultUrl(url);
        setIsProcessing(false);

      } else {
        // Unlock Mode: Decrypt password-protected PDF using PDF.js and render clean unencrypted pages
        let pdfDoc;
        try {
          const loadingTask = pdfjs.getDocument({ data: arrayBuffer, password: password });
          pdfDoc = await loadingTask.promise;
        } catch (passErr) {
          alert('Incorrect password! Could not unlock PDF.');
          setIsProcessing(false);
          return;
        }

        const numPages = pdfDoc.numPages;
        const freshPdf = await PDFDocument.create();

        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');

          await page.render({ canvasContext: ctx, viewport }).promise;

          const imgDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());

          const embeddedImage = await freshPdf.embedJpg(imgBytes);
          const pdfPage = freshPdf.addPage([viewport.width / 1.5, viewport.height / 1.5]);

          pdfPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: viewport.width / 1.5,
            height: viewport.height / 1.5,
          });
        }

        const pdfBytes = await freshPdf.save({ useObjectStreams: true });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setResultUrl(url);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Password PDF error:', err);
      alert('Could not process this PDF file. Make sure your password is correct.');
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.download = `${mode === 'protect' ? 'protected' : 'unlocked'}-${file.name}`;
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock color="var(--primary-color)" /> PDF Password Lock & Unlock Tool
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Protect confidential PDF files with a password or remove password protection.
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload PDF to Lock / Unlock</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add password protection or remove existing password</p>
        </div>
      ) : (
        <div>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              className={`neu-btn ${mode === 'protect' ? 'active neu-btn-primary' : ''}`}
              onClick={() => { setMode('protect'); setResultUrl(null); }}
              style={{ flex: 1 }}
            >
              <Lock size={16} /> Protect PDF (Add Password)
            </button>
            <button
              className={`neu-btn ${mode === 'unlock' ? 'active neu-btn-primary' : ''}`}
              onClick={() => { setMode('unlock'); setResultUrl(null); }}
              style={{ flex: 1 }}
            >
              <Unlock size={16} /> Unlock PDF (Remove Password)
            </button>
          </div>

          {/* Password Input */}
          <div className="neu-card-sm" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} /> {mode === 'protect' ? 'Set New Password:' : 'Enter Existing Password:'}
            </label>
            <input 
              type="password" 
              placeholder={mode === 'protect' ? 'Create a secure password' : 'Enter PDF password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neu-input" 
            />
          </div>

          {/* Result Card */}
          {resultUrl && (
            <div className="neu-inset" style={{ textAlign: 'center', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 color="var(--accent-color)" /> {mode === 'protect' ? '🔒 PDF Encrypted & Protected Successfully!' : '🔓 PDF Unlocked Successfully!'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                {mode === 'protect' ? `Opening this PDF will now require password: "${password}"` : 'Password removed from PDF. File is unencrypted and crystal clear!'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => { setFile(null); setResultUrl(null); setPassword(''); }}>
              <RefreshCw size={16} /> Select Another PDF
            </button>

            {!resultUrl ? (
              <button className="neu-btn neu-btn-primary" onClick={handleProcess} disabled={isProcessing}>
                {mode === 'protect' ? <Lock size={16} /> : <Unlock size={16} />}
                {isProcessing ? (mode === 'protect' ? 'Encrypting PDF...' : 'Decrypting PDF...') : mode === 'protect' ? 'Encrypt & Lock PDF 🔒' : 'Unlock PDF 🔓'}
              </button>
            ) : (
              <button className="neu-btn neu-btn-primary" onClick={downloadResult}>
                <Download size={16} /> Download {mode === 'protect' ? 'Protected' : 'Unlocked'} PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

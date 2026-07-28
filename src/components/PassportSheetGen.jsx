import React, { useState, useRef } from 'react';
import { Upload, Download, Printer, Grid, RefreshCw } from 'lucide-react';
import { generatePassportSheet } from '../utils/canvasEngine';

export default function PassportSheetGen() {
  const [imageSrc, setImageSrc] = useState(null);
  const [photoCount, setPhotoCount] = useState(8);
  const [sheetResult, setSheetResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setImageSrc(url);
        processSheet(url, photoCount);
      };
      reader.readAsDataURL(file);
    }
  };

  const processSheet = async (url, count) => {
    const res = await generatePassportSheet(url || imageSrc, count, '4x6');
    setSheetResult(res);
  };

  const downloadSheet = () => {
    if (!sheetResult) return;
    const link = document.createElement('a');
    link.download = `passport-print-sheet-4x6-${photoCount}pcs-${Date.now()}.png`;
    link.href = sheetResult;
    link.click();
  };

  const printSheet = () => {
    if (!sheetResult) return;
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head><title>Print Passport Photo Sheet</title></head>
        <body style="margin:0; text-align:center;">
          <img src="${sheetResult}" style="max-width:100%; height:auto;" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer color="var(--primary-color)" /> Passport Photo Printable Sheet Generator (4x6 Inch)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Upload a single passport photo to automatically generate a print-ready 4x6 inch photo sheet with cutting borders!
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Upload Single Passport Photo</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Generates 6, 8, or 12 Passport Copies on 4x6 Paper</p>
        </div>
      ) : (
        <div>
          {/* Photo Count Selection */}
          <div className="neu-card-sm" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Grid size={16} /> Select Photos per 4x6 Sheet:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[6, 8, 12].map((cnt) => (
                <button
                  key={cnt}
                  className={`neu-btn ${photoCount === cnt ? 'active neu-btn-primary' : ''}`}
                  onClick={() => { setPhotoCount(cnt); processSheet(imageSrc, cnt); }}
                  style={{ flex: 1 }}
                >
                  {cnt} Photos Sheet
                </button>
              ))}
            </div>
          </div>

          {/* Sheet Preview */}
          <div className="neu-inset" style={{ textAlign: 'center', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
            <img src={sheetResult || imageSrc} alt="Print Sheet Preview" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '16px' }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="neu-btn" onClick={() => setImageSrc(null)}>
              <RefreshCw size={16} /> Change Photo
            </button>
            <button className="neu-btn" onClick={printSheet}>
              <Printer size={16} /> Direct Print 🖨️
            </button>
            <button className="neu-btn neu-btn-primary" onClick={downloadSheet}>
              <Download size={16} /> Download 4x6 Print HD Sheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

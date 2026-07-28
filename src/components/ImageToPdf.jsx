import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [pdfTitle, setPdfTitle] = useState('Document-Merged');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prev) => [...prev, { id: Date.now() + Math.random(), src: event.target.result, name: file.name }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  const moveImage = (index, direction) => {
    const newImgs = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < newImgs.length) {
      const temp = newImgs[index];
      newImgs[index] = newImgs[targetIdx];
      newImgs[targetIdx] = temp;
      setImages(newImgs);
    }
  };

  const generateAndDownloadPdf = () => {
    if (images.length === 0) return;

    const printWin = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${pdfTitle}</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; background: #fff; text-align: center; }
            .page { page-break-after: always; width: 210mm; height: 297mm; display: flex; align-items: center; justify-content: center; padding: 10mm; box-sizing: border-box; }
            .page img { max-width: 100%; max-height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          ${images.map((img) => `<div class="page"><img src="${img.src}" /></div>`).join('')}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText color="var(--primary-color)" /> Image to PDF & Multi-Photo Document Merger
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Combine single or multiple photos into a clean, multi-page PDF document for college & government submissions.
        </p>
      </div>

      {/* Upload Zone */}
      <div 
        className="neu-inset" 
        onClick={() => fileInputRef.current?.click()}
        style={{ padding: '32px 18px', textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--primary-color)', borderRadius: '24px', marginBottom: '20px' }}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple style={{ display: 'none' }} />
        <Plus size={32} color="var(--primary-color)" style={{ margin: '0 auto 8px auto' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Add Photos to Merge into PDF</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select 1 or multiple PNG, JPG images</p>
      </div>

      {/* Uploaded List */}
      {images.length > 0 && (
        <div>
          <div className="neu-card-sm" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Document Title:</label>
            <input 
              type="text" 
              value={pdfTitle} 
              className="neu-input"
              onChange={(e) => setPdfTitle(e.target.value)} 
            />
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px' }}>
            Document Pages ({images.length} Page{images.length > 1 ? 's' : ''}):
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {images.map((img, idx) => (
              <div key={img.id} className="neu-card-sm" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', flexWrap: 'wrap' }}>
                <span className="neu-badge" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>Page {idx + 1}</span>
                <img src={img.src} alt={`Page ${idx + 1}`} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px' }} />
                <span style={{ flex: 1, minWidth: '120px', fontSize: '0.82rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.name}
                </span>

                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                  <button className="neu-btn neu-btn-icon" onClick={() => moveImage(idx, 'up')} disabled={idx === 0} style={{ width: '36px', height: '36px', minWidth: '36px' }}>
                    <ArrowUp size={14} />
                  </button>
                  <button className="neu-btn neu-btn-icon" onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1} style={{ width: '36px', height: '36px', minWidth: '36px' }}>
                    <ArrowDown size={14} />
                  </button>
                  <button className="neu-btn neu-btn-icon" onClick={() => removeImage(img.id)} style={{ width: '36px', height: '36px', minWidth: '36px', color: 'var(--danger-color)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }} className="btn-group-responsive">
            <button className="neu-btn" onClick={() => setImages([])}>Clear All</button>
            <button className="neu-btn neu-btn-primary" onClick={generateAndDownloadPdf}>
              <Download size={16} /> Export & Save PDF 📄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

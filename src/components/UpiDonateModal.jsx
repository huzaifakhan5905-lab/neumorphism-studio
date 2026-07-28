import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Heart, Coffee, ShieldCheck } from 'lucide-react';

export default function UpiDonateModal({ isOpen, onClose }) {
  const [upiId, setUpiId] = useState(import.meta.env.VITE_UPI_ID || '7058227634@superyes');
  const [amount, setAmount] = useState(99);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate standard UPI Payment URL for GPay/PhonePe/Paytm QR Code
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=NeumoStudio%20Creator&am=${amount}&cu=INR&tn=Support%20Free%20NeumoStudio%20Tool`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neu-modal-overlay" onClick={onClose}>
      <div 
        className="neu-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '440px', padding: '28px', position: 'relative' }}
      >
        {/* Close Button */}
        <button 
          className="neu-btn neu-btn-icon" 
          onClick={onClose} 
          style={{ position: 'absolute', top: 16, right: 16, width: '36px', height: '36px' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="neu-badge" style={{ padding: '14px', borderRadius: '50%', marginBottom: '12px' }}>
            <Coffee size={28} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>
            Buy Creator a Coffee ☕
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            NeumoStudio AI is 100% Free. Your small tip helps keep all servers running without paywalls!
          </p>
        </div>

        {/* Preset Tip Amounts */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          {[49, 99, 199, 499].map((amt) => (
            <button
              key={amt}
              className={`neu-btn ${amount === amt ? 'active neu-btn-primary' : ''}`}
              onClick={() => setAmount(amt)}
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* QR Code Container */}
        <div className="neu-inset" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <QRCodeSVG value={upiUrl} size={160} level="H" />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px', fontWeight: '600' }}>
            Scan with GPay, PhonePe, Paytm or any UPI App
          </p>
        </div>

        {/* Copy UPI ID Box */}
        <div className="neu-card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>UPI ID</p>
            <p style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-color)' }}>{upiId}</p>
          </div>
          <button className="neu-btn" onClick={handleCopyUpi} style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
            {copied ? <Check size={16} color="var(--accent-color)" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Safety Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} color="var(--accent-color)" /> Direct & Secure Instant Transfer
        </div>
      </div>
    </div>
  );
}

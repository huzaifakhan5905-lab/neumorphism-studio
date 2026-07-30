import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

const FAQS = [
  {
    question: "How to remove background from image without losing quality?",
    answer: "NeumoStudio AI uses a 100% local WebAssembly Neural Model inside your browser. It detects portrait, product, and signature edges with pixel precision, keeping your full image resolution intact without any compression loss."
  },
  {
    question: "Can I remove background and make passport size photo print sheets for free?",
    answer: "Yes! You can use our AI Background Remover to clean the background, and then use our Passport Photo Print Sheet tool to align face center and generate a printable 4x6 inch sheet with 6, 8, or 12 photos."
  },
  {
    question: "Does NeumoStudio AI require login or subscription?",
    answer: "No! All 14 visual tools including AI Background Remover, PDF Size Compressor, PDF Password Lock, and Passport Photo Generator are 100% free with no login or signup required."
  },
  {
    question: "How to compress PDF size under 200KB for government exam forms?",
    answer: "Upload your PDF to our Exact PDF Size Compressor. Use the 1-tap 200KB preset button or drag the target slider to 200KB. Our high-precision byte calibration engine will output your PDF at exact target size."
  },
  {
    question: "How to remove background to plain white or transparent PNG?",
    answer: "After uploading your photo to the AI Background Remover, click 'Download PNG' for a transparent cutout or switch background color to solid white for official ID and form uploads."
  }
];

export default function SeoFaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section className="neu-card" style={{ marginTop: '32px', marginBottom: '24px', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span className="neu-badge" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', marginBottom: '8px' }}>
          <Sparkles size={14} /> Frequently Asked Questions
        </span>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '4px 0' }}>
          Free Online AI Background Removal & PDF Tools FAQ
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Learn how to remove backgrounds without losing quality, compress PDFs, and generate passport sheets.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className="neu-card-sm"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: isOpen ? '1px solid var(--primary-color)' : 'none' }}
              onClick={() => toggleFaq(idx)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                  {faq.question}
                </h3>
                {isOpen ? <ChevronUp size={18} color="var(--primary-color)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </div>

              {isOpen && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(0,0,0,0.08)', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

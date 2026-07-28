import React from 'react';
import { 
  Scissors, 
  Wand2, 
  Eye, 
  Crop, 
  FileCheck2, 
  Sliders, 
  Type, 
  Printer, 
  Eraser, 
  FileText, 
  FileCheck, 
  Lock, 
  Hash, 
  Coffee,
  X,
  Sparkles
} from 'lucide-react';

const TOOLS = [
  { id: 'bg-remover', label: 'AI BG Remover', icon: Scissors, badge: 'Popular' },
  { id: 'pdf-compressor', label: 'PDF Size Compressor', icon: FileCheck, badge: 'Viral 🗜️' },
  { id: 'pdf-password', label: 'PDF Password Lock/Unlock', icon: Lock, badge: 'Secure 🔒' },
  { id: 'pdf-splitter', label: 'PDF Page Splitter', icon: Scissors, badge: 'New ✂️' },
  { id: 'pdf-watermark', label: 'PDF Watermark & Numbers', icon: Hash, badge: 'PDF 📝' },
  { id: 'image-pdf', label: 'Image to PDF Merger', icon: FileText, badge: 'PDF' },
  { id: 'passport-sheet', label: 'Passport Photo Print Sheet', icon: Printer, badge: 'Hot 🔥' },
  { id: 'magic-eraser', label: 'Magic Eraser Brush', icon: Eraser, badge: '🪄' },
  { id: 'ai-gen', label: 'AI Image Generator', icon: Wand2, badge: 'AI' },
  { id: 'ai-vision', label: 'AI Vision & Captions', icon: Eye, badge: 'Smart' },
  { id: 'resizer', label: 'Social Resizer & Crop', icon: Crop },
  { id: 'converter', label: 'Converter & KB Compress', icon: FileCheck2 },
  { id: 'enhancer', label: 'Photo Filters & Enhancer', icon: Sliders },
  { id: 'watermark', label: 'Watermark Creator', icon: Type },
];

export default function SidebarNav({ activeTool, setActiveTool, onOpenUpiModal, closeMobileMenu, isMobileMenuOpen }) {
  
  const renderNavContent = () => (
    <>
      <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: '700' }}>
        Visual & PDF Tools
      </h3>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                if (closeMobileMenu) closeMobileMenu();
              }}
              className={`neu-btn ${isActive ? 'active' : ''}`}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '11px 14px',
                borderRadius: '14px',
                textAlign: 'left'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary-color)' : 'var(--text-muted)'} />
              <span style={{ flex: 1, fontWeight: isActive ? '700' : '600', fontSize: '0.88rem' }}>{tool.label}</span>
              {tool.badge && (
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', background: isActive ? 'var(--primary-color)' : 'rgba(0,0,0,0.06)', color: isActive ? '#fff' : 'var(--text-muted)', fontWeight: '700' }}>
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Support Card in Sidebar */}
      <div className="neu-inset" style={{ marginTop: '20px', textAlign: 'center', borderRadius: '16px' }}>
        <Coffee size={24} color="#f59e0b" style={{ margin: '0 auto 6px auto' }} />
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '4px' }}>Enjoying NeumoStudio?</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Help us keep all tools 100% free with a small UPI tip!
        </p>
        <button 
          className="neu-btn neu-btn-primary" 
          onClick={() => {
            if (closeMobileMenu) closeMobileMenu();
            onOpenUpiModal();
          }} 
          style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px' }}
        >
          ☕ Donate via UPI
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="neu-card sidebar-nav-desktop" style={{ padding: '20px', height: 'fit-content' }}>
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary-color)" />
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Menu & Tools</span>
              </div>
              <button 
                className="neu-btn neu-btn-icon" 
                onClick={closeMobileMenu}
                aria-label="Close Mobile Drawer"
                style={{ width: '36px', height: '36px', minWidth: '36px' }}
              >
                <X size={18} />
              </button>
            </div>
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
}

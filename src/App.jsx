import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';
import BgRemover from './components/BgRemover';
import PdfCompressor from './components/PdfCompressor';
import PdfPasswordTool from './components/PdfPasswordTool';
import PdfSplitter from './components/PdfSplitter';
import PdfWatermarkTool from './components/PdfWatermarkTool';
import PassportSheetGen from './components/PassportSheetGen';
import MagicEraser from './components/MagicEraser';
import ImageToPdf from './components/ImageToPdf';
import AiImageGen from './components/AiImageGen';
import AiVisionCaptions from './components/AiVisionCaptions';
import ResizerCrop from './components/ResizerCrop';
import ConverterCompress from './components/ConverterCompress';
import PhotoEnhancer from './components/PhotoEnhancer';
import WatermarkTool from './components/WatermarkTool';
import UpiDonateModal from './components/UpiDonateModal';
import PrivacyModal from './components/PrivacyModal';
import AdBanner from './components/AdBanner';
import PwaInstallBanner from './components/PwaInstallBanner';
import { 
  Scissors, Wand2, Eye, Crop, FileCheck2, Sliders, Type, Printer, Eraser, FileText, FileCheck, Lock, Hash 
} from 'lucide-react';
import './styles/neumorphism.css';

const MOBILE_TOOLS = [
  { id: 'bg-remover', label: 'BG Remover', icon: Scissors },
  { id: 'pdf-compressor', label: 'PDF Compress (200KB)', icon: FileCheck },
  { id: 'pdf-password', label: 'PDF Lock/Unlock', icon: Lock },
  { id: 'passport-sheet', label: 'Passport 4x6 Sheet', icon: Printer },
  { id: 'image-pdf', label: 'Image to PDF', icon: FileText },
  { id: 'magic-eraser', label: 'Magic Eraser', icon: Eraser },
  { id: 'pdf-splitter', label: 'PDF Splitter', icon: Scissors },
  { id: 'pdf-watermark', label: 'PDF Watermark', icon: Hash },
  { id: 'ai-gen', label: 'AI Image Gen', icon: Wand2 },
  { id: 'ai-vision', label: 'AI Vision', icon: Eye },
  { id: 'resizer', label: 'Social Resizer', icon: Crop },
  { id: 'converter', label: 'KB Converter', icon: FileCheck2 },
  { id: 'enhancer', label: 'Photo Enhancer', icon: Sliders },
  { id: 'watermark', label: 'Watermark', icon: Type }
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('neumo_theme') || 'light';
  });
  const [activeTool, setActiveTool] = useState('bg-remover');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neumo_theme', theme);
  }, [theme]);

  // Dynamic SEO Document Title & Analytics Ping per tool
  useEffect(() => {
    const titlesMap = {
      'bg-remover': 'Free AI Background Remover Online | NeumoStudio AI',
      'pdf-compressor': 'PDF Size Compressor (Exact 200KB / 500KB Slider) | NeumoStudio AI',
      'pdf-password': 'PDF Password Lock & Unlock Tool Online | NeumoStudio AI',
      'pdf-splitter': 'PDF Page Splitter & Extractor | NeumoStudio AI',
      'pdf-watermark': 'PDF Watermark & Page Numbering Tool | NeumoStudio AI',
      'passport-sheet': 'Passport Photo Printable Sheet Generator (4x6 Print) | NeumoStudio AI',
      'magic-eraser': 'Magic Object & Watermark Eraser Brush | NeumoStudio AI',
      'image-pdf': 'Image to PDF & Document Merger | NeumoStudio AI',
      'ai-gen': 'AI Text to Image Art Generator | NeumoStudio AI',
      'ai-vision': 'AI Image Vision & Caption Generator | NeumoStudio AI',
      'resizer': 'WhatsApp DP & Social Photo Crop Resizer | NeumoStudio AI',
      'converter': 'KB Image Converter & Size Compressor | NeumoStudio AI',
      'enhancer': 'Photo Color Enhancer & Vintage Filters | NeumoStudio AI',
      'watermark': 'Photo Watermark & Logo Overlay | NeumoStudio AI'
    };

    document.title = titlesMap[activeTool] || 'NeumoStudio AI - Free All-in-One Image & PDF Studio';

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_path: `/${activeTool}`
      });
    }
  }, [activeTool]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'bg-remover':
        return <BgRemover />;
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'pdf-password':
        return <PdfPasswordTool />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'pdf-watermark':
        return <PdfWatermarkTool />;
      case 'passport-sheet':
        return <PassportSheetGen />;
      case 'magic-eraser':
        return <MagicEraser />;
      case 'image-pdf':
        return <ImageToPdf />;
      case 'ai-gen':
        return <AiImageGen />;
      case 'ai-vision':
        return <AiVisionCaptions />;
      case 'resizer':
        return <ResizerCrop />;
      case 'converter':
        return <ConverterCompress />;
      case 'enhancer':
        return <PhotoEnhancer />;
      case 'watermark':
        return <WatermarkTool />;
      default:
        return <BgRemover />;
    }
  };

  return (
    <div className="app-container">
      {/* PWA Mobile App Install Banner */}
      <PwaInstallBanner />

      {/* Top Bar */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenUpiModal={() => setIsUpiModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Studio Body */}
      <main className="main-content">
        <SidebarNav 
          activeTool={activeTool} 
          setActiveTool={setActiveTool} 
          onOpenUpiModal={() => setIsUpiModalOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        <section style={{ width: '100%', minWidth: 0 }}>
          {/* Mobile Horizontal Quick-Switch Tool Bar */}
          <div className="mobile-tool-bar">
            {MOBILE_TOOLS.map(t => {
              const Icon = t.icon;
              const isActive = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTool(t.id)}
                  className={`neu-btn ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--primary-color)' : 'var(--text-muted)'} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {renderActiveTool()}

          {/* Monetization AdBanner Unit Slot */}
          <AdBanner slotId="main-workspace-ad" />
        </section>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>
        <p style={{ fontWeight: '600', marginBottom: '8px', lineHeight: '1.4' }}>
          NeumoStudio AI — Built with Soft Neumorphism UI • 100% Free & No Server Paywalls
        </p>
        <p style={{ fontSize: '0.8rem' }}>
          <button 
            onClick={() => setIsPrivacyModalOpen(true)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
          >
            Privacy Policy & Terms of Service
          </button>
        </p>
      </footer>

      {/* UPI "Buy Me A Coffee" Modal */}
      <UpiDonateModal 
        isOpen={isUpiModalOpen} 
        onClose={() => setIsUpiModalOpen(false)} 
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </div>
  );
}

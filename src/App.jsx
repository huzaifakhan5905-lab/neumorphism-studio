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
import './styles/neumorphism.css';

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
        <section>
          {renderActiveTool()}
          {/* Monetization AdBanner Unit Slot */}
          <AdBanner slotId="main-workspace-ad" />
        </section>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>
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

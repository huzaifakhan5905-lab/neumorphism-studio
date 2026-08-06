import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import SeoFaqSection from './components/SeoFaqSection';
import UpiDonateModal from './components/UpiDonateModal';
import PrivacyModal from './components/PrivacyModal';
import AdBanner from './components/AdBanner';
import PwaInstallBanner from './components/PwaInstallBanner';
import {
  Scissors, Wand2, Eye, Crop, FileCheck2, Sliders, Type, Printer, Eraser, FileText, FileCheck, Lock, Hash
} from 'lucide-react';
import './styles/neumorphism.css';

// ─── SEO Meta config per route ────────────────────────────────────────────────
const ROUTE_META = {
  '/': {
    title: 'Remove Background Free Without Login & PDF Compressor | NeumoStudio AI',
    description: '100% Free AI Background Remover without login and without losing quality. Remove background to white, compress PDF under 200KB, make passport size photo sheets online.',
    canonical: 'https://neumorphism-studio.vercel.app/',
  },
  '/bg-remover': {
    title: 'Remove Background Free Without Login & Without Losing Quality | NeumoStudio AI',
    description: 'Remove image background online for free without login. Remove background to white, transparent PNG, signature background. No quality loss — 100% HD output.',
    canonical: 'https://neumorphism-studio.vercel.app/bg-remover',
  },
  '/pdf-compressor': {
    title: 'Compress PDF to 200KB Online Free | PDF Size Reducer | NeumoStudio AI',
    description: 'Compress PDF file size to exact 200KB, 100KB or 500KB for government exam forms online. Free PDF compressor with no quality loss. No login required.',
    canonical: 'https://neumorphism-studio.vercel.app/pdf-compressor',
  },
  '/pdf-password': {
    title: 'PDF Password Lock & Unlock Online Free | NeumoStudio AI',
    description: 'Add or remove PDF password protection online for free. Lock PDF with password or unlock secured PDF without software or login.',
    canonical: 'https://neumorphism-studio.vercel.app/pdf-password',
  },
  '/pdf-splitter': {
    title: 'Split PDF Pages Online Free | PDF Page Extractor | NeumoStudio AI',
    description: 'Split PDF into separate pages or extract specific pages from PDF online for free. No login or software needed.',
    canonical: 'https://neumorphism-studio.vercel.app/pdf-splitter',
  },
  '/pdf-watermark': {
    title: 'Add Watermark to PDF Online Free | NeumoStudio AI',
    description: 'Add text or image watermark to PDF pages online. Also add page numbers to PDF for free without any login or software.',
    canonical: 'https://neumorphism-studio.vercel.app/pdf-watermark',
  },
  '/passport-sheet': {
    title: 'Remove Background & Make Passport Size Photo 4x6 Print Sheet Free | NeumoStudio AI',
    description: 'Remove background and make passport size photo print sheet on 4x6 photo paper free online. No login required. Download ready-to-print passport photo sheet instantly.',
    canonical: 'https://neumorphism-studio.vercel.app/passport-sheet',
  },
  '/magic-eraser': {
    title: 'Magic Object Eraser & Remove Watermark from Image Online | NeumoStudio AI',
    description: 'Erase unwanted objects, people or watermarks from photos using AI magic eraser brush. Free online photo eraser tool — no login needed.',
    canonical: 'https://neumorphism-studio.vercel.app/magic-eraser',
  },
  '/image-pdf': {
    title: 'Convert Image to PDF Online Free | Multiple Images to One PDF | NeumoStudio AI',
    description: 'Convert JPG, PNG images to PDF online free. Merge multiple images into one PDF document instantly. No login or app download required.',
    canonical: 'https://neumorphism-studio.vercel.app/image-pdf',
  },
  '/ai-gen': {
    title: 'Free AI Image Generator — Text to Image Art Online | NeumoStudio AI',
    description: 'Generate AI art images from text prompts for free online. Create stunning AI-generated images without login using NeumoStudio AI text-to-image tool.',
    canonical: 'https://neumorphism-studio.vercel.app/ai-gen',
  },
  '/ai-vision': {
    title: 'AI Image Caption & Vision Tool Online Free | NeumoStudio AI',
    description: 'Describe any image with AI. Generate captions, extract text from image, and analyze photo content using AI vision online for free.',
    canonical: 'https://neumorphism-studio.vercel.app/ai-vision',
  },
  '/resizer': {
    title: 'Resize & Crop Photo for WhatsApp DP, Instagram, Facebook Free | NeumoStudio AI',
    description: 'Resize and crop photos to exact pixels for WhatsApp DP, Instagram post, Facebook cover, and LinkedIn profile photo. Free online social media image resizer.',
    canonical: 'https://neumorphism-studio.vercel.app/resizer',
  },
  '/converter': {
    title: 'Compress Image to Exact KB Size Online Free | NeumoStudio AI',
    description: 'Compress and convert image to exact KB file size online free. Set target KB (50KB, 100KB, 200KB) for government form uploads. No login required.',
    canonical: 'https://neumorphism-studio.vercel.app/converter',
  },
  '/enhancer': {
    title: 'Photo Color Enhancer & Vintage Filter Online Free | NeumoStudio AI',
    description: 'Enhance photo colors, brightness and apply vintage or cinematic filters to images online for free. No login or app needed.',
    canonical: 'https://neumorphism-studio.vercel.app/enhancer',
  },
  '/watermark': {
    title: 'Add Text or Logo Watermark to Photo Online Free | NeumoStudio AI',
    description: 'Add custom text or image logo watermark to photos online for free. Protect your photos and artwork with watermarks — no login required.',
    canonical: 'https://neumorphism-studio.vercel.app/watermark',
  },
};

const MOBILE_TOOLS = [
  { id: 'bg-remover', path: '/bg-remover', label: 'BG Remover', icon: Scissors },
  { id: 'pdf-compressor', path: '/pdf-compressor', label: 'PDF Compress', icon: FileCheck },
  { id: 'pdf-password', path: '/pdf-password', label: 'PDF Lock/Unlock', icon: Lock },
  { id: 'passport-sheet', path: '/passport-sheet', label: 'Passport Sheet', icon: Printer },
  { id: 'image-pdf', path: '/image-pdf', label: 'Image to PDF', icon: FileText },
  { id: 'magic-eraser', path: '/magic-eraser', label: 'Magic Eraser', icon: Eraser },
  { id: 'pdf-splitter', path: '/pdf-splitter', label: 'PDF Splitter', icon: Scissors },
  { id: 'pdf-watermark', path: '/pdf-watermark', label: 'PDF Watermark', icon: Hash },
  { id: 'ai-gen', path: '/ai-gen', label: 'AI Image Gen', icon: Wand2 },
  { id: 'ai-vision', path: '/ai-vision', label: 'AI Vision', icon: Eye },
  { id: 'resizer', path: '/resizer', label: 'Social Resizer', icon: Crop },
  { id: 'converter', path: '/converter', label: 'KB Converter', icon: FileCheck2 },
  { id: 'enhancer', path: '/enhancer', label: 'Photo Enhancer', icon: Sliders },
  { id: 'watermark', path: '/watermark', label: 'Watermark', icon: Type },
];

// ─── SEO Helmet — injects meta tags dynamically ───────────────────────────────
function SeoHelmet() {
  const location = useLocation();
  useEffect(() => {
    const meta = ROUTE_META[location.pathname] || ROUTE_META['/'];
    // Title
    document.title = meta.title;
    // Description
    let desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.description);
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = meta.canonical;
    // OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', meta.canonical);
    // GA pageview
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: meta.title,
        page_path: location.pathname,
      });
    }
  }, [location.pathname]);
  return null;
}

// ─── Main App Shell ───────────────────────────────────────────────────────────
function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('neumo_theme') || 'light');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neumo_theme', theme);
  }, [theme]);

  // Map current path to tool id for sidebar highlight
  const activeToolId = location.pathname === '/'
    ? 'bg-remover'
    : location.pathname.replace('/', '');

  const setActiveTool = (id) => {
    const tool = MOBILE_TOOLS.find(t => t.id === id);
    navigate(tool ? tool.path : '/bg-remover');
  };

  return (
    <div className="app-container">
      <SeoHelmet />
      <PwaInstallBanner />

      <Header
        theme={theme}
        toggleTheme={() => setTheme(p => p === 'light' ? 'dark' : 'light')}
        onOpenUpiModal={() => setIsUpiModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <main className="main-content">
        <SidebarNav
          activeTool={activeToolId}
          setActiveTool={setActiveTool}
          onOpenUpiModal={() => setIsUpiModalOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <section style={{ width: '100%', minWidth: 0 }}>
          {/* Mobile Quick-Switch Tool Bar */}
          <div className="mobile-tool-bar">
            {MOBILE_TOOLS.map(t => {
              const Icon = t.icon;
              const isActive = activeToolId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(t.path)}
                  className={`neu-btn ${isActive ? 'active' : ''}`}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '20px', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  <Icon size={14} color={isActive ? 'var(--primary-color)' : 'var(--text-muted)'} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Tool Routes ─────────────────────────────────── */}
          <Routes>
            <Route path="/"               element={<BgRemover />} />
            <Route path="/bg-remover"     element={<BgRemover />} />
            <Route path="/pdf-compressor" element={<PdfCompressor />} />
            <Route path="/pdf-password"   element={<PdfPasswordTool />} />
            <Route path="/pdf-splitter"   element={<PdfSplitter />} />
            <Route path="/pdf-watermark"  element={<PdfWatermarkTool />} />
            <Route path="/passport-sheet" element={<PassportSheetGen />} />
            <Route path="/magic-eraser"   element={<MagicEraser />} />
            <Route path="/image-pdf"      element={<ImageToPdf />} />
            <Route path="/ai-gen"         element={<AiImageGen />} />
            <Route path="/ai-vision"      element={<AiVisionCaptions />} />
            <Route path="/resizer"        element={<ResizerCrop />} />
            <Route path="/converter"      element={<ConverterCompress />} />
            <Route path="/enhancer"       element={<PhotoEnhancer />} />
            <Route path="/watermark"      element={<WatermarkTool />} />
            {/* 404 fallback → home */}
            <Route path="*"              element={<BgRemover />} />
          </Routes>

          {/* SEO FAQ Section */}
          <SeoFaqSection />

          {/* AdSense Banner */}
          <AdBanner slotId="main-workspace-ad" />
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>
        <p style={{ fontWeight: '600', marginBottom: '8px', lineHeight: '1.4' }}>
          NeumoStudio AI — Built with Soft Neumorphism UI • 100% Free & No Server Paywalls
        </p>
        <p style={{ fontSize: '0.8rem' }}>
          <button onClick={() => setIsPrivacyModalOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>
            Privacy Policy & Terms of Service
          </button>
        </p>
      </footer>

      <UpiDonateModal isOpen={isUpiModalOpen} onClose={() => setIsUpiModalOpen(false)} />
      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

# 🚀 NeumoStudio AI - Complete Web App Source Code

Thank you for purchasing **NeumoStudio AI**! This package contains the full, production-ready source code for the all-in-one Visual Studio & PDF utility web app built with React, Vite, and Neumorphism UI aesthetics.

---

## 🌟 Key Features Included

1. **Neural AI Background Remover**: Runs 100% locally in browser via ONNX WebAssembly.
2. **Exact Target KB PDF Size Compressor**: 4-step binary search byte calibration & padding engine (200KB / 500KB form upload limit targets).
3. **128-bit AES PDF Password Lock & Unlock**: Dual-engine constructor encryption & decrypted stream rendering.
4. **Passport Photo 4x6 Printable Sheet Generator**: 6, 8, 12 photo grids with center crop & `@media print` rules.
5. **Magic Object & Watermark Eraser Brush**: Inpainting engine with touch-locked drawing canvas.
6. **Image to PDF & Document Merger**: Multi-file document combining tool.
7. **AI Text-to-Image & Vision Caption Generator**: OpenRouter multi-modal AI integration.
8. **WhatsApp DP & Social Resizer**: 1:1, 4:5, 9:16 social presets.
9. **Monetization Built-in**: Google AdSense ad slots & Google Analytics tracking pre-integrated.
10. **PWA Support**: Mobile "Add to Home Screen" installer banner included.

---

## 🛠️ Quick Installation & Setup Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Step 1: Install Dependencies
Open terminal in the unzipped folder and run:
```bash
npm install
```

### Step 2: Configure Environment Variables (Optional)
Copy `.env.example` to `.env` if using AI Image Generation APIs:
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Step 3: Run Locally in Development Mode
```bash
npm run dev
```
Open http://localhost:3000 in your browser!

### Step 4: Build for Production & Deployment
```bash
npm run build
```
Upload the generated `dist/` folder to Vercel, Netlify, Cloudflare Pages, or any shared web hosting!

---

## 🎨 Customizing Branding & Logo
- **Logo & Favicon**: Replace `public/logo.jpg` with your own logo image.
- **Brand Title**: Edit `src/components/Header.jsx` to change the app title.
- **Google AdSense**: Edit `index.html` and `src/components/AdBanner.jsx` with your own `ca-pub-XXXXXXXXXXXXXXXX` publisher ID.

---

## 📩 Support & Customization
Need custom features or domain setup? Contact support.

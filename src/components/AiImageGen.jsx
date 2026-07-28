import React, { useState } from 'react';
import { Wand2, Download, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { generateAiImage } from '../utils/openrouter';

const PROMPT_IDEAS = [
  "Cyberpunk futuristic electric supercar in Tokyo neon rain",
  "Cute 3D Pixar style cat wearing astronaut suit on Mars",
  "Aesthetic minimal Neumorphism 3D icon set, pastel blue background",
  "E-commerce product shot of sleek wireless headphones on marble table",
  "Hyper-realistic portrait of an old craftsman in a warm workshop"
];

export default function AiImageGen() {
  const [prompt, setPrompt] = useState('');
  const [generatedImg, setGeneratedImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);

  const handleGenerate = async (selectedPrompt) => {
    const textToUse = selectedPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsLoading(true);
    setIsImgLoading(true);
    setGeneratedImg(null);

    const url = await generateAiImage(textToUse);
    setGeneratedImg(url);
    setIsLoading(false);
  };

  const downloadImage = async () => {
    if (!generatedImg) return;
    try {
      const response = await fetch(generatedImg);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `ai-generated-${Date.now()}.png`;
      link.href = blobUrl;
      link.click();
    } catch (e) {
      window.open(generatedImg, '_blank');
    }
  };

  return (
    <div className="neu-card">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="var(--primary-color)" /> AI Text-to-Image Generator
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Describe any concept, graphic, or art style to generate 8K photorealistic AI images instantly.
        </p>
      </div>

      {/* Prompt Input Box */}
      <div style={{ marginBottom: '20px' }}>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create (e.g., 'Futuristic neon workspace with sleek laptop and coffee cup')..."
          className="neu-textarea"
          style={{ marginBottom: '12px' }}
        />

        {/* Quick Inspiration Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', alignSelf: 'center' }}>Try Prompt:</span>
          {PROMPT_IDEAS.map((idea, idx) => (
            <button
              key={idx}
              className="neu-btn"
              onClick={() => {
                setPrompt(idea);
                handleGenerate(idea);
              }}
              style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px' }}
            >
              {idea.slice(0, 32)}...
            </button>
          ))}
        </div>

        <button 
          className="neu-btn neu-btn-primary"
          onClick={() => handleGenerate(null)}
          disabled={isLoading || isImgLoading || !prompt.trim()}
          style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
        >
          {(isLoading || isImgLoading) ? (
            <>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Creating AI Masterpiece...
            </>
          ) : (
            <>
              <Wand2 size={18} /> Generate AI Image
            </>
          )}
        </button>
      </div>

      {/* Display Result */}
      {generatedImg ? (
        <div className="neu-inset" style={{ textAlign: 'center', padding: '16px', borderRadius: '20px', position: 'relative' }}>
          {isImgLoading && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <RefreshCw size={36} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
              <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>Rendering 8K AI Details...</p>
            </div>
          )}
          <img 
            src={generatedImg} 
            alt="AI Output" 
            onLoad={() => setIsImgLoading(false)}
            onError={() => setIsImgLoading(false)}
            style={{ 
              width: '100%', 
              maxHeight: '480px', 
              objectFit: 'contain', 
              borderRadius: '16px', 
              marginBottom: '16px',
              display: isImgLoading ? 'none' : 'block'
            }} 
          />
          {!isImgLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="neu-btn neu-btn-primary" onClick={downloadImage}>
                <Download size={16} /> Download 8K Image
              </button>
            </div>
          )}
        </div>
      ) : (
        !isLoading && !isImgLoading && (
          <div className="neu-inset" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '20px' }}>
            <ImageIcon size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your generated AI artwork will appear here in high definition.
            </p>
          </div>
        )
      )}
    </div>
  );
}

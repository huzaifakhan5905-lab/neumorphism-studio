import React from 'react';
import { Sun, Moon, Coffee, Sparkles, Heart, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme, onOpenUpiModal, isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <header className="neu-card" style={{ borderRadius: '0 0 24px 24px', padding: '14px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="neu-btn neu-btn-icon mobile-only" 
            onClick={toggleMobileMenu}
            title="Toggle Tools Menu"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="neu-badge" style={{ padding: '8px', borderRadius: '14px' }}>
            <Sparkles size={20} color="var(--primary-color)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
              NeumoStudio <span style={{ color: 'var(--primary-color)' }}>AI</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              100% Free All-In-One Visual Studio
            </p>
          </div>
        </div>

        {/* Right Action Buttons: Theme Toggle & UPI Coffee Donation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
          
          {/* Free Badge (Desktop Only) */}
          <span className="neu-badge desktop-only">
            <Heart size={14} color="#ef4444" fill="#ef4444" /> 100% Free Tool
          </span>

          {/* Theme Toggle */}
          <button 
            className="neu-btn neu-btn-icon" 
            onClick={toggleTheme} 
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} color="var(--primary-color)" /> : <Sun size={18} color="#f59e0b" />}
          </button>

          {/* Buy Me A Coffee UPI Button */}
          <button 
            className="neu-btn neu-btn-primary" 
            onClick={onOpenUpiModal}
            style={{ padding: '8px 14px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
          >
            <Coffee size={16} />
            <span>Donate ☕</span>
          </button>
        </div>

      </div>
    </header>
  );
}

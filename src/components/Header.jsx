import React from 'react';
import { Sun, Moon, Coffee, Sparkles, Heart, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme, onOpenUpiModal, isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <header className="neu-card" style={{ borderRadius: '0 0 24px 24px', padding: '16px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="neu-btn neu-btn-icon mobile-only" 
            onClick={toggleMobileMenu}
            title="Toggle Tools Menu"
            style={{ display: 'none' }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="neu-badge" style={{ padding: '10px', borderRadius: '16px' }}>
            <Sparkles size={24} color="var(--primary-color)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              NeumoStudio <span style={{ color: 'var(--primary-color)' }}>AI</span>
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              100% Free All-In-One Visual Studio
            </p>
          </div>
        </div>

        {/* Action Buttons: Theme Toggle & UPI Coffee Donation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Free Badge */}
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
            {theme === 'light' ? <Moon size={20} color="var(--primary-color)" /> : <Sun size={20} color="#f59e0b" />}
          </button>

          {/* Buy Me A Coffee UPI Button */}
          <button 
            className="neu-btn neu-btn-primary" 
            onClick={onOpenUpiModal}
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
          >
            <Coffee size={18} />
            <span>Donate ☕</span>
          </button>
        </div>

      </div>
    </header>
  );
}

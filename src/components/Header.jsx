import React from 'react';
import { Sun, Moon, Heart, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme, isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <header className="neu-card" style={{ borderRadius: '0 0 24px 24px', padding: '12px 16px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '8px' }}>
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="neu-btn neu-btn-icon mobile-only" 
            onClick={toggleMobileMenu}
            title="Toggle Tools Menu"
            aria-label="Toggle Navigation Menu"
            style={{ width: '40px', height: '40px', minWidth: '40px' }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="neu-badge" style={{ padding: '3px', borderRadius: '14px', background: 'var(--card-bg)' }}>
            <img 
              src="/logo.jpg" 
              alt="NeumoStudio AI Logo" 
              style={{ width: '34px', height: '34px', borderRadius: '11px', objectFit: 'cover', display: 'block' }} 
            />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
              NeumoStudio <span style={{ color: 'var(--primary-color)' }}>AI</span>
            </h1>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '500', display: 'none' }} className="desktop-only">
              100% Free All-In-One Visual Studio
            </p>
          </div>
        </div>

        {/* Right Action Buttons: Theme Toggle & Free Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Free Badge */}
          <span className="neu-badge">
            <Heart size={14} color="#ef4444" fill="#ef4444" /> 100% Free
          </span>

          {/* Theme Toggle */}
          <button 
            className="neu-btn neu-btn-icon" 
            onClick={toggleTheme} 
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
            style={{ width: '40px', height: '40px', minWidth: '40px' }}
          >
            {theme === 'light' ? <Moon size={18} color="var(--primary-color)" /> : <Sun size={18} color="#f59e0b" />}
          </button>
        </div>

      </div>
    </header>
  );
}

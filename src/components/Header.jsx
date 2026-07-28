import React from 'react';
import { Sun, Moon, Coffee, Sparkles, Heart, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme, onOpenUpiModal, isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <header className="neu-card" style={{ borderRadius: '0 0 24px 24px', padding: '14px 16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button 
            className="neu-btn neu-btn-icon mobile-only" 
            onClick={toggleMobileMenu}
            title="Toggle Tools Menu"
            style={{ flexShrink: 0 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="neu-badge" style={{ padding: '8px', borderRadius: '12px', flexShrink: 0 }}>
            <Sparkles size={20} color="var(--primary-color)" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              NeumoStudio <span style={{ color: 'var(--primary-color)' }}>AI</span>
            </h1>
            <p className="desktop-only" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              100% Free All-In-One Visual Studio
            </p>
          </div>
        </div>

        {/* Action Buttons: Theme Toggle & UPI Coffee Donation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          
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
            style={{ flexShrink: 0 }}
          >
            {theme === 'light' ? <Moon size={18} color="var(--primary-color)" /> : <Sun size={18} color="#f59e0b" />}
          </button>

          {/* Buy Me A Coffee UPI Button */}
          <button 
            className="neu-btn neu-btn-primary" 
            onClick={onOpenUpiModal}
            style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', fontSize: '0.85rem', flexShrink: 0 }}
          >
            <Coffee size={16} />
            <span style={{ whiteSpace: 'nowrap' }}>Donate ☕</span>
          </button>
        </div>

      </div>
    </header>
  );
}

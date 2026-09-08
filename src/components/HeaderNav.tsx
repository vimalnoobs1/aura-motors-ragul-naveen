import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, User, LogOut } from 'lucide-react';
import { engineSound } from '../audio/engineSound';
import { AuraUser } from '../types';

interface HeaderNavProps {
  isAudioMuted: boolean;
  onAudioToggle: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenShowroom: () => void;
  onRequestQuote: () => void;
  is3DExpanded?: boolean;
  currentUser: AuraUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'collection', label: 'COLLECTION' },
  { id: 'showroom', label: 'SHOWROOM' },
  { id: 'configurator', label: 'CONFIGURE' },
  { id: 'performance', label: 'PERFORMANCE' },
  { id: 'finance', label: 'FINANCE' },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isAudioMuted,
  onAudioToggle,
  onScrollToSection,
  onOpenShowroom,
  is3DExpanded = false,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('collection');

  useEffect(() => {
    if (is3DExpanded) {
      setActiveSection('showroom');
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['hero', 'collection', 'configurator', 'performance', 'finance'];
      const scrollPos = window.scrollY + 250;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id === 'hero' ? 'collection' : id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [is3DExpanded]);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    engineSound.playClickBeep();
    setActiveSection(sectionId);
    if (sectionId === 'showroom') {
      onOpenShowroom();
    } else {
      onScrollToSection(sectionId);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0f121b]/95 backdrop-blur-2xl border-b border-[#d4af37]/35 shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.08)] py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-[#0e111a]/95 via-[#0e111a]/60 to-transparent py-3 sm:py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram & Name */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg border border-[#d4af37]/60 bg-gradient-to-br from-[#1e2233] to-[#121522] flex items-center justify-center transition-all group-hover:border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <div className="w-3.5 h-3.5 border border-white rotate-45 flex items-center justify-center transition-transform group-hover:rotate-90">
              <div className="w-1.5 h-1.5 bg-[#d4af37]" />
            </div>
          </div>
          <span className="font-cinzel text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase group-hover:text-[#f3ebd8] transition-colors">
            AURA MOTORS
          </span>
        </div>

        {/* Desktop Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 p-1 rounded-full bg-[#121520]/80 border border-neutral-800/80 backdrop-blur-xl font-rajdhani text-xs tracking-[0.2em] uppercase font-semibold">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37]/25 via-[#f5edd7]/15 to-[#d4af37]/25 text-[#fbf7ee] font-bold border border-[#d4af37]/80 shadow-[0_0_16px_rgba(212,175,55,0.35)] scale-105'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37] animate-pulse" />
                )}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_8px_#d4af37]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Indicator, Audio Toggle & Visible LOGIN Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            id="header-sound-btn"
            onClick={onAudioToggle}
            aria-label={isAudioMuted ? 'Turn Sound On' : 'Mute Sound'}
            className="p-2 sm:p-2.5 rounded-xl bg-[#151824] border border-neutral-750 text-neutral-400 hover:text-white hover:border-[#d4af37]/50 transition-colors cursor-pointer shadow-sm flex items-center justify-center min-w-[40px] min-h-[40px]"
            title={isAudioMuted ? 'Sound On' : 'Sound Off'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
            )}
          </button>

          {/* Visible LOGIN / Logged In State Button */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151824] border border-[#d4af37]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <button
                onClick={() => {
                  engineSound.playClickBeep();
                  onLogout();
                }}
                className="ml-1 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer p-0.5"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => {
                engineSound.playClickBeep();
                onOpenLogin();
              }}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#e6ca9c] to-[#d4af37] hover:brightness-110 text-neutral-950 font-rajdhani font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5 cursor-pointer min-h-[38px] active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-neutral-950" />
              <span>LOGIN</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            id="header-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#151824] border border-neutral-750 text-neutral-300 hover:text-white transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e15]/98 border-b border-[#d4af37]/40 px-5 py-5 mt-2.5 space-y-2 font-rajdhani text-sm tracking-[0.2em] uppercase font-semibold backdrop-blur-2xl animate-fade-in shadow-2xl">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#f5edd7]/10 to-transparent text-[#fbf7ee] font-bold border border-[#d4af37]/70 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                )}
              </button>
            );
          })}

          {/* Mobile Login / User Profile Item in Drawer */}
          <div className="pt-2 border-t border-neutral-800">
            {currentUser ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#151824] border border-neutral-750">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-white">Welcome, {currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    engineSound.playClickBeep();
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 font-mono-tech uppercase flex items-center gap-1 cursor-pointer py-1 px-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  engineSound.playClickBeep();
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#e6ca9c] to-[#d4af37] text-neutral-950 font-bold text-xs tracking-wider uppercase cursor-pointer min-h-[44px]"
              >
                <User className="w-4 h-4 text-neutral-950" />
                <span>CLIENT LOGIN</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


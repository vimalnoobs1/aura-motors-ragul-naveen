import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, X, User, LogOut, ChevronRight, Sparkles, FileText } from 'lucide-react';
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

interface NavItem {
  id: string;
  num: string;
  label: string;
  subtitle: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'collection',
    num: '01',
    label: 'COLLECTION',
    subtitle: '11 Curated Hypercar Atelier Fleet',
  },
  {
    id: 'showroom',
    num: '02',
    label: '3D SHOWROOM',
    subtitle: 'Interactive Virtual 360° Stage',
  },
  {
    id: 'configurator',
    num: '03',
    label: 'CONFIGURATOR',
    subtitle: 'Bespoke Paint, Wheels & Aero Tailoring',
  },
  {
    id: 'performance',
    num: '04',
    label: 'PERFORMANCE',
    subtitle: 'Twin-Turbo V12 Telemetry & Specs',
  },
  {
    id: 'finance',
    num: '05',
    label: 'FINANCE & QUOTE',
    subtitle: 'EMI Calculation & Atelier Consultation',
  },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isAudioMuted,
  onAudioToggle,
  onScrollToSection,
  onOpenShowroom,
  onRequestQuote,
  is3DExpanded = false,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('collection');

  // Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

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

  const handleNavClick = useCallback((sectionId: string) => {
    setIsMobileMenuOpen(false);
    engineSound.playClickBeep();
    setActiveSection(sectionId);
    if (sectionId === 'showroom') {
      onOpenShowroom();
    } else {
      onScrollToSection(sectionId);
    }
  }, [onOpenShowroom, onScrollToSection]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0e111a]/95 backdrop-blur-2xl border-b border-[#d4af37]/35 shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.08)] py-2.5 sm:py-3'
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

          {/* Desktop Full Menu (Visible on 768px and up: md:flex) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 p-1 rounded-full bg-[#121520]/80 border border-neutral-800/80 backdrop-blur-xl font-syne text-xs tracking-[0.16em] uppercase font-semibold">
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

          {/* Right Header Controls: Audio Toggle, Login & Premium Mobile Hamburger (below 768px) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle (Always visible) */}
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

            {/* Desktop / Tablet Visible LOGIN or Profile Badge */}
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
                className="hidden sm:flex px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#e6ca9c] to-[#d4af37] hover:brightness-110 text-neutral-950 font-syne font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] items-center gap-1.5 cursor-pointer min-h-[38px] active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-neutral-950" />
                <span>LOGIN</span>
              </button>
            )}

            {/* Premium Hamburger Icon (Visible on mobile devices below 768px: md:hidden) */}
            <button
              id="header-mobile-menu-btn"
              onClick={() => {
                engineSound.playClickBeep();
                setIsMobileMenuOpen(true);
              }}
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden relative min-w-[44px] min-h-[44px] px-2.5 py-2 rounded-xl bg-[#141724]/90 hover:bg-[#1b2030] border border-[#d4af37]/40 hover:border-[#d4af37] text-neutral-200 hover:text-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.12)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {/* Custom Architectural 3-Line Luxury Hamburger Icon */}
              <div className="w-5 h-4 flex flex-col justify-between items-end">
                <span className="h-[2px] w-5 bg-gradient-to-r from-[#d4af37] to-white rounded-full transition-all" />
                <span className="h-[2px] w-3.5 bg-[#d4af37] rounded-full transition-all group-hover:w-5" />
                <span className="h-[2px] w-5 bg-gradient-to-r from-white to-[#d4af37] rounded-full transition-all" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Clean-Styled Overlay Menu on Mobile (< 768px) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Atelier Navigation Menu"
          className="md:hidden fixed inset-0 z-50 w-screen h-[100dvh] bg-[#090b12]/98 backdrop-blur-3xl overflow-y-auto flex flex-col justify-between p-5 sm:p-8 text-neutral-200 animate-fade-in"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 12%, rgba(212,175,55,0.12) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(14,18,27,0.8) 0%, transparent 60%)',
          }}
        >
          {/* Overlay Top Bar: Brand Monogram, Atelier Badge & Luxury Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-[#d4af37]/60 bg-gradient-to-br from-[#1e2233] to-[#121522] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <div className="w-4 h-4 border border-white rotate-45 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#d4af37]" />
                </div>
              </div>
              <div>
                <span className="font-cinzel text-base font-bold tracking-[0.22em] text-white uppercase block">
                  AURA MOTORS
                </span>
                <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#d4af37] uppercase">
                  SWISS ATELIER SHOWROOM
                </span>
              </div>
            </div>

            {/* Premium Close Button */}
            <button
              id="mobile-menu-close-btn"
              onClick={() => {
                engineSound.playClickBeep();
                setIsMobileMenuOpen(false);
              }}
              aria-label="Close Navigation Menu"
              className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-xl bg-[#141724] border border-[#d4af37]/40 hover:border-[#d4af37] text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5 text-[#d4af37]" />
              <span className="text-xs font-syne font-bold tracking-widest text-white uppercase">
                CLOSE
              </span>
            </button>
          </div>

          {/* Core Full-Screen Navigation Links (Generously Spaced & Easy-To-Tap) */}
          <div className="py-6 space-y-3 flex-1 flex flex-col justify-center">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`group w-full min-h-[64px] p-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border cursor-pointer active:scale-98 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#181d2a] to-[#121520] border-[#d4af37]/80 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'bg-[#121520]/80 hover:bg-[#161a28] border-neutral-800/80 hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono-tech text-xs tracking-widest px-2 py-1 rounded-md border ${
                        isActive
                          ? 'text-[#d4af37] bg-[#d4af37]/15 border-[#d4af37]/40 font-bold'
                          : 'text-neutral-500 bg-black/30 border-neutral-800'
                      }`}
                    >
                      {item.num}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-syne text-xl sm:text-2xl font-extrabold tracking-tight uppercase transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-neutral-300 group-hover:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37] animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs text-neutral-400 group-hover:text-neutral-300 font-sans block mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#d4af37] text-neutral-950'
                        : 'bg-neutral-900 text-neutral-500 group-hover:text-white group-hover:bg-neutral-800'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Module: VIP Client Account, Concierge Action & Atelier Details */}
          <div className="pt-4 border-t border-neutral-800/80 space-y-3">
            {/* VIP Client Login / Status */}
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-[#141724] border border-[#d4af37]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-syne font-bold text-white block leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-mono-tech text-emerald-400">
                      VIP Atelier Member
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    engineSound.playClickBeep();
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-red-400 font-mono-tech text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                id="mobile-menu-login-btn"
                onClick={() => {
                  engineSound.playClickBeep();
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-r from-[#e6ca9c] via-[#f7ebd7] to-[#d4af37] text-neutral-950 font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer active:scale-98"
              >
                <User className="w-4 h-4 text-neutral-950" />
                <span>VIP CLIENT LOGIN / ACCESS</span>
              </button>
            )}

            {/* Quick Action Buttons: Quote & Audio */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  engineSound.playClickBeep();
                  setIsMobileMenuOpen(false);
                  onRequestQuote();
                }}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#141724] hover:bg-[#1b2030] border border-neutral-750 hover:border-[#d4af37]/50 text-white font-syne font-bold text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>REQUEST QUOTE</span>
              </button>

              <button
                onClick={() => {
                  onAudioToggle();
                }}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#141724] hover:bg-[#1b2030] border border-neutral-750 hover:border-[#d4af37]/50 text-white font-syne font-bold text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isAudioMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                    <span>AUDIO OFF</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>AUDIO ACTIVE</span>
                  </>
                )}
              </button>
            </div>

            {/* Atelier Footnote */}
            <div className="text-center pt-2">
              <p className="text-[10px] font-mono-tech tracking-wider text-neutral-500 uppercase">
                GENEVA • MONACO • DUBAI • MUMBAI
              </p>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                Lead Architect: <span className="text-white font-semibold">S. Ragul</span> • Lead Engineer: <span className="text-white font-semibold">Naveenkumar S</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CameraPreset,
  ShowroomMode,
  VehicleState,
  BodyColorKey,
  WheelFinishKey,
  CaliperColorKey,
  AuraUser,
} from './types';
import { VehicleSpec, AURA_VEHICLES } from './data/vehicles';
import { ShowroomCanvas } from './components/ShowroomCanvas';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { CollectionCarousel } from './components/CollectionCarousel';
import { VehicleDetailSection } from './components/VehicleDetailSection';
import { ConfiguratorSection, ConfigSummary } from './components/ConfiguratorSection';
import { PerformanceSection } from './components/PerformanceSection';
import { FinanceSection, FinanceDetails } from './components/FinanceSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { QuoteConsultationModal } from './components/QuoteConsultationModal';
import { BrandFooter } from './components/BrandFooter';

// Modals & Extras
import { PerformanceBar } from './components/PerformanceBar';
import { ColorPalette } from './components/ColorPalette';
import { InteractiveControls } from './components/InteractiveControls';
import { EngineeringModal } from './components/EngineeringModal';
import { CreditsModal } from './components/CreditsModal';
import { StartupSequence } from './components/StartupSequence';
import { AuraDbModal } from './components/AuraDbModal';
import { AuthModal } from './components/AuthModal';
import { EmiCalculatorModal } from './components/EmiCalculatorModal';
import { ArchitectureModal } from './components/ArchitectureModal';

import { engineSound } from './audio/engineSound';
import {
  Palette,
  Sliders,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Camera,
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<ShowroomMode>('atelier');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('cinematic');
  const [isStartupCompleted, setIsStartupCompleted] = useState<boolean>(true);

  // Selected Active Vehicle (Defaults to primary Hero: Spectre V12)
  const [activeVehicle, setActiveVehicle] = useState<VehicleSpec>(AURA_VEHICLES[0]);

  // Fullscreen 3D Showroom View Mode
  const [is3DExpanded, setIs3DExpanded] = useState<boolean>(false);

  // Modal States
  const [isCreditsOpen, setIsCreditsOpen] = useState<boolean>(false);
  const [isEngineeringOpen, setIsEngineeringOpen] = useState<boolean>(false);
  const [isAuraDbOpen, setIsAuraDbOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isEmiOpen, setIsEmiOpen] = useState<boolean>(false);
  const [isArchOpen, setIsArchOpen] = useState<boolean>(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quoteMode, setQuoteMode] = useState<'quote' | 'viewing'>('quote');
  const [activeConfigSummary, setActiveConfigSummary] = useState<ConfigSummary | null>(null);
  const [activeFinanceDetails, setActiveFinanceDetails] = useState<FinanceDetails | null>(null);
  const [customConfiguredPrice, setCustomConfiguredPrice] = useState<number | undefined>(undefined);

  // Authenticated User state
  const [currentUser, setCurrentUser] = useState<AuraUser | null>(() => {
    try {
      const saved = localStorage.getItem('aura_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Audio Engine State
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isRevving, setIsRevving] = useState<boolean>(false);

  // 3D Configurator Drawer Tab & Collapse in Expanded Studio Mode
  const [activeTab, setActiveTab] = useState<'colors' | 'kinematics'>('colors');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);

  // 3D Vehicle Kinematics & Styling State
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    color: 'noir',
    wheelFinish: 'titanium',
    caliperColor: 'cyan',
    doorsOpen: false,
    wingAngle: 'retracted',
    headlights: 'drl',
    underglow: false,
    showAeroFlow: false,
    turntableSpeed: 1,
    explodedView: false,
    nitroActive: false,
  });

  const handleUpdateVehicleState = (updates: Partial<VehicleState>) => {
    setVehicleState((prev) => ({ ...prev, ...updates }));
  };

  const handleAudioToggle = () => {
    const unmuted = engineSound.toggleMute();
    setIsAudioMuted(!unmuted);
  };

  const handleRevStart = useCallback(() => {
    setIsRevving(true);
    if (engineSound.getIsMuted()) {
      engineSound.toggleMute();
      setIsAudioMuted(false);
    }
    engineSound.setThrottle(true);
  }, []);

  const handleRevEnd = useCallback(() => {
    setIsRevving(false);
    engineSound.setThrottle(false);
  }, []);

  const handleLogin = (user: AuraUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('aura_auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('aura_auth_user');
    } catch {
      // ignore
    }
  };

  // Section smooth scrolling
  const scrollToSection = (sectionId: string) => {
    engineSound.playClickBeep();
    if (is3DExpanded) {
      setIs3DExpanded(false);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard shortcut listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        setIsCreditsOpen(false);
        setIsEngineeringOpen(false);
        setIsAuraDbOpen(false);
        setIsAuthOpen(false);
        setIsEmiOpen(false);
        setIsArchOpen(false);
        setIsQuoteOpen(false);
        if (is3DExpanded) setIs3DExpanded(false);
      } else if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleRevStart();
      } else if (e.key === 'e' || e.key === 'E') {
        engineSound.playActivationChime();
        handleUpdateVehicleState({ explodedView: !vehicleState.explodedView });
      } else if (e.key === 'n' || e.key === 'N') {
        const nextNitro = !vehicleState.nitroActive;
        if (nextNitro) engineSound.triggerNitro();
        handleUpdateVehicleState({ nitroActive: nextNitro });
      } else if (e.key === 'd' || e.key === 'D') {
        engineSound.playClickBeep();
        handleUpdateVehicleState({ doorsOpen: !vehicleState.doorsOpen });
      } else if (e.key === 'w' || e.key === 'W') {
        engineSound.playClickBeep();
        const wingModes: VehicleState['wingAngle'][] = ['retracted', 'active', 'airbrake'];
        const nextIdx = (wingModes.indexOf(vehicleState.wingAngle) + 1) % wingModes.length;
        handleUpdateVehicleState({ wingAngle: wingModes[nextIdx] });
      } else if (e.key === 'm' || e.key === 'M') {
        engineSound.playClickBeep();
        setMode((prev) => (prev === 'atelier' ? 'midnight' : 'atelier'));
      } else if (e.key === 'c' || e.key === 'C') {
        engineSound.playClickBeep();
        const colors: BodyColorKey[] = ['noir', 'gold', 'cyan', 'rosso', 'bianco'];
        const nextColor = colors[(colors.indexOf(vehicleState.color) + 1) % colors.length];
        handleUpdateVehicleState({ color: nextColor });
      } else if (e.key === '1') {
        setCameraPreset('cinematic');
      } else if (e.key === '2') {
        setCameraPreset('front');
      } else if (e.key === '3') {
        setCameraPreset('side');
      } else if (e.key === '4') {
        setCameraPreset('rear');
      } else if (e.key === '5') {
        setCameraPreset('cockpit');
      } else if (e.key === '6') {
        setCameraPreset('engine');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleRevEnd();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleRevStart, handleRevEnd, vehicleState, is3DExpanded]);

  // Request Quote triggers
  const handleOpenQuoteModal = (
    targetVehicle: VehicleSpec = activeVehicle,
    summary: ConfigSummary | null = null,
    targetMode: 'quote' | 'viewing' = 'quote'
  ) => {
    setActiveVehicle(targetVehicle);
    setActiveConfigSummary(summary);
    setQuoteMode(targetMode);
    setIsQuoteOpen(true);
  };

  const cameraButtons: { id: CameraPreset; label: string }[] = [
    { id: 'cinematic', label: '360° Orbit' },
    { id: 'front', label: 'Front Splitter' },
    { id: 'side', label: 'Profile' },
    { id: 'rear', label: 'Aero Rear' },
    { id: 'cockpit', label: 'Cockpit' },
    { id: 'engine', label: 'V12 Bay' },
  ];

  return (
    <div className="relative min-h-screen app-showroom-container bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,#161a29_0%,#10131e_35%,#090b12_70%,#040508_100%)] bg-fixed text-neutral-100 font-sans selection:bg-[#d4af37] selection:text-black after:fixed after:left-0 after:right-0 after:bottom-0 after:h-[26vh] after:min-h-[160px] after:pointer-events-none after:z-20 after:content-[''] after:bg-gradient-to-t after:from-[#040508]/95 after:via-[#0e121b]/65 after:to-transparent">
      {/* Cinematic Startup Sequence */}
      {!isStartupCompleted && (
        <StartupSequence onComplete={() => setIsStartupCompleted(true)} />
      )}

      {/* 1. Header Navigation (Sticky, Minimal Luxury with Active Highlights & Login) */}
      <HeaderNav
        isAudioMuted={isAudioMuted}
        onAudioToggle={handleAudioToggle}
        onScrollToSection={scrollToSection}
        onOpenShowroom={() => {
          setIs3DExpanded(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRequestQuote={() => handleOpenQuoteModal(activeVehicle, null, 'quote')}
        is3DExpanded={is3DExpanded}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthOpen(true)}
        onLogout={() => {
          try {
            localStorage.removeItem('aura_auth_user');
          } catch {}
          setCurrentUser(null);
        }}
      />

      {/* 2. HERO & 3D SHOWROOM CANVAS */}
      <div
        id="hero"
        className={`transition-all duration-700 ${
          is3DExpanded
            ? 'fixed inset-0 z-40 bg-[#040508]'
            : 'relative w-full h-[95vh] min-h-[640px] overflow-hidden'
        }`}
      >
        {/* Three.js 3D WebGL Canvas */}
        <div className="absolute inset-0 z-0">
          <ShowroomCanvas
            mode={mode}
            cameraPreset={cameraPreset}
            vehicleState={vehicleState}
            onCameraChange={setCameraPreset}
          />
        </div>

        {/* 3D Studio Floating View Controls when in 3D Mode */}
        {is3DExpanded ? (
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 pt-20">
            {/* Top Bar inside expanded 3D view */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-950/80 backdrop-blur-xl border border-neutral-800 shadow-2xl overflow-x-auto max-w-full">
                <div className="px-2 py-1 text-[10px] font-mono-tech text-cyan-400 flex items-center gap-1 hidden sm:flex">
                  <Camera className="w-3.5 h-3.5" />
                  <span>VIEW:</span>
                </div>
                {cameraButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      engineSound.playClickBeep();
                      setCameraPreset(btn.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-rajdhani font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      cameraPreset === btn.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <button
                id="exit-3d-fullscreen-btn"
                onClick={() => setIs3DExpanded(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-750 font-rajdhani font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl"
              >
                <Minimize2 className="w-4 h-4 text-cyan-400" />
                <span>EXIT 3D STUDIO</span>
              </button>
            </div>

            {/* Bottom Floating Telemetry & Interactive Config Drawer */}
            <div className="flex flex-col lg:flex-row items-end justify-between gap-4 pointer-events-none">
              <div className="w-full sm:w-[480px] lg:w-[520px] pointer-events-auto">
                <PerformanceBar isRevving={isRevving} />
              </div>

              <div className="w-full sm:w-[380px] lg:w-[420px] pointer-events-auto">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <div className="flex items-center gap-1 bg-neutral-950/80 backdrop-blur-xl border border-neutral-800/80 p-1 rounded-xl">
                    <button
                      id="tab-colors-btn"
                      onClick={() => {
                        setActiveTab('colors');
                        setIsPanelCollapsed(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-rajdhani font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        activeTab === 'colors' && !isPanelCollapsed
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Atelier Paint</span>
                    </button>

                    <button
                      id="tab-kinematics-btn"
                      onClick={() => {
                        setActiveTab('kinematics');
                        setIsPanelCollapsed(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-rajdhani font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        activeTab === 'kinematics' && !isPanelCollapsed
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Kinematics</span>
                    </button>
                  </div>

                  <button
                    id="collapse-panel-btn"
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                    className="p-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer"
                  >
                    {isPanelCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {!isPanelCollapsed && (
                  <div>
                    {activeTab === 'colors' ? (
                      <ColorPalette
                        currentColor={vehicleState.color}
                        onColorSelect={(color: BodyColorKey) => handleUpdateVehicleState({ color })}
                        currentWheel={vehicleState.wheelFinish}
                        onWheelSelect={(wheelFinish: WheelFinishKey) => handleUpdateVehicleState({ wheelFinish })}
                        currentCaliper={vehicleState.caliperColor}
                        onCaliperSelect={(caliperColor: CaliperColorKey) => handleUpdateVehicleState({ caliperColor })}
                      />
                    ) : (
                      <InteractiveControls
                        vehicleState={vehicleState}
                        onUpdateState={handleUpdateVehicleState}
                        isRevving={isRevving}
                        onRevStart={handleRevStart}
                        onRevEnd={handleRevEnd}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Clean Hero Overlay Mode */
          <div className="relative z-10 w-full h-full flex flex-col justify-between">
            <HeroSection
              onExplore={() => scrollToSection('collection')}
              onConfigure={() => scrollToSection('configurator')}
            />
          </div>
        )}
      </div>

      {/* 3. EXPLORE THE COLLECTION: Horizontal Momentum Carousel */}
      <CollectionCarousel
        activeVehicle={activeVehicle}
        onSelectVehicle={(vehicle) => {
          setActiveVehicle(vehicle);
          if (vehicle.id === 'aura-spectre-v12') {
            handleUpdateVehicleState({ color: 'noir' });
          }
        }}
        onConfigureVehicle={(vehicle) => {
          setActiveVehicle(vehicle);
          scrollToSection('configurator');
        }}
        onViewVehicleDetail={(vehicle) => {
          setActiveVehicle(vehicle);
          scrollToSection('vehicle-detail');
        }}
        onOpen3DShowroom={() => {
          if (activeVehicle.id !== 'aura-spectre-v12') {
            setActiveVehicle(AURA_VEHICLES[0]);
          }
          setIs3DExpanded(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 4. VEHICLE DETAIL: Visual Specs & Engineering Pillars */}
      <VehicleDetailSection
        vehicle={activeVehicle}
        onOpen3DShowroom={() => {
          if (activeVehicle.id !== 'aura-spectre-v12') {
            setActiveVehicle(AURA_VEHICLES[0]);
          }
          setIs3DExpanded(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenConfigurator={() => scrollToSection('configurator')}
      />

      {/* 5. CONFIGURE YOUR AURA: Live 3D Preview with Persistent Price */}
      <ConfiguratorSection
        vehicle={activeVehicle}
        vehicleState={vehicleState}
        onUpdateVehicleState={handleUpdateVehicleState}
        onNavigateToFinance={(totalPrice) => {
          setCustomConfiguredPrice(totalPrice);
          scrollToSection('finance');
        }}
        onRequestQuote={(vehicle, summary) => {
          handleOpenQuoteModal(vehicle, summary, 'quote');
        }}
      />

      {/* 6. PERFORMANCE: Powertrain Dynamics & Dyno Band */}
      <PerformanceSection
        vehicle={activeVehicle}
        onOpen3DShowroom={() => {
          if (activeVehicle.id !== 'aura-spectre-v12') {
            setActiveVehicle(AURA_VEHICLES[0]);
          }
          setIs3DExpanded(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 7. FINANCE: Minimal Atelier Capital with Prominent Monthly EMI */}
      <FinanceSection
        vehicle={activeVehicle}
        configuredPriceInInr={customConfiguredPrice}
        onRequestFinanceQuote={(financeDetails) => {
          setActiveFinanceDetails(financeDetails);
          handleOpenQuoteModal(activeVehicle, activeConfigSummary, 'quote');
        }}
      />

      {/* 8. FINAL CTA: Minimal Luxury CTA ("MAKE IT YOURS") */}
      <FinalCtaSection
        onRequestQuote={() => handleOpenQuoteModal(activeVehicle, activeConfigSummary, 'quote')}
        onBookViewing={() => handleOpenQuoteModal(activeVehicle, activeConfigSummary, 'viewing')}
      />

      {/* 9. LUXURY AUTOMOTIVE BRAND FOOTER */}
      <BrandFooter
        onOpenCredits={() => setIsCreditsOpen(true)}
        onOpenAuraDb={() => setIsAuraDbOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* MODALS & SIMULATED ENTERPRISE EXPERIENCES */}
      {isQuoteOpen && (
        <QuoteConsultationModal
          isOpen={isQuoteOpen}
          onClose={() => setIsQuoteOpen(false)}
          vehicle={activeVehicle}
          configSummary={activeConfigSummary}
          financeDetails={activeFinanceDetails}
          mode={quoteMode}
        />
      )}

      {isAuraDbOpen && (
        <AuraDbModal
          isOpen={isAuraDbOpen}
          onClose={() => setIsAuraDbOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      {isEmiOpen && (
        <EmiCalculatorModal
          isOpen={isEmiOpen}
          onClose={() => setIsEmiOpen(false)}
          baseVehiclePrice={customConfiguredPrice || activeVehicle.priceInCrores * 10000000}
        />
      )}

      {isArchOpen && (
        <ArchitectureModal
          isOpen={isArchOpen}
          onClose={() => setIsArchOpen(false)}
        />
      )}

      {isEngineeringOpen && (
        <EngineeringModal
          isOpen={isEngineeringOpen}
          onClose={() => setIsEngineeringOpen(false)}
        />
      )}

      {isCreditsOpen && (
        <CreditsModal
          isOpen={isCreditsOpen}
          onClose={() => setIsCreditsOpen(false)}
        />
      )}
    </div>
  );
}

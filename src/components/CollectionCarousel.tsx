import React, { useRef, useState, useEffect, useCallback } from 'react';
import { VehicleSpec, AURA_VEHICLES } from '../data/vehicles';
import { VehicleCardVisual } from './VehicleCardVisual';
import { ChevronLeft, ChevronRight, Box, Check, Sliders } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface CollectionCarouselProps {
  activeVehicle: VehicleSpec;
  onSelectVehicle: (vehicle: VehicleSpec) => void;
  onConfigureVehicle: (vehicle: VehicleSpec) => void;
  onViewVehicleDetail: (vehicle: VehicleSpec) => void;
  onOpen3DShowroom: () => void;
}

export const CollectionCarousel: React.FC<CollectionCarouselProps> = ({
  activeVehicle,
  onSelectVehicle,
  onConfigureVehicle,
  onViewVehicleDetail,
  onOpen3DShowroom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const idx = AURA_VEHICLES.findIndex((v) => v.id === activeVehicle.id);
    return idx >= 0 ? idx : 0;
  });

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Viewport intersection observer for staggered entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Drag & Swipe State
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const touchStartXRef = useRef<number>(0);

  // Smooth scroll to card index
  const scrollToIndex = useCallback((index: number, smooth: boolean = true) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.vehicle-card-display');
    if (!cards[index]) return;

    const targetCard = cards[index] as HTMLElement;
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const cardWidth = targetCard.offsetWidth;
    const cardLeft = targetCard.offsetLeft;

    const targetScrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: smooth ? 'smooth' : 'auto',
    });

    setCurrentIndex(index);
    onSelectVehicle(AURA_VEHICLES[index]);
  }, [onSelectVehicle]);

  const handlePrev = () => {
    engineSound.playClickBeep();
    const prevIdx = (currentIndex - 1 + AURA_VEHICLES.length) % AURA_VEHICLES.length;
    scrollToIndex(prevIdx);
  };

  const handleNext = () => {
    engineSound.playClickBeep();
    const nextIdx = (currentIndex + 1) % AURA_VEHICLES.length;
    scrollToIndex(nextIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Snap to center calculation
  const snapToNearestCard = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll('.vehicle-card-display');

    let closestIdx = 0;
    let closestDist = Infinity;

    cards.forEach((card, idx) => {
      const el = card as HTMLElement;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    scrollToIndex(closestIdx);
  };

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    snapToNearestCard();
  };

  const onMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      snapToNearestCard();
    }
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    touchStartXRef.current = e.touches[0].clientX;
    scrollLeftRef.current = containerRef.current.scrollLeft;
    hasDraggedRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const diff = e.touches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 5) {
      hasDraggedRef.current = true;
    }
  };

  const onTouchEnd = () => {
    snapToNearestCard();
  };

  // Featured vehicle from current selection
  const selectedVehicle = AURA_VEHICLES[currentIndex] || activeVehicle;

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative w-full py-24 md:py-32 bg-gradient-to-b from-[#10131b] via-[#141722] to-[#0c0e15] border-t border-neutral-800/80 overflow-hidden select-none"
    >
      {/* Soft Ambient Overhead Atelier Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[92vw] max-w-[1200px] h-[450px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_rgba(255,255,255,0.03)_40%,_transparent_75%)]" />

      {/* Subtle floor ambient shadow at the base */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#090b10] to-transparent" />

      {/* 1. Header & Navigation Controls */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
                CURATED ATELIER FLEET
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-white uppercase">
              EXPLORE THE COLLECTION
            </h2>
          </div>

          {/* Navigation Controls with explicit PREV / NEXT CAR labels */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-mono-tech text-neutral-400 tracking-wider mr-2">
              <span className="text-[#d4af37] font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> /{' '}
              {String(AURA_VEHICLES.length).padStart(2, '0')}
            </span>

            <button
              id="carousel-prev"
              onClick={handlePrev}
              aria-label="Previous Car"
              className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-[#151824] hover:bg-[#1d2232] text-neutral-200 hover:text-white border border-neutral-750 hover:border-[#d4af37]/60 transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-syne font-bold tracking-wider uppercase active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">PREVIOUS CAR</span>
            </button>

            <button
              id="carousel-next"
              onClick={handleNext}
              aria-label="Next Car"
              className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-[#151824] hover:bg-[#1d2232] text-neutral-200 hover:text-white border border-neutral-750 hover:border-[#d4af37]/60 transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-syne font-bold tracking-wider uppercase active:scale-95"
            >
              <span className="hidden sm:inline">NEXT CAR</span>
              <ChevronRight className="w-4 h-4 text-[#d4af37]" />
            </button>
          </div>
        </div>

        {/* 2. Featured Vehicle Stage */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171b27]/85 via-[#131622]/80 to-[#181c28]/85 border border-neutral-700/60 shadow-[0_20px_45px_rgba(0,0,0,0.65)] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                ACTIVE VEHICLE SPOTLIGHT
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-syne font-extrabold tracking-tight text-white uppercase">
              {selectedVehicle.name}
            </h3>
            <div className="text-xl sm:text-2xl font-syne font-extrabold text-amber-200/95 mt-1">
              ₹{selectedVehicle.priceInCrores.toFixed(2)} CR
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-syne text-center">
            <div>
              <span className="text-[10px] font-mono-tech text-neutral-400 uppercase tracking-wider block">0–100</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{selectedVehicle.acceleration0to100}s</span>
            </div>
            <div className="w-[1px] h-8 bg-neutral-800" />
            <div>
              <span className="text-[10px] font-mono-tech text-neutral-400 uppercase tracking-wider block">TOP SPEED</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{selectedVehicle.topSpeedKmh} KM/H</span>
            </div>
            <div className="w-[1px] h-8 bg-neutral-800" />
            <div>
              <span className="text-[10px] font-mono-tech text-neutral-400 uppercase tracking-wider block">POWER</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{selectedVehicle.powerBhp} BHP</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="featured-view-3d-btn"
              onClick={() => {
                engineSound.playActivationChime();
                onSelectVehicle(selectedVehicle);
                onOpen3DShowroom();
              }}
              className="min-h-[44px] px-6 py-3 rounded-full bg-gradient-to-r from-[#e5ca9a] via-[#f7ebd8] to-[#d4af37] hover:brightness-110 text-neutral-950 font-syne font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Box className="w-4 h-4 text-neutral-950" />
              <span>VIEW IN 3D</span>
            </button>

            <button
              id="featured-cfg-btn"
              onClick={() => {
                engineSound.playClickBeep();
                onSelectVehicle(selectedVehicle);
                onConfigureVehicle(selectedVehicle);
              }}
              className="min-h-[44px] px-6 py-3 rounded-full bg-[#151824] hover:bg-[#1d2232] text-white border border-[#d4af37]/40 font-syne font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>CONFIGURE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Momentum Carousel Track with Staggered Entrance Animation */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="w-full overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing px-4 sm:px-12 md:px-16 flex gap-4 sm:gap-6 pb-6 items-stretch snap-x snap-mandatory touch-pan-x"
      >
        {AURA_VEHICLES.map((vehicle, idx) => {
          const isSelected = selectedVehicle.id === vehicle.id;
          const isHovered = hoveredCardId === vehicle.id;

          return (
            <div
              key={vehicle.id}
              id={`card-${vehicle.id}`}
              onMouseEnter={() => setHoveredCardId(vehicle.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => {
                if (!hasDraggedRef.current) {
                  scrollToIndex(idx);
                }
              }}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? isSelected
                    ? 'scale(1.02) translateY(0)'
                    : 'scale(1) translateY(0)'
                  : 'translateY(40px)',
                transition:
                  'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isInView ? `${idx * 40}ms` : '0ms',
              }}
              className={`vehicle-card-display flex-shrink-0 w-[84vw] max-w-[340px] sm:max-w-none sm:w-[440px] md:w-[480px] snap-center rounded-3xl flex flex-col justify-between p-5 sm:p-7 border transition-shadow duration-500 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1c202d] via-[#141723] to-[#0d0f17] border-[#d4af37]/80 shadow-[0_25px_55px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.2)] ring-1 ring-[#d4af37]/45'
                  : 'bg-gradient-to-b from-[#181b26]/90 via-[#12141e]/85 to-[#0b0d14] border-neutral-750/70 hover:border-[#d4af37]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]'
              }`}
            >
              {/* Card Status Indicator */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
                  {vehicle.category}
                </span>

                {isSelected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f5ebd7] text-[9px] font-mono-tech uppercase">
                    <Check className="w-3 h-3 text-[#d4af37]" /> SELECTED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-tech text-neutral-500">
                    {String(idx + 1).padStart(2, '0')} / {String(AURA_VEHICLES.length).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Top Header: Model Name & Price */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="text-xl sm:text-2xl font-syne font-extrabold tracking-tight text-white uppercase leading-tight">
                  {vehicle.name}
                </h4>

                <div className="text-right shrink-0">
                  <span className="text-lg sm:text-xl font-syne font-extrabold text-amber-200">
                    ₹{vehicle.priceInCrores.toFixed(2)} CR
                  </span>
                </div>
              </div>

              {/* Large Vehicle Visual Display */}
              <div className="my-2">
                <VehicleCardVisual vehicle={vehicle} isHovered={isHovered || isSelected} />
              </div>

              {/* 3-Spec Row: 0-100, Top Speed, Power */}
              <div className="grid grid-cols-3 gap-2 my-3 pt-3 border-t border-neutral-800/80 font-syne text-center">
                <div>
                  <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-wider block">0–100</span>
                  <span className="text-base sm:text-lg font-bold text-white">{vehicle.acceleration0to100}s</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-wider block">TOP SPEED</span>
                  <span className="text-base sm:text-lg font-bold text-white">{vehicle.topSpeedKmh} KM/H</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-wider block">POWER</span>
                  <span className="text-base sm:text-lg font-bold text-white">{vehicle.powerBhp} BHP</span>
                </div>
              </div>

              {/* Action Buttons: SELECT CAR, VIEW 3D, CONFIGURE */}
              <div className="pt-2 grid grid-cols-3 gap-2">
                <button
                  id={`btn-select-${vehicle.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    engineSound.playConfirmationBeep();
                    scrollToIndex(idx);
                  }}
                  className={`min-h-[44px] py-2.5 px-2 rounded-xl text-[11px] font-syne font-bold tracking-wider uppercase transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95 ${
                    isSelected
                      ? 'bg-[#d4af37] text-neutral-950 shadow-md font-black'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-neutral-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neutral-950" />
                      <span>SELECTED</span>
                    </>
                  ) : (
                    <span>SELECT CAR</span>
                  )}
                </button>

                <button
                  id={`btn-3d-${vehicle.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    engineSound.playActivationChime();
                    onSelectVehicle(vehicle);
                    onOpen3DShowroom();
                  }}
                  className="min-h-[44px] py-2.5 px-2 rounded-xl text-[11px] font-syne font-bold tracking-wider uppercase bg-gradient-to-r from-neutral-100 to-white hover:brightness-105 text-neutral-950 transition-all cursor-pointer text-center shadow-sm flex items-center justify-center gap-1 active:scale-95"
                >
                  <Box className="w-3.5 h-3.5 text-neutral-950" />
                  <span>VIEW 3D</span>
                </button>

                <button
                  id={`btn-cfg-${vehicle.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    engineSound.playClickBeep();
                    onSelectVehicle(vehicle);
                    onConfigureVehicle(vehicle);
                  }}
                  className="min-h-[44px] py-2.5 px-2 rounded-xl text-[11px] font-syne font-bold tracking-wider uppercase bg-[#141723] hover:bg-[#1b202e] text-neutral-200 hover:text-white border border-neutral-750 hover:border-[#d4af37]/60 transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95"
                >
                  <Sliders className="w-3 h-3 text-[#d4af37]" />
                  <span>CONFIGURE</span>
                </button>
              </div>

              {/* View Full Overview link */}
              <div className="mt-2 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    engineSound.playClickBeep();
                    onSelectVehicle(vehicle);
                    onViewVehicleDetail(vehicle);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white font-mono-tech tracking-wider uppercase underline underline-offset-4 cursor-pointer py-1"
                >
                  View Details & Overview →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Pagination Indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-6 sm:hidden">
        {AURA_VEHICLES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to car ${i + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === i ? 'w-6 bg-[#d4af37]' : 'w-1.5 bg-neutral-800'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import { CameraPreset, ShowroomMode, VehicleState } from '../types';
import { ShowroomScene } from '../three/ShowroomScene';

interface ShowroomCanvasProps {
  mode: ShowroomMode;
  cameraPreset: CameraPreset;
  vehicleState: VehicleState;
  onCameraChange: (preset: CameraPreset) => void;
}

export const ShowroomCanvas: React.FC<ShowroomCanvasProps> = ({
  mode,
  cameraPreset,
  vehicleState,
  onCameraChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ShowroomScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize 3D Showroom Scene
    const scene = new ShowroomScene(containerRef.current, vehicleState, mode);
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Update Showroom Mode
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.applyMode(mode);
    }
  }, [mode]);

  // Update Camera Preset
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCameraPreset(cameraPreset);
    }
  }, [cameraPreset]);

  // Update Vehicle State
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.applyVehicleState(vehicleState);
    }
  }, [vehicleState]);

  // Interactive 3D Hotspot click points
  const hotspots: {
    id: CameraPreset;
    title: string;
    posClass: string;
  }[] = [
    { id: 'front', title: 'Aero Splitter', posClass: 'left-[26%] top-[60%]' },
    { id: 'cockpit', title: 'Cockpit Canopy', posClass: 'left-[46%] top-[38%]' },
    { id: 'engine', title: 'Twin-Turbo V12', posClass: 'left-[64%] top-[44%]' },
    { id: 'rear', title: 'Kinematic Wing', posClass: 'left-[78%] top-[36%]' },
  ];

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-gradient-to-b from-[#12151d] via-[#0d1016] to-[#090b10]">
      {/* Subtle Overhead Atelier Spotlight illumination cone overlay */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(245,237,224,0.12),_rgba(212,175,55,0.04)_40%,_transparent_75%)]" />

      {/* Subtle showroom architectural side wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,_transparent_40%,_rgba(10,12,17,0.7)_100%)]" />

      {/* Three.js canvas container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hotspot Pills with Champagne & Metallic Styling */}
      <div className="hidden md:block pointer-events-none absolute inset-0">
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            id={`hotspot-${spot.id}-btn`}
            onClick={() => onCameraChange(spot.id)}
            className={`pointer-events-auto absolute ${spot.posClass} -translate-x-1/2 -translate-y-1/2 group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12141c]/80 hover:bg-[#1a1e2a] backdrop-blur-xl border border-[#d4af37]/35 hover:border-[#d4af37] shadow-[0_4px_20px_rgba(0,0,0,0.7),0_0_12px_rgba(212,175,55,0.15)] transition-all cursor-pointer`}
          >
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#e4ca98]" />
            </div>
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-neutral-300 group-hover:text-amber-200 transition-colors">
              {spot.title}
            </span>
          </button>
        ))}
      </div>

      {/* Interaction Hint Overlay on Bottom Center of 3D Viewport */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#12141c]/75 backdrop-blur-xl border border-neutral-750/70 shadow-[0_10px_25px_rgba(0,0,0,0.6)] text-[10px] font-mono-tech text-neutral-400 uppercase tracking-widest">
        <span className="hover:text-white transition-colors">DRAG TO ORBIT</span>
        <span className="text-neutral-600">•</span>
        <span>SCROLL TO ZOOM</span>
        <span className="text-neutral-600">•</span>
        <span className="text-amber-300/90 font-semibold">HOLD SPACE FOR V12 THROTTLE</span>
      </div>
    </div>
  );
};

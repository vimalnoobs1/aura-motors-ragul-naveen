import * as THREE from 'three';
import { CameraPreset, ShowroomMode, VehicleState } from '../types';
import { SpectreCarModel } from './SpectreCarModel';

export interface CameraPresetConfig {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export const CAMERA_PRESETS: Record<CameraPreset, CameraPresetConfig> = {
  cinematic: {
    position: new THREE.Vector3(4.4, 1.6, 4.4),
    target: new THREE.Vector3(0, 0.45, 0),
    fov: 42,
  },
  front: {
    position: new THREE.Vector3(0, 0.82, 4.6),
    target: new THREE.Vector3(0, 0.42, 1.2),
    fov: 38,
  },
  side: {
    position: new THREE.Vector3(5.6, 1.05, 0),
    target: new THREE.Vector3(0, 0.45, 0),
    fov: 36,
  },
  rear: {
    position: new THREE.Vector3(-2.4, 1.15, -4.5),
    target: new THREE.Vector3(0, 0.45, -1.2),
    fov: 40,
  },
  cockpit: {
    position: new THREE.Vector3(-1.1, 1.28, 0.85),
    target: new THREE.Vector3(-0.15, 0.55, 0.25),
    fov: 46,
  },
  engine: {
    position: new THREE.Vector3(0.85, 1.85, -1.3),
    target: new THREE.Vector3(0, 0.52, -0.85),
    fov: 42,
  },
  aero: {
    position: new THREE.Vector3(3.6, 4.4, 3.6),
    target: new THREE.Vector3(0, 0.35, 0),
    fov: 40,
  },
};

export class ShowroomScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  public car: SpectreCarModel;

  // Camera lerp targets
  private targetCamPos: THREE.Vector3 = new THREE.Vector3(4.4, 1.6, 4.4);
  private targetCamLookAt: THREE.Vector3 = new THREE.Vector3(0, 0.45, 0);
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 0.45, 0);
  private isUserInteracting: boolean = false;
  private pointerDownPos = { x: 0, y: 0 };
  private spherical = { radius: 6.2, theta: 0.8, phi: 1.3 };
  private targetSpherical = { radius: 6.2, theta: 0.8, phi: 1.3 };

  // Lighting rigs
  private dirLightKey: THREE.DirectionalLight;
  private dirLightRim: THREE.DirectionalLight;
  private dirLightBack: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private cyberGroundRing: THREE.Mesh;
  private cyberRingMat: THREE.MeshBasicMaterial;
  private studioSoftboxGeo: THREE.Mesh;
  private studioSoftboxMat: THREE.MeshBasicMaterial;

  // Environment mode
  private currentMode: ShowroomMode = 'atelier';
  private targetBgColor = new THREE.Color(0x0a0b0e);
  private currentBgColor = new THREE.Color(0x0a0b0e);

  // Turntable
  private turntableGroup: THREE.Group = new THREE.Group();
  private turntableAngle: number = 0;
  private turntableSpeedMultiplier: number = 1;
  private autoRotate: boolean = true;

  private clock = new THREE.Clock();
  private animFrameId: number | null = null;

  private pointerMoveHandler: ((e: MouseEvent | TouchEvent) => void) | null = null;
  private pointerUpHandler: (() => void) | null = null;
  private wheelHandler: ((e: WheelEvent) => void) | null = null;

  constructor(container: HTMLElement, initialState: VehicleState, mode: ShowroomMode) {
    this.container = container;
    this.currentMode = mode;

    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 2. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = this.currentBgColor;
    this.scene.fog = new THREE.FogExp2(0x0e1117, 0.038);

    const aspect = width / (height || 1);
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.copy(this.targetCamPos);
    this.currentLookAt.copy(this.targetCamLookAt);
    this.camera.lookAt(this.currentLookAt);

    // 3. Studio Ground Podium, Architectural Walls & Lighting Architecture
    this.buildShowroomArchitecture();

    // 4. Lights Architecture
    // Primary Key Studio Light (Warm Daylight / Atelier illumination)
    this.dirLightKey = new THREE.DirectionalLight(0xfff6ec, 3.8);
    this.dirLightKey.position.set(6.5, 9.5, 6.5);
    this.dirLightKey.castShadow = true;
    this.dirLightKey.shadow.mapSize.width = 2048;
    this.dirLightKey.shadow.mapSize.height = 2048;
    this.dirLightKey.shadow.camera.near = 1;
    this.dirLightKey.shadow.camera.far = 28;
    this.dirLightKey.shadow.camera.left = -5.5;
    this.dirLightKey.shadow.camera.right = 5.5;
    this.dirLightKey.shadow.camera.top = 5.5;
    this.dirLightKey.shadow.camera.bottom = -5.5;
    this.dirLightKey.shadow.bias = -0.0003;
    this.scene.add(this.dirLightKey);

    // Rim / Metallic Highlight (Warm Champagne & Titanium specular)
    this.dirLightRim = new THREE.DirectionalLight(0xe4ca98, 2.6);
    this.dirLightRim.position.set(-7.5, 5.5, -5.5);
    this.scene.add(this.dirLightRim);

    // Rear Aero Silhouette Light (Subtle Cool Metallic Graphite)
    this.dirLightBack = new THREE.DirectionalLight(0x8fa2b8, 1.8);
    this.dirLightBack.position.set(0, 3.5, -7.5);
    this.scene.add(this.dirLightBack);

    // Soft Studio Ambient / Ground Bounce
    this.hemiLight = new THREE.HemisphereLight(0x3e4554, 0x14161d, 1.5);
    this.scene.add(this.hemiLight);

    // Overhead Studio Softbox Geometries (Dual luminaire panels visible in gloss car paint)
    const softboxGeo = new THREE.PlaneGeometry(5.2, 1.5);
    this.studioSoftboxMat = new THREE.MeshBasicMaterial({ color: 0xfffaee, side: THREE.DoubleSide });
    this.studioSoftboxGeo = new THREE.Mesh(softboxGeo, this.studioSoftboxMat);
    this.studioSoftboxGeo.rotation.x = Math.PI / 2;
    this.studioSoftboxGeo.position.set(0, 6.2, 0);
    this.scene.add(this.studioSoftboxGeo);

    // Cyber Ground Ring Indicator
    const ringGeo = new THREE.RingGeometry(3.68, 3.73, 64);
    this.cyberRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
    });
    this.cyberGroundRing = new THREE.Mesh(ringGeo, this.cyberRingMat);
    this.cyberGroundRing.rotation.x = -Math.PI / 2;
    this.cyberGroundRing.position.set(0, 0.005, 0);
    this.scene.add(this.cyberGroundRing);

    // 5. Add Hypercar to Turntable Group
    this.car = new SpectreCarModel();
    this.applyVehicleState(initialState);
    this.turntableGroup.add(this.car.group);
    this.scene.add(this.turntableGroup);

    // 6. Apply initial environment mode
    this.applyMode(mode, true);

    // 7. Event Listeners
    this.setupInteractions();
    window.addEventListener('resize', this.onResize);

    // 8. Start Render Loop
    this.render();
  }

  private buildShowroomArchitecture() {
    // 1. Polished Obsidian / Graphite Terrazzo Showroom Floor with Real Specular Reflections
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      roughness: 0.16,
      metalness: 0.88,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 1b. Polished Architectural Floor Tile Grid Lines (Fine luxury seam lines)
    const gridHelper = new THREE.GridHelper(50, 25, 0x222634, 0x181a24);
    gridHelper.position.y = 0.002;
    this.scene.add(gridHelper);

    // 2. Circular Turntable Plinth - Tier 1 (Outer brushed titanium rim with beveled edge)
    const outerPlinthGeo = new THREE.CylinderGeometry(3.9, 3.96, 0.03, 64);
    const outerPlinthMat = new THREE.MeshStandardMaterial({
      color: 0x161922,
      roughness: 0.28,
      metalness: 0.85,
    });
    const outerPlinth = new THREE.Mesh(outerPlinthGeo, outerPlinthMat);
    outerPlinth.position.y = 0.015;
    outerPlinth.receiveShadow = true;
    this.turntableGroup.add(outerPlinth);

    // Champagne Metallic Accent Bevel Ring around plinth perimeter
    const plinthBevelGeo = new THREE.TorusGeometry(3.88, 0.02, 16, 64);
    const plinthBevelMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.9,
    });
    const plinthBevel = new THREE.Mesh(plinthBevelGeo, plinthBevelMat);
    plinthBevel.rotation.x = Math.PI / 2;
    plinthBevel.position.y = 0.031;
    this.turntableGroup.add(plinthBevel);

    // 2b. Inner Rotating Turntable Platform (Brushed Dark Graphite with micro-radial groove)
    const innerPlinthGeo = new THREE.CylinderGeometry(3.6, 3.65, 0.03, 64);
    const innerPlinthMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.24,
      metalness: 0.82,
    });
    const innerPlinth = new THREE.Mesh(innerPlinthGeo, innerPlinthMat);
    innerPlinth.position.y = 0.035;
    innerPlinth.receiveShadow = true;
    this.turntableGroup.add(innerPlinth);

    // Subtle Radial Concentric Inlays
    const innerRingGeo = new THREE.RingGeometry(2.35, 2.37, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x333a4a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.052;
    this.turntableGroup.add(innerRing);

    // Cardinal Angle Ticks on turntable
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const tickGeo = new THREE.BoxGeometry(0.015, 0.002, 0.18);
      const tickMat = new THREE.MeshBasicMaterial({
        color: deg % 90 === 0 ? 0xd4af37 : 0x4a5364,
      });
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(Math.sin(rad) * 3.48, 0.053, Math.cos(rad) * 3.48);
      tick.rotation.y = rad;
      this.turntableGroup.add(tick);
    }

    // 3. ARCHITECTURAL SHOWROOM CYCLORAMA WALL
    // Curved back studio wall to eliminate empty void and give true architectural presence
    const wallRadius = 24;
    const wallGeo = new THREE.CylinderGeometry(
      wallRadius,
      wallRadius,
      14,
      48,
      1,
      true,
      Math.PI * 0.65,
      Math.PI * 0.7
    );
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x141720,
      roughness: 0.65,
      metalness: 0.2,
      side: THREE.BackSide,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 7, 2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // 4. ARCHITECTURAL LIGHT STRIPS ON SHOWROOM WALL (Vertical ambient light fins)
    const finCount = 9;
    const angleStart = Math.PI * 0.75;
    const angleEnd = Math.PI * 1.25;
    for (let i = 0; i < finCount; i++) {
      const angle = angleStart + (angleEnd - angleStart) * (i / (finCount - 1));
      const finX = Math.sin(angle) * (wallRadius - 0.2);
      const finZ = Math.cos(angle) * (wallRadius - 0.2) + 2;

      // Vertical illuminated architectural light channel
      const finGeo = new THREE.BoxGeometry(0.08, 11, 0.15);
      const finMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xd4af37 : 0xf4eedb,
        transparent: true,
        opacity: 0.45,
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(finX, 5.5, finZ);
      fin.lookAt(0, 5.5, 0);
      this.scene.add(fin);
    }

    // 5. SUSPENDED ATELIER CEILING LIGHT FRAME (Overhead luminaire canopy)
    // Outer floating frame
    const canopyFrameGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1a1d26,
      roughness: 0.4,
      metalness: 0.8,
    });
    
    // 4 Border beams of overhead ceiling canopy
    const beamLength = 8;
    const beamWidth = 4.2;
    const beamThick = 0.08;
    
    // Front/Back frame beams
    const beamFbGeo = new THREE.BoxGeometry(beamWidth, beamThick, beamThick);
    const beamFront = new THREE.Mesh(beamFbGeo, frameMat);
    beamFront.position.set(0, 6.1, beamLength / 2);
    canopyFrameGroup.add(beamFront);

    const beamBack = new THREE.Mesh(beamFbGeo, frameMat);
    beamBack.position.set(0, 6.1, -beamLength / 2);
    canopyFrameGroup.add(beamBack);

    // Left/Right frame beams
    const beamLrGeo = new THREE.BoxGeometry(beamThick, beamThick, beamLength);
    const beamLeft = new THREE.Mesh(beamLrGeo, frameMat);
    beamLeft.position.set(-beamWidth / 2, 6.1, 0);
    canopyFrameGroup.add(beamLeft);

    const beamRight = new THREE.Mesh(beamLrGeo, frameMat);
    beamRight.position.set(beamWidth / 2, 6.1, 0);
    canopyFrameGroup.add(beamRight);

    // Warm champagne LED light strip inside canopy frame perimeter
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xfff3da });
    const ledGeoFb = new THREE.BoxGeometry(beamWidth - 0.2, 0.02, 0.04);
    const ledFront = new THREE.Mesh(ledGeoFb, ledMat);
    ledFront.position.set(0, 6.05, beamLength / 2 - 0.06);
    canopyFrameGroup.add(ledFront);

    const ledBack = new THREE.Mesh(ledGeoFb, ledMat);
    ledBack.position.set(0, 6.05, -beamLength / 2 + 0.06);
    canopyFrameGroup.add(ledBack);

    this.scene.add(canopyFrameGroup);

    // 6. ARCHITECTURAL SHOWROOM PILLARS (Flanking the space in the background)
    const pillarPositions = [
      { x: -14, z: -8 },
      { x: 14, z: -8 },
      { x: -18, z: 2 },
      { x: 18, z: 2 },
    ];
    pillarPositions.forEach((pos) => {
      const pillarGeo = new THREE.BoxGeometry(0.8, 14, 0.8);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x12141c,
        roughness: 0.5,
        metalness: 0.6,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(pos.x, 7, pos.z);
      this.scene.add(pillar);

      // Fine champagne accent strip running down pillar
      const stripeGeo = new THREE.BoxGeometry(0.04, 14, 0.81);
      const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xc5a880,
        roughness: 0.3,
        metalness: 0.8,
      });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(pos.x, 7, pos.z);
      this.scene.add(stripe);
    });
  }

  private setupInteractions() {
    const el = this.renderer.domElement;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isUserInteracting = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      this.pointerDownPos = { x: clientX, y: clientY };

      // Calculate current spherical coords from camera position relative to lookAt
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.currentLookAt);
      this.spherical.radius = offset.length();
      this.spherical.theta = Math.atan2(offset.x, offset.z);
      this.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / (this.spherical.radius || 1))));
      this.targetSpherical = { ...this.spherical };
    };

    this.pointerMoveHandler = (e: MouseEvent | TouchEvent) => {
      if (!this.isUserInteracting) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - this.pointerDownPos.x;
      const deltaY = clientY - this.pointerDownPos.y;
      this.pointerDownPos = { x: clientX, y: clientY };

      // Orbit rotation sensitivity
      this.targetSpherical.theta -= deltaX * 0.006;
      this.targetSpherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.04, this.targetSpherical.phi - deltaY * 0.006));
    };

    this.pointerUpHandler = () => {
      this.isUserInteracting = false;
    };

    this.wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.003;
      this.targetSpherical.radius = Math.max(2.2, Math.min(10.0, this.targetSpherical.radius + zoomFactor));
    };

    el.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', this.pointerMoveHandler);
    window.addEventListener('mouseup', this.pointerUpHandler);

    el.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', this.pointerMoveHandler, { passive: true });
    window.addEventListener('touchend', this.pointerUpHandler);

    el.addEventListener('wheel', this.wheelHandler, { passive: false });
  }

  public applyMode(mode: ShowroomMode, instant: boolean = false) {
    this.currentMode = mode;
    if (mode === 'atelier') {
      // Luxury Atelier Studio (Deep architectural graphite/warm champagne lighting)
      this.targetBgColor.setHex(0x10131a);
      this.dirLightKey.color.setHex(0xfff6ea);
      this.dirLightKey.intensity = 4.0;
      this.dirLightRim.color.setHex(0xe4ca98);
      this.dirLightRim.intensity = 2.8;
      this.dirLightBack.color.setHex(0x8fa2b8);
      this.dirLightBack.intensity = 1.4;
      this.hemiLight.color.setHex(0x485264);
      this.hemiLight.groundColor.setHex(0x161922);
      this.cyberRingMat.color.setHex(0xd4af37);
      this.cyberRingMat.opacity = 0.5;
      this.studioSoftboxMat.color.setHex(0xfffaee);
      this.renderer.toneMappingExposure = 1.25;
    } else {
      // Midnight Cyber (Dark exhibition with electric cyan ground accent and metallic silver)
      this.targetBgColor.setHex(0x0a0c12);
      this.dirLightKey.color.setHex(0xe0f2fe);
      this.dirLightKey.intensity = 3.2;
      this.dirLightRim.color.setHex(0x00e5ff);
      this.dirLightRim.intensity = 3.0;
      this.dirLightBack.color.setHex(0x38bdf8);
      this.dirLightBack.intensity = 2.0;
      this.hemiLight.color.setHex(0x1e293b);
      this.hemiLight.groundColor.setHex(0x0b0f17);
      this.cyberRingMat.color.setHex(0x00e5ff);
      this.cyberRingMat.opacity = 0.85;
      this.studioSoftboxMat.color.setHex(0xbae6fd);
      this.renderer.toneMappingExposure = 1.15;
    }

    if (instant) {
      this.currentBgColor.copy(this.targetBgColor);
      this.scene.background = this.currentBgColor;
      if (this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).color.copy(this.currentBgColor);
      }
    }
  }

  public setCameraPreset(preset: CameraPreset) {
    const config = CAMERA_PRESETS[preset] || CAMERA_PRESETS.cinematic;
    this.targetCamPos.copy(config.position);
    this.targetCamLookAt.copy(config.target);

    // Sync spherical
    const offset = new THREE.Vector3().subVectors(config.position, config.target);
    this.targetSpherical.radius = offset.length();
    this.targetSpherical.theta = Math.atan2(offset.x, offset.z);
    this.targetSpherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / this.targetSpherical.radius)));
    this.spherical = { ...this.targetSpherical };
    this.camera.fov = config.fov;
    this.camera.updateProjectionMatrix();
  }

  public applyVehicleState(state: VehicleState) {
    this.car.setBodyColor(state.color);
    this.car.setWheelFinish(state.wheelFinish);
    this.car.setCaliperColor(state.caliperColor);
    this.car.setDoors(state.doorsOpen);
    this.car.setWingMode(state.wingAngle);
    this.car.setHeadlights(state.headlights);
    this.car.setUnderglow(state.underglow);
    this.car.setAeroFlow(state.showAeroFlow);
    this.car.setExploded(state.explodedView);
    this.car.setNitro(state.nitroActive);
    this.turntableSpeedMultiplier = state.turntableSpeed;
    this.autoRotate = state.turntableSpeed > 0;
  }

  public setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled;
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth || 800;
    const height = this.container.clientHeight || window.innerHeight || 600;
    if (height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(width, height);
  };

  private render = () => {
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Smoothly blend background and fog colors
    this.currentBgColor.lerp(this.targetBgColor, delta * 3.5);
    this.scene.background = this.currentBgColor;
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color.copy(this.currentBgColor);
    }

    // Auto turntable rotation (subtle exhibition rotate)
    if (this.autoRotate && !this.isUserInteracting) {
      const speed = 0.18 * this.turntableSpeedMultiplier;
      this.turntableAngle += speed * delta;
      this.turntableGroup.rotation.y = this.turntableAngle;
    }

    // Camera smoothing
    if (this.isUserInteracting) {
      // Smooth spherical interpolation
      this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.15;
      this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.15;
      this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.15;

      const sinPhi = Math.sin(this.spherical.phi);
      const cosPhi = Math.cos(this.spherical.phi);
      const sinTheta = Math.sin(this.spherical.theta);
      const cosTheta = Math.cos(this.spherical.theta);

      this.camera.position.set(
        this.currentLookAt.x + this.spherical.radius * sinPhi * sinTheta,
        this.currentLookAt.y + this.spherical.radius * cosPhi,
        this.currentLookAt.z + this.spherical.radius * sinPhi * cosTheta
      );
    } else {
      // Smoothly approach targetCamPos and targetCamLookAt
      this.camera.position.lerp(this.targetCamPos, delta * 4.0);
      this.currentLookAt.lerp(this.targetCamLookAt, delta * 4.0);
    }

    this.camera.lookAt(this.currentLookAt);

    // Update car animations (doors, active wing, wheels spin)
    const wheelSpin = this.autoRotate ? 0.3 * this.turntableSpeedMultiplier : 0;
    this.car.update(delta, wheelSpin);

    // Pulse cyber ground ring
    if (this.currentMode === 'midnight') {
      const ringPulse = 0.75 + Math.sin(Date.now() * 0.003) * 0.25;
      this.cyberRingMat.opacity = ringPulse;
    }

    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(this.render);
  };

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    if (this.pointerMoveHandler) {
      window.removeEventListener('mousemove', this.pointerMoveHandler);
      window.removeEventListener('touchmove', this.pointerMoveHandler);
    }
    if (this.pointerUpHandler) {
      window.removeEventListener('mouseup', this.pointerUpHandler);
      window.removeEventListener('touchend', this.pointerUpHandler);
    }
    this.car.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

import * as THREE from 'three';
import { BodyColorKey, CaliperColorKey, WheelFinishKey } from '../types';

export const COLOR_CONFIG: Record<BodyColorKey, { color: number; metalness: number; roughness: number; clearcoat: number; clearcoatRoughness: number }> = {
  noir: {
    color: 0x0a0b0e,
    metalness: 0.92,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  },
  gold: {
    color: 0xd4af37,
    metalness: 0.88,
    roughness: 0.25,
    clearcoat: 0.95,
    clearcoatRoughness: 0.1,
  },
  cyan: {
    color: 0x00c8e6,
    metalness: 0.82,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  },
  rosso: {
    color: 0xc4121a,
    metalness: 0.85,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  },
  bianco: {
    color: 0xf0f3f6,
    metalness: 0.75,
    roughness: 0.28,
    clearcoat: 1.0,
    clearcoatRoughness: 0.09,
  },
};

export const WHEEL_CONFIG: Record<WheelFinishKey, { color: number; metalness: number; roughness: number }> = {
  stealth: { color: 0x121316, metalness: 0.9, roughness: 0.35 },
  titanium: { color: 0x7c8188, metalness: 0.95, roughness: 0.22 },
  bronze: { color: 0x8a6a3b, metalness: 0.88, roughness: 0.28 },
  chrome: { color: 0xd8dde4, metalness: 0.98, roughness: 0.12 },
};

export const CALIPER_CONFIG: Record<CaliperColorKey, number> = {
  cyan: 0x00e5ff,
  gold: 0xffb703,
  rosso: 0xe61c24,
  noir: 0x1a1c22,
};

export class SpectreCarModel {
  public group: THREE.Group;

  // Materials for real-time adjustments
  private bodyMaterial: THREE.MeshPhysicalMaterial;
  private carbonMaterial: THREE.MeshStandardMaterial;
  private glassMaterial: THREE.MeshPhysicalMaterial;
  private wheelMaterial: THREE.MeshStandardMaterial;
  private caliperMaterial: THREE.MeshStandardMaterial;
  private brakeDiscMaterial: THREE.MeshStandardMaterial;
  private headlightMaterial: THREE.MeshStandardMaterial;
  private taillightMaterial: THREE.MeshStandardMaterial;
  private exhaustMaterial: THREE.MeshStandardMaterial;
  private underglowLight: THREE.PointLight | null = null;

  // Kinematic Door Groups & Wing
  private leftDoorGroup: THREE.Group = new THREE.Group();
  private rightDoorGroup: THREE.Group = new THREE.Group();
  private wingGroup: THREE.Group = new THREE.Group();
  private wheels: THREE.Group[] = [];
  private aeroFlowGroup: THREE.Group = new THREE.Group();

  // Exploded View Sub-Assembly Groups
  private bodyGroup: THREE.Group = new THREE.Group();
  private canopyGroup: THREE.Group = new THREE.Group();
  private splitterGroup: THREE.Group = new THREE.Group();
  private diffuserGroup: THREE.Group = new THREE.Group();
  private nitroFlameGroup: THREE.Group = new THREE.Group();
  private nitroLight: THREE.PointLight | null = null;

  // Animation States
  private targetDoorAngle: number = 0; // 0 (closed) to 0.75 (open butterfly)
  private currentDoorAngle: number = 0;
  private targetWingAngle: number = 0; // 0, 0.25 (active), 0.75 (airbrake)
  private targetWingY: number = 0; // 0 to 0.18
  private currentWingAngle: number = 0;
  private currentWingY: number = 0;
  private targetExploded: number = 0;
  private currentExploded: number = 0;
  private isNitroActive: boolean = false;

  // Lights state
  private headlightIntensity: number = 2.0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'AURA_SPECTRE_V12';

    // 1. Initialize Shared PBR Materials
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: COLOR_CONFIG.noir.color,
      metalness: COLOR_CONFIG.noir.metalness,
      roughness: COLOR_CONFIG.noir.roughness,
      clearcoat: COLOR_CONFIG.noir.clearcoat,
      clearcoatRoughness: COLOR_CONFIG.noir.clearcoatRoughness,
      reflectivity: 0.9,
    });

    this.carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x141518,
      metalness: 0.6,
      roughness: 0.45,
      bumpScale: 0.05,
    });

    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06090d,
      metalness: 0.1,
      roughness: 0.04,
      transmission: 0.85,
      transparent: true,
      opacity: 0.88,
      ior: 1.52,
      thickness: 0.3,
    });

    this.wheelMaterial = new THREE.MeshStandardMaterial({
      color: WHEEL_CONFIG.titanium.color,
      metalness: WHEEL_CONFIG.titanium.metalness,
      roughness: WHEEL_CONFIG.titanium.roughness,
    });

    this.caliperMaterial = new THREE.MeshStandardMaterial({
      color: CALIPER_CONFIG.cyan,
      metalness: 0.75,
      roughness: 0.25,
      emissive: 0x004050,
      emissiveIntensity: 0.2,
    });

    this.brakeDiscMaterial = new THREE.MeshStandardMaterial({
      color: 0x484b50,
      metalness: 0.9,
      roughness: 0.32,
    });

    this.headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8ffff,
      emissive: 0x00e5ff,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });

    this.taillightMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1020,
      emissive: 0xff0020,
      emissiveIntensity: 4.5,
      roughness: 0.1,
    });

    this.exhaustMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d4b68, // titanium heat-treated blue
      metalness: 0.95,
      roughness: 0.2,
    });

    this.buildHyperCar();
  }

  private buildHyperCar() {
    // Overall dimensions: Hyper-GT low slung (length ~4.8m, width ~2.1m, height ~1.12m)
    // Car is centered at (0, 0.45, 0) so wheels touch ground at y=0.

    // 1. Monocoque Carbon Tub Underbody
    const underbodyGeo = new THREE.BoxGeometry(1.85, 0.14, 4.3);
    const underbody = new THREE.Mesh(underbodyGeo, this.carbonMaterial);
    underbody.position.set(0, 0.18, 0);
    underbody.castShadow = true;
    underbody.receiveShadow = true;
    this.group.add(underbody);

    // Front Splitter
    const splitterShape = new THREE.Shape();
    splitterShape.moveTo(-1.05, 0);
    splitterShape.lineTo(1.05, 0);
    splitterShape.lineTo(0.95, -0.75);
    splitterShape.lineTo(0.5, -0.85);
    splitterShape.lineTo(0, -0.9);
    splitterShape.lineTo(-0.5, -0.85);
    splitterShape.lineTo(-0.95, -0.75);
    splitterShape.closePath();

    const splitterExtrude = new THREE.ExtrudeGeometry(splitterShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
    const frontSplitter = new THREE.Mesh(splitterExtrude, this.carbonMaterial);
    frontSplitter.rotation.x = Math.PI / 2;
    frontSplitter.position.set(0, 0.12, 1.6);
    frontSplitter.castShadow = true;
    this.splitterGroup.add(frontSplitter);

    // Splitter Endplates / Winglets
    [-1.04, 1.04].forEach((xPos) => {
      const wingletGeo = new THREE.BoxGeometry(0.04, 0.16, 0.45);
      const winglet = new THREE.Mesh(wingletGeo, this.carbonMaterial);
      winglet.position.set(xPos, 0.2, 2.05);
      this.splitterGroup.add(winglet);
    });
    this.group.add(this.splitterGroup);

    // Rear Diffuser with 6 Vertical Strakes
    const diffuserGeo = new THREE.BoxGeometry(1.78, 0.18, 0.85);
    const diffuser = new THREE.Mesh(diffuserGeo, this.carbonMaterial);
    diffuser.position.set(0, 0.22, -2.05);
    diffuser.rotation.x = -0.15; // rake angle
    this.diffuserGroup.add(diffuser);

    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const strakeGeo = new THREE.BoxGeometry(0.03, 0.18, 0.8);
      const strake = new THREE.Mesh(strakeGeo, this.carbonMaterial);
      strake.position.set(i * 0.24, 0.18, -2.05);
      strake.rotation.x = -0.15;
      this.diffuserGroup.add(strake);
    }
    this.group.add(this.diffuserGroup);

    // 2. Main Sculpted Body & Hood
    this.buildBodySculpture();

    // 3. Teardrop Cockpit & Smoked Glass
    this.buildCockpit();

    // 4. Dihedral Butterfly Doors (Kinematic Groups)
    this.buildKinematicDoors();

    // 5. Powertrain & Engine Bay (Exposed V12 + Twin Turbos)
    this.buildPowertrainBay();

    // 6. Wheels, Carbon-Ceramic Brakes, Calipers
    this.buildWheelsAndSuspension();

    // 7. Futuristic Headlights & Full-Width Rear Lightbar
    this.buildLighting();

    // 8. Quad Titanium Exhausts
    this.buildTitaniumExhausts();

    // 8b. Nitro Flame FX
    this.buildNitroFx();

    // 9. Active Aerodynamic Rear Wing
    this.buildActiveWing();

    // 10. Underglow Ground Illumination
    this.buildUnderglow();

    // 11. Aerodynamic CFD Airflow Streamlines
    this.buildAeroStreamlines();
  }

  private buildNitroFx() {
    this.nitroFlameGroup = new THREE.Group();
    this.nitroFlameGroup.visible = false;

    const exhaustPositions = [
      { x: -0.18, y: 0.38, z: -2.32 },
      { x: -0.06, y: 0.38, z: -2.32 },
      { x: 0.06, y: 0.38, z: -2.32 },
      { x: 0.18, y: 0.38, z: -2.32 },
    ];

    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.85,
    });
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    exhaustPositions.forEach((pos) => {
      const flameSub = new THREE.Group();
      flameSub.position.set(pos.x, pos.y, pos.z);

      // Outer blue/cyan jet cone pointing -Z
      const coneGeo = new THREE.ConeGeometry(0.046, 0.45, 16);
      const outerCone = new THREE.Mesh(coneGeo, outerFlameMat);
      outerCone.rotation.x = -Math.PI / 2;
      outerCone.position.z = -0.22;
      flameSub.add(outerCone);

      // Inner white high-temp core
      const coreGeo = new THREE.ConeGeometry(0.024, 0.28, 12);
      const innerCone = new THREE.Mesh(coreGeo, innerFlameMat);
      innerCone.rotation.x = -Math.PI / 2;
      innerCone.position.z = -0.14;
      flameSub.add(innerCone);

      this.nitroFlameGroup.add(flameSub);
    });

    this.nitroLight = new THREE.PointLight(0x00e5ff, 0, 4.5);
    this.nitroLight.position.set(0, 0.38, -2.4);
    this.nitroFlameGroup.add(this.nitroLight);

    this.group.add(this.nitroFlameGroup);
  }

  private buildBodySculpture() {
    // Low aerodynamic hood & sculpted front nose
    const noseGeo = new THREE.CylinderGeometry(0.5, 0.95, 1.2, 16, 1, false, -Math.PI / 2, Math.PI);
    const nose = new THREE.Mesh(noseGeo, this.bodyMaterial);
    nose.rotation.x = Math.PI / 2;
    nose.rotation.z = Math.PI / 2;
    nose.scale.set(0.65, 1.0, 0.25);
    nose.position.set(0, 0.42, 1.85);
    nose.castShadow = true;
    this.bodyGroup.add(nose);

    // Front Hood Deck with Aero Ducts
    const hoodGeo = new THREE.BoxGeometry(1.45, 0.12, 1.35);
    const hood = new THREE.Mesh(hoodGeo, this.bodyMaterial);
    hood.position.set(0, 0.52, 1.15);
    hood.rotation.x = 0.09;
    hood.castShadow = true;
    this.bodyGroup.add(hood);

    // Hood Air Extractor Vents (Carbon inserts)
    [-0.35, 0.35].forEach((x) => {
      const ventGeo = new THREE.BoxGeometry(0.24, 0.04, 0.5);
      const vent = new THREE.Mesh(ventGeo, this.carbonMaterial);
      vent.position.set(x, 0.56, 1.15);
      vent.rotation.x = 0.16;
      this.bodyGroup.add(vent);
    });

    // Sculpted Front Fenders (Left and Right)
    [-0.88, 0.88].forEach((x) => {
      const fenderGroup = new THREE.Group();
      const fenderArchGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.35, 24, 1, false, 0, Math.PI);
      const fenderArch = new THREE.Mesh(fenderArchGeo, this.bodyMaterial);
      fenderArch.rotation.z = Math.PI / 2;
      fenderArch.rotation.y = Math.PI / 2;
      fenderArch.scale.set(1.05, 0.6, 1.15);
      fenderArch.position.set(0, 0.44, 1.35);
      fenderArch.castShadow = true;
      fenderGroup.add(fenderArch);

      // Fender Top Louvers
      for (let l = 0; l < 4; l++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.06), this.carbonMaterial);
        louver.position.set(0, 0.68 + l * 0.01, 1.38 - l * 0.09);
        louver.rotation.x = 0.25;
        fenderGroup.add(louver);
      }

      fenderGroup.position.x = x;
      this.bodyGroup.add(fenderGroup);
    });

    // Side Sills & Aerodynamic Rockers with carbon ground skirt
    [-0.92, 0.92].forEach((x) => {
      const sillGeo = new THREE.BoxGeometry(0.12, 0.12, 2.1);
      const sill = new THREE.Mesh(sillGeo, this.carbonMaterial);
      sill.position.set(x, 0.22, 0.05);
      sill.castShadow = true;
      this.bodyGroup.add(sill);

      // Side Pod air scoops
      const scoopGeo = new THREE.BoxGeometry(0.18, 0.28, 0.65);
      const scoop = new THREE.Mesh(scoopGeo, this.carbonMaterial);
      scoop.position.set(x * 0.92, 0.38, -0.35);
      scoop.rotation.y = (x > 0 ? -1 : 1) * 0.15;
      this.bodyGroup.add(scoop);
    });

    // Sculpted Rear Haunches (Muscular Rear Fenders)
    [-0.94, 0.94].forEach((x) => {
      const rearFenderArchGeo = new THREE.CylinderGeometry(0.5, 0.54, 0.42, 24, 1, false, 0, Math.PI);
      const rearFenderArch = new THREE.Mesh(rearFenderArchGeo, this.bodyMaterial);
      rearFenderArch.rotation.z = Math.PI / 2;
      rearFenderArch.rotation.y = Math.PI / 2;
      rearFenderArch.scale.set(1.1, 0.65, 1.25);
      rearFenderArch.position.set(x, 0.48, -1.25);
      rearFenderArch.castShadow = true;
      this.bodyGroup.add(rearFenderArch);
    });

    // Rear Bumper / Fascia Panel
    const rearBumperGeo = new THREE.BoxGeometry(1.88, 0.35, 0.35);
    const rearBumper = new THREE.Mesh(rearBumperGeo, this.bodyMaterial);
    rearBumper.position.set(0, 0.44, -2.15);
    rearBumper.castShadow = true;
    this.bodyGroup.add(rearBumper);

    this.group.add(this.bodyGroup);
  }

  private buildCockpit() {
    // Teardrop Canopy & Smoked Panoramic Roof
    const canopyShape = new THREE.Shape();
    canopyShape.moveTo(-0.55, 0);
    canopyShape.lineTo(0.55, 0);
    canopyShape.lineTo(0.5, 1.85);
    canopyShape.lineTo(0.35, 2.2);
    canopyShape.lineTo(-0.35, 2.2);
    canopyShape.lineTo(-0.5, 1.85);
    canopyShape.closePath();

    const canopyGeo = new THREE.CylinderGeometry(0.68, 0.88, 1.95, 24, 1, false, -Math.PI / 2, Math.PI);
    const canopy = new THREE.Mesh(canopyGeo, this.glassMaterial);
    canopy.rotation.x = Math.PI / 2;
    canopy.rotation.z = Math.PI / 2;
    canopy.scale.set(0.55, 1.0, 0.45);
    canopy.position.set(0, 0.74, 0.2);
    canopy.castShadow = true;
    this.canopyGroup.add(canopy);

    // Windshield frame / A-pillars in carbon
    const windshieldFrameGeo = new THREE.TorusGeometry(0.72, 0.04, 8, 24, Math.PI);
    const windshieldFrame = new THREE.Mesh(windshieldFrameGeo, this.carbonMaterial);
    windshieldFrame.rotation.x = 0.55;
    windshieldFrame.position.set(0, 0.75, 0.75);
    this.canopyGroup.add(windshieldFrame);
    this.group.add(this.canopyGroup);

    // Cockpit Interior Elements (visible through smoked glass)
    const cockpitInterior = new THREE.Group();

    // Dual lightweight racing bucket seats
    [-0.32, 0.32].forEach((x) => {
      const seatGroup = new THREE.Group();
      // Seat cushion
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.45), this.carbonMaterial);
      cushion.position.set(0, 0.32, 0.12);
      seatGroup.add(cushion);

      // Backrest
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.45, 0.08), this.carbonMaterial);
      backrest.position.set(0, 0.55, -0.12);
      backrest.rotation.x = -0.22;
      seatGroup.add(backrest);

      // Cyan ambient seat accent harness
      const harness = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.42, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00a8cc, emissiveIntensity: 0.6 })
      );
      harness.position.set(0, 0.55, -0.07);
      harness.rotation.x = -0.22;
      seatGroup.add(harness);

      seatGroup.position.x = x;
      cockpitInterior.add(seatGroup);
    });

    // Center Console Tunnel
    const consoleGeo = new THREE.BoxGeometry(0.18, 0.22, 0.85);
    const centerConsole = new THREE.Mesh(consoleGeo, this.carbonMaterial);
    centerConsole.position.set(0, 0.38, 0.18);
    cockpitInterior.add(centerConsole);

    // Center Display Strip
    const displayGeo = new THREE.BoxGeometry(0.14, 0.02, 0.3);
    const centerDisplay = new THREE.Mesh(
      displayGeo,
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.2 })
    );
    centerDisplay.position.set(0, 0.495, 0.22);
    centerDisplay.rotation.x = -0.3;
    cockpitInterior.add(centerDisplay);

    // Dashboard & Steering Yoke (Left-Hand Drive, x = -0.32)
    const dashGeo = new THREE.BoxGeometry(1.2, 0.18, 0.35);
    const dashboard = new THREE.Mesh(dashGeo, this.carbonMaterial);
    dashboard.position.set(0, 0.62, 0.62);
    cockpitInterior.add(dashboard);

    // Driver HUD Cluster
    const hudCluster = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.1, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 2.0 })
    );
    hudCluster.position.set(-0.32, 0.68, 0.58);
    hudCluster.rotation.x = -0.2;
    cockpitInterior.add(hudCluster);

    // Formula 1 Style Steering Yoke
    const yokeGroup = new THREE.Group();
    const yokeBar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 12), this.carbonMaterial);
    yokeBar.rotation.z = Math.PI / 2;
    yokeGroup.add(yokeBar);

    [-0.12, 0.12].forEach((xGrip) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.14, 12), this.carbonMaterial);
      grip.position.set(xGrip, 0, 0);
      yokeGroup.add(grip);
    });

    const yokeCenter = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0c, emissive: 0xd4af37, emissiveIntensity: 0.3 })
    );
    yokeGroup.add(yokeCenter);

    yokeGroup.position.set(-0.32, 0.6, 0.46);
    yokeGroup.rotation.x = -0.35;
    cockpitInterior.add(yokeGroup);

    this.group.add(cockpitInterior);
  }

  private buildKinematicDoors() {
    // Left Door Group
    this.leftDoorGroup.position.set(-0.86, 0.52, 0.5); // Pivot at A-pillar base
    const leftDoorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 1.15), this.bodyMaterial);
    leftDoorPanel.position.set(0, -0.06, -0.45);
    leftDoorPanel.castShadow = true;
    this.leftDoorGroup.add(leftDoorPanel);

    const leftWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.85), this.glassMaterial);
    leftWindow.position.set(-0.03, 0.22, -0.45);
    leftWindow.rotation.x = 0.1;
    this.leftDoorGroup.add(leftWindow);

    this.group.add(this.leftDoorGroup);

    // Right Door Group
    this.rightDoorGroup.position.set(0.86, 0.52, 0.5); // Pivot at A-pillar base
    const rightDoorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 1.15), this.bodyMaterial);
    rightDoorPanel.position.set(0, -0.06, -0.45);
    rightDoorPanel.castShadow = true;
    this.rightDoorGroup.add(rightDoorPanel);

    const rightWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.85), this.glassMaterial);
    rightWindow.position.set(0.03, 0.22, -0.45);
    rightWindow.rotation.x = 0.1;
    this.rightDoorGroup.add(rightWindow);

    this.group.add(this.rightDoorGroup);
  }

  private buildPowertrainBay() {
    // Transparent Glass Rear Engine Decklid
    const engineDeckGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.04, 1.25),
      this.glassMaterial
    );
    engineDeckGlass.position.set(0, 0.68, -0.85);
    engineDeckGlass.rotation.x = -0.12;
    this.group.add(engineDeckGlass);

    // V12 Engine Block
    const engineGroup = new THREE.Group();
    const crankcase = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.22, 0.72),
      new THREE.MeshStandardMaterial({ color: 0x242830, metalness: 0.9, roughness: 0.3 })
    );
    crankcase.position.set(0, 0.42, -0.85);
    engineGroup.add(crankcase);

    // Twin Red/Carbon V12 Cylinder Heads (60-degree V angle)
    [-0.22, 0.22].forEach((x, idx) => {
      const headCover = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.1, 0.68),
        new THREE.MeshStandardMaterial({
          color: 0xc4121a, // Rosso Corsa Red Head Covers
          metalness: 0.8,
          roughness: 0.25,
        })
      );
      headCover.position.set(x, 0.52, -0.85);
      headCover.rotation.z = (idx === 0 ? 1 : -1) * 0.32;
      engineGroup.add(headCover);

      // Embossed "AURA V12 HYBRID" plate on cover
      const badgePlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.02, 0.4),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 })
      );
      badgePlate.position.set(x * 1.05, 0.58, -0.85);
      badgePlate.rotation.z = (idx === 0 ? 1 : -1) * 0.32;
      engineGroup.add(badgePlate);
    });

    // Twin High-Mounted Turbochargers with Turbine Housings
    [-0.26, 0.26].forEach((x) => {
      const turboTurbine = new THREE.Mesh(
        new THREE.TorusGeometry(0.065, 0.035, 12, 24),
        this.exhaustMaterial
      );
      turboTurbine.position.set(x, 0.56, -1.25);
      turboTurbine.rotation.y = Math.PI / 2;
      engineGroup.add(turboTurbine);

      // Carbon induction pipe leading into plenum
      const pipeCurve = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 12);
      const pipe = new THREE.Mesh(pipeCurve, this.carbonMaterial);
      pipe.position.set(x, 0.58, -1.05);
      pipe.rotation.x = Math.PI / 3;
      engineGroup.add(pipe);
    });

    // Titanium Structural Cross-Brace (X-Brace over engine)
    const braceMat = new THREE.MeshStandardMaterial({ color: 0x8892a0, metalness: 0.92, roughness: 0.2 });
    const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.25, 12), braceMat);
    bar1.position.set(0, 0.65, -0.85);
    bar1.rotation.z = 0.55;
    bar1.rotation.y = 0.35;
    engineGroup.add(bar1);

    const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.25, 12), braceMat);
    bar2.position.set(0, 0.65, -0.85);
    bar2.rotation.z = -0.55;
    bar2.rotation.y = -0.35;
    engineGroup.add(bar2);

    // High Voltage Hybrid Bus Cables (Glowing Orange / Gold)
    const hvCableGeo = new THREE.TorusGeometry(0.24, 0.018, 8, 20, Math.PI);
    const hvCableMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });
    const hvCable = new THREE.Mesh(hvCableGeo, hvCableMat);
    hvCable.position.set(0, 0.44, -0.55);
    hvCable.rotation.x = Math.PI / 2;
    engineGroup.add(hvCable);

    this.group.add(engineGroup);
  }

  private buildWheelsAndSuspension() {
    // Wheel positions: Front Left, Front Right, Rear Left, Rear Right
    const wheelPositions = [
      { x: -0.92, y: 0.36, z: 1.35, isFront: true, isLeft: true },
      { x: 0.92, y: 0.36, z: 1.35, isFront: true, isLeft: false },
      { x: -0.94, y: 0.38, z: -1.25, isFront: false, isLeft: true },
      { x: 0.94, y: 0.38, z: -1.25, isFront: false, isLeft: false },
    ];

    const tireRubberMat = new THREE.MeshStandardMaterial({
      color: 0x18191c,
      roughness: 0.88,
      metalness: 0.05,
    });

    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);
      wheelGroup.name = `Wheel_${idx}`;

      const radius = pos.isFront ? 0.36 : 0.38;
      const width = pos.isFront ? 0.28 : 0.34;

      // 1. Tire Rubber
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 32);
      const tire = new THREE.Mesh(tireGeo, tireRubberMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Tread Grooves (subtle inner ring)
      const treadRingGeo = new THREE.TorusGeometry(radius * 0.96, 0.02, 8, 32);
      const treadRing = new THREE.Mesh(treadRingGeo, tireRubberMat);
      treadRing.rotation.y = Math.PI / 2;
      wheelGroup.add(treadRing);

      // 2. Wheel Rim Outer Barrel
      const rimBarrelGeo = new THREE.CylinderGeometry(radius * 0.78, radius * 0.78, width * 0.92, 28, 1, true);
      const rimBarrel = new THREE.Mesh(rimBarrelGeo, this.wheelMaterial);
      rimBarrel.rotation.z = Math.PI / 2;
      wheelGroup.add(rimBarrel);

      // 3. Forged Alloy 5-Split-Spoke Star Design
      const spokesGroup = new THREE.Group();
      for (let s = 0; s < 5; s++) {
        const angle = (s * Math.PI * 2) / 5;
        // Dual spoke pair
        [-0.08, 0.08].forEach((offset) => {
          const spokeGeo = new THREE.BoxGeometry(0.035, radius * 0.74, 0.04);
          const spoke = new THREE.Mesh(spokeGeo, this.wheelMaterial);
          spoke.rotation.z = angle + offset;
          spokesGroup.add(spoke);
        });
      }
      spokesGroup.position.x = (pos.isLeft ? -1 : 1) * (width * 0.44);
      spokesGroup.rotation.y = Math.PI / 2;
      wheelGroup.add(spokesGroup);

      // Center Lock Nut in Titanium/Cyan
      const centerLockGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12);
      const centerLock = new THREE.Mesh(
        centerLockGeo,
        new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.9, roughness: 0.1 })
      );
      centerLock.rotation.z = Math.PI / 2;
      centerLock.position.x = (pos.isLeft ? -1 : 1) * (width * 0.48);
      wheelGroup.add(centerLock);

      // 4. Perforated Carbon-Ceramic Brake Disc (Fixed, non-rotating)
      const brakeDiscGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, 0.04, 28);
      const brakeDisc = new THREE.Mesh(brakeDiscGeo, this.brakeDiscMaterial);
      brakeDisc.rotation.z = Math.PI / 2;
      brakeDisc.position.x = (pos.isLeft ? -1 : 1) * (width * 0.12);
      wheelGroup.add(brakeDisc);

      // 5. Brembo-style Multi-Piston Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.14, 0.28);
      const caliper = new THREE.Mesh(caliperGeo, this.caliperMaterial);
      caliper.position.set(
        (pos.isLeft ? -1 : 1) * (width * 0.2),
        pos.isFront ? 0.12 : -0.08,
        pos.isFront ? 0.16 : 0.18
      );
      caliper.rotation.x = pos.isFront ? 0.35 : -0.25;
      wheelGroup.add(caliper);

      this.wheels.push(wheelGroup);
      this.group.add(wheelGroup);
    });
  }

  private buildLighting() {
    // 1. Futuristic LED Headlights (Dual Horizontal Slits + Vertical Projector Blades)
    [-0.72, 0.72].forEach((x, idx) => {
      const headlightGroup = new THREE.Group();

      // Top DRL blade (razor sharp horizontal strip)
      const drlBlade = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.024, 0.12),
        this.headlightMaterial
      );
      drlBlade.position.set(0, 0.45, 1.95);
      drlBlade.rotation.y = (idx === 0 ? 1 : -1) * 0.32;
      headlightGroup.add(drlBlade);

      // Lower projector pod
      const projector = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16),
        this.headlightMaterial
      );
      projector.rotation.x = Math.PI / 2;
      projector.position.set((idx === 0 ? 1 : -1) * 0.05, 0.4, 1.94);
      headlightGroup.add(projector);

      // Fine Cyan Accent eyebrow
      const eyebrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.012, 0.04),
        new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 4.0,
        })
      );
      eyebrow.position.set(0, 0.47, 1.93);
      headlightGroup.add(eyebrow);

      headlightGroup.position.x = x;
      this.group.add(headlightGroup);
    });

    // 2. Full-Width Curved Rear LED Light Bar
    const lightBarGeo = new THREE.BoxGeometry(1.72, 0.038, 0.12);
    const rearLightBar = new THREE.Mesh(lightBarGeo, this.taillightMaterial);
    rearLightBar.position.set(0, 0.58, -2.18);
    this.group.add(rearLightBar);

    // Glowing Central "AURA" Insignia on rear fascia
    const auraBadge = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.028, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0xff3344,
        emissive: 0xff1020,
        emissiveIntensity: 3.0,
      })
    );
    auraBadge.position.set(0, 0.52, -2.25);
    this.group.add(auraBadge);
  }

  private buildTitaniumExhausts() {
    // Quad Titanium Exhaust Tips (arranged 2x2 centrally above the diffuser)
    const exhaustPositions = [
      { x: -0.18, y: 0.38, z: -2.24 },
      { x: -0.06, y: 0.38, z: -2.24 },
      { x: 0.06, y: 0.38, z: -2.24 },
      { x: 0.18, y: 0.38, z: -2.24 },
    ];

    exhaustPositions.forEach((pos) => {
      const pipeGeo = new THREE.CylinderGeometry(0.048, 0.052, 0.18, 18, 1, true);
      const pipe = new THREE.Mesh(pipeGeo, this.exhaustMaterial);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(pos.x, pos.y, pos.z);
      this.group.add(pipe);

      // Inner hollow dark core
      const innerCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.16, 16),
        new THREE.MeshBasicMaterial({ color: 0x050508 })
      );
      innerCore.rotation.x = Math.PI / 2;
      innerCore.position.set(pos.x, pos.y, pos.z + 0.02);
      this.group.add(innerCore);
    });
  }

  private buildActiveWing() {
    // Dual Carbon Pylons
    this.wingGroup.position.set(0, 0.72, -1.82);

    [-0.45, 0.45].forEach((x) => {
      const pylon = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.22, 0.28),
        this.carbonMaterial
      );
      pylon.position.set(x, 0.08, 0);
      pylon.rotation.x = -0.25;
      this.wingGroup.add(pylon);
    });

    // Main Airfoil Aerodynamic Wing Blade
    const wingBladeShape = new THREE.Shape();
    wingBladeShape.moveTo(-0.95, -0.15);
    wingBladeShape.lineTo(0.95, -0.15);
    wingBladeShape.lineTo(0.98, 0.15);
    wingBladeShape.lineTo(-0.98, 0.15);
    wingBladeShape.closePath();

    const wingBladeGeo = new THREE.BoxGeometry(1.92, 0.035, 0.34);
    const wingBlade = new THREE.Mesh(wingBladeGeo, this.carbonMaterial);
    wingBlade.position.set(0, 0.2, 0);
    this.wingGroup.add(wingBlade);

    // Carbon Wing Endplates with fine cyan pinstriping
    [-0.96, 0.96].forEach((x) => {
      const endplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.14, 0.36),
        this.carbonMaterial
      );
      endplate.position.set(x, 0.2, 0);
      this.wingGroup.add(endplate);
    });

    this.group.add(this.wingGroup);
  }

  private buildUnderglow() {
    this.underglowLight = new THREE.PointLight(0x00e5ff, 0, 4.5, 2.0);
    this.underglowLight.position.set(0, 0.08, 0);
    this.group.add(this.underglowLight);
  }

  private buildAeroStreamlines() {
    // CFD Aerodynamic Flow lines along the car body (visualized when toggled)
    const streamlinesCount = 14;
    for (let i = 0; i < streamlinesCount; i++) {
      const t = (i / (streamlinesCount - 1)) * 2 - 1; // -1 to 1 across width
      const xOffset = t * 0.75;
      const points: THREE.Vector3[] = [];

      // 6 key control points along aerodynamic curve from splitter to diffuser
      points.push(new THREE.Vector3(xOffset * 0.6, 0.12, 2.4));
      points.push(new THREE.Vector3(xOffset * 0.8, 0.48, 1.4));
      points.push(new THREE.Vector3(xOffset * 0.65, 0.82, 0.3));
      points.push(new THREE.Vector3(xOffset * 0.75, 0.72, -0.8));
      points.push(new THREE.Vector3(xOffset * 0.9, 0.62, -1.8));
      points.push(new THREE.Vector3(xOffset * 1.1, 0.45, -2.6));

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.008, 6, false);
      const streamMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.75,
      });
      const streamTube = new THREE.Mesh(tubeGeo, streamMat);
      this.aeroFlowGroup.add(streamTube);
    }

    this.aeroFlowGroup.visible = false;
    this.group.add(this.aeroFlowGroup);
  }

  // --- Public Configuration Methods ---

  public setBodyColor(key: BodyColorKey) {
    const config = COLOR_CONFIG[key] || COLOR_CONFIG.noir;
    this.bodyMaterial.color.setHex(config.color);
    this.bodyMaterial.metalness = config.metalness;
    this.bodyMaterial.roughness = config.roughness;
    this.bodyMaterial.clearcoat = config.clearcoat;
    this.bodyMaterial.clearcoatRoughness = config.clearcoatRoughness;
    this.bodyMaterial.needsUpdate = true;
  }

  public setWheelFinish(key: WheelFinishKey) {
    const config = WHEEL_CONFIG[key] || WHEEL_CONFIG.titanium;
    this.wheelMaterial.color.setHex(config.color);
    this.wheelMaterial.metalness = config.metalness;
    this.wheelMaterial.roughness = config.roughness;
    this.wheelMaterial.needsUpdate = true;
  }

  public setCaliperColor(key: CaliperColorKey) {
    const hex = CALIPER_CONFIG[key] || CALIPER_CONFIG.cyan;
    this.caliperMaterial.color.setHex(hex);
    this.caliperMaterial.emissive.setHex(hex);
    this.caliperMaterial.needsUpdate = true;
  }

  public setDoors(open: boolean) {
    this.targetDoorAngle = open ? 0.72 : 0;
  }

  public setWingMode(mode: 'retracted' | 'active' | 'airbrake') {
    if (mode === 'retracted') {
      this.targetWingAngle = 0;
      this.targetWingY = 0;
    } else if (mode === 'active') {
      this.targetWingAngle = -0.22;
      this.targetWingY = 0.12;
    } else {
      // airbrake
      this.targetWingAngle = -0.65;
      this.targetWingY = 0.22;
    }
  }

  public setHeadlights(mode: 'off' | 'drl' | 'full') {
    if (mode === 'off') {
      this.headlightMaterial.emissiveIntensity = 0.05;
      this.taillightMaterial.emissiveIntensity = 0.2;
    } else if (mode === 'drl') {
      this.headlightMaterial.emissiveIntensity = 1.8;
      this.taillightMaterial.emissiveIntensity = 2.0;
    } else {
      this.headlightMaterial.emissiveIntensity = 4.8;
      this.taillightMaterial.emissiveIntensity = 4.5;
    }
  }

  public setUnderglow(enabled: boolean) {
    if (this.underglowLight) {
      this.underglowLight.intensity = enabled ? 3.5 : 0;
    }
  }

  public setAeroFlow(visible: boolean) {
    this.aeroFlowGroup.visible = visible;
  }

  public setExploded(enabled: boolean) {
    this.targetExploded = enabled ? 1.0 : 0.0;
  }

  public setNitro(enabled: boolean) {
    this.isNitroActive = enabled;
    this.nitroFlameGroup.visible = enabled;
    if (this.nitroLight) {
      this.nitroLight.intensity = enabled ? 4.5 : 0;
    }
  }

  public update(delta: number, wheelSpinSpeed: number = 0) {
    // Kinematic Dihedral Butterfly Door Animation (Rotate forward and upward)
    const doorDiff = this.targetDoorAngle - this.currentDoorAngle;
    this.currentDoorAngle += doorDiff * Math.min(delta * 5.0, 1.0);

    // Left door rotates on Y and Z
    this.leftDoorGroup.rotation.y = this.currentDoorAngle * 0.45;
    this.leftDoorGroup.rotation.z = this.currentDoorAngle * 0.85;

    // Right door rotates opposite
    this.rightDoorGroup.rotation.y = -this.currentDoorAngle * 0.45;
    this.rightDoorGroup.rotation.z = -this.currentDoorAngle * 0.85;

    // Kinematic Wing deployment
    const wingAngleDiff = this.targetWingAngle - this.currentWingAngle;
    this.currentWingAngle += wingAngleDiff * Math.min(delta * 6.0, 1.0);
    this.wingGroup.rotation.x = this.currentWingAngle;

    const wingYDiff = this.targetWingY - this.currentWingY;
    this.currentWingY += wingYDiff * Math.min(delta * 6.0, 1.0);

    // Exploded View Kinematics (Separates modules smoothly)
    const explodeDiff = this.targetExploded - this.currentExploded;
    this.currentExploded += explodeDiff * Math.min(delta * 4.2, 1.0);

    // Body shell elevates
    this.bodyGroup.position.y = this.currentExploded * 0.62;

    // Canopy greenhouse lifts high above monocoque
    this.canopyGroup.position.y = this.currentExploded * 1.05;

    // Splitter lowers & extends forward
    this.splitterGroup.position.z = this.currentExploded * 0.42;
    this.splitterGroup.position.y = -this.currentExploded * 0.14;

    // Diffuser lowers & extends backward
    this.diffuserGroup.position.z = -this.currentExploded * 0.42;
    this.diffuserGroup.position.y = -this.currentExploded * 0.14;

    // Doors fan outward in exploded view
    this.leftDoorGroup.position.x = -0.86 - this.currentExploded * 0.45;
    this.rightDoorGroup.position.x = 0.86 + this.currentExploded * 0.45;

    // Wheels slide outward laterally
    if (this.wheels.length >= 4) {
      this.wheels[0].position.x = -0.92 - this.currentExploded * 0.35;
      this.wheels[1].position.x = 0.92 + this.currentExploded * 0.35;
      this.wheels[2].position.x = -0.94 - this.currentExploded * 0.35;
      this.wheels[3].position.x = 0.94 + this.currentExploded * 0.35;
    }

    // Active wing floats upward & back in exploded view
    this.wingGroup.position.y = 0.72 + this.currentWingY + this.currentExploded * 0.55;
    this.wingGroup.position.z = -1.82 - this.currentExploded * 0.35;

    // Nitro Plasma Flames Animation
    if (this.isNitroActive) {
      const now = performance.now() * 0.035;
      const flicker = 0.88 + Math.sin(now * 1.8) * 0.14 + (Math.random() - 0.5) * 0.08;
      const lengthPulse = 1.0 + Math.sin(now * 2.5) * 0.3 + Math.random() * 0.15;
      this.nitroFlameGroup.scale.set(flicker, flicker, lengthPulse);
      if (this.nitroLight) {
        this.nitroLight.intensity = 3.8 + Math.random() * 2.8;
      }
    }

    // Wheel spin when turntable rotates or car in motion
    if (wheelSpinSpeed !== 0) {
      this.wheels.forEach((w) => {
        w.rotation.x += wheelSpinSpeed * delta;
      });
    }

    // Gentle pulse in aero flow lines if visible
    if (this.aeroFlowGroup.visible) {
      const pulse = 1.8 + Math.sin(Date.now() * 0.005) * 0.8;
      this.aeroFlowGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
        }
      });
    }
  }

  public dispose() {
    this.bodyMaterial.dispose();
    this.carbonMaterial.dispose();
    this.glassMaterial.dispose();
    this.wheelMaterial.dispose();
    this.caliperMaterial.dispose();
    this.brakeDiscMaterial.dispose();
    this.headlightMaterial.dispose();
    this.taillightMaterial.dispose();
    this.exhaustMaterial.dispose();
  }
}

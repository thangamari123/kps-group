'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  DimensionUnit,
  WeightUnit,
  VolumeUnit,
  ContainerSpec,
  CONTAINERS,
  dimensionToMM,
  mmToDimension,
  weightToKG,
  kgToWeight,
  cbmToVolume,
  fmt,
  calculatePositions,
  calculateLoad,
  BoxPosition,
} from '@/lib/calculator-utils';

const RENDER_CAP = 80000;

export default function ContainerLoadCalculator() {
  // 1. Container selection
  const [ctype, setCtype] = useState<'20GP' | '40GP' | '40HC'>('20GP');
  const [payloadTouched, setPayloadTouched] = useState(false);

  // 2. Units
  const [dimUnit, setDimUnit] = useState<DimensionUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [volUnit, setVolUnit] = useState<VolumeUnit>('CBM');

  // 3. Carton Dimensions
  const [dimL, setDimL] = useState<number>(30);
  const [dimB, setDimB] = useState<number>(25);
  const [dimH, setDimH] = useState<number>(20);

  // 4. Weight & Quantity
  const [cartonWt, setCartonWt] = useState<number>(10);
  const [cartonQty, setCartonQty] = useState<number>(1000);

  // 5. Loading conditions
  const [upright, setUpright] = useState<boolean>(true);
  const [maxLayers, setMaxLayers] = useState<string>(''); // blank = no limit
  const [customPayload, setCustomPayload] = useState<number>(CONTAINERS['20GP'].payload);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Error message
  const [errMsg, setErrMsg] = useState<string>('');

  // Three.js Canvas and Stage Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Three.js internal instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boxMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const contGroupRef = useRef<THREE.Group | null>(null);
  const freeGroupRef = useRef<THREE.Group | null>(null);
  const centerRef = useRef<THREE.Vector3>(new THREE.Vector3(2.949, 1.1965, 1.176));
  const camTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(2.949, 1.1965, 1.176));
  const targetCenterRef = useRef<THREE.Vector3>(new THREE.Vector3(2.949, 1.1965, 1.176));
  const spanRef = useRef<number>(5.898);
  const prevShownRef = useRef<number>(0);
  const animStateRef = useRef<{ t0: number; dur: number; from: number; total: number } | null>(null);
  const targetOrbRef = useRef<{ theta: number; phi: number; r: number } | null>(null);
  const orbRef = useRef<{ theta: number; phi: number; r: number }>({
    theta: -0.75,
    phi: 1.05,
    r: 5.898 * 1.35,
  });
  const boxMatRef = useRef<THREE.MeshLambertMaterial | null>(null);
  const boxGeoRef = useRef<THREE.BoxGeometry | null>(null);
  const lastCalcRef = useRef<any>(null);

  // Clamp radius for camera zoom based on container span
  const clampR = useCallback((r: number) => {
    const span = spanRef.current;
    return Math.min(span * 4, Math.max(span * 0.25, r));
  }, []);

  // Reset Camera View to original default isometric 3D view
  const resetView = useCallback(
    (targetType?: '20GP' | '40GP' | '40HC') => {
      // 1. Cancel any active camera transition immediately
      targetOrbRef.current = null;

      // 2. Resolve container specification
      const activeType = targetType || ctype;
      const C = CONTAINERS[activeType];
      const L = C.L / 1000;
      const W = C.W / 1000;
      const H = C.H / 1000;
      const targetCenter = new THREE.Vector3(L / 2, H / 2, W / 2);
      const targetSpan = Math.max(L, W * 2, H * 2);
      const targetR = targetSpan * 1.35;
      const targetTheta = -0.75;
      const targetPhi = 1.05;

      // 3. Update center and span references
      centerRef.current.copy(targetCenter);
      targetCenterRef.current.copy(targetCenter);
      spanRef.current = targetSpan;

      // 4. Normalize current theta relative to targetTheta so it takes the shortest arc without full spins
      let diff = (orbRef.current.theta - targetTheta) % (2 * Math.PI);
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      orbRef.current.theta = targetTheta + diff;

      // 5. Set target orbital state to trigger smooth transition
      targetOrbRef.current = {
        theta: targetTheta,
        phi: targetPhi,
        r: targetR,
      };
    },
    [ctype]
  );

  // Camera presets
  const setView = useCallback(
    (v: 'iso' | 'side' | 'top' | 'door') => {
      if (v === 'iso') {
        resetView();
        return;
      }
      targetOrbRef.current = null;

      const C = CONTAINERS[ctype];
      const L = C.L / 1000;
      const W = C.W / 1000;
      const H = C.H / 1000;
      const span = Math.max(L, W * 2, H * 2);
      const base = span * 1.35;
      const targetCenter = new THREE.Vector3(L / 2, H / 2, W / 2);
      targetCenterRef.current.copy(targetCenter);

      const presets: Record<string, { theta: number; phi: number; r: number }> = {
        side: { theta: 0, phi: Math.PI / 2 - 0.02, r: base },
        top: { theta: 0, phi: 0.02, r: base * 1.05 },
        door: { theta: Math.PI / 2, phi: 1.3, r: base * 0.55 },
      };
      const target = presets[v];
      if (target) {
        let diff = (orbRef.current.theta - target.theta) % (2 * Math.PI);
        if (diff > Math.PI) diff -= 2 * Math.PI;
        if (diff < -Math.PI) diff += 2 * Math.PI;
        orbRef.current.theta = target.theta + diff;
        targetOrbRef.current = target;
      }
    },
    [ctype, resetView]
  );

  // Handle Dimension Unit Change - converts displayed L, B, H without changing physical mm
  const handleDimUnitChange = (newUnit: DimensionUnit) => {
    if (newUnit === dimUnit) return;
    const curL_mm = dimensionToMM(dimL, dimUnit);
    const curB_mm = dimensionToMM(dimB, dimUnit);
    const curH_mm = dimensionToMM(dimH, dimUnit);
    setDimUnit(newUnit);
    const decimals = newUnit === 'm' || newUnit === 'ft' ? 3 : newUnit === 'in' ? 2 : 1;
    setDimL(Number(mmToDimension(curL_mm, newUnit).toFixed(decimals)));
    setDimB(Number(mmToDimension(curB_mm, newUnit).toFixed(decimals)));
    setDimH(Number(mmToDimension(curH_mm, newUnit).toFixed(decimals)));
  };

  // Handle Weight Unit Change - converts displayed cartonWt and payload without changing physical kg
  const handleWeightUnitChange = (newUnit: WeightUnit) => {
    if (newUnit === weightUnit) return;
    const curWt_kg = weightToKG(cartonWt, weightUnit);
    const curPayload_kg = weightToKG(customPayload, weightUnit);
    setWeightUnit(newUnit);
    const wtDecimals = newUnit === 'MT' ? 4 : 2;
    const plDecimals = newUnit === 'MT' ? 2 : 0;
    setCartonWt(Number(kgToWeight(curWt_kg, newUnit).toFixed(wtDecimals)));
    setCustomPayload(Number(kgToWeight(curPayload_kg, newUnit).toFixed(plDecimals)));
  };

  // Handle Container Type Switch
  const handleContainerSwitch = (newCtype: '20GP' | '40GP' | '40HC') => {
    setCtype(newCtype);
    setPayloadTouched(false);
    // update default payload in selected weight unit
    const defaultKg = CONTAINERS[newCtype].payload;
    const converted = kgToWeight(defaultKg, weightUnit);
    setCustomPayload(Number(converted.toFixed(weightUnit === 'MT' ? 2 : 0)));
    resetView(newCtype);
  };

  // Helper: Create Carton Texture on dynamic Canvas
  const createCartonTexture = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    g.fillStyle = '#cfa268';
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = 'rgba(255,255,255,.07)';
    for (let i = 0; i < 128; i += 6) g.fillRect(0, i, 128, 2);
    g.fillStyle = '#e2c495'; // tape
    g.fillRect(54, 0, 20, 128);
    g.strokeStyle = '#7d5427';
    g.lineWidth = 7;
    g.strokeRect(3.5, 3.5, 121, 121);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  };

  // Helper: Create Text Sprite
  const createLabelSprite = (text: string, color: string, w = 512, h = 96, fontSize = 52) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d')!;
    g.fillStyle = color;
    g.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + 2);
    const texture = new THREE.CanvasTexture(c);
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true })
    );
    s.scale.set(1.6, 0.3, 1);
    return s;
  };

  // Build 3D Container
  const buildContainer = (C: ContainerSpec) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (contGroupRef.current) scene.remove(contGroupRef.current);

    const contGroup = new THREE.Group();
    const L = C.L / 1000;
    const W = C.W / 1000;
    const H = C.H / 1000;

    const geo = new THREE.BoxGeometry(L, H, W);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x0b2e59 })
    );
    edges.position.set(L / 2, H / 2, W / 2);
    contGroup.add(edges);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(L, W),
      new THREE.MeshLambertMaterial({ color: 0x9a7550 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(L / 2, 0.001, W / 2);
    contGroup.add(floor);

    const wallMat = new THREE.MeshBasicMaterial({
      color: 0x1557a8,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat);
    back.rotation.y = Math.PI / 2;
    back.position.set(0, H / 2, W / 2);
    contGroup.add(back);

    const s1 = new THREE.Mesh(new THREE.PlaneGeometry(L, H), wallMat);
    s1.position.set(L / 2, H / 2, 0);
    contGroup.add(s1);

    const roof = new THREE.Mesh(new THREE.PlaneGeometry(L, W), wallMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.set(L / 2, H, W / 2);
    contGroup.add(roof);

    // Corrugation hint on far side wall
    const rib = new THREE.LineBasicMaterial({ color: 0x6d8db5, transparent: true, opacity: 0.35 });
    const pts: THREE.Vector3[] = [];
    for (let x = 0.15; x < L; x += 0.3) {
      pts.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, H, 0));
    }
    contGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), rib));

    // Door and Front Sprites
    const door = createLabelSprite('DOOR', '#c8322f');
    door.position.set(L + 0.45, H * 0.55, W / 2);
    contGroup.add(door);

    const front = createLabelSprite('FRONT', '#0b2e59');
    front.position.set(-0.45, H * 0.55, W / 2);
    contGroup.add(front);

    // Ground shadow plane
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(L + 3, W + 3),
      new THREE.MeshBasicMaterial({ color: 0x0b2e59, transparent: true, opacity: 0.05 })
    );
    g.rotation.x = -Math.PI / 2;
    g.position.set(L / 2, -0.002, W / 2);
    contGroup.add(g);

    scene.add(contGroup);
    contGroupRef.current = contGroup;
    centerRef.current.set(L / 2, H / 2, W / 2);
    spanRef.current = Math.max(L, W * 2, H * 2);
    if (!targetOrbRef.current) {
      targetCenterRef.current.copy(centerRef.current);
      camTargetRef.current.copy(centerRef.current);
    }
  };

  // Build Free Space and Left Out Indicators
  const buildFree = (C: ContainerSpec, usedX: number, leftOut: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (freeGroupRef.current) scene.remove(freeGroupRef.current);

    const freeGroup = new THREE.Group();
    const L = C.L / 1000;
    const W = C.W / 1000;
    const H = C.H / 1000;
    const x0 = usedX / 1000;
    const fl = L - x0;

    if (fl > 0.05) {
      const g = new THREE.BoxGeometry(fl, H, W);
      const m = new THREE.Mesh(
        g,
        new THREE.MeshBasicMaterial({
          color: 0x1f9d4c,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        })
      );
      m.position.set(x0 + fl / 2, H / 2, W / 2);
      freeGroup.add(m);

      const e = new THREE.LineSegments(
        new THREE.EdgesGeometry(g),
        new THREE.LineDashedMaterial({ color: 0x1f9d4c, dashSize: 0.12, gapSize: 0.08 })
      );
      e.position.copy(m.position);
      e.computeLineDistances();
      freeGroup.add(e);

      const lb = createLabelSprite('FREE ' + fl.toFixed(2) + ' m', '#157a39');
      lb.position.set(x0 + fl / 2, H + 0.3, W / 2);
      lb.scale.set(1.3, 0.32, 1);
      freeGroup.add(lb);
    }

    if (leftOut > 0) {
      const lb = createLabelSprite('+' + fmt(leftOut) + ' CTNS LEFT OUT', '#c8322f');
      lb.position.set(L + 0.6, H + 0.35, W / 2);
      lb.scale.set(2.2, 0.42, 1);
      freeGroup.add(lb);
    }

    scene.add(freeGroup);
    freeGroupRef.current = freeGroup;
  };

  // Build Instanced Boxes
  const buildBoxes = (list: BoxPosition[]) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (boxMeshRef.current) {
      scene.remove(boxMeshRef.current);
      boxMeshRef.current.dispose();
    }

    const n = Math.max(list.length, 1);
    const boxGeo = boxGeoRef.current || new THREE.BoxGeometry(1, 1, 1);
    const boxMat = boxMatRef.current || new THREE.MeshLambertMaterial({ map: createCartonTexture() });

    const boxMesh = new THREE.InstancedMesh(boxGeo, boxMat, n);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const cA = new THREE.Color(1, 1, 1);
    const cB = new THREE.Color(0.8, 0.9, 1.05);

    list.forEach((b, i) => {
      const o = b.o;
      const gap = 0.992;
      p.set(b.x / 1000, b.y / 1000, b.z / 1000);
      s.set((o[0] / 1000) * gap, (o[2] / 1000) * gap, (o[1] / 1000) * gap);
      m.compose(p, q, s);
      boxMesh.setMatrixAt(i, m);
      boxMesh.setColorAt(i, b.blockIdx === 0 ? cA : cB);
    });

    boxMesh.count = list.length;
    boxMesh.instanceMatrix.needsUpdate = true;
    if (boxMesh.instanceColor) boxMesh.instanceColor.needsUpdate = true;

    scene.add(boxMesh);
    boxMeshRef.current = boxMesh;
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, stage.clientWidth / stage.clientHeight, 0.05, 200);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const dl = new THREE.DirectionalLight(0xffffff, 0.7);
    dl.position.set(5, 9, 6);
    scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.25);
    dl2.position.set(-6, 4, -5);
    scene.add(dl2);

    boxMatRef.current = new THREE.MeshLambertMaterial({ map: createCartonTexture() });
    boxGeoRef.current = new THREE.BoxGeometry(1, 1, 1);

    const resize = () => {
      if (!stage || !renderer || !camera) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    // Pointer events for orbit & zoom
    const ptrs = new Map<number, { x: number; y: number }>();
    let pinch0 = 0;
    let r0 = 0;

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      targetOrbRef.current = null;
      if (ptrs.size === 2) {
        const a = [...ptrs.values()];
        pinch0 = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        r0 = orbRef.current.r;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!ptrs.has(e.pointerId)) return;
      const prev = ptrs.get(e.pointerId)!;
      if (ptrs.size === 1) {
        orbRef.current.theta -= (e.clientX - prev.x) * 0.008;
        orbRef.current.phi = Math.min(
          Math.PI / 2 - 0.01,
          Math.max(0.02, orbRef.current.phi - (e.clientY - prev.y) * 0.008)
        );
      }
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2) {
        const a = [...ptrs.values()];
        const d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        if (pinch0 > 0) orbRef.current.r = clampR((r0 * pinch0) / d);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch0 = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetOrbRef.current = null;
      orbRef.current.r = clampR(orbRef.current.r * (1 + Math.sign(e.deltaY) * 0.08));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    let reqId: number;
    const loop = (t: number) => {
      if (targetOrbRef.current) {
        const k = 0.12;
        let dT = targetOrbRef.current.theta - orbRef.current.theta;
        while (dT > Math.PI) dT -= 2 * Math.PI;
        while (dT < -Math.PI) dT += 2 * Math.PI;
        const dPhi = targetOrbRef.current.phi - orbRef.current.phi;
        const dR = targetOrbRef.current.r - orbRef.current.r;

        orbRef.current.theta += dT * k;
        orbRef.current.phi += dPhi * k;
        orbRef.current.r += dR * k;

        camTargetRef.current.x += (targetCenterRef.current.x - camTargetRef.current.x) * k;
        camTargetRef.current.y += (targetCenterRef.current.y - camTargetRef.current.y) * k;
        camTargetRef.current.z += (targetCenterRef.current.z - camTargetRef.current.z) * k;

        if (
          Math.abs(dT) < 0.001 &&
          Math.abs(dPhi) < 0.001 &&
          Math.abs(dR) < 0.005 &&
          camTargetRef.current.distanceTo(targetCenterRef.current) < 0.005
        ) {
          orbRef.current.theta = targetOrbRef.current.theta;
          orbRef.current.phi = targetOrbRef.current.phi;
          orbRef.current.r = targetOrbRef.current.r;
          camTargetRef.current.copy(targetCenterRef.current);
          targetOrbRef.current = null;
        }
      }

      if (animStateRef.current && boxMeshRef.current) {
        const f = Math.min(1, (t - animStateRef.current.t0) / animStateRef.current.dur);
        const ease = 1 - Math.pow(1 - f, 3);
        boxMeshRef.current.count = Math.round(
          animStateRef.current.from + (animStateRef.current.total - animStateRef.current.from) * ease
        );
        if (f >= 1) animStateRef.current = null;
      }

      // Apply camera
      const target = camTargetRef.current;
      const orb = orbRef.current;
      const y = orb.r * Math.cos(orb.phi);
      camera.position.set(
        target.x + orb.r * Math.sin(orb.phi) * Math.sin(orb.theta),
        target.y + y,
        target.z + orb.r * Math.sin(orb.phi) * Math.cos(orb.theta)
      );
      camera.lookAt(target);

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
      boxMatRef.current?.dispose();
      boxGeoRef.current?.dispose();
    };
  }, []);

  // Recalculate and update 3D visualization
  const updateCalculation = useCallback(() => {
    const C = CONTAINERS[ctype];
    const L_mm = dimensionToMM(dimL, dimUnit);
    const B_mm = dimensionToMM(dimB, dimUnit);
    const H_mm = dimensionToMM(dimH, dimUnit);
    const boxMM: [number, number, number] = [L_mm, B_mm, H_mm];

    const wtKG = weightToKG(cartonWt, weightUnit);
    const payloadKG = weightToKG(customPayload, weightUnit) || C.payload;
    const N = Math.max(0, Math.floor(cartonQty));
    const lim = Math.floor(parseFloat(maxLayers)) || 0;

    if (boxMM.some((v) => v <= 0) || N <= 0) {
      setErrMsg('Enter carton L, B, H and no. of cartons.');
      return;
    }
    setErrMsg('');

    const r = calculateLoad(C, boxMM, wtKG, N, upright, lim, payloadKG);
    if (r.p.count === 0) {
      setErrMsg('This carton is larger than the container inside size in every allowed orientation.');
    }

    const loaded = Math.min(N, r.eff);
    const list = calculatePositions(C, r.p, Math.min(loaded, RENDER_CAP));

    buildContainer(C);
    buildBoxes(list);

    // Animation transition
    const from = Math.min(prevShownRef.current, list.length);
    if (from !== list.length && boxMeshRef.current) {
      boxMeshRef.current.count = from;
      animStateRef.current = {
        t0: performance.now(),
        dur: Math.min(1400, 500 + Math.abs(list.length - from) * 0.6),
        from,
        total: list.length,
      };
    } else {
      animStateRef.current = null;
    }
    prevShownRef.current = list.length;

    const boxCbm = (boxMM[0] * boxMM[1] * boxMM[2]) / 1e9;
    const contCbm = (C.L * C.W * C.H) / 1e9;
    const volPct = (loaded * boxCbm) / contCbm * 100;
    const wtUsed = loaded * wtKG;
    const wtPct = (wtUsed / payloadKG) * 100;
    const lastX = list.length
      ? Math.max(...list.slice(-Math.min(list.length, 5000)).map((b) => b.x + b.o[0] / 2))
      : 0;
    const fits = N <= r.eff && r.p.count > 0;

    buildFree(C, lastX, Math.max(0, N - r.eff));

    lastCalcRef.current = {
      C,
      N,
      boxMM,
      wtKG,
      fits,
      r,
      loaded,
      volPct,
      wtPct,
      boxCbm,
      contCbm,
      lastX,
      payloadKG,
      wtUsed,
    };
  }, [ctype, dimL, dimB, dimH, dimUnit, cartonWt, weightUnit, cartonQty, upright, maxLayers, customPayload]);

  useEffect(() => {
    updateCalculation();
  }, [updateCalculation]);

  // Loading animation trigger
  const triggerLoadingAnimation = () => {
    if (!boxMeshRef.current || !lastCalcRef.current) return;
    const n = Math.min(lastCalcRef.current.loaded, RENDER_CAP);
    animStateRef.current = {
      t0: performance.now(),
      dur: Math.min(6000, 1500 + n * 1.2),
      from: 0,
      total: n,
    };
    boxMeshRef.current.count = 0;
  };

  // Copy result for WhatsApp / Mail
  const handleCopyResult = async () => {
    if (!lastCalcRef.current) return;
    const d = lastCalcRef.current;
    const C = d.C;

    // Format dimensions in current selected unit
    const l_str = fmt(mmToDimension(d.boxMM[0], dimUnit), dimUnit === 'm' || dimUnit === 'ft' ? 3 : dimUnit === 'in' ? 2 : 1);
    const b_str = fmt(mmToDimension(d.boxMM[1], dimUnit), dimUnit === 'm' || dimUnit === 'ft' ? 3 : dimUnit === 'in' ? 2 : 1);
    const h_str = fmt(mmToDimension(d.boxMM[2], dimUnit), dimUnit === 'm' || dimUnit === 'ft' ? 3 : dimUnit === 'in' ? 2 : 1);

    const wt_val = kgToWeight(d.wtKG, weightUnit);
    const wt_str = fmt(wt_val, weightUnit === 'MT' ? 4 : 2);

    const totalCBM = d.N * d.boxCbm;
    const totalCFT = totalCBM * 35.3146667;
    const totalWt = d.N * d.wtKG;
    const totalWtDisp = fmt(kgToWeight(totalWt, weightUnit), weightUnit === 'MT' ? 2 : 0);

    const txt = `*KPS Container Load Check*
Container: ${C.name} (Inside: ${fmt(C.L / 1000, 2)} m × ${fmt(C.W / 1000, 2)} m × ${fmt(C.H / 1000, 2)} m · ${fmt(d.contCbm, 1)} CBM / ${fmt(d.contCbm * 35.3147, 1)} CFT)
Carton: ${l_str} × ${b_str} × ${h_str} ${dimUnit} · ${wt_str} ${weightUnit} · ${fmt(d.boxCbm, 3)} CBM (${fmt(d.boxCbm * 35.3147, 2)} CFT)
Quantity: ${fmt(d.N)} cartons requested
Result: ${d.fits ? 'FITS' : 'DOES NOT FIT'} · Max that fit: ${fmt(d.r.eff)} (limited by ${d.r.limBy.toLowerCase()})
Volume used: ${fmt(d.volPct, 1)}% (${fmt(d.loaded * d.boxCbm, 2)} CBM / ${fmt(d.loaded * d.boxCbm * 35.3147, 1)} CFT)
Weight used: ${fmt(d.wtPct, 1)}% (${fmt(kgToWeight(d.wtUsed, weightUnit), weightUnit === 'MT' ? 2 : 0)} ${weightUnit} of ${fmt(kgToWeight(d.payloadKG, weightUnit), weightUnit === 'MT' ? 2 : 0)} ${weightUnit} max payload)

Indicative only. KPS Worldwide Logistics Pvt Ltd · www.kpsgroups.net · 044-45088099 / 25264647`;

    try {
      await navigator.clipboard.writeText(txt);
      setToastMsg('Result copied for WhatsApp / email');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setToastMsg('Result copied for WhatsApp / email');
      } catch {
        setToastMsg('Copy failed, please copy manually');
      }
      ta.remove();
    }
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Calculation display values
  const C = CONTAINERS[ctype];
  const L_mm = dimensionToMM(dimL, dimUnit);
  const B_mm = dimensionToMM(dimB, dimUnit);
  const H_mm = dimensionToMM(dimH, dimUnit);
  const boxMM: [number, number, number] = [L_mm, B_mm, H_mm];
  const wtKG = weightToKG(cartonWt, weightUnit);
  const payloadKG = weightToKG(customPayload, weightUnit) || C.payload;
  const N = Math.max(0, Math.floor(cartonQty));
  const lim = Math.floor(parseFloat(maxLayers)) || 0;

  const currentCalc = calculateLoad(C, boxMM, wtKG, N, upright, lim, payloadKG);
  const loaded = Math.min(N, currentCalc.eff);
  const boxCbm = (boxMM[0] * boxMM[1] * boxMM[2]) / 1e9;
  const contCbm = (C.L * C.W * C.H) / 1e9;
  const volPct = (loaded * boxCbm) / contCbm * 100;
  const wtUsed = loaded * wtKG;
  const wtPct = (wtUsed / payloadKG) * 100;
  const fits = N <= currentCalc.eff && currentCalc.p.count > 0;
  const lastX = lastCalcRef.current?.lastX || 0;

  // Comparison row calculations
  const compRows = (['20GP', '40GP', '40HC'] as const).map((k) => {
    const c = CONTAINERS[k];
    const pl = k === ctype ? payloadKG : c.payload;
    const rr = calculateLoad(c, boxMM, wtKG, N, upright, lim, pl);
    return {
      k,
      name: c.name,
      eff: rr.eff,
      need: rr.need,
      limBy: rr.p.count ? rr.limBy : 'Too large',
      isSel: k === ctype,
    };
  });

  return (
    <div className="text-[#1b2430]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 z-50 bg-[#0b2e59] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-2xl transition-all">
          {toastMsg}
        </div>
      )}

      {/* Main Grid: Inputs (340px) + Stage & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-3.5 lg:gap-4 items-start">
        {/* LEFT COLUMN: INPUT CONTROLS */}
        <section className="bg-white border border-[#d9e1ec] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 lg:sticky lg:top-24 z-10">
          {/* 1. Container Selection */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1557a8] mb-2.5">
              1. Container
            </h2>
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {(['20GP', '40GP', '40HC'] as const).map((k) => {
                const item = CONTAINERS[k];
                const active = ctype === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleContainerSwitch(k)}
                    className={`py-2 px-1 text-center rounded-xl border font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0b2e59] text-white border-[#0b2e59] shadow-xs'
                        : 'bg-white text-[#0b2e59] border-[#d9e1ec] hover:border-[#1557a8]'
                    }`}
                  >
                    <span>{item.shortName}</span>
                    <small className={`block text-[10px] font-normal mt-0.5 ${active ? 'text-[#cfe0f7]' : 'text-[#5e6b7a]'}`}>
                      {k === '40HC' ? 'High Cube' : 'FCL'}
                    </small>
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] sm:text-xs text-[#5e6b7a] leading-relaxed">
              Inside: <b>{fmt(C.L / 1000, 2)} m × {fmt(C.W / 1000, 2)} m × {fmt(C.H / 1000, 2)} m</b> · {fmt(contCbm, 1)} CBM ({fmt(contCbm * 35.3147, 0)} CFT) · Payload ≈ {fmt(kgToWeight(C.payload, weightUnit), weightUnit === 'MT' ? 2 : 0)} {weightUnit}
            </div>
          </div>

          {/* 2. Carton Size & Dimensions */}
          <div className="pt-2 border-t border-[#d9e1ec]/70">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1557a8]">
                2. Carton Size (per carton)
              </h2>
            </div>

            {/* Dimension Unit Selector */}
            <div className="mb-2.5">
              <label htmlFor="dimUnit" className="block text-xs font-semibold text-[#5e6b7a] mb-1">
                Dimension Unit
              </label>
              <select
                id="dimUnit"
                value={dimUnit}
                onChange={(e) => handleDimUnitChange(e.target.value as DimensionUnit)}
                className="w-full py-2 px-2.5 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-semibold text-[#1b2430] bg-[#f8fafc] focus:outline-none focus:border-[#1557a8]"
              >
                <option value="cm">Centimetres (cm)</option>
                <option value="mm">Millimetres (mm)</option>
                <option value="m">Metres (m)</option>
                <option value="in">Inches (in)</option>
                <option value="ft">Feet (ft)</option>
              </select>
            </div>

            {/* L, B, H Inputs */}
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <div>
                <label htmlFor="dimL" className="block text-[11px] font-semibold text-[#5e6b7a] mb-1">
                  Length ({dimUnit})
                </label>
                <input
                  id="dimL"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={dimL || ''}
                  onChange={(e) => setDimL(parseFloat(e.target.value) || 0)}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-bold text-[#1b2430] focus:outline-none focus:border-[#1557a8]"
                />
              </div>
              <div>
                <label htmlFor="dimB" className="block text-[11px] font-semibold text-[#5e6b7a] mb-1">
                  Breadth ({dimUnit})
                </label>
                <input
                  id="dimB"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={dimB || ''}
                  onChange={(e) => setDimB(parseFloat(e.target.value) || 0)}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-bold text-[#1b2430] focus:outline-none focus:border-[#1557a8]"
                />
              </div>
              <div>
                <label htmlFor="dimH" className="block text-[11px] font-semibold text-[#5e6b7a] mb-1">
                  Height ({dimUnit})
                </label>
                <input
                  id="dimH"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={dimH || ''}
                  onChange={(e) => setDimH(parseFloat(e.target.value) || 0)}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-bold text-[#1b2430] focus:outline-none focus:border-[#1557a8]"
                />
              </div>
            </div>

            {/* Weight Unit & Weight Input */}
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="cartonWt" className="text-[11px] font-semibold text-[#5e6b7a]">
                    Weight ({weightUnit})
                  </label>
                </div>
                <input
                  id="cartonWt"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={cartonWt || ''}
                  onChange={(e) => setCartonWt(parseFloat(e.target.value) || 0)}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-bold text-[#1b2430] focus:outline-none focus:border-[#1557a8]"
                />
              </div>

              <div>
                <label htmlFor="weightUnit" className="block text-[11px] font-semibold text-[#5e6b7a] mb-1">
                  Weight Unit
                </label>
                <select
                  id="weightUnit"
                  value={weightUnit}
                  onChange={(e) => handleWeightUnitChange(e.target.value as WeightUnit)}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-semibold text-[#1b2430] bg-[#f8fafc] focus:outline-none focus:border-[#1557a8]"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="MT">Metric Tonnes (MT)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>

            {/* Carton Quantity & Slider */}
            <div className="mb-2.5">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="cartonQty" className="text-[11px] font-semibold text-[#5e6b7a]">
                  No. of Cartons
                </label>
                <span className="text-[11px] font-bold text-[#0b2e59]">{fmt(cartonQty)} ctns</span>
              </div>
              <input
                id="cartonQty"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={cartonQty || ''}
                onChange={(e) => setCartonQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-bold text-[#1b2430] focus:outline-none focus:border-[#1557a8] mb-2"
              />

              <label htmlFor="qtySlider" className="block text-[10.5px] text-[#5e6b7a] mb-1">
                Slide to adjust quantity — watch container fill
              </label>
              <input
                id="qtySlider"
                type="range"
                min="1"
                max={Math.max(10, Math.ceil(Math.max(currentCalc.eff * 1.25, cartonQty)))}
                step="1"
                value={cartonQty}
                onChange={(e) => setCartonQty(parseInt(e.target.value) || 1)}
                className="w-full h-2 bg-[#d9e1ec] rounded-lg appearance-none cursor-pointer accent-[#1f9d4c]"
              />
            </div>

            {errMsg && <div className="text-xs font-bold text-[#c8322f] pt-1">{errMsg}</div>}
          </div>

          {/* 3. Loading Conditions */}
          <div className="pt-2 border-t border-[#d9e1ec]/70 space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1557a8]">
              3. Loading Conditions
            </h2>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#1b2430] cursor-pointer">
              <input
                type="checkbox"
                checked={upright}
                onChange={(e) => setUpright(e.target.checked)}
                className="w-4 h-4 rounded text-[#1f9d4c] focus:ring-0 cursor-pointer"
              />
              <span>This side up (cartons cannot be tipped on their side)</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="maxLayers" className="block text-[11px] font-semibold text-[#5e6b7a] mb-1">
                  Max Stacking Layers
                </label>
                <input
                  id="maxLayers"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  placeholder="No limit"
                  value={maxLayers}
                  onChange={(e) => setMaxLayers(e.target.value)}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm text-[#1b2430] focus:outline-none focus:border-[#1557a8]"
                />
              </div>
              <div>
                <label htmlFor="customPayload" className="block text-[11px] font-semibold text-[#5e6b7a] mb-1">
                  Max Payload ({weightUnit})
                </label>
                <input
                  id="customPayload"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="any"
                  value={customPayload || ''}
                  onChange={(e) => {
                    setPayloadTouched(true);
                    setCustomPayload(parseFloat(e.target.value) || 0);
                  }}
                  className="w-full py-2 px-2 border border-[#d9e1ec] rounded-xl text-xs sm:text-sm font-bold text-[#1b2430] focus:outline-none focus:border-[#1557a8]"
                />
              </div>
            </div>

            <div className="text-[10.5px] text-[#5e6b7a] leading-relaxed">
              Leave layer limit blank to stack to roof. Payload pre-fills standard container rating; adjust for highway or axle limits.
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: 3D STAGE & RESULTS */}
        <div className="space-y-4 min-w-0">
          {/* 3D Interactive Stage Canvas */}
          <div
            ref={stageRef}
            className="relative w-full h-[52vh] min-h-[340px] max-h-[580px] rounded-2xl overflow-hidden border border-[#d9e1ec] shadow-xs bg-[radial-gradient(ellipse_at_50%_30%,#ffffff_0%,#dfe8f4_100%)] select-none"
          >
            <canvas ref={canvasRef} className="block w-full h-full touch-none cursor-grab active:cursor-grabbing" />

            {/* Stage Camera View Buttons */}
            <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 z-10">
              <button
                type="button"
                onClick={() => resetView()}
                className="bg-white/95 hover:bg-white text-[#0b2e59] text-[11.5px] sm:text-xs font-bold py-1.5 px-2.5 rounded-lg border border-[#d9e1ec] shadow-xs cursor-pointer transition-all"
              >
                3D
              </button>
              <button
                type="button"
                onClick={() => setView('side')}
                className="bg-white/95 hover:bg-white text-[#0b2e59] text-[11.5px] sm:text-xs font-bold py-1.5 px-2.5 rounded-lg border border-[#d9e1ec] shadow-xs cursor-pointer transition-all"
              >
                Side
              </button>
              <button
                type="button"
                onClick={() => setView('top')}
                className="bg-white/95 hover:bg-white text-[#0b2e59] text-[11.5px] sm:text-xs font-bold py-1.5 px-2.5 rounded-lg border border-[#d9e1ec] shadow-xs cursor-pointer transition-all"
              >
                Top
              </button>
              <button
                type="button"
                onClick={() => setView('door')}
                className="bg-white/95 hover:bg-white text-[#0b2e59] text-[11.5px] sm:text-xs font-bold py-1.5 px-2.5 rounded-lg border border-[#d9e1ec] shadow-xs cursor-pointer transition-all"
              >
                Door End
              </button>
              <button
                type="button"
                onClick={triggerLoadingAnimation}
                className="bg-[#1f9d4c] hover:bg-[#157a39] text-white text-[11.5px] sm:text-xs font-extrabold py-1.5 px-2.5 rounded-lg border border-[#1f9d4c] shadow-xs cursor-pointer transition-all"
              >
                ▶ Animate Loading
              </button>
            </div>

            {/* Verdict Badge */}
            <div
              className={`absolute right-2.5 top-2.5 py-1.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm text-white shadow-md z-10 ${
                fits ? 'bg-[#1f9d4c]' : 'bg-[#c8322f]'
              }`}
            >
              {fits ? '✓ FITS' : '✗ DOES NOT FIT'}
            </div>

            {/* Overlay Fill Progress Indicator */}
            <div className="absolute left-2.5 bottom-2.5 bg-white/95 backdrop-blur-xs rounded-xl p-2.5 min-w-[190px] shadow-md border border-slate-100 z-10">
              <div className="text-xl sm:text-2xl font-black text-[#0b2e59] leading-none">
                {fmt(volPct, 1)}%
                <small className="text-xs font-bold text-[#5e6b7a] ml-1">filled</small>
              </div>
              <div className="h-2 bg-[#cfdbea] rounded-full my-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    volPct > 100 ? 'bg-[#c8322f]' : volPct > 90 ? 'bg-[#d98a00]' : 'bg-[#1f9d4c]'
                  }`}
                  style={{ width: `${Math.min(100, volPct)}%` }}
                />
              </div>
              <div className="text-xs font-bold text-[#1b2430]">
                {fmt(loaded)} ctns inside · {fmt(lastX / 1000, 2)} m of {fmt(C.L / 1000, 2)} m used
              </div>
              <div className={`text-[11px] font-bold mt-0.5 ${fits ? 'text-[#157a39]' : 'text-[#c8322f]'}`}>
                {fits
                  ? `Room for ~${fmt(currentCalc.eff - N)} more ctns`
                  : `${fmt(N - currentCalc.eff)} ctns won't fit (${currentCalc.limBy.toLowerCase()})`}
              </div>
            </div>

            {/* Help / Guidance pill */}
            <div className="hidden sm:block absolute right-2.5 bottom-2.5 text-[10.5px] text-[#5e6b7a] bg-white/85 backdrop-blur-xs py-1 px-2 rounded-lg border border-slate-200 pointer-events-none z-10">
              Drag to rotate · Pinch / scroll to zoom
            </div>
          </div>

          {/* Results Card */}
          <section className="bg-white border border-[#d9e1ec] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            {/* Fit / No-fit Banner */}
            <div
              className={`rounded-xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed border ${
                fits
                  ? 'bg-[#e6f6ec] border-[#b6e3c6] text-[#14532d]'
                  : 'bg-[#fdecec] border-[#f3c1c0] text-[#7a1d1b]'
              }`}
            >
              {fits ? (
                <>
                  <b className="text-sm sm:text-base">Yes. All {fmt(N)} cartons fit in one {C.name}.</b>
                  <div className="mt-1">
                    Space left for about <b>{fmt(currentCalc.eff - N)}</b> more cartons. Cargo uses about{' '}
                    <b>{fmt(lastX / 1000, 2)} m</b> of the {fmt(C.L / 1000, 2)} m container length.
                  </div>
                </>
              ) : (
                <>
                  <b className="text-sm sm:text-base">
                    No. Only {fmt(currentCalc.eff)} of {fmt(N)} cartons fit in one {C.name}.
                  </b>
                  <div className="mt-1">
                    <b>{fmt(N - currentCalc.eff)}</b> cartons will be left out (limited by{' '}
                    <b>{currentCalc.limBy.toLowerCase()}</b>). You will need{' '}
                    <b>{isFinite(currentCalc.need) ? `${currentCalc.need} × ${C.name}` : 'a larger container'}</b>.
                  </div>
                </>
              )}
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Loaded */}
              <div className="bg-[#e8f0fb] rounded-xl p-3">
                <div className="text-[10px] font-bold text-[#5e6b7a] uppercase tracking-wider">Cartons Loaded</div>
                <div className="text-xl sm:text-2xl font-black text-[#0b2e59] mt-0.5">{fmt(loaded)}</div>
                <div className="text-[11px] text-[#5e6b7a]">of {fmt(N)} requested</div>
              </div>

              {/* Max Fit */}
              <div className="bg-[#e8f0fb] rounded-xl p-3">
                <div className="text-[10px] font-bold text-[#5e6b7a] uppercase tracking-wider">Max That Fit</div>
                <div className="text-xl sm:text-2xl font-black text-[#0b2e59] mt-0.5">{fmt(currentCalc.eff)}</div>
                <div className="text-[10.5px] text-[#5e6b7a] truncate" title={`Space: ${fmt(currentCalc.p.count)} · Wt: ${isFinite(currentCalc.wCap) ? fmt(currentCalc.wCap) : '—'}`}>
                  Space {fmt(currentCalc.p.count)} · Wt {isFinite(currentCalc.wCap) ? fmt(currentCalc.wCap) : '—'}
                </div>
              </div>

              {/* Volume Used */}
              <div className="bg-[#e8f0fb] rounded-xl p-3">
                <div className="text-[10px] font-bold text-[#5e6b7a] uppercase tracking-wider">Volume Used</div>
                <div className="text-xl sm:text-2xl font-black text-[#0b2e59] mt-0.5">{fmt(volPct, 1)}%</div>
                <div className="text-[10.5px] text-[#5e6b7a] truncate">
                  {fmt(cbmToVolume(loaded * boxCbm, volUnit), volUnit === 'L' ? 0 : 2)} {volUnit}
                </div>
                <div className="h-1.5 bg-[#cfdbea] rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${volPct > 100 ? 'bg-[#c8322f]' : volPct > 90 ? 'bg-[#d98a00]' : 'bg-[#1f9d4c]'}`}
                    style={{ width: `${Math.min(100, volPct)}%` }}
                  />
                </div>
              </div>

              {/* Weight Used */}
              <div className="bg-[#e8f0fb] rounded-xl p-3">
                <div className="text-[10px] font-bold text-[#5e6b7a] uppercase tracking-wider">Weight Used</div>
                <div className="text-xl sm:text-2xl font-black text-[#0b2e59] mt-0.5">{fmt(wtPct, 1)}%</div>
                <div className="text-[10.5px] text-[#5e6b7a] truncate">
                  {fmt(kgToWeight(wtUsed, weightUnit), weightUnit === 'MT' ? 2 : 0)} of {fmt(kgToWeight(payloadKG, weightUnit), weightUnit === 'MT' ? 2 : 0)} {weightUnit}
                </div>
                <div className="h-1.5 bg-[#cfdbea] rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${wtPct > 100 ? 'bg-[#c8322f]' : wtPct > 90 ? 'bg-[#d98a00]' : 'bg-[#1f9d4c]'}`}
                    style={{ width: `${Math.min(100, wtPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Volume Output Selector & Packing Details */}
            <div className="pt-2 border-t border-[#d9e1ec] space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1557a8]">
                  Packing Orientation & Volume Breakdown
                </h3>
                <div className="flex items-center gap-2">
                  <label htmlFor="volUnit" className="text-xs font-bold text-[#5e6b7a]">
                    Volume Unit:
                  </label>
                  <select
                    id="volUnit"
                    value={volUnit}
                    onChange={(e) => setVolUnit(e.target.value as VolumeUnit)}
                    className="py-1 px-2 text-xs font-bold text-[#0b2e59] bg-[#f8fafc] border border-[#d9e1ec] rounded-lg focus:outline-none"
                  >
                    <option value="CBM">CBM (m³)</option>
                    <option value="CFT">CFT (ft³)</option>
                    <option value="L">Litres (L)</option>
                  </select>
                </div>
              </div>

              {/* Block breakdown */}
              <div className="bg-[#fbfcfd] border border-[#d9e1ec] rounded-xl p-3.5 text-xs sm:text-sm text-[#1b2430] space-y-1.5">
                {currentCalc.p.blocks.map((b, i) => {
                  const lDisp = fmt(mmToDimension(b.r.o[0], dimUnit), dimUnit === 'm' || dimUnit === 'ft' ? 3 : dimUnit === 'in' ? 2 : 1);
                  const bDisp = fmt(mmToDimension(b.r.o[1], dimUnit), dimUnit === 'm' || dimUnit === 'ft' ? 3 : dimUnit === 'in' ? 2 : 1);
                  const hDisp = fmt(mmToDimension(b.r.o[2], dimUnit), dimUnit === 'm' || dimUnit === 'ft' ? 3 : dimUnit === 'in' ? 2 : 1);
                  return (
                    <div key={i}>
                      <b>{i === 0 ? 'Main' : 'Balance'} block:</b> carton placed {lDisp} × {bDisp} × {hDisp} {dimUnit} (along length × across width × height) →{' '}
                      <b>{b.k}</b> rows × <b>{b.r.ny}</b> across × <b>{b.r.nz}</b> high = <b>{fmt(b.k * b.r.per)}</b> cartons
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-[#d9e1ec]/60 text-[11.5px] sm:text-xs text-[#5e6b7a] space-y-1">
                  <div>
                    <b>Volume per carton:</b> {fmt(boxCbm, 4)} CBM ({fmt(boxCbm * 35.3147, 2)} CFT / {fmt(boxCbm * 1000, 1)} L)
                  </div>
                  <div>
                    <b>Total volume of {fmt(N)} cartons:</b> {fmt(cbmToVolume(N * boxCbm, volUnit), volUnit === 'L' ? 0 : 2)} {volUnit}{' '}
                    <span className="text-[#5e6b7a]">({fmt(N * boxCbm, 2)} CBM · {fmt(N * boxCbm * 35.3147, 1)} CFT)</span> ·{' '}
                    <b>Total weight:</b> {fmt(kgToWeight(N * wtKG, weightUnit), weightUnit === 'MT' ? 2 : 0)} {weightUnit}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Across All Containers */}
            <div className="pt-2 border-t border-[#d9e1ec]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1557a8] mb-2">
                Comparison Across Containers
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#d9e1ec]">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#d9e1ec] text-[10.5px] sm:text-xs uppercase text-[#5e6b7a] tracking-wider">
                      <th className="py-2.5 px-3 font-extrabold">Container</th>
                      <th className="py-2.5 px-3 font-bold">Max Cartons</th>
                      <th className="py-2.5 px-3 font-bold">Containers Needed</th>
                      <th className="py-2.5 px-3 font-bold">Limited By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d9e1ec]">
                    {compRows.map((row) => (
                      <tr key={row.k} className={row.isSel ? 'bg-[#f0f6ff] font-bold text-[#0b2e59]' : 'text-[#1b2430]'}>
                        <td className="py-2 px-3">{row.name}</td>
                        <td className="py-2 px-3">{fmt(row.eff)}</td>
                        <td className="py-2 px-3">{isFinite(row.need) ? row.need : '—'}</td>
                        <td className="py-2 px-3">{row.limBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons: Copy & Reset */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyResult}
                className="bg-[#1f9d4c] hover:bg-[#157a39] text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Copy Result for WhatsApp / Email
              </button>
              <button
                type="button"
                onClick={() => resetView()}
                className="bg-white hover:bg-slate-50 text-[#0b2e59] border-1.5 border-[#0b2e59] font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-all cursor-pointer"
              >
                Reset 3D View
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

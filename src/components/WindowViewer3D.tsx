import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Box, DoorOpen, Eye, Home, Layers, RotateCcw } from 'lucide-react';
import { GLASS_OPTIONS, PROFILE_COLORS, PROFILE_SERIES } from '../constants/catalog';
import type { TranslationDict } from '../i18n/translations';
import type { ColorId, GlassType, HandleType, SashOpeningType, WindowConfig } from '../types/window';
import { WindowSchematicSVG } from './WindowSchematicSVG';

interface WindowViewer3DProps {
  config: WindowConfig;
  t: TranslationDict;
}

type TiltTurnSubMode = 'turn' | 'tilt';

// Detect software WebGL once cleanly without leaking context
function detectWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  if (typeof document === 'undefined') {
    return { supported: false, isSoftwareGl: true };
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) {
      return { supported: false, isSoftwareGl: true };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

// React ErrorBoundary for WebGL Canvas safety
class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Procedural woodgrain texture generator (zero external URLs)
function createWoodgrainTexture(baseHex: string, grainHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = grainHex;
    ctx.globalAlpha = 0.28;
    for (let i = 0; i < 42; i++) {
      const y = (i / 42) * 256;
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 32) {
        const wave = Math.sin((x / 256) * Math.PI * 2 + i * 0.7) * 3.5;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Procedural mosquito net mesh texture
function createMosquitoNetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.75)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 64; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(64, i);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 24);
  return tex;
}

// Studio Environment using Three.js RoomEnvironment
const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    return () => {
      scene.environment = null;
      envTarget.dispose();
    };
  }, [gl, scene]);

  return null;
};

// Reusable hook to build laminated PBR material (with optional woodgrain)
function useLaminatedMaterial(colorId: ColorId) {
  const spec = PROFILE_COLORS[colorId] ?? PROFILE_COLORS.white;
  const texture = useMemo(() => {
    if (!spec.isWoodgrain || !spec.grainHex) return null;
    return createWoodgrainTexture(spec.hex, spec.grainHex);
  }, [spec.hex, spec.grainHex, spec.isWoodgrain]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: texture ? '#FFFFFF' : spec.hex,
      map: texture ?? null,
      roughness: spec.roughness,
      metalness: spec.metalness,
    });
  }, [spec.hex, spec.roughness, spec.metalness, texture]);
}

// Dual-sided laminated bar: outer half (-Z) & inner half (+Z)
const DualBar: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  outerMat: THREE.Material;
  innerMat: THREE.Material;
  castShadow?: boolean;
}> = ({ position, size, outerMat, innerMat, castShadow = true }) => {
  const [w, h, d] = size;
  const halfD = d / 2;
  return (
    <group position={position}>
      {/* Outer laminated half (-Z) */}
      <mesh
        position={[0, 0, -halfD / 2]}
        material={outerMat}
        castShadow={castShadow}
        receiveShadow
      >
        <boxGeometry args={[w, h, halfD]} />
      </mesh>
      {/* Inner laminated half (+Z) */}
      <mesh
        position={[0, 0, halfD / 2]}
        material={innerMat}
        castShadow={castShadow}
        receiveShadow
      >
        <boxGeometry args={[w, h, halfD]} />
      </mesh>
    </group>
  );
};

interface Sash3DProps {
  index: number;
  sashType: SashOpeningType;
  isDoorLeaf: boolean;
  centerX: number;
  centerY: number;
  sashW: number;
  sashH: number;
  depth: number;
  outerMat: THREE.Material;
  innerMat: THREE.Material;
  glassMat: THREE.Material;
  gasketMat: THREE.Material;
  handleType: HandleType;
  hasMosquitoNet: boolean;
  netTex: THREE.CanvasTexture;
  isOpen: boolean;
  tiltSubMode: TiltTurnSubMode;
  onToggle: () => void;
}

const Sash3D: React.FC<Sash3DProps> = ({
  sashType,
  isDoorLeaf,
  centerX,
  centerY,
  sashW,
  sashH,
  depth,
  outerMat,
  innerMat,
  glassMat,
  gasketMat,
  handleType,
  hasMosquitoNet,
  netTex,
  isOpen,
  tiltSubMode,
  onToggle,
}) => {
  const pivotRef = useRef<THREE.Group>(null);
  const handleRef = useRef<THREE.Group>(null);

  const isOperable = sashType !== 'fixed';
  const barThick = 0.048;
  const sashDepth = depth * 0.88;

  // Determine effective kinematic mode
  const effectiveMode: 'fixed' | 'left' | 'right' | 'tilt' | 'bottom' = useMemo(() => {
    if (sashType === 'fixed') return 'fixed';
    if (sashType === 'open_left') return 'left';
    if (sashType === 'open_right') return 'right';
    if (sashType === 'tilt') return 'tilt';
    if (sashType === 'open_bottom') return 'bottom';
    if (sashType === 'tilt_turn_left') {
      return tiltSubMode === 'tilt' ? 'tilt' : 'left';
    }
    if (sashType === 'tilt_turn_right') {
      return tiltSubMode === 'tilt' ? 'tilt' : 'right';
    }
    return 'fixed';
  }, [sashType, tiltSubMode]);

  // Compute hinge pivot offset in parent space & local mesh offset from hinge
  const { pivotPos, contentOffset } = useMemo(() => {
    const zHinge = depth * 0.44; // Hinge sits on the interior face edge
    if (effectiveMode === 'left') {
      return {
        pivotPos: [centerX - sashW / 2, centerY, zHinge] as [number, number, number],
        contentOffset: [sashW / 2, 0, -zHinge] as [number, number, number],
      };
    }
    if (effectiveMode === 'right') {
      return {
        pivotPos: [centerX + sashW / 2, centerY, zHinge] as [number, number, number],
        contentOffset: [-sashW / 2, 0, -zHinge] as [number, number, number],
      };
    }
    if (effectiveMode === 'tilt') {
      return {
        pivotPos: [centerX, centerY - sashH / 2, zHinge] as [number, number, number],
        contentOffset: [0, sashH / 2, -zHinge] as [number, number, number],
      };
    }
    if (effectiveMode === 'bottom') {
      return {
        pivotPos: [centerX, centerY + sashH / 2, zHinge] as [number, number, number],
        contentOffset: [0, -sashH / 2, -zHinge] as [number, number, number],
      };
    }
    return {
      pivotPos: [centerX, centerY, 0] as [number, number, number],
      contentOffset: [0, 0, 0] as [number, number, number],
    };
  }, [centerX, centerY, sashW, sashH, depth, effectiveMode]);

  // Reset rotation instantly if effectiveMode changes so pivot axes never mix awkwardly
  useEffect(() => {
    if (pivotRef.current) {
      pivotRef.current.rotation.set(0, 0, 0);
    }
  }, [effectiveMode]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (pivotRef.current) {
      let targetRotX = 0;
      let targetRotY = 0;
      if (isOpen) {
        if (effectiveMode === 'left') targetRotY = 1.12;
        else if (effectiveMode === 'right') targetRotY = -1.12;
        else if (effectiveMode === 'tilt') targetRotX = 0.3;
        else if (effectiveMode === 'bottom') targetRotX = -0.34;
      }
      pivotRef.current.rotation.x = THREE.MathUtils.damp(
        pivotRef.current.rotation.x,
        targetRotX,
        7,
        dt
      );
      pivotRef.current.rotation.y = THREE.MathUtils.damp(
        pivotRef.current.rotation.y,
        targetRotY,
        7,
        dt
      );
    }
    if (handleRef.current) {
      const targetHandleZ = isOpen ? (effectiveMode === 'tilt' ? Math.PI : Math.PI / 2) : 0;
      handleRef.current.rotation.z = THREE.MathUtils.damp(
        handleRef.current.rotation.z,
        targetHandleZ,
        9,
        dt
      );
    }
  });

  // Glass & optional door sandwich panel dimensions
  const innerGlassW = Math.max(0.05, sashW - (isOperable ? barThick * 2 : 0.01));
  const innerGlassH = Math.max(0.05, sashH - (isOperable ? barThick * 2 : 0.01));
  const doorLowerRatio = 0.34;
  const doorMidBarThick = 0.055;
  const doorPanelH = isDoorLeaf ? innerGlassH * doorLowerRatio : 0;
  const topGlassH = isDoorLeaf
    ? Math.max(0.05, innerGlassH - doorPanelH - doorMidBarThick)
    : innerGlassH;
  const topGlassCenterY = isDoorLeaf
    ? (innerGlassH - topGlassH) / 2
    : 0;
  const doorPanelCenterY = isDoorLeaf
    ? -innerGlassH / 2 + doorPanelH / 2
    : 0;
  const doorMidBarY = isDoorLeaf
    ? -innerGlassH / 2 + doorPanelH + doorMidBarThick / 2
    : 0;

  // Handle placement
  const handlePos: [number, number, number] = useMemo(() => {
    const zPos = sashDepth / 2 + 0.012;
    if (sashType === 'tilt') {
      return [0, sashH / 2 - barThick * 0.5, zPos];
    }
    if (sashType === 'open_bottom') {
      return [0, -sashH / 2 + barThick * 0.5, zPos];
    }
    if (sashType === 'open_left' || sashType === 'tilt_turn_left') {
      return [sashW / 2 - barThick * 0.5, 0, zPos];
    }
    return [-sashW / 2 + barThick * 0.5, 0, zPos];
  }, [sashType, sashW, sashH, sashDepth, barThick]);

  const handleColor =
    handleType === 'premium_metal'
      ? '#C0C6CE'
      : handleType === 'key_lock'
        ? '#D91E2A'
        : '#F1F5F9';

  return (
    <group>
      {/* Fixed exterior mosquito net (stays on frame when sash opens) */}
      {hasMosquitoNet && isOperable && !isDoorLeaf && (
        <group position={[centerX, centerY, -depth * 0.52]}>
          <mesh>
            <planeGeometry args={[sashW - 0.01, sashH - 0.01]} />
            <meshBasicMaterial
              map={netTex}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Pivoting Sash Assembly */}
      <group ref={pivotRef} position={pivotPos}>
        <group position={contentOffset}>
          {/* Sash Profile Bars (only for operable sashes) */}
          {isOperable && (
            <group>
              {/* Top & Bottom */}
              <DualBar
                position={[0, sashH / 2 - barThick / 2, 0.008]}
                size={[sashW, barThick, sashDepth]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
              <DualBar
                position={[0, -sashH / 2 + barThick / 2, 0.008]}
                size={[sashW, barThick, sashDepth]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
              {/* Left & Right */}
              <DualBar
                position={[-sashW / 2 + barThick / 2, 0, 0.008]}
                size={[barThick, sashH - barThick * 2, sashDepth]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
              <DualBar
                position={[sashW / 2 - barThick / 2, 0, 0.008]}
                size={[barThick, sashH - barThick * 2, sashDepth]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
              {/* Subtle EPDM rubber seal line */}
              <mesh position={[0, 0, 0.008]} material={gasketMat}>
                <boxGeometry args={[innerGlassW + 0.008, innerGlassH + 0.008, 0.022]} />
              </mesh>
            </group>
          )}

          {/* Glass Pane */}
          <mesh
            position={[0, topGlassCenterY, 0.004]}
            material={glassMat}
            onClick={(e) => {
              if (isOperable) {
                e.stopPropagation();
                onToggle();
              }
            }}
          >
            <boxGeometry args={[innerGlassW, topGlassH, 0.018]} />
          </mesh>

          {/* Balcony Door Mid Transom & Lower Sandwich Panel */}
          {isDoorLeaf && (
            <>
              <DualBar
                position={[0, doorMidBarY, 0.008]}
                size={[innerGlassW, doorMidBarThick, sashDepth * 0.92]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
              <DualBar
                position={[0, doorPanelCenterY, 0.004]}
                size={[innerGlassW, doorPanelH, 0.028]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
            </>
          )}

          {/* Architectural Handle */}
          {isOperable && (
            <group
              position={handlePos}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {/* Escutcheon plate */}
              <mesh castShadow>
                <boxGeometry args={[0.024, 0.068, 0.014]} />
                <meshStandardMaterial
                  color={handleColor}
                  metalness={handleType === 'premium_metal' ? 0.85 : 0.3}
                  roughness={handleType === 'premium_metal' ? 0.2 : 0.35}
                />
              </mesh>
              {/* Key cylinder dot if key_lock */}
              {handleType === 'key_lock' && (
                <mesh position={[0, -0.02, 0.01]}>
                  <cylinderGeometry args={[0.006, 0.006, 0.008, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
                </mesh>
              )}
              {/* Rotating lever */}
              <group ref={handleRef} position={[0, 0.008, 0.012]}>
                <mesh position={[0, -0.055, 0.018]} castShadow>
                  <boxGeometry args={[0.016, 0.11, 0.018]} />
                  <meshStandardMaterial
                    color={handleColor}
                    metalness={handleType === 'premium_metal' ? 0.88 : 0.35}
                    roughness={handleType === 'premium_metal' ? 0.18 : 0.3}
                  />
                </mesh>
                <mesh position={[0, 0, 0.009]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.009, 0.009, 0.022, 12]} />
                  <meshStandardMaterial
                    color={handleColor}
                    metalness={handleType === 'premium_metal' ? 0.88 : 0.35}
                    roughness={0.25}
                  />
                </mesh>
              </group>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

interface WindowAssemblyProps {
  config: WindowConfig;
  openStates: boolean[];
  tiltSubModes: TiltTurnSubMode[];
  showRoomBg: boolean;
  onToggleSash: (idx: number) => void;
}

const WindowAssembly3D: React.FC<WindowAssemblyProps> = ({
  config,
  openStates,
  tiltSubModes,
  showRoomBg,
  onToggleSash,
}) => {
  const seriesSpec = PROFILE_SERIES[config.series] ?? PROFILE_SERIES.comfort;
  const glassSpec = GLASS_OPTIONS[config.glassType] ?? GLASS_OPTIONS.double_chamber;

  const W = config.widthMm / 1000;
  const H = config.heightMm / 1000;
  const depth = seriesSpec.depthMm / 1000;
  const frameThick = 0.062;
  const mullionThick = 0.052;

  const outerMat = useLaminatedMaterial(config.outerColor);
  const innerMat = useLaminatedMaterial(config.innerColor);

  const glassMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: glassSpec.tintHex,
      transparent: true,
      opacity: glassSpec.opacity,
      roughness: glassSpec.roughness,
      metalness: config.glassType === 'low_e' ? 0.18 : 0.05,
      reflectivity: 0.9,
      clearcoat: config.glassType === 'frosted' ? 0.1 : 1.0,
      clearcoatRoughness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [glassSpec.tintHex, glassSpec.opacity, glassSpec.roughness, config.glassType]);

  const gasketMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E293B',
        roughness: 0.85,
        metalness: 0.0,
      }),
    []
  );

  const netTex = useMemo(() => createMosquitoNetTexture(), []);

  useEffect(() => {
    return () => {
      outerMat.dispose();
      innerMat.dispose();
      glassMat.dispose();
      gasketMat.dispose();
      netTex.dispose();
    };
  }, [outerMat, innerMat, glassMat, gasketMat, netTex]);

  const sashCount = config.sashCount;
  const innerW = W - frameThick * 2;
  const innerH = H - frameThick * 2;
  const totalSashW = innerW - mullionThick * (sashCount - 1);
  const sashW = totalSashW / sashCount;

  // Room wall geometry dimensions around window opening
  const wallW = Math.max(W + 1.8, 3.6);
  const wallH = Math.max(H + 1.4, 2.9);
  const wallThick = 0.24;
  const sideWallW = (wallW - W) / 2;
  const topWallH = (wallH - H) / 2;
  const botWallH = (wallH - H) / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Outer Frame (4 perimeter members) */}
      <DualBar
        position={[0, H / 2 - frameThick / 2, 0]}
        size={[W, frameThick, depth]}
        outerMat={outerMat}
        innerMat={innerMat}
      />
      <DualBar
        position={[0, -H / 2 + frameThick / 2, 0]}
        size={[W, frameThick, depth]}
        outerMat={outerMat}
        innerMat={innerMat}
      />
      <DualBar
        position={[-W / 2 + frameThick / 2, 0, 0]}
        size={[frameThick, H - frameThick * 2, depth]}
        outerMat={outerMat}
        innerMat={innerMat}
      />
      <DualBar
        position={[W / 2 - frameThick / 2, 0, 0]}
        size={[frameThick, H - frameThick * 2, depth]}
        outerMat={outerMat}
        innerMat={innerMat}
      />

      {/* Vertical Mullions & Sashes */}
      {Array.from({ length: sashCount }).map((_, idx) => {
        const sashX =
          -W / 2 + frameThick + sashW / 2 + idx * (sashW + mullionThick);
        const sashType = config.sashes[idx] ?? 'fixed';
        const isDoorLeaf = config.isBalconyDoor && idx === 0;

        return (
          <React.Fragment key={idx}>
            <Sash3D
              index={idx}
              sashType={sashType}
              isDoorLeaf={isDoorLeaf}
              centerX={sashX}
              centerY={0}
              sashW={sashW}
              sashH={innerH}
              depth={depth}
              outerMat={outerMat}
              innerMat={innerMat}
              glassMat={glassMat}
              gasketMat={gasketMat}
              handleType={config.extras.handleType}
              hasMosquitoNet={config.extras.mosquitoNet}
              netTex={netTex}
              isOpen={Boolean(openStates[idx])}
              tiltSubMode={tiltSubModes[idx] ?? 'turn'}
              onToggle={() => onToggleSash(idx)}
            />
            {idx < sashCount - 1 && (
              <DualBar
                position={[sashX + sashW / 2 + mullionThick / 2, 0, 0]}
                size={[mullionThick, innerH, depth]}
                outerMat={outerMat}
                innerMat={innerMat}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Interior Window Sill (Podokonnik) */}
      {config.extras.sill && (
        <group position={[0, -H / 2 - 0.016, depth / 2 + 0.075]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[W + 0.08, 0.032, 0.2]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.28} metalness={0.05} />
          </mesh>
          {/* Front rounded-style lip */}
          <mesh position={[0, -0.008, 0.098]} castShadow>
            <boxGeometry args={[W + 0.084, 0.044, 0.018]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.05} />
          </mesh>
        </group>
      )}

      {/* Exterior Drain / Ebb (Otliv) */}
      {config.extras.drainEbb && (
        <mesh
          position={[0, -H / 2 - 0.018, -depth / 2 - 0.06]}
          rotation={[0.14, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[W + 0.04, 0.01, 0.14]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.28} metalness={0.65} />
        </mesh>
      )}

      {/* 3D Architectural Dimension Indicator Bars (Width & Height) */}
      <group>
        {/* Bottom Width Bar (Eni) */}
        <mesh position={[0, -H / 2 - 0.14, depth / 2]}>
          <boxGeometry args={[W, 0.008, 0.008]} />
          <meshBasicMaterial color="#D91E2A" />
        </mesh>
        <mesh position={[-W / 2, -H / 2 - 0.14, depth / 2]}>
          <boxGeometry args={[0.008, 0.06, 0.008]} />
          <meshBasicMaterial color="#D91E2A" />
        </mesh>
        <mesh position={[W / 2, -H / 2 - 0.14, depth / 2]}>
          <boxGeometry args={[0.008, 0.06, 0.008]} />
          <meshBasicMaterial color="#D91E2A" />
        </mesh>

        {/* Left Height Bar (Bo'yi) */}
        <mesh position={[-W / 2 - 0.14, 0, depth / 2]}>
          <boxGeometry args={[0.008, H, 0.008]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-W / 2 - 0.14, H / 2, depth / 2]}>
          <boxGeometry args={[0.06, 0.008, 0.008]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-W / 2 - 0.14, -H / 2, depth / 2]}>
          <boxGeometry args={[0.06, 0.008, 0.008]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Architectural Room Wall Context */}
      {showRoomBg ? (
        <group>
          {/* Left wall pier */}
          <mesh position={[-W / 2 - sideWallW / 2, 0, 0]} receiveShadow>
            <boxGeometry args={[sideWallW, wallH, wallThick]} />
            <meshStandardMaterial color="#EAECEF" roughness={0.88} />
          </mesh>
          {/* Right wall pier */}
          <mesh position={[W / 2 + sideWallW / 2, 0, 0]} receiveShadow>
            <boxGeometry args={[sideWallW, wallH, wallThick]} />
            <meshStandardMaterial color="#EAECEF" roughness={0.88} />
          </mesh>
          {/* Top header wall */}
          <mesh position={[0, H / 2 + topWallH / 2, 0]} receiveShadow>
            <boxGeometry args={[W, topWallH, wallThick]} />
            <meshStandardMaterial color="#EAECEF" roughness={0.88} />
          </mesh>
          {/* Bottom apron wall */}
          <mesh position={[0, -H / 2 - botWallH / 2, 0]} receiveShadow>
            <boxGeometry args={[W, botWallH, wallThick]} />
            <meshStandardMaterial color="#E2E6EC" roughness={0.88} />
          </mesh>
          {/* Interior Floor */}
          <mesh
            position={[0, -wallH / 2, 1.1]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[wallW + 1.2, 2.6]} />
            <meshStandardMaterial color="#D6C7B2" roughness={0.72} />
          </mesh>
          {/* Subtle Outdoor Sky Backdrop Plane behind window */}
          <mesh position={[0, 0, -2.2]}>
            <planeGeometry args={[wallW + 4, wallH + 3]} />
            <meshBasicMaterial color="#CBE4F5" />
          </mesh>
        </group>
      ) : (
        /* Fixed Studio Reference Grid & Shadow Plane so Width/Height changes stay visually true to scale */
        <group position={[0, -1.62, 0]}>
          <gridHelper args={[6, 12, '#CBD5E1', '#DDE3EC']} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
            <planeGeometry args={[8, 8]} />
            <shadowMaterial opacity={0.12} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Fixed Studio Camera Rig (only resets on manual trigger so dimension sliders reflect true physical scale)
const CameraRig: React.FC<{ resetTick: number }> = ({ resetTick }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0.95, 0.35, 4.45);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [resetTick, camera]);

  return null;
};

export const WindowViewer3D: React.FC<WindowViewer3DProps> = ({ config, t }) => {
  const [{ supported: webglSupported, isSoftwareGl }] = useState(() => detectWebGL());
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(webglSupported ? '3d' : '2d');
  const [twoDSide, setTwoDSide] = useState<'inner' | 'outer'>('inner');
  const [showRoomBg, setShowRoomBg] = useState<boolean>(false);
  const [cameraResetTick, setCameraResetTick] = useState<number>(0);
  const [openStates, setOpenStates] = useState<boolean[]>([false, false, false, false]);
  const [tiltSubModes, setTiltSubModes] = useState<TiltTurnSubMode[]>([
    'turn',
    'turn',
    'turn',
    'turn',
  ]);
  const [contextLost, setContextLost] = useState(false);

  const activeSashes = config.sashes.slice(0, config.sashCount);
  const operableIndices = activeSashes
    .map((s, idx) => (s !== 'fixed' ? idx : -1))
    .filter((i) => i !== -1);

  const allOpen =
    operableIndices.length > 0 && operableIndices.every((idx) => openStates[idx]);

  const handleToggleSash = (idx: number) => {
    if (activeSashes[idx] === 'fixed') return;
    setOpenStates((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleToggleAll = () => {
    const nextState = !allOpen;
    setOpenStates((prev) =>
      prev.map((val, idx) => (activeSashes[idx] && activeSashes[idx] !== 'fixed' ? nextState : val))
    );
  };

  const handleToggleTiltSubMode = (idx: number) => {
    setTiltSubModes((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 'turn' ? 'tilt' : 'turn';
      return next;
    });
    // Ensure sash opens so user sees the motion immediately
    setOpenStates((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const show2DFallback = !webglSupported || contextLost || viewMode === '2d';

  const fallback2DView = (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F1F4F8]">
      {(!webglSupported || contextLost) && (
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
          {t.viewer.webglFallback}
        </div>
      )}
      <div className="w-full max-w-md flex-1 flex items-center justify-center min-h-[260px]">
        <WindowSchematicSVG
          config={config}
          showDimensions
          fixedScale
          side={twoDSide}
          className="w-full h-auto max-h-[340px]"
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTwoDSide('inner')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            twoDSide === 'inner'
              ? 'bg-[#0F172A] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A]'
          }`}
        >
          {t.viewer.interiorTag}
        </button>
        <button
          type="button"
          onClick={() => setTwoDSide('outer')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            twoDSide === 'outer'
              ? 'bg-[#0F172A] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A]'
          }`}
        >
          {t.viewer.exteriorTag}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[360px] sm:h-[490px] lg:h-[540px] bg-[#ECEFF4] border border-slate-200 rounded-2xl overflow-hidden select-none">
      {/* Top Floating Viewport Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: 2D/3D Toggle */}
        <div className="inline-flex items-center p-1 bg-white/95 border border-slate-200 rounded-xl shadow-xs pointer-events-auto">
          <button
            type="button"
            disabled={!webglSupported || contextLost}
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              !show2DFallback
                ? 'bg-[#0F172A] text-white'
                : 'text-slate-600 hover:text-[#0F172A] disabled:opacity-40'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{t.viewer.view3D}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              show2DFallback
                ? 'bg-[#0F172A] text-white'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.viewer.view2D}</span>
          </button>
        </div>

        {/* Right: Room Wall Toggle + Camera Reset + Dimension Readout */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!show2DFallback && (
            <>
              <button
                type="button"
                onClick={() => setShowRoomBg((prev) => !prev)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  showRoomBg
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-white/95 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {showRoomBg ? t.viewer.roomBgOn : t.viewer.roomBgOff}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCameraResetTick((c) => c + 1)}
                title="Reset 3D camera"
                className="p-2 rounded-xl text-xs font-semibold border bg-white/95 text-slate-700 border-slate-200 hover:border-slate-300 inline-flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <div className="px-3 py-2 rounded-xl bg-white/95 border border-slate-200 text-xs font-mono tabular-nums font-semibold text-[#0F172A] whitespace-nowrap">
            {config.widthMm} × {config.heightMm} mm
          </div>
        </div>
      </div>

      {/* Main Canvas or 2D Fallback */}
      {show2DFallback ? (
        fallback2DView
      ) : (
        <WebGLErrorBoundary fallback={fallback2DView}>
          <div className="w-full h-full">
            <Canvas
              shadows={!isSoftwareGl}
              dpr={isSoftwareGl ? [1, 1] : [1, 2]}
              camera={{ fov: 40, near: 0.1, far: 50, position: [0.95, 0.35, 4.45] }}
              gl={{
                antialias: !isSoftwareGl,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.08,
              }}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  setContextLost(true);
                });
                gl.domElement.addEventListener('webglcontextrestored', () => {
                  setContextLost(false);
                });
              }}
            >
              <color attach="background" args={[showRoomBg ? '#DCE7F0' : '#ECEFF4']} />
              <StudioEnvironment />
              <CameraRig resetTick={cameraResetTick} />

              {/* Three-point Warm/Cool Studio Lighting */}
              <hemisphereLight args={['#EFF6FF', '#CBD5E1', 0.65]} />
              <directionalLight
                position={[3.5, 4.5, 4]}
                intensity={1.35}
                color="#FFF8EE"
                castShadow={!isSoftwareGl}
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0005}
                shadow-normalBias={0.02}
              />
              <directionalLight position={[-3, 2, -4]} intensity={0.65} color="#E0F2FE" />

              <WindowAssembly3D
                config={config}
                openStates={openStates}
                tiltSubModes={tiltSubModes}
                showRoomBg={showRoomBg}
                onToggleSash={handleToggleSash}
              />

              <OrbitControls
                makeDefault
                enableDamping={!isSoftwareGl}
                dampingFactor={0.06}
                minDistance={1.0}
                maxDistance={8.0}
                maxPolarAngle={Math.PI * 0.85}
                minPolarAngle={Math.PI * 0.12}
              />
            </Canvas>
          </div>
        </WebGLErrorBoundary>
      )}

      {/* Bottom Control Dock for Sash Open/Close Animations */}
      {!show2DFallback && (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
          <div className="pointer-events-auto max-w-full overflow-x-auto bg-white/95 border border-slate-200 rounded-xl shadow-sm p-1.5 flex items-center gap-1.5">
            {/* Open All / Close All */}
            {operableIndices.length > 0 && (
              <button
                type="button"
                onClick={handleToggleAll}
                className={`px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  allOpen
                    ? 'bg-[#D91E2A] text-white'
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                }`}
              >
                {allOpen ? (
                  <RotateCcw className="w-3.5 h-3.5" />
                ) : (
                  <DoorOpen className="w-3.5 h-3.5" />
                )}
                <span>{allOpen ? t.viewer.closeAll : t.viewer.openAll}</span>
              </button>
            )}

            {/* Per-Sash Controls */}
            {activeSashes.map((sType, idx) => {
              const isOperable = sType !== 'fixed';
              const isOpen = Boolean(openStates[idx]);
              const isTiltTurn = sType === 'tilt_turn_left' || sType === 'tilt_turn_right';
              const subMode = tiltSubModes[idx] ?? 'turn';

              return (
                <div
                  key={idx}
                  className="inline-flex items-center rounded-lg bg-[#F1F5F9] p-0.5 shrink-0"
                >
                  <button
                    type="button"
                    disabled={!isOperable}
                    onClick={() => handleToggleSash(idx)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                      !isOperable
                        ? 'text-slate-400 cursor-not-allowed'
                        : isOpen
                          ? 'bg-[#D91E2A] text-white cursor-pointer'
                          : 'bg-white text-[#0F172A] hover:bg-slate-50 cursor-pointer shadow-2xs'
                    }`}
                  >
                    {t.viewer.sashShort}
                    {idx + 1}:{' '}
                    {!isOperable
                      ? t.viewer.fixedLabel
                      : isOpen
                        ? t.viewer.closeSash
                        : t.viewer.openSash}
                  </button>

                  {isTiltTurn && (
                    <button
                      type="button"
                      onClick={() => handleToggleTiltSubMode(idx)}
                      title={`${t.viewer.turnMode} / ${t.viewer.tiltMode}`}
                      className="ml-0.5 px-2 py-1.5 rounded-md text-[11px] font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {subMode === 'tilt' ? t.viewer.tiltMode : t.viewer.turnMode}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] font-medium text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{t.viewer.dragHint}</span>
          </p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { GLASS_OPTIONS, PROFILE_COLORS } from '../constants/catalog';
import type { SashOpeningType, WindowConfig } from '../types/window';

interface SashSymbolSVGProps {
  type: SashOpeningType;
  size?: number;
  className?: string;
}

/**
 * Standard architectural opening symbol (triangle lines) for sash mechanism buttons & diagrams.
 */
export const SashSymbolSVG: React.FC<SashSymbolSVGProps> = ({
  type,
  size = 28,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="26"
        height="26"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      {type === 'fixed' && (
        <>
          <line x1="11" y1="11" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="21" y1="11" x2="11" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {(type === 'open_left' || type === 'tilt_turn_left') && (
        <polyline
          points="4,4 27,16 4,28"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {(type === 'open_right' || type === 'tilt_turn_right') && (
        <polyline
          points="28,4 5,16 28,28"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {(type === 'tilt' || type === 'tilt_turn_left' || type === 'tilt_turn_right') && (
        <polyline
          points="4,28 16,5 28,28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2.5 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {type === 'open_bottom' && (
        <polyline
          points="4,4 16,27 28,4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="2.5 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

interface WindowSchematicSVGProps {
  config: WindowConfig;
  showDimensions?: boolean;
  fixedScale?: boolean;
  side?: 'inner' | 'outer';
  className?: string;
}

/**
 * Clean procedural SVG elevation schematic for catalog cards, 2D view mode, cart thumbnails, and print quotes.
 */
export const WindowSchematicSVG: React.FC<WindowSchematicSVGProps> = ({
  config,
  showDimensions = false,
  fixedScale = false,
  side = 'inner',
  className = '',
}) => {
  const colorId = side === 'outer' ? config.outerColor : config.innerColor;
  const frameSpec = PROFILE_COLORS[colorId] ?? PROFILE_COLORS.white;
  const glassSpec = GLASS_OPTIONS[config.glassType] ?? GLASS_OPTIONS.double_chamber;

  let drawW: number;
  let drawH: number;
  let padLeft: number;
  let padTop: number;
  let vbW: number;
  let vbH: number;

  if (fixedScale) {
    // Fixed 3000 mm reference canvas so width (Eni) and height (Bo'yi) scale independently
    const maxRefPx = 210;
    const scale = maxRefPx / 3000;
    drawW = Math.max(28, config.widthMm * scale);
    drawH = Math.max(28, config.heightMm * scale);
    vbW = 310;
    vbH = 276;
    padLeft = (vbW - drawW) / 2 + 12;
    padTop = (vbH - drawH) / 2 - 12;
  } else {
    const maxDrawW = 260;
    const maxDrawH = 200;
    const aspect = config.widthMm / Math.max(1, config.heightMm);
    drawW = maxDrawW;
    drawH = drawW / aspect;
    if (drawH > maxDrawH) {
      drawH = maxDrawH;
      drawW = drawH * aspect;
    }
    padLeft = showDimensions ? 48 : 16;
    padTop = 16;
    const padRight = 16;
    const padBottom = showDimensions ? 44 : 18;
    vbW = drawW + padLeft + padRight;
    vbH = drawH + padTop + padBottom;
  }

  const outerFrameThick = Math.max(4, Math.min(12, Math.min(drawW, drawH) * 0.06));
  const mullionThick = Math.max(3, outerFrameThick * 0.72);
  const sashCount = config.sashCount;
  const innerW = Math.max(8, drawW - outerFrameThick * 2);
  const innerH = Math.max(8, drawH - outerFrameThick * 2);
  const sashTotalW = Math.max(8, innerW - mullionThick * (sashCount - 1));
  const sashW = sashTotalW / sashCount;

  const isDarkFrame =
    colorId === 'black' ||
    colorId === 'anthracite' ||
    colorId === 'brown' ||
    colorId === 'walnut';
  const frameStroke = isDarkFrame ? '#0F172A' : '#64748B';
  const symbolStroke = config.glassType === 'tinted' ? '#E2E8F0' : '#334155';
  const glassFill =
    config.glassType === 'frosted'
      ? '#E8EDF2'
      : config.glassType === 'tinted'
        ? '#51606E'
        : config.glassType === 'low_e'
          ? '#D1EFE7'
          : '#DCEFF8';

  const handleColor =
    config.extras.handleType === 'premium_metal'
      ? '#94A3B8'
      : config.extras.handleType === 'key_lock'
        ? '#D91E2A'
        : isDarkFrame
          ? '#E2E8F0'
          : '#1E293B';

  return (
    <svg
      viewBox={`0 0 ${vbW.toFixed(1)} ${vbH.toFixed(1)}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${config.widthMm} x ${config.heightMm} mm`}
    >
      {/* Outer Frame */}
      <rect
        x={padLeft}
        y={padTop}
        width={drawW}
        height={drawH}
        rx="2"
        fill={frameSpec.hex}
        stroke={frameStroke}
        strokeWidth="1.5"
      />

      {/* Sashes */}
      {Array.from({ length: sashCount }).map((_, idx) => {
        const sashType = config.sashes[idx] ?? 'fixed';
        const sx = padLeft + outerFrameThick + idx * (sashW + mullionThick);
        const sy = padTop + outerFrameThick;
        const sh = innerH;

        const isDoorLeaf = config.isBalconyDoor && idx === 0;
        const isOperable = sashType !== 'fixed';
        const sashInset = isOperable ? Math.max(4, outerFrameThick * 0.55) : 1.5;

        const gx = sx + sashInset;
        const gy = sy + sashInset;
        const gw = Math.max(8, sashW - sashInset * 2);
        const gh = Math.max(12, sh - sashInset * 2);

        const doorSplitY = gy + gh * 0.65;
        const glassBottomY = isDoorLeaf ? doorSplitY - 2 : gy + gh;
        const glassH = Math.max(8, glassBottomY - gy);

        const showLeftLine = sashType === 'open_left' || sashType === 'tilt_turn_left';
        const showRightLine = sashType === 'open_right' || sashType === 'tilt_turn_right';
        const showTiltLine =
          sashType === 'tilt' ||
          sashType === 'tilt_turn_left' ||
          sashType === 'tilt_turn_right';
        const showBottomLine = sashType === 'open_bottom';

        return (
          <g key={idx}>
            {/* Operable sash border */}
            {isOperable && (
              <rect
                x={sx}
                y={sy}
                width={sashW}
                height={sh}
                fill={frameSpec.hex}
                stroke={frameStroke}
                strokeWidth="1.1"
              />
            )}

            {/* Glass pane */}
            <rect
              x={gx}
              y={gy}
              width={gw}
              height={glassH}
              fill={glassFill}
              fillOpacity={config.glassType === 'frosted' ? 0.95 : 0.85}
              stroke={frameStroke}
              strokeWidth="1"
            />

            {/* Subtle glass diagonal reflection highlight */}
            <line
              x1={gx + gw * 0.18}
              y1={gy + glassH * 0.28}
              x2={gx + gw * 0.42}
              y2={gy + glassH * 0.1}
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />

            {/* Balcony Door lower insulated sandwich panel */}
            {isDoorLeaf && (
              <rect
                x={gx}
                y={doorSplitY + 2}
                width={gw}
                height={Math.max(6, gy + gh - (doorSplitY + 2))}
                fill={frameSpec.hex}
                stroke={frameStroke}
                strokeWidth="1"
              />
            )}

            {/* Opening Symbols (standard architectural triangle lines) */}
            {showLeftLine && (
              <polyline
                points={`${gx},${gy} ${gx + gw},${gy + glassH / 2} ${gx},${gy + glassH}`}
                fill="none"
                stroke={symbolStroke}
                strokeWidth="1.15"
                strokeDasharray="4 3"
              />
            )}
            {showRightLine && (
              <polyline
                points={`${gx + gw},${gy} ${gx},${gy + glassH / 2} ${gx + gw},${gy + glassH}`}
                fill="none"
                stroke={symbolStroke}
                strokeWidth="1.15"
                strokeDasharray="4 3"
              />
            )}
            {showTiltLine && (
              <polyline
                points={`${gx},${gy + glassH} ${gx + gw / 2},${gy} ${gx + gw},${gy + glassH}`}
                fill="none"
                stroke={symbolStroke}
                strokeWidth="1.15"
                strokeDasharray="3 2.5"
              />
            )}
            {showBottomLine && (
              <polyline
                points={`${gx},${gy} ${gx + gw / 2},${gy + glassH} ${gx + gw},${gy}`}
                fill="none"
                stroke={symbolStroke}
                strokeWidth="1.15"
                strokeDasharray="3 2.5"
              />
            )}

            {/* Mosquito net subtle grid overlay */}
            {config.extras.mosquitoNet && isOperable && !isDoorLeaf && (
              <rect
                x={gx + 1}
                y={gy + 1}
                width={Math.max(2, gw - 2)}
                height={Math.max(2, glassH - 2)}
                fill="none"
                stroke="#475569"
                strokeWidth="0.7"
                strokeDasharray="1.5 2.5"
                strokeOpacity="0.55"
              />
            )}

            {/* Handle indicator */}
            {isOperable && (
              <rect
                x={
                  showLeftLine
                    ? sx + sashW - sashInset * 0.72
                    : showRightLine
                      ? sx + sashInset * 0.28
                      : sx + sashW / 2 - 4
                }
                y={
                  sashType === 'tilt'
                    ? sy + sashInset * 0.35
                    : sashType === 'open_bottom'
                      ? sy + sh - sashInset * 0.75
                      : sy + sh * 0.45
                }
                width={sashType === 'tilt' || sashType === 'open_bottom' ? 8 : 2.6}
                height={sashType === 'tilt' || sashType === 'open_bottom' ? 2.6 : 12}
                rx="1"
                fill={handleColor}
              />
            )}

            {/* Mullion divider */}
            {idx < sashCount - 1 && (
              <rect
                x={sx + sashW}
                y={padTop + outerFrameThick}
                width={mullionThick}
                height={innerH}
                fill={frameSpec.hex}
                stroke={frameStroke}
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}

      {/* Window Sill (Interior) or Drain/Ebb (Exterior) */}
      {(config.extras.sill || config.extras.drainEbb) && (
        <rect
          x={padLeft - 5}
          y={padTop + drawH}
          width={drawW + 10}
          height={6}
          rx="1.5"
          fill={side === 'outer' ? '#CBD5E1' : '#E2E8F0'}
          stroke="#64748B"
          strokeWidth="1"
        />
      )}

      {/* Architectural mm Dimension Callouts */}
      {showDimensions && (
        <g className="font-mono" fill="#334155" fontSize="11" fontWeight="600">
          {/* Width line */}
          <line
            x1={padLeft}
            y1={padTop + drawH + 18}
            x2={padLeft + drawW}
            y2={padTop + drawH + 18}
            stroke="#64748B"
            strokeWidth="1"
          />
          <line x1={padLeft} y1={padTop + drawH + 13} x2={padLeft} y2={padTop + drawH + 23} stroke="#64748B" strokeWidth="1" />
          <line x1={padLeft + drawW} y1={padTop + drawH + 13} x2={padLeft + drawW} y2={padTop + drawH + 23} stroke="#64748B" strokeWidth="1" />
          <text x={padLeft + drawW / 2} y={padTop + drawH + 34} textAnchor="middle">
            {config.widthMm} mm
          </text>

          {/* Height line */}
          <line
            x1={padLeft - 16}
            y1={padTop}
            x2={padLeft - 16}
            y2={padTop + drawH}
            stroke="#64748B"
            strokeWidth="1"
          />
          <line x1={padLeft - 21} y1={padTop} x2={padLeft - 11} y2={padTop} stroke="#64748B" strokeWidth="1" />
          <line x1={padLeft - 21} y1={padTop + drawH} x2={padLeft - 11} y2={padTop + drawH} stroke="#64748B" strokeWidth="1" />
          <text
            x={padLeft - 24}
            y={padTop + drawH / 2}
            textAnchor="middle"
            transform={`rotate(-90, ${padLeft - 24}, ${padTop + drawH / 2})`}
          >
            {config.heightMm} mm
          </text>
        </g>
      )}
    </svg>
  );
};

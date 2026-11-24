import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Upload,
  Wand2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { MAX_DIMENSION_MM, MIN_DIMENSION_MM } from '../constants/catalog';
import type { TranslationDict } from '../i18n/translations';
import type { WindowConfig } from '../types/window';
import { WindowSchematicSVG } from './WindowSchematicSVG';

interface WallFitScannerProps {
  config: WindowConfig;
  t: TranslationDict;
  onChangeConfig: (next: WindowConfig) => void;
  onClose: () => void;
}

type BackgroundSource = 'demo' | 'live' | 'photo';

export const WallFitScanner: React.FC<WallFitScannerProps> = ({
  config,
  t,
  onChangeConfig,
  onClose,
}) => {
  const [source, setSource] = useState<BackgroundSource>('demo');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // Wall dimensions in meters
  const [wallWidthM, setWallWidthM] = useState<number>(3.2);
  const [wallHeightM, setWallHeightM] = useState<number>(2.7);

  // Window position from top-left of wall in meters
  const [posXM, setPosXM] = useState<number>(() =>
    Math.max(0, (3.2 - config.widthMm / 1000) / 2)
  );
  const [posYM, setPosYM] = useState<number>(() =>
    Math.max(0, 2.7 - config.heightMm / 1000 - 0.85)
  );

  // Visual zoom / scale factor (kattalashtirish)
  const [zoom, setZoom] = useState<number>(1.0);

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stageSize, setStageSize] = useState<{ w: number; h: number }>({
    w: 360,
    h: 340,
  });

  // Track stage container dimensions reliably
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      setStageSize({
        w: Math.max(240, el.clientWidth),
        h: Math.max(240, el.clientHeight),
      });
    };
    update();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Cleanup camera stream and object URLs on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [stopCamera, photoUrl]);

  const startCamera = async () => {
    setCameraError('');
    stopCamera();

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(t.wallScanner.cameraError);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setSource('live');
      setCameraActive(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            // Ignore autoplay race; muted+playsInline handles mobile
          });
        }
      }, 40);
    } catch {
      setCameraError(t.wallScanner.cameraError);
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }
      setPhotoUrl(dataUrl);
      setSource('photo');
      stopCamera();
    }
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setCameraError('');
    if (photoUrl && photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl(nextUrl);
    setSource('photo');
    // Reset file input so selecting the same file again triggers onChange
    e.target.value = '';
  };

  // Compute wall pixel box & px-per-meter ratio
  const { wallBoxW, wallBoxH, pxPerMeter } = useMemo(() => {
    const pad = 28;
    const availW = Math.max(120, stageSize.w - pad * 2);
    const availH = Math.max(120, stageSize.h - pad * 2);
    const wallAspect = wallWidthM / Math.max(0.5, wallHeightM);

    let baseW = availW;
    let baseH = baseW / wallAspect;
    if (baseH > availH) {
      baseH = availH;
      baseW = baseH * wallAspect;
    }

    const scaledW = baseW * zoom;
    const scaledH = baseH * zoom;
    return {
      wallBoxW: scaledW,
      wallBoxH: scaledH,
      pxPerMeter: scaledW / wallWidthM,
    };
  }, [stageSize.w, stageSize.h, wallWidthM, wallHeightM, zoom]);

  const winWM = config.widthMm / 1000;
  const winHM = config.heightMm / 1000;

  // Live 4-side distances in meters
  const leftM = posXM;
  const rightM = wallWidthM - (posXM + winWM);
  const topM = posYM;
  const bottomM = wallHeightM - (posYM + winHM);

  const tooWide = winWM > wallWidthM + 0.001;
  const tooTall = winHM > wallHeightM + 0.001;
  const outside =
    leftM < -0.005 || rightM < -0.005 || topM < -0.005 || bottomM < -0.005;
  const fits = !tooWide && !tooTall && !outside;

  let failReason = '';
  if (tooWide) failReason = t.wallScanner.fitReasonTooWide;
  else if (tooTall) failReason = t.wallScanner.fitReasonTooTall;
  else if (outside) failReason = t.wallScanner.fitReasonOutside;

  // Dragging state for moving the window smoothly on the wall (mouse + touch)
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origXM: number;
    origYM: number;
  }>({ active: false, startX: 0, startY: 0, origXM: 0, origYM: 0 });

  const handleWindowPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origXM: posXM,
      origYM: posYM,
    };
  };

  const handleWindowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || pxPerMeter <= 0) return;
    const dxPx = e.clientX - dragRef.current.startX;
    const dyPx = e.clientY - dragRef.current.startY;
    const nextX = dragRef.current.origXM + dxPx / pxPerMeter;
    const nextY = dragRef.current.origYM + dyPx / pxPerMeter;

    // Allow mild overshoot so user can see "outside edge" warning, without losing the window
    const minX = -0.35;
    const maxX = wallWidthM - winWM + 0.35;
    const minY = -0.35;
    const maxY = wallHeightM - winHM + 0.35;

    setPosXM(Math.min(Math.max(nextX, Math.min(minX, maxX)), Math.max(minX, maxX)));
    setPosYM(Math.min(Math.max(nextY, Math.min(minY, maxY)), Math.max(minY, maxY)));
  };

  const handleWindowPointerUp = () => {
    dragRef.current.active = false;
  };

  const handleAutoFit = () => {
    let nextWidthMm = config.widthMm;
    let nextHeightMm = config.heightMm;

    if (tooWide) {
      const maxAllowedMm = Math.floor((wallWidthM - 0.16) * 1000 / 10) * 10;
      nextWidthMm = Math.min(MAX_DIMENSION_MM, Math.max(MIN_DIMENSION_MM, maxAllowedMm));
    }
    if (tooTall) {
      const maxAllowedMm = Math.floor((wallHeightM - 0.16) * 1000 / 10) * 10;
      nextHeightMm = Math.min(MAX_DIMENSION_MM, Math.max(MIN_DIMENSION_MM, maxAllowedMm));
    }

    if (nextWidthMm !== config.widthMm || nextHeightMm !== config.heightMm) {
      onChangeConfig({
        ...config,
        widthMm: nextWidthMm,
        heightMm: nextHeightMm,
      });
    }

    const wM = nextWidthMm / 1000;
    const hM = nextHeightMm / 1000;
    setPosXM(Math.max(0, (wallWidthM - wM) / 2));
    // Place at comfortable ~0.85m from floor if height allows, else center vertically
    const preferredSill = wallHeightM - hM >= 0.85 ? 0.85 : Math.max(0, (wallHeightM - hM) / 2);
    setPosYM(Math.max(0, wallHeightM - hM - preferredSill));
  };

  const fmtM = (val: number) => `${val.toFixed(2)} ${t.wallScanner.meterUnit}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/85 flex flex-col items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.wallScanner.title}
    >
      <div className="w-full max-w-5xl max-h-[96vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <header className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] truncate">
              {t.wallScanner.title}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {t.wallScanner.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            aria-label={t.wallScanner.closeBtn}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 flex items-center justify-center text-[#0F172A] shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Camera & Photo Source Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>
                    {source === 'photo' ? t.wallScanner.retakePhoto : t.wallScanner.startCamera}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.wallScanner.takePhoto}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{t.wallScanner.uploadPhoto}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleUploadFile}
                className="hidden"
              />

              {source !== 'demo' && (
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setSource('demo');
                    setCameraError('');
                  }}
                  className="min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.wallScanner.demoWall}</span>
                </button>
              )}
            </div>

            {/* Zoom Controls (Kattalashtirish) */}
            <div className="inline-flex items-center gap-1 bg-[#F4F6F9] border border-slate-200 rounded-xl p-1">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] hover:bg-slate-50 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold tabular-nums text-[#0F172A] min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.15).toFixed(2))))}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] hover:bg-slate-50 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Reset zoom"
                onClick={() => setZoom(1.0)}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#0F172A] cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {cameraError && (
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
              {cameraError}
            </div>
          )}

          {/* Fit Verdict Banner */}
          <div
            className={`px-4 py-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
              fits
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-[#D91E2A]'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              {fits ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#D91E2A] shrink-0" />
              )}
              <div>
                <div>{fits ? t.wallScanner.fitYes : t.wallScanner.fitNo}</div>
                {!fits && failReason && (
                  <div className="text-xs font-medium opacity-90 mt-0.5">{failReason}</div>
                )}
              </div>
            </div>

            {!fits && (
              <button
                type="button"
                onClick={handleAutoFit}
                className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#D91E2A] hover:bg-[#B81620] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{t.wallScanner.autoFitBtn}</span>
              </button>
            )}
          </div>

          {/* Interactive Wall & Camera Canvas Stage */}
          <div
            ref={stageRef}
            className="relative w-full h-[330px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-300 bg-[#1E293B] flex items-center justify-center select-none"
          >
            {/* Background: Live Camera / Captured Photo / Architectural Sample Wall */}
            {source === 'live' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {source === 'photo' && photoUrl && (
              <img
                src={photoUrl}
                alt="Wall"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {source === 'demo' && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, #E2E8F0 0%, #EDF1F5 76%, #C7B299 76%, #B39B80 100%)',
                }}
              />
            )}

            {/* Wall Boundary Frame + Draggable Window Overlay */}
            <div
              className="relative border-2 border-dashed border-sky-400 bg-sky-500/5 shadow-inner"
              style={{
                width: `${wallBoxW}px`,
                height: `${wallBoxH}px`,
              }}
            >
              {/* Wall Dimension Label at top */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#0F172A]/85 text-white text-[11px] font-mono tabular-nums whitespace-nowrap">
                {t.wallScanner.wallInfo}: {wallWidthM.toFixed(2)} × {wallHeightM.toFixed(2)}{' '}
                {t.wallScanner.meterUnit}
              </div>

              {/* Draggable Window Element */}
              <div
                onPointerDown={handleWindowPointerDown}
                onPointerMove={handleWindowPointerMove}
                onPointerUp={handleWindowPointerUp}
                onPointerCancel={handleWindowPointerUp}
                style={{
                  left: `${posXM * pxPerMeter}px`,
                  top: `${posYM * pxPerMeter}px`,
                  width: `${winWM * pxPerMeter}px`,
                  height: `${winHM * pxPerMeter}px`,
                }}
                className={`absolute touch-none cursor-grab active:cursor-grabbing transition-shadow ${
                  fits
                    ? 'ring-2 ring-emerald-500 shadow-lg'
                    : 'ring-2 ring-[#D91E2A] shadow-lg bg-red-500/10'
                }`}
              >
                <WindowSchematicSVG config={config} className="w-full h-full" />

                {/* Top Margin Line & Label */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 bottom-full flex flex-col items-center pointer-events-none"
                  style={{ height: `${Math.max(0, posYM * pxPerMeter)}px` }}
                >
                  <div className="w-px flex-1 bg-amber-400" />
                  <span className="px-1.5 py-0.5 rounded bg-[#0F172A]/90 text-amber-300 text-[10px] font-mono tabular-nums whitespace-nowrap">
                    ↑ {fmtM(topM)}
                  </span>
                </div>

                {/* Bottom Height Line & Label (Pasti nechchi metr!) */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full flex flex-col items-center pointer-events-none"
                  style={{ height: `${Math.max(0, bottomM * pxPerMeter)}px` }}
                >
                  <div className="w-px flex-1 bg-emerald-400" />
                  <span className="px-1.5 py-0.5 rounded bg-[#0F172A]/95 text-emerald-300 text-[11px] font-mono font-bold tabular-nums whitespace-nowrap">
                    ↓ {t.wallScanner.bottomHeight}: {fmtM(bottomM)}
                  </span>
                </div>

                {/* Left Margin Line & Label */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 right-full flex items-center pointer-events-none"
                  style={{ width: `${Math.max(0, leftM * pxPerMeter)}px` }}
                >
                  <span className="px-1.5 py-0.5 rounded bg-[#0F172A]/90 text-white text-[10px] font-mono tabular-nums whitespace-nowrap">
                    ← {fmtM(leftM)}
                  </span>
                  <div className="h-px flex-1 bg-sky-300" />
                </div>

                {/* Right Margin Line & Label */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-full flex items-center pointer-events-none"
                  style={{ width: `${Math.max(0, rightM * pxPerMeter)}px` }}
                >
                  <div className="h-px flex-1 bg-sky-300" />
                  <span className="px-1.5 py-0.5 rounded bg-[#0F172A]/90 text-white text-[10px] font-mono tabular-nums whitespace-nowrap">
                    {fmtM(rightM)} →
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-[#0F172A]/75 text-white text-[11px] font-medium whitespace-nowrap pointer-events-none">
              {t.wallScanner.dragHint}
            </div>
          </div>

          {/* Live 4-Side Meter Readout Cards (always visible immediately when window is on wall) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70">
              <div className="text-[11px] font-semibold text-emerald-800">
                {t.wallScanner.bottomHeight}
              </div>
              <div
                className={`text-lg font-extrabold font-mono tabular-nums ${
                  bottomM < 0 ? 'text-[#D91E2A]' : 'text-[#0F172A]'
                }`}
              >
                {fmtM(bottomM)}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-[#F8FAFC]">
              <div className="text-[11px] font-semibold text-slate-500">
                {t.wallScanner.topSpace}
              </div>
              <div
                className={`text-lg font-extrabold font-mono tabular-nums ${
                  topM < 0 ? 'text-[#D91E2A]' : 'text-[#0F172A]'
                }`}
              >
                {fmtM(topM)}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-[#F8FAFC]">
              <div className="text-[11px] font-semibold text-slate-500">
                {t.wallScanner.leftSpace}
              </div>
              <div
                className={`text-lg font-extrabold font-mono tabular-nums ${
                  leftM < 0 ? 'text-[#D91E2A]' : 'text-[#0F172A]'
                }`}
              >
                {fmtM(leftM)}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-[#F8FAFC]">
              <div className="text-[11px] font-semibold text-slate-500">
                {t.wallScanner.rightSpace}
              </div>
              <div
                className={`text-lg font-extrabold font-mono tabular-nums ${
                  rightM < 0 ? 'text-[#D91E2A]' : 'text-[#0F172A]'
                }`}
              >
                {fmtM(rightM)}
              </div>
            </div>
          </div>

          {/* Wall Size & Window Size Fine-Tuning Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F7F8FA] border border-slate-200 rounded-2xl p-4">
            {/* Wall Dimensions */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>{t.wallScanner.wallWidthLabel}</span>
                  <span className="font-mono tabular-nums">
                    {wallWidthM.toFixed(2)} {t.wallScanner.meterUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={7.0}
                  step={0.1}
                  value={wallWidthM}
                  onChange={(e) => setWallWidthM(Number(e.target.value))}
                  className="w-full akfa-slider"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>{t.wallScanner.wallHeightLabel}</span>
                  <span className="font-mono tabular-nums">
                    {wallHeightM.toFixed(2)} {t.wallScanner.meterUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={4.5}
                  step={0.1}
                  value={wallHeightM}
                  onChange={(e) => setWallHeightM(Number(e.target.value))}
                  className="w-full akfa-slider"
                />
              </div>
            </div>

            {/* Window Dimensions (direct sliders for resizing right on the wall) */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>{t.configurator.widthLabel}</span>
                  <span className="font-mono tabular-nums text-[#D91E2A]">
                    {(config.widthMm / 1000).toFixed(2)} {t.wallScanner.meterUnit} ({config.widthMm} mm)
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_DIMENSION_MM}
                  max={MAX_DIMENSION_MM}
                  step={10}
                  value={config.widthMm}
                  onChange={(e) =>
                    onChangeConfig({ ...config, widthMm: Number(e.target.value) })
                  }
                  className="w-full akfa-slider"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>{t.configurator.heightLabel}</span>
                  <span className="font-mono tabular-nums text-[#D91E2A]">
                    {(config.heightMm / 1000).toFixed(2)} {t.wallScanner.meterUnit} ({config.heightMm} mm)
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_DIMENSION_MM}
                  max={MAX_DIMENSION_MM}
                  step={10}
                  value={config.heightMm}
                  onChange={(e) =>
                    onChangeConfig({ ...config, heightMm: Number(e.target.value) })
                  }
                  className="w-full akfa-slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
          >
            {t.wallScanner.applyAndClose}
          </button>
        </footer>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { Pipette, Crosshair, Sparkles, Check, Info } from 'lucide-react';
import { RGBColor, SamplePoint } from '../types/rice';
import { IRRI_LCC_COLORS, matchLCCLevel, rgbToHex, rgbToHsv } from '../utils/colorAnalysis';

interface Props {
  imageUri: string;
  averageRgb: RGBColor;
  samplePoints?: SamplePoint[];
  currentLcc: number;
  mode: 'leaf' | 'soil';
  onPointSelected?: (point: SamplePoint) => void;
}

export const ImageColorInspector: React.FC<Props> = ({
  imageUri,
  averageRgb,
  samplePoints = [],
  currentLcc,
  mode,
  onPointSelected,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [activeRgb, setActiveRgb] = useState<RGBColor>(averageRgb);
  const [clickedCoord, setClickedCoord] = useState<{ x: number; y: number } | null>(null);
  const [isDropperActive, setIsDropperActive] = useState(false);

  // Read pixel from image on click
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    // Create a temporary canvas to sample pixel
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 400;
    canvas.height = img.naturalHeight || 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const px = Math.floor(normX * canvas.width);
      const py = Math.floor(normY * canvas.height);
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      const selectedRgb: RGBColor = {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
      };
      setActiveRgb(selectedRgb);
      setClickedCoord({ x: normX, y: normY });

      const lcc = matchLCCLevel(selectedRgb);
      if (onPointSelected) {
        onPointSelected({
          x: normX,
          y: normY,
          rgb: selectedRgb,
          hex: rgbToHex(selectedRgb),
          lccLevel: lcc.level,
        });
      }
    }
  };

  const activeHex = rgbToHex(activeRgb);
  const activeHsv = rgbToHsv(activeRgb);
  const activeLcc = matchLCCLevel(activeRgb);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-emerald-600" />
            <span>ตรวจวัดและสแกนค่าสี RGB ({mode === 'leaf' ? 'ใบข้าว' : 'ผิวดิน'})</span>
          </h3>
          <p className="text-xs text-stone-500">
            แตะหรือคลิกบนรูปภาพเพื่อดูค่าสีเฉพาะจุดแบบละเอียด (Pixel Eyedropper)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveRgb(averageRgb);
            setClickedCoord(null);
          }}
          className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto font-medium transition cursor-pointer"
        >
          รีเซ็ตกลับเป็นค่าเฉลี่ย
        </button>
      </div>

      {/* Main Image Inspector with Interactive Pins */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Photo Container */}
        <div className="md:col-span-7 relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 group select-none">
          <div
            className="relative cursor-crosshair"
            onClick={handleImageClick}
          >
            <img
              ref={imageRef}
              src={imageUri}
              alt="Leaf or Soil Inspection"
              className="w-full h-auto max-h-[380px] object-contain mx-auto block"
              crossOrigin="anonymous"
            />

            {/* Default sample pins if available */}
            {samplePoints.map((pt, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRgb(pt.rgb);
                  setClickedCoord({ x: pt.x, y: pt.y });
                }}
                style={{
                  left: `${pt.x * 100}%`,
                  top: `${pt.y * 100}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white transition hover:scale-125"
                title={`จุดที่ ${i + 1}: LCC ระดับ ${pt.lccLevel}`}
              >
                <span
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: pt.hex }}
                >
                  {i + 1}
                </span>
              </button>
            ))}

            {/* Custom Clicked Coordinate Pin */}
            {clickedCoord && (
              <div
                style={{
                  left: `${clickedCoord.x * 100}%`,
                  top: `${clickedCoord.y * 100}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-xl animate-pulse flex items-center justify-center"
                    style={{ backgroundColor: activeHex }}
                  >
                    <Pipette className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap shadow-sm">
                    {activeHex}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 pointer-events-none">
            <Pipette className="w-3.5 h-3.5 text-emerald-400" />
            <span>คลิกบนภาพเพื่อดูค่าสีตำแหน่งนั้น</span>
          </div>
        </div>

        {/* Color Metrics Panel */}
        <div className="md:col-span-5 space-y-3">
          {/* Active Swatch Card */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-xl border-2 border-white shadow-md shrink-0 flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: activeHex }}
            >
              <span className="text-[10px] font-bold text-white/90 drop-shadow-md">
                LCC {activeLcc.level}
              </span>
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {clickedCoord ? 'จุดที่เลือก (Selected Point)' : 'ค่าสีเฉลี่ยรวม (Overall Mean)'}
              </span>
              <p className="text-base font-bold text-stone-900 font-mono">
                {activeHex.toUpperCase()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">R:{activeRgb.r}</span>
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">G:{activeRgb.g}</span>
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">B:{activeRgb.b}</span>
              </div>
            </div>
          </div>

          {/* Color Analysis Values */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">ดัชนีคลอโรฟิลล์ (SPAD)</span>
              <strong className="text-sm text-stone-900 font-bold font-mono">
                ~{activeLcc.spad} SPAD
              </strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">ระดับความอิ่มตัวสี (HSV)</span>
              <strong className="text-sm text-stone-900 font-bold font-mono">
                {activeHsv.h}° / {activeHsv.s}%
              </strong>
            </div>
          </div>

          {/* IRRI Leaf Color Chart (LCC) Visual Scale */}
          {mode === 'leaf' && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <span>แถบเทียบสีใบข้าว LCC (ระดับ 1-6)</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  ตรงกับระดับ {activeLcc.level}
                </span>
              </div>

              {/* 6 Color Segments */}
              <div className="grid grid-cols-6 gap-1 h-9 rounded-xl overflow-hidden p-1 bg-stone-100 border border-stone-200">
                {IRRI_LCC_COLORS.map((item) => {
                  const isCurrent = item.level === activeLcc.level;
                  return (
                    <div
                      key={item.level}
                      style={{ backgroundColor: item.hex }}
                      className={`relative rounded-md flex items-center justify-center text-[11px] font-bold transition-all ${
                        isCurrent
                          ? 'ring-2 ring-emerald-600 scale-105 z-10 text-white shadow-md'
                          : 'text-stone-800 opacity-80'
                      }`}
                      title={`ระดับ ${item.level}: ${item.name}`}
                    >
                      <span>{item.level}</span>
                      {isCurrent && (
                        <div className="absolute -top-1 w-2 h-2 bg-emerald-600 rotate-45" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-[10px] text-stone-400 px-1">
                <span>1 ขาด N รุนแรง</span>
                <span>3 เริ่มวิกฤต</span>
                <span>4 สมบูรณ์</span>
                <span>6 เขียวจัด</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

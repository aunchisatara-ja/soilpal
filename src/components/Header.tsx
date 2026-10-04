import React from 'react';
import { Sprout, HelpCircle, Volume2, Layers } from 'lucide-react';

interface Props {
  mode: 'leaf' | 'soil';
  onModeChange: (m: 'leaf' | 'soil') => void;
  plantStage: string;
  onPlantStageChange: (s: string) => void;
  onOpenGuidelines: () => void;
  onSpeakSummary: () => void;
  isSpeaking: boolean;
}

export const Header: React.FC<Props> = ({
  mode,
  onModeChange,
  plantStage,
  onPlantStageChange,
  onOpenGuidelines,
  onSpeakSummary,
  isSpeaking,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-stone-900 text-lg leading-tight tracking-tight">
                  Soilpal <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase">AI Crop & Soil Doctor</span>
                </h1>
              </div>
              <p className="text-xs text-stone-500">
                ระบบ AI วิเคราะห์สี RGB ใบข้าว ตรวจโรคพืช และค่าสีดินนา
              </p>
            </div>
          </div>

          {/* Controls: Mode Toggle & Utilities */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Segmented Switch */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200/80">
              <button
                type="button"
                onClick={() => onModeChange('leaf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  mode === 'leaf'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🌾</span> วิเคราะห์ใบข้าว
              </button>
              <button
                type="button"
                onClick={() => onModeChange('soil')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  mode === 'soil'
                    ? 'bg-white text-amber-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🪵</span> วิเคราะห์สีดิน
              </button>
            </div>

            {/* Stage Selector (for Leaf mode) */}
            {mode === 'leaf' && (
              <div className="relative">
                <select
                  value={plantStage}
                  onChange={(e) => onPlantStageChange(e.target.value)}
                  className="bg-white border border-stone-200 text-stone-700 text-xs rounded-xl px-2.5 py-1.5 font-medium hover:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 pr-7 appearance-none cursor-pointer"
                  title="เลือกระยะการเจริญเติบโตของข้าว"
                >
                  <option value="ระยะกล้า (1-20 วัน)">🌱 ระยะกล้า (1-20 วัน)</option>
                  <option value="ระยะแตกกอ (20-50 วัน)">🌿 ระยะแตกกอ (20-50 วัน)</option>
                  <option value="ระยะตั้งท้อง/สร้างรวง (50-75 วัน)">🌾 ระยะตั้งท้อง (50-75 วัน)</option>
                  <option value="ระยะออกรวง/ดอกบาน (75-90 วัน)">🌾 ระยะออกรวง (75-90 วัน)</option>
                  <option value="ระยะสุกแก่ (90-120 วัน)">✨ ระยะสุกแก่ (90-120 วัน)</option>
                </select>
                <Layers className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            )}

            {/* Readout voice button */}
            <button
              type="button"
              onClick={onSpeakSummary}
              className={`p-2 rounded-xl border text-xs font-medium transition flex items-center gap-1 ${
                isSpeaking
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
              }`}
              title="อ่านผลวิเคราะห์ออกเสียงภาษาไทย"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden md:inline">อ่านผล</span>
            </button>

            {/* Guidelines button */}
            <button
              type="button"
              onClick={onOpenGuidelines}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium transition flex items-center gap-1"
              title="วิธีถ่ายภาพที่ถูกต้อง"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">วิธีถ่ายรูป</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

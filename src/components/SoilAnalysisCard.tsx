import React from 'react';
import { Layers, Droplets, Sparkles, CheckCircle2, AlertTriangle, Sprout } from 'lucide-react';
import { SoilAnalysis, WaterManagement } from '../types/rice';

interface Props {
  soilAnalysis: SoilAnalysis;
  waterPlan: WaterManagement;
}

export const SoilAnalysisCard: React.FC<Props> = ({ soilAnalysis, waterPlan }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Soil Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              ผลวิเคราะห์สีและชนิดดิน (Soil RGB Classification)
            </span>
            <h3 className="font-bold text-stone-900 text-lg sm:text-xl mt-1">
              {soilAnalysis.soilNameThai}
            </h3>
            <p className="text-xs text-stone-500">
              ลักษณะทางกายภาพ: {soilAnalysis.colorDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100 shrink-0">
          <div>
            <div className="text-[10px] text-stone-400 font-semibold">ค่ากรด-ด่าง (pH)</div>
            <strong className="text-xs sm:text-sm text-stone-800">{soilAnalysis.approximatePh}</strong>
          </div>
        </div>
      </div>

      {/* Soil Metrics Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Fertility Index */}
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> ความอุดมสมบูรณ์ของดิน
            </span>
            <strong className="text-stone-900 font-bold font-mono">
              {soilAnalysis.fertilityScore} / 100
            </strong>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                soilAnalysis.fertilityScore >= 70
                  ? 'bg-emerald-500'
                  : soilAnalysis.fertilityScore >= 45
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${soilAnalysis.fertilityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">
            {soilAnalysis.fertilityScore >= 70
              ? 'ดินมีปริมาณแร่ธาตุและอินทรียวัตถุสูง กักเก็บปุ๋ยได้ดี'
              : 'ควรเพิ่มปุ๋ยอินทรีย์ ปุ๋ยคอก หรือหว่านพืชตระกูลถั่วปรับปรุงดิน'}
          </p>
        </div>

        {/* Water Retention Capacity */}
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" /> ความสามารถในการอุ้มน้ำ
            </span>
            <strong className="text-stone-900 font-bold font-mono">
              {soilAnalysis.waterHoldingCapacity} / 100
            </strong>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                soilAnalysis.waterHoldingCapacity >= 70
                  ? 'bg-sky-500'
                  : soilAnalysis.waterHoldingCapacity >= 45
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${soilAnalysis.waterHoldingCapacity}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">
            {soilAnalysis.waterHoldingCapacity >= 70
              ? 'อุ้มน้ำได้ดีมาก เหมาะกับการขังน้ำและทำเปียกสลับแห้ง'
              : 'ระบายน้ำไวมาก น้ำซึมเร็ว ควรรดน้ำบ่อยขึ้นและแบ่งใส่ปุ๋ย'}
          </p>
        </div>
      </div>

      {/* Recommended Basal Fertilizer & Water Plan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">
            🌾 ปุ๋ยรองพื้นสำหรับดินชนิดนี้ (Basal Fertilizer)
          </span>
          <strong className="text-sm text-stone-900 block font-bold">
            {soilAnalysis.recommendedBasalFertilizer}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-1">
          <span className="text-[11px] font-bold text-sky-800 uppercase block">
            💧 การจัดการน้ำสำหรับดินแปลงนี้
          </span>
          <strong className="text-sm text-stone-900 block font-bold">
            {waterPlan.action} (ระดับแนะนำ: {waterPlan.recommendedDepthCm})
          </strong>
        </div>
      </div>

      {/* Suitable Rice Varieties */}
      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
        <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>พันธุ์ข้าวที่เหมาะสมกับสภาพดินนี้</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {soilAnalysis.suitableRiceVarieties.map((variety, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-medium shadow-2xs"
            >
              ✓ {variety}
            </span>
          ))}
        </div>
      </div>

      {/* Soil Improvement Advice */}
      <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
        <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>แนวทางการปรับปรุงบำรุงดินแปลงนา</span>
        </h4>
        <ul className="space-y-1.5 text-stone-600">
          {soilAnalysis.soilImprovementAdvice.map((advice, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{advice}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

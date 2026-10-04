import React from 'react';
import { Activity, Leaf, ShieldAlert, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { NutrientItem } from '../types/rice';

interface Props {
  healthScore: number;
  nutrients: {
    n: NutrientItem;
    p: NutrientItem;
    k: NutrientItem;
  };
  summaryTitle: string;
  summaryDescription: string;
  chlorophyllIndex: number;
}

export const NutrientDashboard: React.FC<Props> = ({
  healthScore,
  nutrients,
  summaryTitle,
  summaryDescription,
  chlorophyllIndex,
}) => {
  // Status badge styling helper
  const getStatusBadge = (status: NutrientItem['status']) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> พอเหมาะ (Optimal)
          </span>
        );
      case 'slightly_low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> เริ่มลดต่ำ (Caution)
          </span>
        );
      case 'deficient':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
            <ShieldAlert className="w-3 h-3" /> ขาดธาตุอาหาร (Deficient)
          </span>
        );
      case 'excess':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" /> สูงเกินเกณฑ์ (Excess)
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 55) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBarColor = (status: NutrientItem['status']) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500';
      case 'slightly_low':
        return 'bg-amber-500';
      case 'deficient':
        return 'bg-rose-500';
      case 'excess':
        return 'bg-purple-500';
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header with Title & Health Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
            📊 รายงานการตรวจวัดความสมบูรณ์
          </span>
          <h3 className="font-bold text-stone-900 text-base sm:text-lg">
            {summaryTitle || 'ผลการวิเคราะห์ความสมบูรณ์และธาตุอาหาร'}
          </h3>
          <p className="text-xs text-stone-500 max-w-xl mt-0.5">
            {summaryDescription}
          </p>
        </div>

        {/* Circular Health Gauge Card */}
        <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* SVG radial ring */}
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={healthScore >= 70 ? 'text-emerald-500' : healthScore >= 50 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${healthScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-sm font-extrabold ${getScoreColor(healthScore)}`}>
                {healthScore}
              </span>
              <span className="text-[8px] text-stone-400 font-semibold">%</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-stone-500">ดัชนีสุขภาพต้นข้าว</div>
            <div className="text-xs font-bold text-stone-800">
              {healthScore >= 75 ? '🌱 สมบูรณ์ดี' : healthScore >= 50 ? '⚠️ ควรดูแลบำรุง' : '🚨 วิกฤต/ต้องแก้ไข'}
            </div>
            <div className="text-[10px] text-stone-400">
              SPAD ~{chlorophyllIndex}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Nutrients (N - P - K) Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Nitrogen (N) */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center border border-emerald-200">
                N
              </span>
              <div>
                <h4 className="text-xs font-bold text-stone-800">ไนโตรเจน</h4>
                <span className="text-[10px] text-stone-400 font-mono">การสร้างใบและแตกกอ</span>
              </div>
            </div>
            {getStatusBadge(nutrients.n.status)}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>ความเข้มข้น</span>
              <span className="font-bold text-stone-800">{nutrients.n.score}/100</span>
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(nutrients.n.status)}`}
                style={{ width: `${Math.min(100, Math.max(10, nutrients.n.score))}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-snug">
            {nutrients.n.interpretation}
          </p>
        </div>

        {/* Phosphorus (P) */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center border border-amber-200">
                P
              </span>
              <div>
                <h4 className="text-xs font-bold text-stone-800">ฟอสฟอรัส</h4>
                <span className="text-[10px] text-stone-400 font-mono">ระบบรากและตาดอก</span>
              </div>
            </div>
            {getStatusBadge(nutrients.p.status)}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>ความเข้มข้น</span>
              <span className="font-bold text-stone-800">{nutrients.p.score}/100</span>
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(nutrients.p.status)}`}
                style={{ width: `${Math.min(100, Math.max(10, nutrients.p.score))}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-snug">
            {nutrients.p.interpretation}
          </p>
        </div>

        {/* Potassium (K) */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center border border-indigo-200">
                K
              </span>
              <div>
                <h4 className="text-xs font-bold text-stone-800">โพแทสเซียม</h4>
                <span className="text-[10px] text-stone-400 font-mono">ความแข็งแรงและเมล็ด</span>
              </div>
            </div>
            {getStatusBadge(nutrients.k.status)}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>ความเข้มข้น</span>
              <span className="font-bold text-stone-800">{nutrients.k.score}/100</span>
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(nutrients.k.status)}`}
                style={{ width: `${Math.min(100, Math.max(10, nutrients.k.score))}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-snug">
            {nutrients.k.interpretation}
          </p>
        </div>
      </div>
    </section>
  );
};

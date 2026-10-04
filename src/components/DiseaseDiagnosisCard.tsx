import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldCheck,
  Droplet,
  Beaker,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
  ArrowRightLeft,
} from 'lucide-react';
import { DiseaseDiagnosis, FertilizerPlan, WaterManagement } from '../types/rice';
import { RICE_DISEASES_DB } from '../data/diseasesData';

interface Props {
  userImageUri: string;
  diagnosis: DiseaseDiagnosis;
  fertilizerPlan: FertilizerPlan;
  waterPlan: WaterManagement;
}

export const DiseaseDiagnosisCard: React.FC<Props> = ({
  userImageUri,
  diagnosis,
  fertilizerPlan,
  waterPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'fertilizer' | 'water' | 'bio' | 'chemical'>('fertilizer');
  const [selectedCompareKey, setSelectedCompareKey] = useState<string>(diagnosis.id in RICE_DISEASES_DB ? diagnosis.id : 'blast');

  const compareDisease = RICE_DISEASES_DB[selectedCompareKey] || diagnosis;
  const isHealthy = diagnosis.id === 'healthy';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-5">
      {/* Diagnosis Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isHealthy
                ? 'bg-emerald-100 text-emerald-800'
                : diagnosis.severity === 'ระดับรุนแรง (ระบาด)'
                ? 'bg-rose-100 text-rose-800 animate-pulse'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isHealthy ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <AlertOctagon className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                ผลวินิจฉัยโรคพืช
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isHealthy
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {diagnosis.severity}
              </span>
            </div>
            <h3 className="font-bold text-stone-900 text-lg sm:text-xl mt-0.5">
              {diagnosis.nameThai}
            </h3>
            <p className="text-xs text-stone-500 italic">
              {diagnosis.nameEng} ({diagnosis.scientificName}) • สาเหตุ: {diagnosis.pathogenType}
            </p>
          </div>
        </div>

        {/* Confidence Percentage */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between bg-stone-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-stone-100">
          <span className="text-[11px] text-stone-500 font-medium">ความแม่นยำ AI</span>
          <span className="text-lg font-extrabold text-emerald-700 font-mono">
            {diagnosis.confidence}%
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
              เปรียบเทียบภาพใบข้าวของคุณ กับภาพอ้างอิงโรคจากฐานข้อมูล
            </h4>
          </div>

          {/* Compare Selector dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400 hidden sm:inline">เปรียบเทียบกับ:</span>
            <select
              value={selectedCompareKey}
              onChange={(e) => setSelectedCompareKey(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg px-2 py-1 font-medium hover:border-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="healthy">ต้นข้าวสมบูรณ์</option>
              <option value="blast">โรคไหม้ข้าว (Blast)</option>
              <option value="bacterial_blight">โรคขอบใบแห้ง (BLB)</option>
              <option value="brown_spot">โรคใบจุดสีน้ำตาล</option>
              <option value="nitrogen_deficiency">อาการขาดไนโตรเจน</option>
              <option value="potassium_deficiency">อาการขาดโพแทสเซียม</option>
              <option value="sheath_blight">โรคกาบใบแห้ง</option>
            </select>
          </div>
        </div>

        {/* 2-Column Visual Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Left: User's Uploaded Leaf */}
          <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-900 relative">
            <div className="aspect-4/3 flex items-center justify-center">
              <img
                src={userImageUri}
                alt="ภาพที่ถ่ายจากแปลงนาของคุณ"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
              📍 ภาพจากแปลงนาของคุณ
            </div>
            <div className="p-2.5 bg-stone-950/90 text-white text-xs border-t border-stone-800">
              <span className="text-stone-400 block text-[10px]">การวินิจฉัย:</span>
              <p className="line-clamp-2 text-stone-200">{diagnosis.comparisonAnalysis}</p>
            </div>
          </div>

          {/* Right: Online Reference Sample */}
          <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-900 relative">
            <div className="aspect-4/3 flex items-center justify-center">
              <img
                src={compareDisease.sampleImageUrl}
                alt={compareDisease.nameThai}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute top-2 left-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-md">
              🔬 ภาพอ้างอิง: {compareDisease.nameThai}
            </div>
            <div className="p-2.5 bg-stone-950/90 text-white text-xs border-t border-stone-800">
              <span className="text-stone-400 block text-[10px]">จุดสังเกตเฉพาะของโรค:</span>
              <ul className="text-[11px] text-stone-300 space-y-0.5">
                {compareDisease.keySymptoms.slice(0, 2).map((symptom, idx) => (
                  <li key={idx} className="line-clamp-1">• {symptom}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Plan & Solutions Tabs */}
      <div className="pt-2">
        <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <span>🛠️</span>
          <span>แนวทางการแก้ปัญหาและการดูแลเบื้องต้น</span>
        </h4>

        {/* Tab Headers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('fertilizer')}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              activeTab === 'fertilizer'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <span>💊</span> สูตรปุ๋ยที่ควรใช้
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('water')}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              activeTab === 'water'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" /> การจัดการน้ำ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bio')}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              activeTab === 'bio'
                ? 'bg-green-700 text-white border-green-700 shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <span>🌿</span> ชีวภัณฑ์/อินทรีย์
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chemical')}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              activeTab === 'chemical'
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" /> สารเคมีมาตรฐาน
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5">
          {/* Fertilizer Tab */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] text-stone-400 block font-semibold">สูตรปุ๋ยเคมีแนะนำ (Primary Formula)</span>
                  <strong className="text-base text-emerald-800 font-extrabold block mt-0.5">
                    {fertilizerPlan.recommendedFormula}
                  </strong>
                  <p className="text-stone-600 mt-1">
                    อัตราใส่: <strong>{fertilizerPlan.applicationRate}</strong>
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] text-stone-400 block font-semibold">สูตรเสริม / สูตรทางใบ (Secondary)</span>
                  <strong className="text-sm text-stone-800 font-bold block mt-0.5">
                    {fertilizerPlan.secondaryFormula || 'ปุ๋ยเกล็ดสูตรเสมอหรือสูตรเร่งราก'}
                  </strong>
                  <p className="text-stone-600 mt-1">
                    {fertilizerPlan.organicAlternative}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-stone-800">
                  <Info className="w-4 h-4 text-emerald-600" /> วิธีการและช่วงเวลาใส่ปุ๋ยที่ถูกต้อง
                </div>
                <p className="text-stone-700 leading-relaxed">
                  {fertilizerPlan.applicationMethod}
                </p>
                {fertilizerPlan.warningOrTips && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg flex items-start gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{fertilizerPlan.warningOrTips}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Water Management Tab */}
          {activeTab === 'water' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-stone-400 font-semibold block">คำแนะนำหลักเรื่องน้ำ</span>
                  <strong className="text-base text-sky-800 font-bold block mt-0.5">
                    {waterPlan.action}
                  </strong>
                  <p className="text-stone-600 mt-1">
                    ระดับน้ำที่เหมาะสมในแปลง: <strong>{waterPlan.recommendedDepthCm}</strong>
                  </p>
                </div>

                <div className="px-3 py-2 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-center shrink-0">
                  <span className="text-[10px] block text-sky-600">สถานะระดับน้ำ</span>
                  <strong className="text-sm font-bold">{waterPlan.recommendedDepthCm}</strong>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2">
                <h5 className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-sky-600" />
                  <span>ต้องรดน้ำหรือปล่อยน้ำเพิ่มไหม?</span>
                </h5>
                <p className="text-stone-700 leading-relaxed">
                  {waterPlan.details}
                </p>
                <div className="p-2.5 rounded-lg bg-stone-100 text-stone-600 mt-2">
                  <strong className="font-semibold text-stone-800">คำแนะนำตามระยะข้าว: </strong>
                  {waterPlan.stageGuidance}
                </div>
              </div>
            </div>
          )}

          {/* Bio / Organic Tab */}
          {activeTab === 'bio' && (
            <div className="space-y-3 text-xs animate-in fade-in">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <h5 className="font-bold text-green-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>สารชีวภัณฑ์และการจัดการปลอดภัยไร้สารเคมี</span>
                </h5>
                <ul className="space-y-2 text-stone-700">
                  {diagnosis.treatment.bioMethod.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-green-50/60 p-2.5 rounded-lg border border-green-100">
                      <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">การจัดการดูแลสภาพแปลงนา:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  {diagnosis.treatment.fieldManagement.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Chemical Tab */}
          {activeTab === 'chemical' && (
            <div className="space-y-3 text-xs animate-in fade-in">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <h5 className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Beaker className="w-4 h-4 text-purple-600" />
                  <span>สารเคมีควบคุมโรคพืชที่ได้รับรองจากกรมวิชาการเกษตร</span>
                </h5>
                <p className="text-[11px] text-stone-500">
                  * ควรใช้เมื่อมีการระบาดเกินเกณฑ์เศรษฐกิจ และสวมใส่อุปกรณ์ป้องกันทุกครั้ง
                </p>
                <ul className="space-y-2 text-stone-700 mt-2">
                  {diagnosis.treatment.chemicalMethod.map((chem, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
                      <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{chem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>ข้อควรระวัง:</strong> งดการฉีดพ่นสารเคมีช่วงข้าวออกดอกบาน (ช่วง 08:30 - 11:30 น.) เพื่อไม่ให้กระทบการผสมเกสรของรวงข้าว และหยุดพ่นก่อนเก็บเกี่ยวอย่างน้อย 14 วัน
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

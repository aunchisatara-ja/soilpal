import React from 'react';
import { X, CheckCircle2, AlertTriangle, Sun, Camera, Eye, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'leaf' | 'soil';
}

export const PhotoGuidelineModal: React.FC<Props> = ({ isOpen, onClose, mode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">
                {mode === 'leaf' ? 'คำแนะนำการถ่ายภาพใบข้าว' : 'คำแนะนำการถ่ายภาพดินนา'}
              </h3>
              <p className="text-xs text-stone-500">เพื่อให้ AI และค่าสี RGB วิเคราะห์ได้แม่นยำที่สุด</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {mode === 'leaf' ? (
            <>
              {/* Golden Rule */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="font-semibold block text-sm mb-1">กฎทองของการตรวจใบข้าว (IRRI Standard):</strong>
                  ควรเลือกถ่ายที่ <strong>"ใบลำดับที่ 3 จากยอด"</strong> (ใบบนสุดที่คลี่กางเต็มที่) เพราะเป็นใบที่สะท้อนระดับไนโตรเจนและธาตุอาหารของต้นข้าวได้สมจริงที่สุด
                </div>
              </div>

              {/* Do & Don't */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> สิ่งที่ควรทำ (แนะนำ)
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>ถ่ายในแสงธรรมชาติ เวลา <strong>09:00 - 11:00 น.</strong></li>
                    <li>ใช้เงาตัวเองบังแสงแดดจ้า เพื่อให้สีเขียวไม่สะท้อนแสงหลอกตา</li>
                    <li>ระยะห่าง <strong>15 - 20 ซม.</strong> ให้แผ่นใบอยู่กึ่งกลางภาพ</li>
                    <li>หากเป็นไปได้ ใช้นิ้วหรือฝ่ามือประคองรองหลังใบเพื่อให้กล้องโฟกัสง่ายขึ้น</li>
                  </ul>
                </div>

                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> สิ่งที่ไม่ควรทำ
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>อย่าถ่ายย้อนแสงอาทิตย์โดยตรง</li>
                    <li>อย่าเปิดแฟลชมือถือ เพราะแฟลชจะทำให้ค่า RGB ขาวหลอก</li>
                    <li>อย่าถ่ายใบที่เหี่ยวแห้งติดโคนกอจนเน่าดำ (ให้ถ่ายใบที่มีรอยแผลที่ยังสด)</li>
                    <li>อย่าถ่ายในขณะที่มีหยดน้ำฝนหรือน้ำค้างเกาะหนาแน่น</li>
                  </ul>
                </div>
              </div>

              {/* Visual diagram representation */}
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 text-center">
                <p className="text-xs text-stone-600 font-medium mb-2">ตำแหน่งใบที่ถูกต้องบนต้นข้าว</p>
                <div className="flex items-center justify-center gap-6 py-2">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-stone-200 rounded-lg mx-auto flex items-center justify-center border-2 border-stone-300 opacity-60 text-stone-500 text-[10px]">
                      ใบยอดที่ 1-2<br/>(ยังอ่อนเกินไป)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-xl mx-auto flex items-center justify-center border-2 border-emerald-500 shadow-md text-emerald-900 font-bold text-xs">
                      ⭐ ใบที่ 3 จากยอด<br/>(เหมาะที่สุด)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-stone-200 rounded-lg mx-auto flex items-center justify-center border-2 border-stone-300 opacity-60 text-stone-500 text-[10px]">
                      ใบล่างสุด<br/>(แก่เกินไป)
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Soil Guidelines */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Sun className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="font-semibold block text-sm mb-1">เทคนิคการถ่ายภาพดินนา:</strong>
                  สีดินที่แท้จริงจะบอกปริมาณอินทรียวัตถุ (สีดำ), สนิมเหล็ก/ดินเปรี้ยว (สีแดงส้ม), หรือดินทราย (สีจาง) ได้แม่นยำเมื่อถ่ายที่ผิวดินเนื้อแท้
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> สิ่งที่ควรทำ
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>กวาดเศษฟางแห้งหรือเศษวัชพืชผิวดินออกประมาณ 1 คืบ</li>
                    <li>ถ่ายดินที่มีความชื้นหมาดๆ พอเหมาะ</li>
                    <li>ถ่ายในมุมมองตั้งฉาก 90 องศาลงที่ผิวดิน ระยะประมาณ 30-40 ซม.</li>
                  </ul>
                </div>

                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> สิ่งที่ไม่ควรทำ
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>อย่าถ่ายผิวดินที่มีน้ำท่วมขังสูงจนเกิดแสงสะท้อนผิวน้ำ</li>
                    <li>อย่าถ่ายบริเวณที่เพิ่งเผาตอซังจนมีขี้เถ้าสีเทากลบผิวดิน</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs shadow-sm transition"
          >
            เข้าใจแล้ว พร้อมถ่ายภาพ
          </button>
        </div>
      </div>
    </div>
  );
};

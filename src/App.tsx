import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CaptureSection } from './components/CaptureSection';
import { ImageColorInspector } from './components/ImageColorInspector';
import { NutrientDashboard } from './components/NutrientDashboard';
import { DiseaseDiagnosisCard } from './components/DiseaseDiagnosisCard';
import { SoilAnalysisCard } from './components/SoilAnalysisCard';
import { FieldDoctorChat } from './components/FieldDoctorChat';
import { PhotoGuidelineModal } from './components/PhotoGuidelineModal';
import { AnalysisResult, RGBColor, SamplePoint } from './types/rice';
import { PRESET_SAMPLES, PresetSample } from './data/samplePhotos';
import {
  extractImageRGB,
  matchLCCLevel,
  analyzeLeafNutrients,
  classifySoilByRGB,
  rgbToHex,
} from './utils/colorAnalysis';
import { RICE_DISEASES_DB, SOIL_DATABASE } from './data/diseasesData';
import { Loader2, Sparkles, AlertCircle, Share2, Check, Download } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'leaf' | 'soil'>('leaf');
  const [plantStage, setPlantStage] = useState('ระยะแตกกอ (20-50 วัน)');
  const [currentImageUri, setCurrentImageUri] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Process image analysis with both Canvas RGB extraction and Server AI (Gemini)
  const processImage = useCallback(
    async (imageSrc: string, sampleInfo?: PresetSample, targetMode?: 'leaf' | 'soil') => {
      const activeMode = targetMode || mode;
      setIsLoading(true);
      setCurrentImageUri(imageSrc);

      try {
        // Step 1: Client-side pixel scanning with HTML5 Canvas
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        const { averageRgb, hex, samplePoints } = await extractImageRGB(img);
        const lccMatch = matchLCCLevel(averageRgb);
        const nutrientsEstimate = analyzeLeafNutrients(averageRgb, lccMatch.level);
        const soilEstimate = classifySoilByRGB(averageRgb);

        // Convert any image source (including SVG data URIs) to clean JPEG Base64 for Gemini Vision API
        let cleanJpegBase64 = imageSrc;
        try {
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = Math.min(img.naturalWidth || 600, 600);
          exportCanvas.height = Math.min(img.naturalHeight || 450, 450);
          const exportCtx = exportCanvas.getContext('2d');
          if (exportCtx) {
            exportCtx.fillStyle = '#ffffff';
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            exportCtx.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height);
            cleanJpegBase64 = exportCanvas.toDataURL('image/jpeg', 0.88);
          }
        } catch (canvasErr) {
          console.warn('Canvas JPEG conversion note:', canvasErr);
        }

        // Step 2: Try Server Gemini 3.8 Flash Vision Endpoint
        let aiResultData: any = null;
        try {
          const res = await fetch('/api/analyze-rice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: cleanJpegBase64,
              mode: activeMode,
              rgbEstimate: averageRgb,
              plantStage,
            }),
          });
          const json = await res.json();
          if (json.success && json.data) {
            aiResultData = json.data;
          }
        } catch (serverErr) {
          console.warn('Server AI API error, utilizing agronomic rule engine:', serverErr);
        }

        // Step 3: Combine Server AI data or Heuristic Agronomic Engine
        let finalDiagnosis = RICE_DISEASES_DB.healthy;
        if (sampleInfo && sampleInfo.defaultDiagnosisId in RICE_DISEASES_DB) {
          finalDiagnosis = RICE_DISEASES_DB[sampleInfo.defaultDiagnosisId];
        } else if (aiResultData?.primaryDisease) {
          const matchedDb = RICE_DISEASES_DB[aiResultData.primaryDisease.id];
          finalDiagnosis = {
            ...aiResultData.primaryDisease,
            sampleImageUrl: matchedDb?.sampleImageUrl || RICE_DISEASES_DB.healthy.sampleImageUrl,
          };
        } else if (activeMode === 'leaf') {
          if (lccMatch.level <= 2) {
            finalDiagnosis = RICE_DISEASES_DB.nitrogen_deficiency;
          } else if (averageRgb.r > averageRgb.g * 0.85) {
            finalDiagnosis = RICE_DISEASES_DB.potassium_deficiency;
          } else {
            finalDiagnosis = RICE_DISEASES_DB.healthy;
          }
        }

        // Water management logic
        const waterPlan = aiResultData?.waterPlan || {
          action:
            activeMode === 'leaf' && finalDiagnosis.id === 'blast'
              ? 'รักษาระดับน้ำปกติ'
              : 'แกล้งข้าว (ปล่อยแห้งสลับเปียก)',
          recommendedDepthCm: '3-5 ซม.',
          details:
            activeMode === 'leaf' && finalDiagnosis.id === 'blast'
              ? 'รักษาระดับน้ำที่ 5-7 ซม. ในช่วงพบโรคไหม้ เพื่อป้องกันสปอร์ฟุ้งกระจาย และงดการระบายน้ำไปยังแปลงข้างเคียง'
              : 'ใช้วิธีเปียกสลับแห้ง แกล้งข้าว (AWD) ปล่อยน้ำลดจนผิวดินแตกลายงาเล็กน้อยเพื่อให้อากาศซึมลงราก แล้วจึงสูบน้ำเข้าสูง 3-5 ซม.',
          stageGuidance: 'เหมาะกับระยะแตกกอจนถึงก่อนสร้างรวงอ่อน',
        };

        // Fertilizer plan logic
        const fertilizerPlan = aiResultData?.fertilizerPlan || {
          recommendedFormula:
            finalDiagnosis.id === 'blast'
              ? 'งดปุ๋ย 46-0-0 เด็ดขาด! ให้ใช้ 0-0-60 ร่วมกับ 16-20-0'
              : finalDiagnosis.id === 'potassium_deficiency'
              ? 'ปุ๋ยโพแทสเซียมคลอไรด์ 0-0-60 (8-12 กก./ไร่) ร่วมกับ 16-20-0 หรือ 16-16-8'
              : lccMatch.level <= 2
              ? 'ปุ๋ยยูเรีย 46-0-0 (เร่งเขียว) + 16-20-0'
              : 'ปุ๋ยสูตร 16-20-0 (นาดินเหนียว) หรือ 16-16-8 (นาดินทราย)',
          secondaryFormula: 'ปุ๋ยโพแทสเซียม 0-0-60 เสริมความแกร่งของลำต้นและลดอาการใบแก่แห้ง',
          applicationRate: finalDiagnosis.id === 'potassium_deficiency' ? '8-12 กก./ไร่ (ปุ๋ย 0-0-60)' : '15-20 กก./ไร่',
          applicationMethod: 'หว่านช่วงเช้าหลังน้ำค้างบนใบแห้ง ระดับน้ำในนา 3-5 ซม.',
          organicAlternative: 'ปุ๋ยคอกหมักร่วมกับขี้เถ้าแกลบเผาสมบูรณ์ (มีโพแทสเซียมอินทรีย์สูง)',
          warningOrTips:
            finalDiagnosis.id === 'blast'
              ? 'คำเตือน: หากมีโรคไหม้ระบาด ห้ามใส่ปุ๋ยไนโตรเจนเด็ดขาด เพราะจะทำให้ใบอวบน้ำและเชื้อราลุกลามเร็วขึ้น'
              : finalDiagnosis.id === 'potassium_deficiency'
              ? 'คำแนะนำ: ใบแก่แห้ง และทั้งต้นแคระแกร็น ควรรีบเสริมโพแทสเซียม 0-0-60 เพื่อฟื้นฟูระบบลำต้นและป้องกันรวงลีบ'
              : 'ไม่ควรหว่านปุ๋ยขณะมีฝนตกชุกหนักเพื่อป้องกันปุ๋ยถูกชะล้าง',
        };

        const finalResult: AnalysisResult = {
          id: 'analysis_' + Date.now(),
          mode: activeMode,
          timestamp: new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          imageUri: imageSrc,
          rgbAverage: averageRgb,
          rgbHex: hex,
          lccLevel: aiResultData?.lccLevel || lccMatch.level,
          chlorophyllIndex: aiResultData?.chlorophyllIndex || lccMatch.spad,
          healthScore: aiResultData?.healthScore || nutrientsEstimate.healthScore,
          summaryTitle:
            aiResultData?.summaryTitle ||
            (activeMode === 'leaf'
              ? `ตรวจพบ: ${finalDiagnosis.nameThai} (ความสมบูรณ์ ${nutrientsEstimate.healthScore}%)`
              : `ตรวจพบ: ${soilEstimate.soilNameThai}`),
          summaryDescription:
            aiResultData?.summaryDescription ||
            (activeMode === 'leaf'
              ? `วิเคราะห์จากค่าสี RGB(${averageRgb.r}, ${averageRgb.g}, ${averageRgb.b}) แถบสีใบข้าว LCC ระดับ ${lccMatch.level} สภาพต้นข้าวอยู่ในเกณฑ์${finalDiagnosis.severity}`
              : `ดินมีสี ${soilEstimate.colorDescription} ค่าความอุดมสมบูรณ์ ${soilEstimate.fertilityScore}% เหมาะสำหรับปลูกข้าว`),
          nutrients: aiResultData?.nutrients || {
            n: nutrientsEstimate.n,
            p: nutrientsEstimate.p,
            k: nutrientsEstimate.k,
          },
          primaryDisease: finalDiagnosis,
          fertilizerPlan,
          waterPlan,
          soilAnalysis: aiResultData?.soilAnalysis || soilEstimate,
          samplePoints,
        };

        setAnalysisResult(finalResult);
      } catch (err) {
        console.error('Processing error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [mode, plantStage]
  );

  // Initialize with a realistic preset on first mount
  useEffect(() => {
    const defaultSample = PRESET_SAMPLES[0]; // Healthy Leaf
    processImage(defaultSample.imageUri, defaultSample, 'leaf');
  }, []);

  // Handle switching between leaf and soil mode
  const handleModeChange = (newMode: 'leaf' | 'soil') => {
    setMode(newMode);
    const firstPreset = PRESET_SAMPLES.find((p) => p.category === newMode);
    if (firstPreset) {
      processImage(firstPreset.imageUri, firstPreset, newMode);
    }
  };

  // Text-To-Speech (TTS) Voice Readout in Thai
  const speakSummary = () => {
    if (!analysisResult) return;
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak =
      mode === 'leaf'
        ? `ผลการวิเคราะห์ใบข้าว: ตรวจพบ ${analysisResult.primaryDisease.nameThai} ระดับความรุนแรง ${analysisResult.primaryDisease.severity} คะแนนความสมบูรณ์ ${analysisResult.healthScore} เปอร์เซ็นต์ แนะนำสูตรปุ๋ย ${analysisResult.fertilizerPlan.recommendedFormula} และการจัดการน้ำคือ ${analysisResult.waterPlan.action}`
        : `ผลการวิเคราะห์สีดิน: ตรวจพบ ${analysisResult.soilAnalysis?.soilNameThai} ความอุดมสมบูรณ์ ${analysisResult.soilAnalysis?.fertilityScore} เปอร์เซ็นต์ ปุ๋ยรองพื้นแนะนำคือ ${analysisResult.soilAnalysis?.recommendedBasalFertilizer}`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'th-TH';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Share or copy summary
  const handleShare = () => {
    if (!analysisResult) return;
    const text = `🌾 ผลตรวจ Soilpal AI\nตรวจพบ: ${analysisResult.primaryDisease.nameThai}\nคะแนนความสมบูรณ์: ${analysisResult.healthScore}%\nปุ๋ยที่แนะนำ: ${analysisResult.fertilizerPlan.recommendedFormula}\nการจัดการน้ำ: ${analysisResult.waterPlan.action}\nตรวจเมื่อ: ${analysisResult.timestamp}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16">
      {/* Top Navigation */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        plantStage={plantStage}
        onPlantStageChange={(stage) => {
          setPlantStage(stage);
          if (currentImageUri) {
            processImage(currentImageUri, undefined, mode);
          }
        }}
        onOpenGuidelines={() => setGuidelinesOpen(true)}
        onSpeakSummary={speakSummary}
        isSpeaking={isSpeaking}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Photo Upload & Presets Section */}
        <CaptureSection
          mode={mode}
          onImageSelected={(imgData, sample) => processImage(imgData, sample, mode)}
          isLoading={isLoading}
          onOpenGuidelines={() => setGuidelinesOpen(true)}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <div>
              <p className="text-sm font-bold text-stone-800">
                AI กำลังตรวจวัดค่าสี RGB สแกนคลอโรฟิลล์ และวินิจฉัยโรคพืช...
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                ประมวลผลตามมาตรฐานแผ่นเทียบสี LCC (IRRI) และคำแนะนำกรมการข้าว
              </p>
            </div>
          </div>
        )}

        {/* Results Sections */}
        {!isLoading && analysisResult && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Quick Share / Record Banner */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                <span>🕒</span> วันที่ตรวจ: <strong className="text-stone-700">{analysisResult.timestamp}</strong>
              </span>

              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">คัดลอกรายงานแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>แชร์รายงานสรุป</span>
                  </>
                )}
              </button>
            </div>

            {/* 1. Interactive Image & RGB Color Inspector */}
            <ImageColorInspector
              imageUri={analysisResult.imageUri}
              averageRgb={analysisResult.rgbAverage}
              samplePoints={analysisResult.samplePoints}
              currentLcc={analysisResult.lccLevel}
              mode={mode}
            />

            {/* 2. Nutrient Deficiency Dashboard & Health Score Gauge */}
            {mode === 'leaf' && (
              <NutrientDashboard
                healthScore={analysisResult.healthScore}
                nutrients={analysisResult.nutrients}
                summaryTitle={analysisResult.summaryTitle}
                summaryDescription={analysisResult.summaryDescription}
                chlorophyllIndex={analysisResult.chlorophyllIndex}
              />
            )}

            {/* 3. Disease Diagnosis Card with Online Reference Comparison */}
            {mode === 'leaf' && (
              <DiseaseDiagnosisCard
                userImageUri={analysisResult.imageUri}
                diagnosis={analysisResult.primaryDisease}
                fertilizerPlan={analysisResult.fertilizerPlan}
                waterPlan={analysisResult.waterPlan}
              />
            )}

            {/* 4. Soil Analysis Card (if mode is soil) */}
            {mode === 'soil' && analysisResult.soilAnalysis && (
              <SoilAnalysisCard
                soilAnalysis={analysisResult.soilAnalysis}
                waterPlan={analysisResult.waterPlan}
              />
            )}

            {/* 5. Field Doctor Interactive Q&A Assistant */}
            <FieldDoctorChat currentAnalysis={analysisResult} />
          </div>
        )}
      </main>

      {/* Photography Guideline Modal */}
      <PhotoGuidelineModal
        isOpen={guidelinesOpen}
        onClose={() => setGuidelinesOpen(false)}
        mode={mode}
      />
    </div>
  );
}

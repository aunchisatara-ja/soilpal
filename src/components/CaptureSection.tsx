import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, AlertCircle, FlipHorizontal } from 'lucide-react';
import { PRESET_SAMPLES, PresetSample } from '../data/samplePhotos';

interface Props {
  mode: 'leaf' | 'soil';
  onImageSelected: (base64OrUrl: string, sampleInfo?: PresetSample) => void;
  isLoading: boolean;
  onOpenGuidelines: () => void;
}

export const CaptureSection: React.FC<Props> = ({
  mode,
  onImageSelected,
  isLoading,
  onOpenGuidelines,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Filter presets based on mode
  const currentPresets = PRESET_SAMPLES.filter((p) => p.category === mode);

  // Open live webcam / phone camera
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera open error:', err);
      setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้กล้องหรือใช้วิธีอัปโหลดรูปภาพแทน');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const flipCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Capture frame from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.92);
      stopCamera();
      onImageSelected(dataUri);
    }
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onImageSelected(result);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>📷</span>
            <span>{mode === 'leaf' ? 'ถ่ายภาพหรืออัปโหลดภาพใบข้าว' : 'ถ่ายภาพหรืออัปโหลดภาพผิวดิน'}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            รองรับทั้งถ่ายสดจากมือถือ อัปโหลดจากแกลเลอรี หรือคลิกเลือกภาพตัวอย่าง
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenGuidelines}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>แนะนำสิ่งที่ควรถ่าย</span>
        </button>
      </div>

      {/* Action Buttons: Camera & Upload */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => startCamera('environment')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-medium text-sm shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          <Camera className="w-5 h-5" />
          <span>เปิดกล้องถ่ายภาพ</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium text-sm border border-stone-200 transition disabled:opacity-50 cursor-pointer"
        >
          <Upload className="w-5 h-5 text-stone-600" />
          <span>เลือกรูปจากเครื่อง/แกลเลอรี</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Preset Test Photos Row */}
      <div className="pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
            <span>✨</span> ภาพตัวอย่างสำหรับทดสอบระบบทันที:
          </span>
          <span className="text-[11px] text-stone-400">คลิกที่ภาพเพื่อวิเคราะห์</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {currentPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onImageSelected(preset.imageUri, preset)}
              disabled={isLoading}
              className="group text-left p-2 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition bg-stone-50 flex flex-col items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <div className="w-full aspect-4/3 rounded-lg overflow-hidden bg-stone-200 relative border border-stone-200/60 shadow-xs">
                <img
                  src={preset.imageUri}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span
                  className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                  style={{
                    backgroundColor: `rgb(${preset.hintRgb.r}, ${preset.hintRgb.g}, ${preset.hintRgb.b})`,
                  }}
                  title={`RGB(${preset.hintRgb.r},${preset.hintRgb.g},${preset.hintRgb.b})`}
                />
              </div>
              <div className="w-full text-center">
                <p className="text-xs font-bold text-stone-800 line-clamp-1 group-hover:text-emerald-800">
                  {preset.title}
                </p>
                <p className="text-[10px] text-stone-500 line-clamp-1">{preset.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Camera Stream Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-stone-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-800 relative">
            {/* Camera Header */}
            <div className="p-4 flex items-center justify-between border-b border-stone-800">
              <span className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                กล้องตรวจ {mode === 'leaf' ? 'ใบข้าว' : 'ดินนา'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={flipCamera}
                  className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
                  title="สลับกล้องหน้า/หลัง"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-1 text-xs rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
                >
                  ยกเลิก
                </button>
              </div>
            </div>

            {/* Video Viewport with Targeting Overlay */}
            <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Leaf alignment frame guideline */}
              <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                <div className="text-[11px] bg-black/60 px-2.5 py-1 rounded-full text-emerald-300 font-medium">
                  {mode === 'leaf' ? 'วางใบข้าวให้อยู่ในกรอบนี้' : 'จัดผิวดินให้อยู่ในกรอบ'}
                </div>

                {/* Crosshairs */}
                <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 absolute top-4 left-4" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 absolute top-4 right-4" />
                <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 absolute bottom-4 left-4" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 absolute bottom-4 right-4" />

                <div className="text-[11px] bg-black/60 px-2.5 py-1 rounded-full text-stone-300">
                  ระยะ 15-20 ซม. หลีกเลี่ยงแสงสะท้อน
                </div>
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center p-6 text-center text-rose-300">
                  <AlertCircle className="w-10 h-10 mb-2" />
                  <p className="text-sm">{cameraError}</p>
                </div>
              )}
            </div>

            {/* Shutter Button Bar */}
            <div className="p-5 bg-stone-950 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg bg-emerald-500 hover:bg-emerald-400 cursor-pointer disabled:opacity-50"
                title="กดถ่ายภาพ"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-emerald-800">
                  <Camera className="w-7 h-7" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

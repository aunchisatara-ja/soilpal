import { RGBColor, HSVColor, NutrientItem, SoilAnalysis } from '../types/rice';
import { SOIL_DATABASE } from '../data/diseasesData';

export const IRRI_LCC_COLORS = [
  { level: 1, name: 'เหลืองซีดจัด (ขาดไนโตรเจนรุนแรง)', hex: '#e2e77b', rgb: { r: 226, g: 231, b: 123 }, spad: 20 },
  { level: 2, name: 'เขียวอ่อนอมเหลือง (ขาดไนโตรเจน)', hex: '#b5cc51', rgb: { r: 181, g: 204, b: 81 }, spad: 28 },
  { level: 3, name: 'เขียวตองอ่อน (ระดับเริ่มวิกฤต/ต้องใส่ปุ๋ย)', hex: '#7ea83c', rgb: { r: 126, g: 168, b: 60 }, spad: 34 },
  { level: 4, name: 'เขียวมาตรฐาน (สมบูรณ์พอเหมาะ)', hex: '#4e822d', rgb: { r: 78, g: 130, b: 45 }, spad: 38 },
  { level: 5, name: 'เขียวเข้ม (สมบูรณ์ดีมาก)', hex: '#316323', rgb: { r: 49, g: 99, b: 35 }, spad: 42 },
  { level: 6, name: 'เขียวเข้มจัด (อาจมีไนโตรเจนเกิน เสี่ยงโรค)', hex: '#1d4817', rgb: { r: 29, g: 72, b: 23 }, spad: 46 }
];

export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export function calculateDistance(c1: RGBColor, c2: RGBColor): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) * 0.3 +
    Math.pow(c1.g - c2.g, 2) * 0.59 +
    Math.pow(c1.b - c2.b, 2) * 0.11
  );
}

export function matchLCCLevel(rgb: RGBColor): { level: number; confidence: number; spad: number; hex: string } {
  let closest = IRRI_LCC_COLORS[0];
  let minDiff = Infinity;

  for (const lcc of IRRI_LCC_COLORS) {
    const diff = calculateDistance(rgb, lcc.rgb);
    if (diff < minDiff) {
      minDiff = diff;
      closest = lcc;
    }
  }

  // Calculate SPAD estimate from RGB
  const greenness = (2 * rgb.g - rgb.r - rgb.b);
  const spadEstimate = Math.max(15, Math.min(50, Math.round(closest.spad + (greenness / 30))));

  return {
    level: closest.level,
    confidence: Math.max(70, Math.min(99, Math.round(100 - minDiff * 0.5))),
    spad: spadEstimate,
    hex: closest.hex
  };
}

export function analyzeLeafNutrients(rgb: RGBColor, lccLevel: number): {
  n: NutrientItem;
  p: NutrientItem;
  k: NutrientItem;
  healthScore: number;
} {
  const hsv = rgbToHsv(rgb);
  // Nitrogen is strongly correlated with LCC and Greenness
  let nStatus: NutrientItem['status'] = 'optimal';
  let nScore = 80;
  let nDesc = 'ระดับไนโตรเจนเหมาะสม ใบมีสีเขียวพอเหมาะกับการสังเคราะห์แสง';
  let nSymptom = 'ไม่มีอาการผิดปกติ ต้นข้าวแตกกอได้ตามเกณฑ์';

  if (lccLevel <= 2 || (hsv.h >= 45 && hsv.h <= 65 && hsv.s > 30)) {
    nStatus = 'deficient';
    nScore = 35 + lccLevel * 10;
    nDesc = 'ขาดไนโตรเจนชัดเจน สีใบซีดเหลือง ควรเสริมปุ๋ยไนโตรเจนแต่งหน้า';
    nSymptom = 'ใบข้าวมีสีเหลืองจากใบล่างสู่ใบบน ต้นแคระแกร็น แตกกอน้อย';
  } else if (lccLevel === 3) {
    nStatus = 'slightly_low';
    nScore = 65;
    nDesc = 'ไนโตรเจนเริ่มลดต่ำลง อยู่ในเกณฑ์วิกฤตที่ต้องเตรียมใส่ปุ๋ยรอบถัดไป';
    nSymptom = 'ใบเขียวอ่อน เริ่มสังเกตเห็นความต่างจากใบเขียวปกติ';
  } else if (lccLevel >= 5) {
    nStatus = 'excess';
    nScore = 90;
    nDesc = 'ไนโตรเจนค่อนข้างสูง ใบเขียวจัด อาจเสี่ยงต่อโรคไหม้และแมลงรบกวน';
    nSymptom = 'ใบอวบหนา ลำต้นอวบน้ำ ต้นอาจล้มง่ายหากมีลมแรง';
  }

  // Phosphorus: deficiency causes dark purplish green and stunted growth
  let pStatus: NutrientItem['status'] = 'optimal';
  let pScore = 78;
  let pDesc = 'ฟอสฟอรัสอยู่ในเกณฑ์ปกติ ส่งเสริมการเจริญของรากและการแตกกอ';
  let pSymptom = 'ระบบรากแข็งแรง การสร้างตาดอกสมบูรณ์';

  if (hsv.h < 75 && hsv.v < 35 && lccLevel >= 4) {
    pStatus = 'slightly_low';
    pScore = 55;
    pDesc = 'มีแนวโน้มขาดฟอสฟอรัส หรือดินตรึงฟอสฟอรัสไว้';
    pSymptom = 'ใบเขียวคล้ำผิดปกติ ต้นตั้งชัน แตกกอน้อยกว่าปกติ';
  }

  // Potassium: deficiency causes scorched leaf edges and orange-brown tips
  let kStatus: NutrientItem['status'] = 'optimal';
  let kScore = 82;
  let kDesc = 'โพแทสเซียมเพียงพอ เสริมผนังเซลล์ให้ต้านทานโรคและสภาพแล้ง';
  let kSymptom = 'ขอบใบแข็งแรง เมล็ดข้าวเต่งน้ำหนักดี';

  // If Red component is relatively high compared to Green, leaf edges might be rusting
  if (rgb.r > rgb.g * 0.8 && rgb.g > 80) {
    kStatus = 'deficient';
    kScore = 40;
    kDesc = 'ขาดโพแทสเซียม: ใบแก่แห้ง และทั้งต้นแคระแกร็น ควรเสริมปุ๋ย 0-0-60';
    kSymptom = 'ใบแก่แห้ง และทั้งต้นแคระแกร็น ปลายใบและขอบใบล่างไหม้แห้ง ลำต้นหักล้มง่าย';
  }

  // Calculate composite Health Score (0-100)
  const healthScore = Math.round((nScore * 0.45) + (pScore * 0.25) + (kScore * 0.30));

  return {
    n: {
      name: 'ไนโตรเจน (Nitrogen)',
      symbol: 'N',
      status: nStatus,
      score: nScore,
      interpretation: nDesc,
      symptomOnRice: nSymptom
    },
    p: {
      name: 'ฟอสฟอรัส (Phosphorus)',
      symbol: 'P',
      status: pStatus,
      score: pScore,
      interpretation: pDesc,
      symptomOnRice: pSymptom
    },
    k: {
      name: 'โพแทสเซียม (Potassium)',
      symbol: 'K',
      status: kStatus,
      score: kScore,
      interpretation: kDesc,
      symptomOnRice: kSymptom
    },
    healthScore
  };
}

export function classifySoilByRGB(rgb: RGBColor): SoilAnalysis {
  const brightness = (rgb.r + rgb.g + rgb.b) / 3;
  const hsv = rgbToHsv(rgb);

  // Very dark / grey-black -> Clay (นาดำ)
  if (brightness < 75 && hsv.s < 30) {
    return SOIL_DATABASE.clay;
  }

  // Reddish hue -> Acid Sulfate (ดินเปรี้ยว / สนิมเหล็ก)
  if (rgb.r > rgb.g * 1.25 && rgb.r > rgb.b * 1.4 && brightness < 140) {
    return SOIL_DATABASE.acid_sulfate;
  }

  // Pale / high brightness / low saturation -> Sandy soil
  if (brightness > 165 && hsv.s < 35) {
    return SOIL_DATABASE.sandy;
  }

  // Brownish-yellow / medium brightness -> Sandy Loam
  if (brightness >= 75 && brightness <= 165 && rgb.r > rgb.b) {
    return SOIL_DATABASE.sandy_loam;
  }

  return SOIL_DATABASE.loamy_clay;
}

export async function extractImageRGB(imgElement: HTMLImageElement): Promise<{
  averageRgb: RGBColor;
  hex: string;
  samplePoints: { x: number; y: number; rgb: RGBColor; hex: string; lccLevel: number }[];
}> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Scale down to a workable max size for rapid pixel scanning
    const width = Math.min(imgElement.naturalWidth || 400, 400);
    const height = Math.min(imgElement.naturalHeight || 300, 300);
    canvas.width = width;
    canvas.height = height;

    if (!ctx) {
      resolve({
        averageRgb: { r: 90, g: 140, b: 50 },
        hex: '#5a8c32',
        samplePoints: []
      });
      return;
    }

    ctx.drawImage(imgElement, 0, 0, width, height);

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let count = 0;

      // Sample central grid area (avoiding extreme borders)
      const startX = Math.floor(width * 0.15);
      const endX = Math.floor(width * 0.85);
      const startY = Math.floor(height * 0.15);
      const endY = Math.floor(height * 0.85);

      for (let y = startY; y < endY; y += 4) {
        for (let x = startX; x < endX; x += 4) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 180) {
            // Ignore near white glare (>245) or absolute dark (<10)
            const bright = (r + g + b) / 3;
            if (bright > 15 && bright < 245) {
              totalR += r;
              totalG += g;
              totalB += b;
              count++;
            }
          }
        }
      }

      const avgR = count > 0 ? Math.round(totalR / count) : 90;
      const avgG = count > 0 ? Math.round(totalG / count) : 140;
      const avgB = count > 0 ? Math.round(totalB / count) : 50;
      const avgRgb = { r: avgR, g: avgG, b: avgB };

      // Pick 3 representative sample points (top leaf, mid leaf, base leaf)
      const points = [
        { px: 0.5, py: 0.3 },
        { px: 0.5, py: 0.5 },
        { px: 0.5, py: 0.7 }
      ].map((pt) => {
        const sx = Math.floor(pt.px * width);
        const sy = Math.floor(pt.py * height);
        const idx = (sy * width + sx) * 4;
        const pr = data[idx] ?? avgR;
        const pg = data[idx + 1] ?? avgG;
        const pb = data[idx + 2] ?? avgB;
        const pRgb = { r: pr, g: pg, b: pb };
        const lcc = matchLCCLevel(pRgb);
        return {
          x: pt.px,
          y: pt.py,
          rgb: pRgb,
          hex: rgbToHex(pRgb),
          lccLevel: lcc.level
        };
      });

      resolve({
        averageRgb: avgRgb,
        hex: rgbToHex(avgRgb),
        samplePoints: points
      });
    } catch {
      resolve({
        averageRgb: { r: 90, g: 140, b: 50 },
        hex: '#5a8c32',
        samplePoints: []
      });
    }
  });
}

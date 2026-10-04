import { DISEASE_IMAGES } from './diseasesData';

export interface PresetSample {
  id: string;
  title: string;
  subtitle: string;
  category: 'leaf' | 'soil';
  imageUri: string;
  hintRgb: { r: number; g: number; b: number };
  defaultDiagnosisId: string;
}

// Soil image SVG generator
const SOIL_IMAGES = {
  clay: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <radialGradient id="clayG" cx="40%" cy="40%" r="70%">
        <stop offset="0%" stop-color="%233e3835"/>
        <stop offset="60%" stop-color="%232b2725"/>
        <stop offset="100%" stop-color="%231a1817"/>
      </radialGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise"/>
        <feColorMatrix type="matrix" values="0.3 0 0 0 0.1  0 0.3 0 0 0.1  0 0 0.3 0 0.1  0 0 0 0.25 0"/>
        <feComposite in2="SourceGraphic" in="gl" operator="in"/>
      </filter>
    </defs>
    <rect width="400" height="300" fill="url(%23clayG)"/>
    <!-- Mud cracks and clay clods -->
    <path d="M 50,40 Q 90,80 140,70 T 220,120 T 320,80" stroke="%23151413" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M 140,70 Q 130,150 170,220 T 250,280" stroke="%23151413" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M 220,120 Q 280,180 340,160" stroke="%23151413" stroke-width="2" fill="none" opacity="0.5"/>
    <!-- Fine organic matter flecks -->
    <circle cx="80" cy="90" r="3" fill="%235c524c"/>
    <circle cx="270" cy="180" r="4" fill="%235c524c"/>
    <circle cx="190" cy="240" r="3.5" fill="%23483f3a"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23d7ccc8" font-family="sans-serif" font-size="13" font-weight="bold">ดินเหนียวนาดำ (ดินดำอินทรียวัตถุสูง กักเก็บน้ำดี)</text>
  </svg>`,

  sandy_loam: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <radialGradient id="sandG" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="%23b89b72"/>
        <stop offset="60%" stop-color="%239c7f56"/>
        <stop offset="100%" stop-color="%237d6340"/>
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(%23sandG)"/>
    <!-- Sand granules texture -->
    <ellipse cx="120" cy="80" rx="18" ry="12" fill="%23a88a62" opacity="0.7"/>
    <ellipse cx="260" cy="140" rx="25" ry="15" fill="%23cbb18b" opacity="0.6"/>
    <ellipse cx="180" cy="210" rx="30" ry="18" fill="%238a6f4a" opacity="0.8"/>
    <circle cx="60" cy="190" r="8" fill="%23d6be99"/>
    <circle cx="320" cy="90" r="6" fill="%23e0cfae"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23ffe0b2" font-family="sans-serif" font-size="13" font-weight="bold">ดินร่วนปนทราย (สีน้ำตาลอ่อน ระบายน้ำเร็ว มักขาด N-K)</text>
  </svg>`
};

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'sample_healthy',
    title: 'ใบข้าวสมบูรณ์',
    subtitle: 'เขียวเข้มสม่ำเสมอ ธาตุอาหารครบถ้วน',
    category: 'leaf',
    imageUri: DISEASE_IMAGES.healthy,
    hintRgb: { r: 52, g: 125, b: 54 },
    defaultDiagnosisId: 'healthy'
  },
  {
    id: 'sample_nitrogen_def',
    title: 'ใบขาดไนโตรเจน (N)',
    subtitle: 'ใบเหลืองซีดจากโคนสู่ยอด แตกกอน้อย',
    category: 'leaf',
    imageUri: DISEASE_IMAGES.nitrogen_deficiency,
    hintRgb: { r: 185, g: 195, b: 65 },
    defaultDiagnosisId: 'nitrogen_deficiency'
  },
  {
    id: 'sample_blast',
    title: 'โรคไหม้ข้าว (Blast)',
    subtitle: 'แผลรูปตารูปกระสวย กึ่งกลางสีเทา',
    category: 'leaf',
    imageUri: DISEASE_IMAGES.blast,
    hintRgb: { r: 110, g: 122, b: 58 },
    defaultDiagnosisId: 'blast'
  },
  {
    id: 'sample_bacterial_blight',
    title: 'โรคขอบใบแห้ง (BLB)',
    subtitle: 'ขอบใบแห้งเป็นลอนคลื่นสีฟางข้าว',
    category: 'leaf',
    imageUri: DISEASE_IMAGES.bacterial_blight,
    hintRgb: { r: 145, g: 148, b: 78 },
    defaultDiagnosisId: 'bacterial_blight'
  },
  {
    id: 'sample_potassium_def',
    title: 'ใบขาดโพแทสเซียม (K)',
    subtitle: 'ใบแก่แห้ง และทั้งต้นแคระแกร็น',
    category: 'leaf',
    imageUri: DISEASE_IMAGES.potassium_deficiency,
    hintRgb: { r: 115, g: 130, b: 55 },
    defaultDiagnosisId: 'potassium_deficiency'
  },
  {
    id: 'sample_clay_soil',
    title: 'ดินเหนียวนาดำ',
    subtitle: 'สีเทาเข้ม-ดำ กักเก็บน้ำและปุ๋ยได้ดีเยี่ยม',
    category: 'soil',
    imageUri: SOIL_IMAGES.clay,
    hintRgb: { r: 55, g: 50, b: 46 },
    defaultDiagnosisId: 'clay'
  },
  {
    id: 'sample_sandy_loam',
    title: 'ดินร่วนปนทราย',
    subtitle: 'สีน้ำตาลอ่อน ระบายน้ำเร็ว ธาตุอาหารชะล้างง่าย',
    category: 'soil',
    imageUri: SOIL_IMAGES.sandy_loam,
    hintRgb: { r: 156, g: 127, b: 86 },
    defaultDiagnosisId: 'sandy_loam'
  }
];

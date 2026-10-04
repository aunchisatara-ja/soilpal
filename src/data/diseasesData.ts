import { DiseaseDiagnosis, SoilAnalysis } from '../types/rice';

// SVG representations of typical disease appearances for side-by-side comparison
export const DISEASE_IMAGES = {
  healthy: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="healthyBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231e3a1e"/>
        <stop offset="100%" stop-color="%230f2410"/>
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%232e7d32"/>
        <stop offset="50%" stop-color="%2343a047"/>
        <stop offset="100%" stop-color="%231b5e20"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(%23healthyBg)"/>
    <path d="M 200,290 C 190,180 180,80 200,20 C 220,80 210,180 200,290 Z" fill="url(%23leafGrad)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"/>
    <line x1="200" y1="290" x2="200" y2="20" stroke="%2381c784" stroke-width="2.5" opacity="0.8"/>
    <!-- Leaf veins -->
    <path d="M 200,220 Q 185,210 180,200 M 200,170 Q 185,160 180,150 M 200,120 Q 188,110 184,100" stroke="%2381c784" stroke-width="1.2" opacity="0.6"/>
    <path d="M 200,220 Q 215,210 220,200 M 200,170 Q 215,160 220,150 M 200,120 Q 212,110 216,100" stroke="%2381c784" stroke-width="1.2" opacity="0.6"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.6)"/>
    <text x="35" y="266" fill="%23a5d6a7" font-family="sans-serif" font-size="14" font-weight="bold">✓ ภาพอ้างอิง: ใบข้าวสมบูรณ์ สีเขียวสม่ำเสมอ แข็งแรง</text>
  </svg>`,

  blast: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="blastBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%232b261b"/>
        <stop offset="100%" stop-color="%2314120c"/>
      </linearGradient>
      <linearGradient id="blastLeaf" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%23558b2f"/>
        <stop offset="50%" stop-color="%237cb342"/>
        <stop offset="100%" stop-color="%2333691e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(%23blastBg)"/>
    <path d="M 200,290 C 190,180 180,80 200,20 C 220,80 210,180 200,290 Z" fill="url(%23blastLeaf)"/>
    <line x1="200" y1="290" x2="200" y2="20" stroke="%239ccc65" stroke-width="2.5" opacity="0.7"/>
    <!-- Spindle-shaped blast lesions (eye shaped) -->
    <!-- Lesion 1 -->
    <path d="M 190,90 Q 200,82 210,90 Q 212,110 200,120 Q 188,110 190,90 Z" fill="%238d6e63" stroke="%235d4037" stroke-width="2"/>
    <ellipse cx="200" cy="103" rx="4" ry="10" fill="%23e0e0e0" opacity="0.9"/>
    <!-- Lesion 2 -->
    <path d="M 185,160 Q 195,152 205,160 Q 208,185 195,195 Q 182,185 185,160 Z" fill="%238d6e63" stroke="%234e342e" stroke-width="2"/>
    <ellipse cx="195" cy="175" rx="5" ry="12" fill="%23d7ccc8" opacity="0.9"/>
    <!-- Lesion 3 small -->
    <path d="M 200,50 Q 208,45 214,50 Q 215,62 208,68 Q 200,62 200,50 Z" fill="%23a1887f" stroke="%235d4037" stroke-width="1.5"/>
    <ellipse cx="207" cy="58" rx="2.5" ry="5" fill="%23eee"/>
    <!-- Yellow halo -->
    <circle cx="195" cy="175" r="22" fill="%23fdd835" opacity="0.25"/>
    <circle cx="200" cy="103" r="18" fill="%23fdd835" opacity="0.25"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23ffb74d" font-family="sans-serif" font-size="14" font-weight="bold">⚠ ภาพอ้างอิง: แผลรูปตารูปกระสวย กึ่งกลางสีเทา (โรคไหม้ข้าว)</text>
  </svg>`,

  bacterial_blight: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="blightBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231a221a"/>
        <stop offset="100%" stop-color="%230d120d"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(%23blightBg)"/>
    <!-- Rice leaf with dried wavy edges from tip down -->
    <path d="M 200,290 C 190,180 180,80 200,20 C 220,80 210,180 200,290 Z" fill="%234caf50"/>
    <line x1="200" y1="290" x2="200" y2="20" stroke="%2381c784" stroke-width="2"/>
    <!-- Bacterial blight wavy dried margin along the right edge -->
    <path d="M 200,20 Q 212,35 208,60 Q 220,85 212,120 Q 218,150 207,190 Q 212,230 203,270 L 200,270 L 200,20 Z" fill="%23e6c280" stroke="%23c79c4e" stroke-width="1.5"/>
    <!-- Water soaked border wavy line -->
    <path d="M 200,25 Q 206,45 202,75 Q 211,105 204,145 Q 210,180 201,230" fill="none" stroke="%23ffeb3b" stroke-width="2.5" opacity="0.8"/>
    <!-- Tip dried out -->
    <path d="M 195,40 Q 200,20 205,40 Z" fill="%23d7ccc8"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23ffe082" font-family="sans-serif" font-size="14" font-weight="bold">⚠ ภาพอ้างอิง: ขอบใบแห้งสีฟาง ขอบรอยแผลเป็นลอนคลื่น</text>
  </svg>`,

  brown_spot: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <rect width="400" height="300" fill="%231a2015"/>
    <path d="M 200,290 C 190,180 180,80 200,20 C 220,80 210,180 200,290 Z" fill="%23689f38"/>
    <line x1="200" y1="290" x2="200" y2="20" stroke="%239ccc65" stroke-width="2"/>
    <!-- Circular brown spots all over leaf -->
    <ellipse cx="195" cy="70" rx="6" ry="4" fill="%235d4037" stroke="%23ffd54f" stroke-width="1.5"/>
    <ellipse cx="204" cy="95" rx="5" ry="3" fill="%235d4037" stroke="%23ffd54f" stroke-width="1.2"/>
    <ellipse cx="192" cy="120" rx="7" ry="4.5" fill="%234e342e" stroke="%23ffd54f" stroke-width="1.5"/>
    <ellipse cx="205" cy="140" rx="5" ry="3.5" fill="%234e342e" stroke="%23ffd54f" stroke-width="1.2"/>
    <ellipse cx="194" cy="170" rx="8" ry="5" fill="%233e2723" stroke="%23ffd54f" stroke-width="1.5"/>
    <ellipse cx="206" cy="195" rx="6" ry="4" fill="%234e342e" stroke="%23ffd54f" stroke-width="1.2"/>
    <ellipse cx="198" cy="230" rx="5" ry="3" fill="%235d4037" stroke="%23ffd54f" stroke-width="1"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23ffcc80" font-family="sans-serif" font-size="14" font-weight="bold">⚠ ภาพอ้างอิง: แผลกลมรีสีน้ำตาลกระจายทั่วใบ (ดินขาดปุ๋ย)</text>
  </svg>`,

  nitrogen_deficiency: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <rect width="400" height="300" fill="%231a2412"/>
    <!-- Pale yellow leaf gradient -->
    <defs>
      <linearGradient id="nDefGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="%23d4e157"/>
        <stop offset="50%" stop-color="%23ffee58"/>
        <stop offset="100%" stop-color="%23fdd835"/>
      </linearGradient>
    </defs>
    <path d="M 200,290 C 190,180 180,80 200,20 C 220,80 210,180 200,290 Z" fill="url(%23nDefGrad)"/>
    <line x1="200" y1="290" x2="200" y2="20" stroke="%23fff59d" stroke-width="2"/>
    <!-- Dried yellowish tip -->
    <path d="M 197,35 C 196,25 204,25 203,35 Z" fill="%23e0a96d"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23fff176" font-family="sans-serif" font-size="14" font-weight="bold">⚠ ภาพอ้างอิง: ใบเหลืองซีดจากโคน/ปลายใบ (ขาดไนโตรเจน N)</text>
  </svg>`,

  potassium_deficiency: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="kDefBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231c1914"/>
        <stop offset="100%" stop-color="%230d0b08"/>
      </linearGradient>
      <linearGradient id="stuntedStem" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="%23556b2f"/>
        <stop offset="100%" stop-color="%233e4f20"/>
      </linearGradient>
      <linearGradient id="witheredLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23a07844"/>
        <stop offset="50%" stop-color="%237c5225"/>
        <stop offset="100%" stop-color="%234e3215"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(%23kDefBg)"/>
    <!-- Stunted, dwarfed rice clump (แคระแกร็น ลำต้นเตี้ยสั้น) -->
    <!-- Base crown & soil line -->
    <ellipse cx="200" cy="245" rx="55" ry="12" fill="%232b2118"/>
    
    <!-- Outer older leaves: completely dried, curled and withered (ใบแก่แห้งกรอบ) -->
    <!-- Left outer older leaf: curled, withered down to ground -->
    <path d="M 185,235 C 160,210 120,200 95,225 C 80,240 100,250 115,242 C 140,230 170,232 188,238 Z" fill="url(%23witheredLeaf)" stroke="%233e2714" stroke-width="1.5"/>
    <path d="M 180,230 C 150,195 110,185 80,205 C 70,212 75,220 90,215 C 120,200 155,215 178,235 Z" fill="%238d6232" stroke="%234e3318" stroke-width="1.2"/>
    
    <!-- Right outer older leaf: crispy dried, scorched brown and curling -->
    <path d="M 215,235 C 240,210 280,200 305,225 C 320,240 300,250 285,242 C 260,230 230,232 212,238 Z" fill="url(%23witheredLeaf)" stroke="%233e2714" stroke-width="1.5"/>
    <path d="M 220,230 C 250,195 290,185 320,205 C 330,212 325,220 310,215 C 280,200 245,215 222,235 Z" fill="%238d6232" stroke="%234e3318" stroke-width="1.2"/>
    
    <!-- Middle stunted leaves: stunted in height (แคระแกร็น), tip scorched dark orange-brown -->
    <path d="M 195,235 C 185,180 160,130 145,105 C 140,95 155,95 165,115 C 180,145 195,190 198,235 Z" fill="%235d7237" stroke="%2338471e" stroke-width="1.5"/>
    <!-- Scorched tip on left leaf -->
    <path d="M 145,105 C 140,95 155,95 165,115 L 160,135 L 148,125 Z" fill="%23b85d19" stroke="%23873e0b" stroke-width="1.2"/>
    
    <path d="M 205,235 C 215,180 240,130 255,105 C 260,95 245,95 235,115 C 220,145 205,190 202,235 Z" fill="%235d7237" stroke="%2338471e" stroke-width="1.5"/>
    <!-- Scorched tip on right leaf -->
    <path d="M 255,105 C 260,95 245,95 235,115 L 240,135 L 252,125 Z" fill="%23b85d19" stroke="%23873e0b" stroke-width="1.2"/>
    
    <!-- Central stunted leaf: short, unable to elongate, margins burnt -->
    <path d="M 196,235 C 194,160 192,100 200,65 C 208,100 206,160 204,235 Z" fill="%23687f3b" stroke="%23425222" stroke-width="1.5"/>
    <line x1="200" y1="235" x2="200" y2="70" stroke="%238a9f53" stroke-width="1.5"/>
    <!-- Burnt rust tip & margins of central leaf -->
    <path d="M 194,75 L 200,65 L 206,75 L 204,115 L 196,115 Z" fill="%23a84b12" stroke="%2378330a" stroke-width="1"/>
    <path d="M 193,115 L 195,160 M 207,115 L 205,160" stroke="%23c26725" stroke-width="2.5" opacity="0.85"/>
    
    <!-- Stunted height comparison line & indicator -->
    <line x1="50" y1="65" x2="120" y2="65" stroke="%23e57373" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="50" y="55" fill="%23ef9a9a" font-family="sans-serif" font-size="11">ระดับต้นแคระแกร็น (เตี้ยกว่าปกติ 50%)</text>
    
    <!-- Description Badge at bottom -->
    <rect x="15" y="248" width="370" height="42" rx="8" fill="rgba(0,0,0,0.85)" stroke="%23b85d19" stroke-width="1"/>
    <text x="25" y="274" fill="%23ffb74d" font-family="sans-serif" font-size="13" font-weight="bold">⚠ ภาพอ้างอิง: ใบแก่แห้ง และทั้งต้นแคระแกร็น (ขาดโพแทสเซียม K)</text>
  </svg>`,

  sheath_blight: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <rect width="400" height="300" fill="%231a2618"/>
    <!-- Stem & sheath view -->
    <rect x="180" y="20" width="40" height="260" rx="6" fill="%23558b2f"/>
    <!-- Irregular serpent/tiger-like lesions on sheath -->
    <path d="M 182,100 Q 200,90 218,105 Q 215,135 195,140 Q 183,130 182,100 Z" fill="%23bcaaa4" stroke="%235d4037" stroke-width="2"/>
    <ellipse cx="200" cy="118" rx="10" ry="12" fill="%23cfd8dc" opacity="0.8"/>
    <path d="M 183,170 Q 202,165 217,175 Q 215,210 190,215 Q 182,195 183,170 Z" fill="%23bcaaa4" stroke="%234e342e" stroke-width="2"/>
    <ellipse cx="202" cy="190" rx="8" ry="14" fill="%23cfd8dc" opacity="0.8"/>
    <rect x="20" y="240" width="360" height="42" rx="8" fill="rgba(0,0,0,0.7)"/>
    <text x="35" y="266" fill="%23b0bec5" font-family="sans-serif" font-size="14" font-weight="bold">⚠ ภาพอ้างอิง: กาบใบมีแผลวงรีสีเทาขอบน้ำตาลลายเสือ (กาบใบแห้ง)</text>
  </svg>`,
};

// Database of standard Thai Rice Department diseases
export const RICE_DISEASES_DB: Record<string, DiseaseDiagnosis> = {
  healthy: {
    id: 'healthy',
    nameThai: 'ต้นข้าวสมบูรณ์แข็งแรง (ไม่พบอาการผิดปกติ)',
    nameEng: 'Healthy Rice Plant',
    scientificName: 'Oryza sativa L.',
    pathogenType: 'ปกติ (Healthy)',
    confidence: 96,
    severity: 'ปกติ/ไม่พบโรค',
    keySymptoms: [
      'สีใบเขียวสดใส สม่ำเสมอตามระดับแผ่นเทียบสี LCC ระดับ 3-4',
      'ไม่มีจุดแผล ลายด่าง หรือขอบใบแห้งกรอบ',
      'กอข้าวตั้งตรง แตกกอแน่น ลำต้นแข็งแรง ผิวใบสะอาด'
    ],
    sampleImageUrl: DISEASE_IMAGES.healthy,
    comparisonAnalysis: 'แผ่นใบเขียวสม่ำเสมอ ผิวใบเนียนไม่มีรอยแผลช้ำหรือรอยเจาะทำลาย สอดคล้องกับภาพต้นข้าวสมบูรณ์มาตรฐาน',
    treatment: {
      bioMethod: [
        'ฉีดพ่นเชื้อราไตรโคเดอร์มา (Trichoderma asperellum) ทุก 15-20 วัน เพื่อสร้างภูมิคุ้มกันและป้องกันเชื้อราในดิน',
        'เสริมจุลินทรีย์สังเคราะห์แสง (PSB) เพื่อช่วยการตรึงคาร์บอนและระบบราก'
      ],
      chemicalMethod: [
        'ไม่มีความจำเป็นต้องใช้สารเคมีกำจัดโรคใดๆ ในขณะนี้',
        'รักษาระดับสมดุลระบบนิเวศน์ในแปลงนาเพื่ออนุรักษ์แมลงศัตรูธรรมชาติ (ตัวห้ำ-ตัวเบียน)'
      ],
      fieldManagement: [
        'รักษาระดับน้ำที่ 3-5 ซม. ในระยะแตกกอ หรือใช้ระบบเปียกสลับแห้ง (AWD)',
        'ใส่ปุ๋ยแต่งหน้าตามระยะการเจริญเติบโตในอัตราที่พอเหมาะ ไม่ใส่ยูเรียมากเกินไป'
      ]
    }
  },

  blast: {
    id: 'blast',
    nameThai: 'โรคไหม้ข้าว (Rice Blast)',
    nameEng: 'Rice Blast',
    scientificName: 'Pyricularia oryzae (Magnaporthe oryzae)',
    pathogenType: 'เชื้อรา (Fungus)',
    confidence: 92,
    severity: 'ระดับปานกลาง (ต้องรักษา)',
    keySymptoms: [
      'แผลบนใบมีลักษณะรูปตารูปกระสวย (Spindle-shaped lesion)',
      'กึ่งกลางแผลมีสีเทาหรือสีขาวเงิน ล้อมรอบด้วยขอบสีน้ำตาลเข้ม',
      'หากระบาดรุนแรงแผลจะขยายตัวเชื่อมติดกัน ทำให้ใบไหม้แห้งตายทั้งใบคล้ายถูกไฟลวก'
    ],
    sampleImageUrl: DISEASE_IMAGES.blast,
    comparisonAnalysis: 'พบลักษณะแผลทรงกระสวยขอบสีน้ำตาลเข้มกึ่งกลางสีเทาชัดเจนตรงตามแบบของโรคไหม้ข้าวระยะรุนแรงปานกลาง',
    treatment: {
      bioMethod: [
        'พ่นเชื้อราไตรโคเดอร์มา (อัตรา 1 กก. ต่อน้ำ 200 ลิตร) ในช่วงเวลาเย็นแดดร่ม ทุก 5-7 วัน ติดต่อกัน 2 ครั้ง',
        'ใช้น้ำส้มควันไม้ผสมสะเดาเจือจางช่วยลดการเกาะของสปอร์เชื้อรา'
      ],
      chemicalMethod: [
        'ไตรไซคลาโซล (Tricyclazole 75% WP) อัตรา 10-15 กรัม ต่อน้ำ 20 ลิตร พ่นทันทีเมื่อพบแผล',
        'หรือ อะซอกซีสโตรบิน (Azoxystrobin 25% SC) อัตรา 15-20 ซีซี ต่อน้ำ 20 ลิตร สลับกลุ่มกลไกเพื่อป้องกันเชื้อดื้อยา'
      ],
      fieldManagement: [
        'งดการใส่ปุ๋ยไนโตรเจน (ปุ๋ยยูเรีย 46-0-0) โดยเด็ดขาด เพราะจะทำให้เซลล์ใบอวบน้ำและเชื้อราลุกลามเร็ว',
        'รักษาระดับน้ำในแปลงนา 5-7 ซม. เพื่อลดการแพร่กระจายของสปอร์จากผิวดิน และหมั่นตรวจแปลงช่วงเช้า'
      ]
    }
  },

  bacterial_blight: {
    id: 'bacterial_blight',
    nameThai: 'โรคขอบใบแห้ง (Bacterial Leaf Blight - BLB)',
    nameEng: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    pathogenType: 'แบคทีเรีย (Bacteria)',
    confidence: 89,
    severity: 'ระดับปานกลาง (ต้องรักษา)',
    keySymptoms: [
      'เริ่มเกิดจากขอบใบหรือปลายใบ เป็นรอยช้ำฉ่ำน้ำสีเทาอมเขียว',
      'รอยแผลลามยาวลงมาตามแนวขอบใบ มีขอบหยักเป็นลอนคลื่นชัดเจน',
      'เนื้อเยื่อที่ถูกทำลายจะเปลี่ยนเป็นสีเหลือง แล้วแห้งกรอบเป็นสีฟางข้าว',
      'ช่วงเช้าที่มีหมอกหนาหรือน้ำค้าง อาจพบหยดน้ำเมือกสีเหลืองขุ่นของแบคทีเรีย (Bacterial ooze)'
    ],
    sampleImageUrl: DISEASE_IMAGES.bacterial_blight,
    comparisonAnalysis: 'พบลักษณะขอบใบแห้งเป็นลอนคลื่นจากยอดลงสู่โคนแผ่นใบ เป็นเอกลักษณ์เฉพาะของโรคขอบใบแห้งแบคทีเรีย',
    treatment: {
      bioMethod: [
        'ใช้เชื้อแบคทีเรียปฏิปักษ์ บาซิลลัส ซับทิลิส (Bacillus subtilis - BS) พ่นสม่ำเสมอทุก 5-7 วัน',
        'ฉีดพ่นสารสกัดจากเปลือกมังคุดหรือแทนนินธรรมชาติ ช่วยยับยั้งการแบ่งตัวของแบคทีเรีย'
      ],
      chemicalMethod: [
        'คอปเปอร์ไฮดรอกไซด์ (Copper Hydroxide 77% WP) อัตรา 20-30 กรัม ต่อน้ำ 20 ลิตร',
        'หรือ บิสเมอร์ไทอะโซล (Bismerthiazol) อัตรา 20-30 กรัม ต่อน้ำ 20 ลิตร เพื่อควบคุมแบคทีเรีย'
      ],
      fieldManagement: [
        'ลดการระบายน้ำไหลผ่านจากแปลงที่เกิดโรคไปยังแปลงอื่นเพื่อป้องกันการแพร่เชื้อตามทางน้ำ',
        'ลดการให้ปุ๋ยไนโตรเจนลง 50% และเสริมปุ๋ยโพแทสเซียม (0-0-60) เพื่อสร้างความแข็งแรงให้ผนังเซลล์ขอบใบ'
      ]
    }
  },

  brown_spot: {
    id: 'brown_spot',
    nameThai: 'โรคใบจุดสีน้ำตาล (Brown Spot)',
    nameEng: 'Brown Spot Disease',
    scientificName: 'Bipolaris oryzae (Cochliobolus miyabeanus)',
    pathogenType: 'เชื้อราสัมพันธ์กับภาวะขาดธาตุอาหาร (Fungus & Malnutrition)',
    confidence: 88,
    severity: 'ระดับเริ่มต้น (เฝ้าระวัง)',
    keySymptoms: [
      'แผลเป็นจุดกลมรีสีน้ำตาล กระจายทั่วไปบนแผ่นใบ',
      'ขอบแผลสีน้ำตาลเข้ม บางแผลมีวงสีเหลือง (Halo) ล้อมรอบ',
      'มักเกิดในแปลงนาที่เป็นดินทรายจัด ดินเปรี้ยว หรือดินที่ขาดธาตุอาหารสมบูรณ์'
    ],
    sampleImageUrl: DISEASE_IMAGES.brown_spot,
    comparisonAnalysis: 'พบจุดสีน้ำตาลกลมกระจายทั่วทั้งใบ สัมพันธ์กับการตรวจพบระดับธาตุอาหาร N และ K ค่อนข้างต่ำ',
    treatment: {
      bioMethod: [
        'พ่นเชื้อราไตรโคเดอร์มาชนิดสดหรือผงละลายน้ำ เพื่อควบคุมการขยายตัวของเชื้อรา',
        'ฉีดพ่นน้ำหมักชีวภาพที่มีกรดอะมิโนและจุลธาตุเพื่อช่วยฟื้นฟูใบ'
      ],
      chemicalMethod: [
        'แมนโคเซบ (Mancozeb 80% WP) หรือ ไอโพรไดโอน (Iprodione 50% WP) อัตรา 30-40 กรัม ต่อน้ำ 20 ลิตร'
      ],
      fieldManagement: [
        'ปรับปรุงบำรุงดินโดยด่วน ใส่ปุ๋ยหมัก ปุ๋ยคอก หรือปุ๋ยอินทรีย์ 200-300 กก./ไร่',
        'เสริมปุ๋ยเคมีสูตรเสมอหรือปุ๋ยโพแทสเซียม (0-0-60) อัตรา 5-10 กก./ไร่ เพื่อลดความไวต่อโรค'
      ]
    }
  },

  nitrogen_deficiency: {
    id: 'nitrogen_deficiency',
    nameThai: 'อาการขาดธาตุไนโตรเจน (Nitrogen Deficiency)',
    nameEng: 'Nitrogen Deficiency in Rice',
    scientificName: 'Abiotic physiological disorder',
    pathogenType: 'ความผิดปกติจากการขาดธาตุอาหาร (Nutrient Deficiency)',
    confidence: 94,
    severity: 'ระดับปานกลาง (ต้องรักษา)',
    keySymptoms: [
      'แผ่นใบเปลี่ยนเป็นสีเขียวซีดจนถึงเหลืองอ่อน โดยเริ่มจากใบล่างขึ้นสู่ใบบน',
      'ใบมีขนาดแคบ เล็ก และตั้งชันผิดปกติ',
      'ต้นข้าวแตกกอน้อย ลำต้นเตี้ยแคระแกร็น การเจริญเติบโตหยุดชะงัก'
    ],
    sampleImageUrl: DISEASE_IMAGES.nitrogen_deficiency,
    comparisonAnalysis: 'ค่าสี RGB สอดคล้องกับแผ่นเทียบสี LCC ระดับ 1-2 บ่งชี้คลอโรฟิลล์ต่ำ ใบเหลืองซีดจากโคนสู่ยอดใบ',
    treatment: {
      bioMethod: [
        'ฉีดพ่นน้ำหมักปลาทะเลหรือน้ำหมักถั่วเหลืองที่มีไนโตรเจนอินทรีย์สูง อัตรา 30-50 ซีซี ต่อน้ำ 20 ลิตร ทุก 7 วัน',
        'หว่านแหนแดง (Azolla) ในแปลงนาเพื่อตรึงไนโตรเจนในอากาศตามธรรมชาติ'
      ],
      chemicalMethod: [
        'ใส่ปุ๋ยยูเรีย (สูตร 46-0-0) อัตรา 10-15 กก./ไร่ ควบคู่กับ 16-20-0 หรือ 16-16-8',
        'หรือฉีดพ่นปุ๋ยเกล็ดทางใบสูตร 30-20-10 เพื่อให้ข้าวดูดซึมนำไปใช้ฟื้นฟูยอดได้ทันที'
      ],
      fieldManagement: [
        'ควบคุมระดับน้ำในนาข้าวให้สูง 3-5 ซม. ก่อนหว่านปุ๋ย เพื่อป้องกันปุ๋ยระเหยสูญหาย',
        'ใส่ปุ๋ยในช่วงเช้าที่ไม่มีน้ำค้างเกาะใบข้าว และงดใส่ปุ๋ยขณะมีฝนตกชุกหนัก'
      ]
    }
  },

  potassium_deficiency: {
    id: 'potassium_deficiency',
    nameThai: 'อาการขาดธาตุโพแทสเซียม (Potassium Deficiency)',
    nameEng: 'Potassium Deficiency in Rice',
    scientificName: 'Abiotic physiological disorder',
    pathogenType: 'ความผิดปกติจากการขาดธาตุอาหาร (Nutrient Deficiency)',
    confidence: 90,
    severity: 'ระดับเริ่มต้น (เฝ้าระวัง)',
    keySymptoms: [
      'ใบแก่แห้ง และทั้งต้นแคระแกร็น',
      'ปลายใบและขอบใบล่างเริ่มแห้งไหม้เป็นสีน้ำตาลส้ม คล้ายถูกไฟลวก (Marginal scorch)',
      'ลำต้นอ่อนแอ หักล้มง่าย ต้นข้าวแคระแกร็น แตกกอน้อย เมล็ดข้าวลีบน้ำหนักเบา'
    ],
    sampleImageUrl: DISEASE_IMAGES.potassium_deficiency,
    comparisonAnalysis: 'ตรวจพบลักษณะใบแก่แห้ง และทั้งต้นแคระแกร็น ปลายใบและขอบใบแห้งไหม้เป็นสีน้ำตาลสนิม สอดคล้องกับอาการขาดธาตุโพแทสเซียม (K) ชัดเจน',
    treatment: {
      bioMethod: [
        'หว่านขี้เถ้าแกลบหรือเถ้าถ่านที่เผาไหม้สมบูรณ์ (มีโพแทสเซียมธรรมชาติสูง) อัตรา 50-100 กก./ไร่',
        'ใช้น้ำหมักเปลือกกล้วยและขี้เถ้าพ่นทางใบ'
      ],
      chemicalMethod: [
        'ใส่ปุ๋ยโพแทสเซียมคลอไรด์ (สูตร 0-0-60) อัตรา 8-12 กก./ไร่',
        'หรือฉีดพ่นปุ๋ยทางใบสูตร 0-0-50 หรือ 10-10-40 เพื่อเร่งการดูดซึม'
      ],
      fieldManagement: [
        'รักษาระดับความชื้นในดินไม่ให้แห้งแตกระแหง เพราะดินแห้งจะตรึงโพแทสเซียมทำให้รากดูดซึมไม่ได้'
      ]
    }
  },

  sheath_blight: {
    id: 'sheath_blight',
    nameThai: 'โรคกาบใบแห้ง (Sheath Blight)',
    nameEng: 'Sheath Blight of Rice',
    scientificName: 'Rhizoctonia solani Kuhn',
    pathogenType: 'เชื้อราในดิน (Soil-borne Fungus)',
    confidence: 87,
    severity: 'ระดับปานกลาง (ต้องรักษา)',
    keySymptoms: [
      'เกิดแผลที่กาบใบระดับผิวน้ำ เป็นแผลรูปวงรีหรือลายเสือขอบสีน้ำตาลเข้ม',
      'กึ่งกลางแผลสีเทาเงิน แผลจะลามขึ้นสู่ใบและกาบใบส่วนบน',
      'ต้นข้าวบริเวณที่เป็นโรคมักเหี่ยวแห้งและหักล้มง่าย'
    ],
    sampleImageUrl: DISEASE_IMAGES.sheath_blight,
    comparisonAnalysis: 'พบลักษณะแผลลายขอบน้ำตาลสลับเทาคล้ายลายเสือที่บริเวณโคนกาบใบ สอดคล้องกับโรคกาบใบแห้ง',
    treatment: {
      bioMethod: [
        'ฉีดพ่นเชื้อราไตรโคเดอร์มาเข้มข้นที่บริเวณโคนกอข้าวใกล้ผิวดินทุก 7 วัน',
        'หมั่นตัดแต่งใบแก่ที่สัมผัสน้ำออกเพื่อให้อากาศถ่ายเท'
      ],
      chemicalMethod: [
        'วาลิคามัยซิน (Validamycin 3% L) อัตรา 30-40 ซีซี ต่อน้ำ 20 ลิตร พ่นเน้นที่โคนกอ',
        'หรือ เฮกซะโคนาโซล (Hexaconazole 5% SC) อัตรา 30 ซีซี ต่อน้ำ 20 ลิตร'
      ],
      fieldManagement: [
        'ลดความหนาแน่นของต้นข้าว และระบายน้ำออกจากแปลงให้ระดับน้ำลดลง เพื่อลดความชื้นสะสมบริเวณโคนกอ'
      ]
    }
  }
};

// Database of Soil Types for Thai paddy fields
export const SOIL_DATABASE: Record<string, SoilAnalysis> = {
  clay: {
    soilType: 'clay',
    soilNameThai: 'ดินเหนียวนาดำ (Heavy Clay / Lowland Paddy)',
    colorDescription: 'สีเทาเข้มถึงดำ (Dark Grayish Brown to Black)',
    fertilityScore: 85,
    waterHoldingCapacity: 92,
    approximatePh: '5.5 - 6.5 (เหมาะสม)',
    suitableRiceVarieties: ['ขาวดอกมะลิ 105', 'กข43', 'กข6', 'พิษณุโลก 2', 'ปทุมธานี 1'],
    soilImprovementAdvice: [
      'กักเก็บน้ำและปุ๋ยได้ดีเยี่ยม แนะนำการทำ "เปียกสลับแห้ง แกล้งข้าว" เพื่อให้ดินมีออกซิเจนช่วยระบบราก',
      'ไถกลบตอซังข้าวหลังเก็บเกี่ยวเพื่อเพิ่มความร่วนซุย ไม่ควรเผาตอซังเด็ดขาด',
      'ระวังการสะสมของแก๊สไข่เน่า (H2S) หากมีน้ำขังตลอดเวลาเป็นเวลานาน'
    ],
    recommendedBasalFertilizer: 'ปุ๋ยรองพื้นสูตร 16-20-0 อัตรา 20-25 กก./ไร่ ควบคู่ปุ๋ยอินทรีย์'
  },

  sandy_loam: {
    soilType: 'sandy_loam',
    soilNameThai: 'ดินร่วนปนทราย (Sandy Loam / Upland Rice)',
    colorDescription: 'สีน้ำตาลอ่อนถึงน้ำตาลปนเหลือง (Light Brown / Yellowish)',
    fertilityScore: 58,
    waterHoldingCapacity: 50,
    approximatePh: '5.0 - 6.0 (กรดอ่อน)',
    suitableRiceVarieties: ['ขาวดอกมะลิ 105 (ภาคอีสาน)', 'กข15', 'เหนียวอุบล 2'],
    soilImprovementAdvice: [
      'ดินระบายน้ำเร็วมากและสูญเสียปุ๋ยได้ง่ายจากการชะล้าง ควรแบ่งใส่ปุ๋ยเป็น 3-4 ครั้ง (แบ่งใส่ทีละน้อยแต่บ่อยครั้ง)',
      'ใส่ปุ๋ยคอก ปุ๋ยหมัก หรือมูลไก่แกลบ 300-500 กก./ไร่ เพื่อเพิ่มอินทรียวัตถุและความสามารถในการอุ้มน้ำ',
      'ปลูกพืชตระกูลถั่ว เช่น ปอเทือง ถั่วพร้า แล้วไถกลบเป็นปุ๋ยพืชสดช่วงพักนา'
    ],
    recommendedBasalFertilizer: 'ปุ๋ยสูตร 16-16-8 หรือ 15-15-15 อัตรา 20-25 กก./ไร่ ร่วมกับปุ๋ยคอก'
  },

  acid_sulfate: {
    soilType: 'acid_sulfate',
    soilNameThai: 'ดินเปรี้ยวจัด / ดินกรดกำมะถัน (Acid Sulfate Soil)',
    colorDescription: 'สีแดงสนิมเหล็กหรือจุดประสีเหลืองฟางข้าว (Jarosite mottles)',
    fertilityScore: 42,
    waterHoldingCapacity: 75,
    approximatePh: '3.8 - 4.8 (เปรี้ยวจัด/เป็นกรดรุนแรง)',
    suitableRiceVarieties: ['พันธุ์ข้าวทนดินเปรี้ยว เช่น กข41, กข49, พวงไร่'],
    soilImprovementAdvice: [
      'ใส่ปูนมาร์ล (Marl) หรือ โดโลไมท์ (Dolomite) อัตรา 500-1,000 กก./ไร่ เพื่อยกระดับค่า pH ให้สูงขึ้น',
      'ใช้วิธี "แกล้งดิน" ตามแนวพระราชดำริ โดยการระบายน้ำขังออกแล้วล้างกรดออก 2-3 รอบ',
      'ฟอสฟอรัสในดินจะถูกตรึงสูงมาก จำเป็นต้องใส่ปุ๋ยหินฟอสเฟตบด (0-3-0) รองพื้น'
    ],
    recommendedBasalFertilizer: 'หินฟอสเฟตบด 50-100 กก./ไร่ ควบคู่ 16-20-0 และปูนโดโลไมท์'
  },

  loamy_clay: {
    soilType: 'loamy_clay',
    soilNameThai: 'ดินร่วนเหนียว (Loamy Clay)',
    colorDescription: 'สีน้ำตาลเข้มปนเทา (Dark Grayish Brown)',
    fertilityScore: 80,
    waterHoldingCapacity: 82,
    approximatePh: '6.0 - 6.8 (สมบูรณ์มาก)',
    suitableRiceVarieties: ['กข43', 'ชัยนาท 1', 'กข79', 'สุพรรณบุรี 1'],
    soilImprovementAdvice: [
      'ความสมบูรณ์สูง ระบายน้ำปานกลาง เหมาะสมกับการปลูกข้าวชลประทานและนาดำ',
      'รักษาการหมุนเวียนธาตุอาหารด้วยการใช้จุลินทรีย์ย่อยสลายตอซัง'
    ],
    recommendedBasalFertilizer: 'ปุ๋ยสูตร 16-20-0 หรือ 18-46-0 ร่วมกับโพแทสเซียม'
  },

  sandy: {
    soilType: 'sandy',
    soilNameThai: 'ดินทรายจัด (Sandy Soil)',
    colorDescription: 'สีเทาอ่อนถึงสีเบจซีด (Light Gray / Pale Beige)',
    fertilityScore: 35,
    waterHoldingCapacity: 30,
    approximatePh: '5.0 - 5.5',
    suitableRiceVarieties: ['พันธุ์ข้าวทนแล้ง กข6, ขาวดอกมะลิ 105'],
    soilImprovementAdvice: [
      'ไม่อุ้มน้ำ ปุ๋ยซึมหายรวดเร็ว จำเป็นต้องเสริมปุ๋ยอินทรีย์อย่างต่อเนื่องทุกฤดูกาล',
      'ควรใช้วัสดุปรับปรุงดินเช่น แกลบดำ ฮิวมิค หรือไบโอชาร์'
    ],
    recommendedBasalFertilizer: 'ปุ๋ยอินทรีย์เคมีสูตร 12-3-3 หรือ 16-16-8 ร่วมกับขี้ไก่หมัก'
  }
};

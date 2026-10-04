import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Support base64 image uploads from mobile cameras
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Rice Analysis API Endpoint
app.post('/api/analyze-rice', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mode = 'leaf', rgbEstimate, plantStage = 'ระยะแตกกอ (Tillering stage)' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'กรุณาส่งข้อมูลรูปภาพ' });
    }

    // Parse data URI and validate base64
    let mimeType = 'image/jpeg';
    let base64Clean = '';

    if (typeof imageBase64 === 'string') {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        mimeType = match[1].toLowerCase();
        base64Clean = match[2].trim();
      } else if (!imageBase64.startsWith('data:')) {
        base64Clean = imageBase64.trim();
      }
    }

    const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!supportedMimeTypes.includes(mimeType)) {
      mimeType = 'image/jpeg';
    }

    const sanitizedBase64 = base64Clean.replace(/\s+/g, '');
    const isValidBase64 = sanitizedBase64.length > 20 && /^[A-Za-z0-9+/=]+$/.test(sanitizedBase64);

    const systemPrompt = `คุณเป็นผู้เชี่ยวชาญด้านโรคพืชและปฐพีวิทยา กรมการข้าว (Rice Crop Pathologist & Soil Agronomist) ประจำประเทศไทย
งานของคุณคือวิเคราะห์รูปภาพแปลงนาข้าว ใบข้าว หรือผิวดิน ที่เกษตรกรถ่ายส่งมา พร้อมระบุ:
1. การตรวจวัดค่าสี (RGB) ของใบหรือดิน และการประเมินแผ่นเทียบสีใบข้าว (LCC 1-6 ของ IRRI)
2. วินิจฉัยการขาดธาตุอาหารหลัก (N, P, K) และธาตุรองอย่างแม่นยำ
3. การวินิจฉัยโรคพืช เช่น โรคไหม้ข้าว (Rice blast), โรคขอบใบแห้ง (Bacterial leaf blight), โรคใบจุดสีน้ำตาล (Brown spot), โรคกาบใบแห้ง (Sheath blight), หรือต้นข้าวสมบูรณ์
4. แนวทางการแก้ปัญหา:
   - ชนิดและสูตรปุ๋ยเคมีที่เหมาะสม เช่น 46-0-0 (ยูเรีย), 16-20-0, 16-16-8, 0-0-60 พร้อมอัตราการใส่ต่อไร่
   - ปุ๋ยอินทรีย์ / ชีวภาพทางเลือก
   - การจัดการน้ำ: ต้องรดน้ำ/สูบน้ำเพิ่มไหม? ระดับน้ำที่แนะนำกี่เซนติเมตร หรือควรใช้วิธีเปียกสลับแห้ง แกล้งข้าว (AWD)
   - การกำจัดโรค (สารชีวภัณฑ์ เช่น ไตรโคเดอร์มา บาซิลลัส และสารควบคุมที่ปลอดภัย)
5. หากเป็นโหมดดิน (mode: soil): วิเคราะห์ชนิดดิน (ดินเหนียว, ดินร่วนปนทราย, ดินเปรี้ยวจัด), ความอุดมสมบูรณ์, การอุ้มน้ำ, และปุ๋ยรองพื้น

ให้ตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างที่กำหนดเท่านั้น ภาษาไทยเข้าใจง่ายสำหรับชาวนา`;

    const userPrompt = `โปรดวิเคราะห์รูปภาพนี้:
โหมด: ${mode === 'soil' ? 'ตรวจวิเคราะห์ดิน (Soil Analysis)' : 'ตรวจวิเคราะห์ใบข้าวและโรคพืช (Rice Leaf & Crop Health)'}
ระยะการเจริญเติบโตของข้าว: ${plantStage}
ค่าสี RGB เบื้องต้นที่เครื่องวัดได้: R=${rgbEstimate?.r || 'N/A'}, G=${rgbEstimate?.g || 'N/A'}, B=${rgbEstimate?.b || 'N/A'}

โครงสร้าง JSON ที่ต้องการ:
{
  "summaryTitle": "สรุปผลตรวจสั้นๆ 1 บรรทัด",
  "summaryDescription": "คำอธิบายภาพรวม 2-3 บรรทัด",
  "healthScore": 85,
  "lccLevel": 4,
  "chlorophyllIndex": 38,
  "nutrients": {
    "n": {
      "name": "ไนโตรเจน (Nitrogen)",
      "symbol": "N",
      "status": "optimal" หรือ "deficient" หรือ "slightly_low" หรือ "excess",
      "score": 80,
      "interpretation": "คำอธิบายระดับ N",
      "symptomOnRice": "อาการที่สังเกตได้บนต้นข้าว"
    },
    "p": {
      "name": "ฟอสฟอรัส (Phosphorus)",
      "symbol": "P",
      "status": "optimal" หรือ "deficient" หรือ "slightly_low",
      "score": 75,
      "interpretation": "คำอธิบายระดับ P",
      "symptomOnRice": "อาการที่สังเกตได้บนต้นข้าว"
    },
    "k": {
      "name": "โพแทสเซียม (Potassium)",
      "symbol": "K",
      "status": "optimal" หรือ "deficient" หรือ "slightly_low",
      "score": 82,
      "interpretation": "คำอธิบายระดับ K",
      "symptomOnRice": "อาการที่สังเกตได้บนต้นข้าว"
    }
  },
  "primaryDisease": {
    "id": "blast" หรือ "bacterial_blight" หรือ "brown_spot" หรือ "healthy" หรือ "nitrogen_deficiency" หรือ "potassium_deficiency" หรือ "sheath_blight",
    "nameThai": "ชื่อโรคหรืออาการเป็นภาษาไทย",
    "nameEng": "English Name",
    "scientificName": "Scientific name",
    "pathogenType": "เชื้อรา / แบคทีเรีย / ปัจจัยกายภาพ",
    "confidence": 92,
    "severity": "ปกติ/ไม่พบโรค" หรือ "ระดับเริ่มต้น (เฝ้าระวัง)" หรือ "ระดับปานกลาง (ต้องรักษา)" หรือ "ระดับรุนแรง (ระบาด)",
    "keySymptoms": ["อาการสำคัญข้อที่ 1", "อาการสำคัญข้อที่ 2", "อาการสำคัญข้อที่ 3"],
    "comparisonAnalysis": "เปรียบเทียบอาการในรูปกับลักษณะของโรคมาตรฐาน",
    "treatment": {
      "bioMethod": ["วิธีชีวภัณฑ์/อินทรีย์ข้อ 1", "วิธีชีวภัณฑ์ข้อ 2"],
      "chemicalMethod": ["สารเคมีที่ขึ้นทะเบียนและอัตราใช้ข้อ 1", "ข้อ 2"],
      "fieldManagement": ["การดูแลแปลงนาข้อ 1", "ข้อ 2"]
    }
  },
  "waterPlan": {
    "action": "เติมน้ำด่วน" หรือ "รักษาระดับน้ำปกติ" หรือ "ระบายน้ำออก" หรือ "แกล้งข้าว (ปล่อยแห้งสลับเปียก)",
    "recommendedDepthCm": "3-5 ซม.",
    "details": "คำแนะนำการจัดการน้ำอย่างละเอียดว่าต้องสูบน้ำเพิ่มไหม",
    "stageGuidance": "ข้อแนะนำตามระยะการเจริญเติบโตของข้าว"
  },
  "fertilizerPlan": {
    "recommendedFormula": "สูตรปุ๋ยหลัก เช่น 46-0-0 หรือ 16-20-0 หรือ 16-16-8",
    "secondaryFormula": "สูตรเสริมหรือสูตรทางใบ",
    "applicationRate": "อัตราการใส่ เช่น 15-20 กก./ไร่",
    "applicationMethod": "วิธีการใส่และช่วงเวลา เช่น หว่านช่วงเช้าหลังน้ำค้างแห้ง",
    "organicAlternative": "ปุ๋ยคอก/ปุ๋ยหมัก/น้ำหมักทางเลือก",
    "warningOrTips": "ข้อควรระวัง เช่น งดใส่ยูเรียหากพบโรคไหม้"
  },
  "soilAnalysis": {
    "soilType": "clay" หรือ "sandy_loam" หรือ "acid_sulfate" หรือ "loamy_clay" หรือ "sandy",
    "soilNameThai": "ดินเหนียวนาดำ / ดินร่วนปนทราย / ดินเปรี้ยว",
    "colorDescription": "คำอธิบายสีดิน",
    "fertilityScore": 85,
    "waterHoldingCapacity": 90,
    "approximatePh": "5.5 - 6.5",
    "suitableRiceVarieties": ["ขาวดอกมะลิ 105", "กข43", "กข6"],
    "soilImprovementAdvice": ["ข้อแนะนำปรับปรุงดิน 1", "ข้อ 2"],
    "recommendedBasalFertilizer": "สูตรปุ๋ยรองพื้นแนะนำ"
  }
}`;

    if (process.env.GEMINI_API_KEY && isValidBase64) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: sanitizedBase64,
                },
              },
              { text: userPrompt },
            ],
          },
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawJson = response.text || '';
        const parsed = JSON.parse(rawJson);
        return res.json({ success: true, source: 'gemini-3.8-flash', data: parsed });
      } catch (geminiError: any) {
        console.warn('Gemini vision API call error, falling back to local agronomist heuristics:', geminiError?.message);
      }
    } else if (process.env.GEMINI_API_KEY && !isValidBase64) {
      // In case image is not a valid raster binary (e.g. text or SVG string), send text prompt with RGB data
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        const rawJson = response.text || '';
        const parsed = JSON.parse(rawJson);
        return res.json({ success: true, source: 'gemini-3.8-flash-text', data: parsed });
      } catch (geminiTextErr: any) {
        console.warn('Gemini text prompt fallback note:', geminiTextErr?.message);
      }
    }

    // High quality agronomy fallback if API key is not yet provided
    return res.json({
      success: true,
      source: 'local-agronomist-engine',
      data: null // Frontend will seamlessly compute using the built-in colorAnalysis & diseaseDB
    });
  } catch (err: any) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการวิเคราะห์: ' + (err.message || '') });
  }
});

// Interactive Field Doctor Q&A Endpoint
app.post('/api/ask-doctor', async (req: Request, res: Response) => {
  try {
    const { question, currentContext } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'กรุณาระบุคำถาม' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: 'Soilpal ให้คำปรึกษาอัตโนมัติ: แนะนำให้ใส่ปุ๋ยแต่งหน้าสูตร 46-0-0 (10-15 กก./ไร่) ในระยะแตกกอร่วมกับ 16-20-0 และรักษาระดับน้ำที่ 3-5 ซม. หากพบโรคไหม้ควรงดยูเรียทันทีและฉีดพ่นไตรโคเดอร์มาช่วงแดดร่ม',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `คุณคือ "Soilpal" ผู้เชี่ยวชาญด้านการเกษตร ดิน และโรคพืชข้าว ตอบคำถามเกษตรกรชาวนาไทยอย่างเป็นกันเอง เข้าใจง่าย และให้แนวทางปฏิบัติที่ชัดเจน
บริบทการตรวจล่าสุด: ${JSON.stringify(currentContext || {})}
คำถามจากชาวนา: "${question}"

ตอบเป็นภาษาไทย กระชับ ไม่เยิ่นเย้อ เน้นสูตรปุ๋ย วิธีคุมน้ำ การปรับปรุงดิน และการแก้โรคที่ทำได้จริงทันที`,
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    res.status(500).json({ error: 'ไม่สามารถรับคำตอบได้ในขณะนี้' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Soilpal AI Server running at http://localhost:${PORT}`);
  });
}

startServer();

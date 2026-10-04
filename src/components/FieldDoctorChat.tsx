import React, { useState } from 'react';
import { Send, Bot, Sparkles, MessageSquare, Volume2, User } from 'lucide-react';
import { AnalysisResult } from '../types/rice';

interface Props {
  currentAnalysis: AnalysisResult | null;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const FieldDoctorChat: React.FC<Props> = ({ currentAnalysis }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'สวัสดีครับ ผม Soilpal ยินดีให้คำแนะนำเรื่องการดูแลนาข้าว การตรวจวิเคราะห์ดิน การใส่ปุ๋ย การคุมน้ำ หรือการรักษาโรคข้าว สอบถามเพิ่มเติมได้เลยครับ',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'ใส่ปุ๋ยตอนฝนตกชุกได้ไหม?',
    'ถ้าพบโรคไหม้ ต้องงดปุ๋ยอะไรบ้าง?',
    'วิธีแกล้งข้าว ปล่อยน้ำแห้งกี่วัน?',
    'ดินแบบนี้ควรใส่ปุ๋ยคอกเพิ่มเท่าไหร่?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          currentContext: currentAnalysis
            ? {
                mode: currentAnalysis.mode,
                disease: currentAnalysis.primaryDisease?.nameThai,
                healthScore: currentAnalysis.healthScore,
                recommendedFertilizer: currentAnalysis.fertilizerPlan?.recommendedFormula,
                waterPlan: currentAnalysis.waterPlan?.action,
              }
            : null,
        }),
      });

      const data = await response.json();
      const botReply = data.answer || 'ขออภัยครับ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';
      setMessages((prev) => [...prev, { role: 'assistant', text: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'คำแนะนำเบื้องต้น: แนะนำให้รักษาระดับน้ำ 3-5 ซม. ใส่ปุ๋ยแต่งหน้า 46-0-0 ควบคู่ 16-20-0 หรือ 16-16-8 และหมั่นตรวจแปลงช่วงเช้าเพื่อเฝ้าระวังโรคพืช',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              ปรึกษา Soilpal เพิ่มเติม (Field Q&A)
            </h4>
            <p className="text-[11px] text-stone-500">สอบถามข้อสงสัยเรื่องดิน ปุ๋ย น้ำ และโรคพืชได้ตลอดเวลา</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 text-xs ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs'
                  : 'bg-stone-100 text-stone-800 rounded-tl-xs border border-stone-200/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] font-bold opacity-70">
                  {msg.role === 'user' ? 'คำถามของคุณ' : 'Soilpal'}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.text)}
                    className="p-1 rounded-md hover:bg-stone-200 text-stone-500 transition"
                    title="อ่านออกเสียง"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 pl-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Soilpal กำลังพิมพ์คำตอบ...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="pt-2 border-t border-stone-100">
        <span className="text-[10px] text-stone-400 block mb-1.5 font-medium">คำถามที่พบบ่อย:</span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[11px] bg-stone-50 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-lg px-2.5 py-1 text-stone-600 transition"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถาม เช่น ใส่ปุ๋ยสูตรไหนดี หรือคุมน้ำยังไง..."
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition shrink-0 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

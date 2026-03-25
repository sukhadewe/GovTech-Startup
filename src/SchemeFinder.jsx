import { useState } from 'react'
import { ClipboardList, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react'

const QUESTIONS = {
  mr: [
    { q: 'तुमचे वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी आहे का?', yes: 1, no: 1 },
    { q: 'तुमची एकूण जमीन ३ एकर पेक्षा कमी आहे का?', options: [{ label: 'होय, ३ एकर पेक्षा कमी', next: 2 }, { label: 'नाही, ३-५ एकर', next: 2 }, { label: '५ एकर पेक्षा जास्त', next: 2 }] },
    { q: 'तुम्ही अनुसूचित जाती/जमाती (SC/ST) वर्गातील आहात का?', yes: 3, no: 3 },
    { q: 'तुमचे वय ८ ते ६० वर्षे दरम्यान आहे का?', yes: 4, no: 4 },
    { q: 'तुमच्याकडे सिंचनाची (विहीर/धरण) सोय आहे का?', yes: 'result', no: 'result' },
  ],
  hi: [
    { q: 'क्या आपकी वार्षिक आय ₹2.5 लाख से कम है?', yes: 1, no: 1 },
    { q: 'क्या आपकी कुल जमीन 3 एकड़ से कम है?', options: [{ label: 'हाँ, 3 एकड़ से कम', next: 2 }, { label: 'नहीं, 3-5 एकड़', next: 'result' }, { label: '5 एकड़ से ज्यादा', next: 'result' }] },
    { q: 'क्या आप अनुसूचित जाति/जनजाति (SC/ST) वर्ग से हैं?', yes: 3, no: 3 },
    { q: 'क्या आपकी उम्र 8 से 60 वर्ष के बीच है?', yes: 4, no: 4 },
    { q: 'क्या आपके पास सिंचाई (कुआं/नहर) की सुविधा है?', yes: 'result', no: 'result' },
  ],
  en: [
    { q: 'Is your annual income less than ₹2.5 Lakhs?', yes: 1, no: 1 },
    { q: 'Is your total land size less than 3 acres?', options: [{ label: 'Yes, < 3 acres', next: 2 }, { label: 'No, 3-5 acres', next: 'result' }, { label: 'No, > 5 acres', next: 'result' }] },
    { q: 'Do you belong to SC/ST or Minority category?', yes: 3, no: 3 },
    { q: 'Is your age between 18 and 60 years?', yes: 4, no: 4 },
    { q: 'Do you have irrigation facilities (Well/Canal)?', yes: 'result', no: 'result' },
  ],
}

const SCHEMES = {
  mr: [
    { name: 'PM-KISAN', desc: 'वार्षिक ₹६,००० अर्थसाहाय्य', tag: 'Direct Benefit' },
    { name: 'नमो शेतकरी योजना', desc: 'वार्षिक ₹६,००० अतिरिक्त लाभ', tag: 'State Scheme' },
    { name: 'कुसुम सोलर पंप', desc: '९०% सबसिडीवर सोलर पंप', tag: 'Subsidy' },
    { name: 'पीक विमा (PMFBY)', desc: 'किमान प्रीमियमवर पूर्ण विमा संरक्षण', tag: 'Insurance' },
    { name: 'गोपीनाथ मुंडे विमा', desc: 'अपघात विमा संरक्षण', tag: 'Protection' },
  ],
  hi: [
    { name: 'PM-KISAN', desc: 'वार्षिक ₹6,000 वित्तीय सहायता', tag: 'Direct Benefit' },
    { name: 'नमो शेतकरी योजना', desc: 'वार्षिक ₹6,000 अतिरिक्त लाभ', tag: 'State Scheme' },
    { name: 'कुसुम सोलर पंप', desc: '90% सब्सिडी पर सोलर पंप', tag: 'Subsidy' },
    { name: 'फसल बीमा (PMFBY)', desc: 'न्यूनतम प्रीमियम पर पूर्ण बीमा कवच', tag: 'Insurance' },
    { name: 'गोपीनाथ मुंडे बीमा', desc: 'दुर्घटना बीमा सुरक्षा', tag: 'Protection' },
  ],
  en: [
    { name: 'PM-KISAN', desc: '₹6,000/year direct financial aid', tag: 'Direct Benefit' },
    { name: 'Namo Shetkari Yojana', desc: 'Additional ₹6,000/year benefit', tag: 'State Scheme' },
    { name: 'Kusum Solar Pump', desc: '90% subsidy on Solar Pumps', tag: 'Subsidy' },
    { name: 'Crop Insurance (PMFBY)', desc: 'Full coverage at minimum premium', tag: 'Insurance' },
    { name: 'Gopinath Munde Bima', desc: 'Accident insurance protection', tag: 'Protection' },
  ],
}

const L = {
  mr: { title: 'प्रमाणित योजना पात्रता', start: 'क्विझ सुरू करा', yes: 'होय', no: 'नाही', result: 'तुमच्या उत्तरांनुसार खालील योजना उपलब्ध आहेत:', restart: 'पुन्हा तपासा' },
  hi: { title: 'प्रमाणित योजना पात्रता', start: 'क्विज़ शुरू करें', yes: 'हाँ', no: 'नहीं', result: 'आपके उत्तरों के अनुसार निम्न योजनाएं उपलब्ध हैं:', restart: 'फिर से जांचें' },
  en: { title: 'Certified Scheme Eligibility', start: 'Start Quiz', yes: 'Yes', no: 'No', result: 'Based on your answers, you qualify for:', restart: 'Check Again' },
}

export default function SchemeFinder({ lang = 'mr' }) {
  const [step, setStep] = useState(-1)
  const [done, setDone] = useState(false)
  const l = L[lang] || L.en
  const qs = QUESTIONS[lang] || QUESTIONS.en
  const schemes = SCHEMES[lang] || SCHEMES.en

  const handleAnswer = (next) => {
    if (next === 'result') { setDone(true); return }
    setStep(next)
  }

  if (done) {
    return (
      <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <ClipboardList size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/70 mb-1 block">Survey Results</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{l.title}</h3>
          </div>
        </div>

        <div className="space-y-4 flex-1 text-left">
          <p className="font-black text-gray-400 text-[10px] uppercase tracking-widest pl-1">{l.result}</p>
          <div className="space-y-4">
            {schemes.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-[24px] border border-gray-100 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-left relative z-10 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-gray-900 text-lg leading-tight">{s.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-[#1E3A8A] text-[9px] font-black uppercase tracking-wider rounded-md">{s.tag}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => { setStep(-1); setDone(false) }}
          className="w-full h-16 bg-[#1E3A8A] text-white rounded-[22px] font-black text-lg shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          {l.restart}
        </button>
      </div>
    )
  }

  if (step === -1) {
    return (
      <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <ClipboardList size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/70 mb-1 block">Eligibility</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{l.title}</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-4">
           <p className="text-gray-500 font-bold text-base leading-relaxed mb-8">
             {lang === 'mr' ? 'काही सोपे प्रश्न उत्तरे द्या आणि तुम्हाला कोणत्या योजना लागू होतात ते शोधा.' : lang === 'hi' ? 'कुछ आसान सवालों के जवाब दें और पता करें कि कौन सी योजनाएं आपके लिए हैं।' : 'Answer a few simple questions to find which government schemes apply to you.'}
           </p>
           <button 
            onClick={() => setStep(0)}
            className="w-full h-16 bg-[#1E3A8A] text-white rounded-[22px] font-black text-lg shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all cursor-pointer flex items-center justify-center gap-3 group"
           >
             {l.start} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    )
  }

  const current = qs[step]
  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
          <ClipboardList size={30} strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/70 mb-1 block">Step {step + 1}</span>
          <h3 className="text-2xl font-black text-gray-900 leading-tight">{l.title}</h3>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="p-8 bg-indigo-50/50 rounded-[32px] border-2 border-indigo-100/50 text-center">
           <p className="text-2xl font-black text-[#1E3A8A] tracking-tight">{current.q}</p>
        </div>

        {current.options ? (
          <div className="grid grid-cols-1 gap-3">
            {current.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.next)}
                className="w-full h-16 bg-white border-2 border-gray-100 rounded-[22px] font-black text-gray-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md transition-all cursor-pointer flex items-center justify-between px-6 group"
              >
                {opt.label} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAnswer(current.yes)}
              className="h-16 bg-emerald-500 text-white rounded-[22px] font-black text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {l.yes}
            </button>
            <button onClick={() => handleAnswer(current.no)}
              className="h-16 bg-white border-2 border-gray-100 text-gray-800 rounded-[22px] font-black text-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {l.no}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

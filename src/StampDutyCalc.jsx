import { useState } from 'react'
import { Calculator, IndianRupee } from 'lucide-react'

const RATES = {
  urban_male: { stamp: 6, reg: 1, surcharge: 1 },
  urban_female: { stamp: 5, reg: 1, surcharge: 1 },
  rural_male: { stamp: 4, reg: 1, surcharge: 0 },
  rural_female: { stamp: 3, reg: 1, surcharge: 0 },
}

const LABELS = {
  mr: { title: 'मुद्रांक शुल्क कॅल्क्युलेटर', propValue: 'मालमत्ता मूल्य (₹)', area: 'क्षेत्र', urban: 'शहरी', rural: 'ग्रामीण', buyer: 'खरेदीदार', male: 'पुरुष', female: 'महिला', stampDuty: 'मुद्रांक शुल्क', regFee: 'नोंदणी शुल्क', surcharge: 'अधिभार', total: 'एकूण खर्च', saved: 'महिला नावावर बचत' },
  hi: { title: 'स्टाम्प ड्यूटी कैल्कुलेटर', propValue: 'संपत्ति मूल्य (₹)', area: 'क्षेत्र', urban: 'शहरी', rural: 'ग्रामीण', buyer: 'खरीदार', male: 'पुरुष', female: 'महिला', stampDuty: 'स्टाम्प ड्यूटी', regFee: 'रजिस्ट्रेशन शुल्क', surcharge: 'सरचार्ज', total: 'कुल खर्च', saved: 'महिला नाम पर बचत' },
  en: { title: 'Stamp Duty Calculator', propValue: 'Property Value (₹)', area: 'Area Type', urban: 'Urban', rural: 'Rural', buyer: 'Buyer', male: 'Male', female: 'Female', stampDuty: 'Stamp Duty', regFee: 'Registration Fee', surcharge: 'Surcharge', total: 'Total Cost', saved: 'Save with Woman Buyer' },
}

const fmt = (n) => '₹' + n.toLocaleString('en-IN')

export default function StampDutyCalc({ lang = 'mr' }) {
  const [value, setValue] = useState(2000000)
  const [area, setArea] = useState('urban')
  const [gender, setGender] = useState('male')
  const L = LABELS[lang] || LABELS.en
  const key = `${area}_${gender}`
  const r = RATES[key]
  const stamp = Math.round(value * r.stamp / 100)
  const reg = Math.round(value * r.reg / 100)
  const sur = Math.round(value * r.surcharge / 100)
  const total = stamp + reg + sur
  const femKey = `${area}_female`
  const fR = RATES[femKey]
  const fTotal = Math.round(value * fR.stamp / 100) + Math.round(value * fR.reg / 100) + Math.round(value * fR.surcharge / 100)
  const saved = total - fTotal

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calculator size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-1 block">{L.title.split(' ')[0]}</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{L.title}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{L.propValue}</label>
          <div className="relative group">
            <input 
              type="number" value={value} onChange={e => setValue(Number(e.target.value) || 0)}
              className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-2xl text-[#1E3A8A] transition-all shadow-inner" 
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xl">₹</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{L.area}</label>
            <div className="flex bg-[#F1F5F9] rounded-[20px] p-1.5 border border-gray-100 shadow-sm">
              {['urban', 'rural'].map(a => (
                <button key={a} onClick={() => setArea(a)}
                  className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black transition-all cursor-pointer ${area === a ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}>
                  {a === 'urban' ? L.urban : L.rural}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{L.buyer}</label>
            <div className="flex bg-[#F1F5F9] rounded-[20px] p-1.5 border border-gray-100 shadow-sm">
              {['male', 'female'].map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`flex-1 py-3.5 rounded-[16px] text-[13px] font-black transition-all cursor-pointer ${gender === g ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}>
                  {g === 'male' ? L.male : L.female}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-100">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:border-[#1E3A8A]/30 transition-all group">
            <span className="font-bold text-gray-500 text-sm">{L.stampDuty} <span className="text-[#1E3A8A]/50 ml-1">({r.stamp}%)</span></span>
            <span className="font-black text-gray-900 group-hover:text-[#1E3A8A] transition-colors">{fmt(stamp)}</span>
          </div>
          <div className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:border-[#1E3A8A]/30 transition-all group">
            <span className="font-bold text-gray-500 text-sm">{L.regFee} <span className="text-[#1E3A8A]/50 ml-1">({r.reg}%)</span></span>
            <span className="font-black text-gray-900 group-hover:text-[#1E3A8A] transition-colors">{fmt(reg)}</span>
          </div>
        </div>

        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] group-hover:scale-105 transition-transform duration-500"></div>
          <div className="relative flex justify-between items-center p-7 text-white">
            <div className="flex flex-col">
              <span className="font-bold text-[11px] uppercase tracking-widest opacity-80 mb-1">{L.total}</span>
              <span className="font-black text-4xl leading-none">{fmt(total)}</span>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <IndianRupee size={28} />
            </div>
          </div>
        </div>

        {gender === 'male' && saved > 0 && (
          <div className="p-5 bg-emerald-50/50 rounded-[24px] border border-emerald-100 flex items-center gap-4 group">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
              <span className="text-xl">✨</span>
            </div>
            <p className="font-bold text-[13px] text-emerald-800 leading-tight">
              {L.saved} <span className="text-emerald-600 font-black block text-base mt-0.5">{fmt(saved)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Calculator } from 'lucide-react'

const L = {
  mr: { title: 'EMI कॅल्क्युलेटर', amount: 'कर्ज रक्कम (₹)', rate: 'व्याजदर (%)', tenure: 'कालावधी (वर्षे)', emi: 'मासिक EMI', totalInt: 'एकूण व्याज', totalAmt: 'एकूण रक्कम' },
  hi: { title: 'EMI कैल्कुलेटर', amount: 'लोन राशि (₹)', rate: 'ब्याज दर (%)', tenure: 'अवधि (वर्ष)', emi: 'मासिक EMI', totalInt: 'कुल ब्याज', totalAmt: 'कुल राशि' },
  en: { title: 'EMI Calculator', amount: 'Loan Amount (₹)', rate: 'Interest Rate (%)', tenure: 'Tenure (Years)', emi: 'Monthly EMI', totalInt: 'Total Interest', totalAmt: 'Total Amount' },
}

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export default function EMICalc({ lang = 'mr' }) {
  const [amt, setAmt] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(5)
  const l = L[lang] || L.en

  const r = rate / 100 / 12
  const n = years * 12
  const emi = r > 0 ? (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amt / n
  const totalAmt = emi * n
  const totalInt = totalAmt - amt

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calculator size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600/70 mb-1 block">{l.title.split(' ')[0]}</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{l.title}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{l.amount}</label>
          <div className="relative group">
            <input 
              type="number" value={amt} onChange={e => setAmt(Number(e.target.value) || 0)}
              className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-2xl text-[#1E3A8A] transition-all shadow-inner" 
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xl">₹</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{l.rate}</label>
            <input 
              type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value) || 0)}
              className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-5 h-14 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-xl text-text-main transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">{l.tenure}</label>
            <input 
              type="number" value={years} onChange={e => setYears(Number(e.target.value) || 1)}
              className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-5 h-14 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-xl text-text-main transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-100">
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-[#1E3A8A] group-hover:scale-105 transition-transform duration-500"></div>
          <div className="relative flex justify-between items-center p-7 text-white">
            <div className="flex flex-col">
              <span className="font-bold text-[11px] uppercase tracking-widest opacity-80 mb-1">{l.emi}</span>
              <span className="font-black text-4xl leading-none">{fmt(emi)}</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
               <span className="text-xl font-black">/mo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm text-center group hover:border-red-100 transition-all">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{l.totalInt}</span>
            <span className="block text-xl font-black text-red-600 transition-transform group-hover:scale-110">{fmt(totalInt)}</span>
          </div>
          <div className="p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm text-center group hover:border-[#1E3A8A]/30 transition-all">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{l.totalAmt}</span>
            <span className="block text-xl font-black text-[#1E3A8A] transition-transform group-hover:scale-110">{fmt(totalAmt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

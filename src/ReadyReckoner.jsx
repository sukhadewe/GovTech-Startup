import { useState } from 'react'
import { Map, Search, ChevronRight, Download, Calculator } from 'lucide-react'

const L = {
  mr: { title: 'रेडी रेकनर दर (मूल्य दर)', dist: 'जिल्हा निवडा', taluka: 'तालुका निवडा', village: 'गाव निवडा', search: 'दर शोधा', rateLabel: 'प्रति चौ. मी. दर', agri: 'शेती (Agri)', nonAgri: 'बिगरशेती (NA)', comm: 'व्यावसायिक', noData: 'दर उपलब्ध नाहीत', downloadTitle: 'पीडीएफ डाउनलोड करा' },
  hi: { title: 'रेडी रेकनर दर (मूल्य दर)', dist: 'जिला चुनें', taluka: 'तहसील चुनें', village: 'गांव चुनें', search: 'दर खोजें', rateLabel: 'प्रति वर्ग मी. दर', agri: 'कृषि (Agri)', nonAgri: 'गैर-कृषि (NA)', comm: 'व्यावसायिक', noData: 'दर उपलब्ध नहीं', downloadTitle: 'पीडीएफ डाउनलोड करें' },
  en: { title: 'Ready Reckoner Rates', dist: 'Select District', taluka: 'Select Taluka', village: 'Select Village', search: 'Search Rates', rateLabel: 'Rate per Sq.M', agri: 'Agricultural', nonAgri: 'Non-Agri (NA)', comm: 'Commercial', noData: 'Rates unknown', downloadTitle: 'Download PDF' },
}

const RATES_DB = {
  Pune: { Haveli: { 'Shivajinagar': { agri: 5000, na: 35000, comm: 70000 }, 'Kothrud': { agri: 4000, na: 25000, comm: 55000 } } },
  Mumbai: { Andheri: { 'Juhu': { agri: 15000, na: 120000, comm: 250000 }, 'Vile Parle': { agri: 10000, na: 90000, comm: 180000 } } },
  Nagpur: { Nagpur: { 'Dharampeth': { agri: 2000, na: 15000, comm: 30000 }, 'Sadar': { agri: 1500, na: 12000, comm: 25000 } } }
}

const fmt = (n) => '₹' + n.toLocaleString('en-IN')

export default function ReadyReckoner({ lang = 'mr' }) {
  const [dist, setDist] = useState('')
  const [taluka, setTaluka] = useState('')
  const [village, setVillage] = useState('')
  const [result, setResult] = useState(null)
  const l = L[lang] || L.en

  const districts = Object.keys(RATES_DB)
  const talukas = dist ? Object.keys(RATES_DB[dist]) : []
  const villages = dist && taluka ? Object.keys(RATES_DB[dist][taluka]) : []

  const handleSearch = () => {
    if (dist && taluka && village) {
      setResult(RATES_DB[dist][taluka][village])
    }
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Map size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-1 block">Value Rates</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{l.title}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2 flex-1">
        <div className="group relative">
           <select value={dist} onChange={e => { setDist(e.target.value); setTaluka(''); setVillage(''); setResult(null) }}
             className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-lg text-gray-800 transition-all appearance-none cursor-pointer"
           >
             <option value="" disabled>{l.dist}</option>
             {districts.map(d => <option key={d} value={d}>{d}</option>)}
           </select>
           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-[#1E3A8A] transition-colors"><ChevronRight className="rotate-90" /></div>
        </div>
        
        <div className="group relative">
           <select value={taluka} onChange={e => { setTaluka(e.target.value); setVillage(''); setResult(null) }} disabled={!dist}
             className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-lg text-gray-800 transition-all appearance-none disabled:opacity-50 cursor-pointer"
           >
             <option value="" disabled>{l.taluka}</option>
             {talukas.map(t => <option key={t} value={t}>{t}</option>)}
           </select>
           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-[#1E3A8A] transition-colors"><ChevronRight className="rotate-90" /></div>
        </div>

        <div className="group relative">
           <select value={village} onChange={e => { setVillage(e.target.value); setResult(null) }} disabled={!taluka}
             className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-lg text-gray-800 transition-all appearance-none disabled:opacity-50 cursor-pointer"
           >
             <option value="" disabled>{l.village}</option>
             {villages.map(v => <option key={v} value={v}>{v}</option>)}
           </select>
           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-[#1E3A8A] transition-colors"><ChevronRight className="rotate-90" /></div>
        </div>

        <button 
          onClick={handleSearch} disabled={!village} 
          className="w-full h-16 mt-4 bg-[#1E3A8A] text-white rounded-[22px] font-black text-lg shadow-lg shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3"
        >
          <Search size={22} /> {l.search}
        </button>
      </div>

      {result && (
        <div className="pt-8 border-t-2 border-dashed border-gray-100 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between px-1">
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{l.rateLabel}</span>
             <span className="text-xs font-bold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full">{village}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
               { label: l.agri, val: result.agri, color: 'emerald' },
               { label: l.nonAgri, val: result.na, color: 'blue' },
               { label: l.comm, val: result.comm, color: 'orange' }
            ].map((r, idx) => (
               <div key={idx} className={`p-5 bg-${r.color}-50/50 rounded-[28px] border border-${r.color}-100 flex flex-col justify-center text-center group hover:bg-${r.color}-50 transition-all`}>
                  <span className={`text-[10px] font-black text-${r.color}-600 uppercase tracking-widest mb-1`}>{r.label}</span>
                  <span className={`text-xl font-black text-${r.color}-900 group-hover:scale-110 transition-transform tracking-tight`}>{fmt(r.val)}</span>
               </div>
            ))}
          </div>

          <button className="w-full h-14 mt-4 flex items-center justify-center gap-3 bg-[#F8FAFC] border-2 border-gray-100 rounded-[18px] font-black text-sm text-[#1E3A8A] uppercase tracking-widest hover:bg-white hover:border-[#1E3A8A] transition-all group">
            <Download size={20} className="group-hover:translate-y-1 transition-transform" />
            {l.downloadTitle}
          </button>
        </div>
      )}
    </div>
  )
}

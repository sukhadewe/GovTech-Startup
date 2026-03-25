import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Search, Download, ChevronRight, CheckCircle2, Clock, FileText, X, Bookmark } from 'lucide-react'
import { useLang } from './LangContext'

const DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Beed',
  'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli',
  'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
  'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
  'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 'Parbhani',
  'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
]

const TALUKAS = {
  'Pune': ['Haveli', 'Mulshi', 'Maval', 'Khed', 'Ambegaon', 'Junnar', 'Shirur', 'Daund', 'Indapur', 'Baramati', 'Purandar', 'Bhor', 'Velhe'],
  'Nashik': ['Nashik', 'Sinnar', 'Igatpuri', 'Trimbakeshwar', 'Niphad', 'Chandwad', 'Malegaon', 'Baglan', 'Kalwan', 'Surgana', 'Dindori', 'Peth', 'Surgana'],
  'Nagpur': ['Nagpur Urban', 'Nagpur Rural', 'Hingna', 'Narkhed', 'Katol', 'Savner', 'Kalmeshwar', 'Ramtek', 'Mouda', 'Parseoni', 'Umred', 'Bhiwapur', 'Kuhi'],
  'Kolhapur': ['Karvir', 'Hatkanangle', 'Shirol', 'Panhala', 'Shahuwadi', 'Radhanagari', 'Gaganbawda', 'Bhudargad', 'Ajra', 'Chandgad', 'Bavada'],
  'Satara': ['Satara', 'Karad', 'Patan', 'Jawali', 'Mahabaleshwar', 'Wai', 'Khandala', 'Khatav', 'Koregaon', 'Man (Dahiwadi)', 'Phaltan'],
}
const DEFAULT_TALUKAS = ['Taluka 1', 'Taluka 2', 'Taluka 3', 'Taluka 4']

const VILLAGES = {
  'Haveli': ['Kothrud', 'Hadapsar', 'Wagholi', 'Uruli Kanchan', 'Loni Kalbhor', 'Mundhwa', 'Fursungi', 'Undri', 'Pisoli', 'Ambegaon BK'],
  'Shirur': ['Shirur', 'Ranjangaon', 'Koregaon Bhima', 'Shikrapur', 'Nighoj', 'Talegaon Dhamdhere'],
  'Mulshi': ['Mulshi', 'Pirangut', 'Lavasa', 'Tamhini', 'Paud', 'Bhugaon'],
}
const DEFAULT_VILLAGES = ['Village 1', 'Village 2', 'Village 3', 'Village 4', 'Village 5']

const MOCK_RESULTS = [
  { owner: 'Rajesh Vitthal Patil', area: '2.35 Hectare (5.80 Acre)', type: 'Agricultural (Irrigated)', lastMutation: 'Mar 2022', surveyNo: '142/1', village: '' },
  { owner: 'Sunita Anil Deshmukh', area: '1.20 Hectare (2.96 Acre)', type: 'Agricultural (Dryland)', lastMutation: 'Jul 2021', surveyNo: '88/A', village: '' },
  { owner: 'Mahadev Gangaram More', area: '3.00 Hectare (7.41 Acre)', type: 'Agricultural (Partially Irrigated)', lastMutation: 'Nov 2023', surveyNo: '201/B', village: '' },
]

const LABELS = {
  mr: {
    title: '७/१२ उतारा डाउनलोड',
    subtitle: 'माहिती भरा आणि तुमचा सातबारा मिळवा',
    step1: 'जिल्हा निवडा',
    step1hint: 'आपला जिल्हा निवडा',
    step2: 'तालुका निवडा',
    step2hint: 'तुमचा तालुका निवडा',
    step3: 'गाव निवडा',
    step3hint: 'तुमचे गाव निवडा',
    step4: 'सर्व्हे नंबर',
    step4hint: 'सर्व्हे नंबर किंवा नाव टाका',
    searchBtn: 'सातबारा शोधा',
    downloadPDF: 'PDF डाउनलोड करा',
    saveRecord: 'हा रेकॉर्ड सेव्ह करा (Login करा)',
    recentSearches: 'अलीकडील शोध',
    noRecent: 'अद्याप कोणताही शोध नाही',
    resultFound: 'रेकॉर्ड सापडला',
    ownerName: 'मालकाचे नाव',
    area: 'क्षेत्र',
    landType: 'प्रकार',
    lastMutation: 'शेवटचा फेरफार',
    surveyNo: 'सर्व्हे नंबर',
    disclaimer: '* हा नमुना डेटा आहे. अधिकृत नोंदी महाभूलेख पोर्टलवर तपासा.',
    newSearch: 'नवीन शोध',
    step: 'पायरी',
    of: 'पैकी',
    searching: 'शोधत आहे...',
  },
  hi: {
    title: '7/12 उतारा डाउनलोड',
    subtitle: 'जानकारी भरें और अपना सातबारा पाएं',
    step1: 'जिला चुनें',
    step1hint: 'अपना जिला चुनें',
    step2: 'तालुका चुनें',
    step2hint: 'अपना तालुका चुनें',
    step3: 'गांव चुनें',
    step3hint: 'अपना गांव चुनें',
    step4: 'सर्वे नंबर',
    step4hint: 'सर्वे नंबर या नाम दर्ज करें',
    searchBtn: 'सातबारा खोजें',
    downloadPDF: 'PDF डाउनलोड करें',
    saveRecord: 'इस रिकॉर्ड को सेव करें (Login करें)',
    recentSearches: 'हाल की खोजें',
    noRecent: 'अभी तक कोई खोज नहीं',
    resultFound: 'रिकॉर्ड मिला',
    ownerName: 'मालिक का नाम',
    area: 'क्षेत्र',
    landType: 'प्रकार',
    lastMutation: 'अंतिम फेरफार',
    surveyNo: 'सर्वे नंबर',
    disclaimer: '* यह नमूना डेटा है। आधिकारिक रिकॉर्ड महाभूलेख पोर्टल पर जांचें।',
    newSearch: 'नई खोज',
    step: 'चरण',
    of: 'में से',
    searching: 'खोज रहे हैं...',
  },
  en: {
    title: '7/12 Extract Download',
    subtitle: 'Fill in details and get your Satbara record',
    step1: 'Select District',
    step1hint: 'Choose your district',
    step2: 'Select Taluka',
    step2hint: 'Choose your taluka',
    step3: 'Select Village',
    step3hint: 'Choose your village',
    step4: 'Survey Number',
    step4hint: 'Enter survey number or owner name',
    searchBtn: 'Search Satbara',
    downloadPDF: 'Download PDF',
    saveRecord: 'Save this Record (Login)',
    recentSearches: 'Recent Searches',
    noRecent: 'No searches yet',
    resultFound: 'Record Found',
    ownerName: 'Owner Name',
    area: 'Area',
    landType: 'Land Type',
    lastMutation: 'Last Mutation',
    surveyNo: 'Survey No',
    disclaimer: '* This is sample data. For official records, check Mahabhulekh portal.',
    newSearch: 'New Search',
    step: 'Step',
    of: 'of',
    searching: 'Searching...',
  }
}

export default function SevenTwelveFlow({ onBack }) {
  const { lang } = useLang()
  const L = LABELS[lang] || LABELS.en
  const [step, setStep] = useState(1)
  const [district, setDistrict] = useState('')
  const [taluka, setTaluka] = useState('')
  const [village, setVillage] = useState('')
  const [surveyInput, setSurveyInput] = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ls_recent_712') || '[]')
    setRecentSearches(saved)
  }, [])

  const talukaList = TALUKAS[district] || DEFAULT_TALUKAS
  const villageList = VILLAGES[taluka] || DEFAULT_VILLAGES
  const filteredDistricts = DISTRICTS.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()))

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const r = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]
      const resultData = { ...r, surveyNo: surveyInput || r.surveyNo, village }
      setResult(resultData)
      setIsSearching(false)
      const newSearch = { district, taluka, village, surveyNo: surveyInput, time: new Date().toLocaleDateString() }
      const updated = [newSearch, ...recentSearches.slice(0, 2)]
      setRecentSearches(updated)
      localStorage.setItem('ls_recent_712', JSON.stringify(updated))
      setStep(5)
    }, 1200)
  }

  const reset = () => {
    setStep(1); setDistrict(''); setTaluka(''); setVillage('')
    setSurveyInput(''); setResult(null); setDistrictSearch('')
  }

  const progressPct = ((step - 1) / 4) * 100

  return (
    <div className="fixed inset-0 z-[70] bg-gradient-to-br from-[#0F1B4D] via-[#1E3A8A] to-[#1D4ED8] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-white/10">
        <button onClick={onBack} className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-black text-xl leading-tight">{L.title}</h1>
          <p className="text-white/60 text-xs font-bold mt-0.5">{L.subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{L.step} {Math.min(step, 4)} {L.of} 4</span>
        </div>
      </div>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="h-1 bg-white/10 mx-6 mt-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-10 pt-6">
        <AnimatePresence mode="wait">

          {/* STEP 1: District */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto"><MapPin size={32} className="text-emerald-400" /></div>
                <h2 className="text-2xl font-black text-white">{L.step1}</h2>
                <p className="text-white/60 font-bold text-sm">{L.step1hint}</p>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <p className="text-white/50 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Clock size={12} />{L.recentSearches}</p>
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => { setDistrict(s.district); setTaluka(s.taluka); setVillage(s.village); setSurveyInput(s.surveyNo); setStep(5); handleSearch() }}
                      className="w-full text-left bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition-all flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm">{s.district} › {s.taluka} › {s.village}</p>
                        <p className="text-white/50 text-xs mt-1">{s.surveyNo} · {s.time}</p>
                      </div>
                      <ChevronRight size={16} className="text-white/40" />
                    </button>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input value={districtSearch} onChange={e => setDistrictSearch(e.target.value)}
                  placeholder="Search district..." className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-5 h-14 text-white placeholder:text-white/30 font-bold outline-none focus:border-emerald-400 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto">
                {filteredDistricts.map(d => (
                  <button key={d} onClick={() => { setDistrict(d); setTaluka(''); setVillage(''); setStep(2) }}
                    className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/20 hover:border-emerald-400/50 transition-all group">
                    <p className="text-white font-bold text-sm leading-snug group-hover:text-emerald-300">{d}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Taluka */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div>
                <button onClick={() => setStep(1)} className="text-white/50 text-xs font-black flex items-center gap-1 mb-4 hover:text-white transition-colors"><ArrowLeft size={12} />{district}</button>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto"><MapPin size={32} className="text-cyan-400" /></div>
                  <h2 className="text-2xl font-black text-white">{L.step2}</h2>
                  <p className="text-white/60 font-bold text-sm">{L.step2hint}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {talukaList.map(t => (
                  <button key={t} onClick={() => { setTaluka(t); setVillage(''); setStep(3) }}
                    className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/20 hover:border-cyan-400/50 transition-all group">
                    <p className="text-white font-bold text-sm group-hover:text-cyan-300">{t}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Village */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div>
                <button onClick={() => setStep(2)} className="text-white/50 text-xs font-black flex items-center gap-1 mb-4 hover:text-white transition-colors"><ArrowLeft size={12} />{district} › {taluka}</button>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto"><MapPin size={32} className="text-yellow-400" /></div>
                  <h2 className="text-2xl font-black text-white">{L.step3}</h2>
                  <p className="text-white/60 font-bold text-sm">{L.step3hint}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {villageList.map(v => (
                  <button key={v} onClick={() => { setVillage(v); setStep(4) }}
                    className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/20 hover:border-yellow-400/50 transition-all group">
                    <p className="text-white font-bold text-sm group-hover:text-yellow-300">{v}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Survey Number */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div>
                <button onClick={() => setStep(3)} className="text-white/50 text-xs font-black flex items-center gap-1 mb-4 hover:text-white transition-colors"><ArrowLeft size={12} />{district} › {taluka} › {village}</button>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto"><FileText size={32} className="text-orange-400" /></div>
                  <h2 className="text-2xl font-black text-white">{L.step4}</h2>
                  <p className="text-white/60 font-bold text-sm">{L.step4hint}</p>
                </div>
              </div>

              {/* Location summary */}
              <div className="bg-white/10 border border-white/10 rounded-2xl p-5 space-y-1">
                {[district, taluka, village].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm font-bold">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    {s}
                  </div>
                ))}
              </div>

              <input value={surveyInput} onChange={e => setSurveyInput(e.target.value)}
                placeholder="e.g. 142/1 or Patil" className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 h-16 text-white placeholder:text-white/30 font-bold text-lg outline-none focus:border-orange-400 transition-all" />

              <button onClick={handleSearch} disabled={isSearching || !surveyInput.trim()}
                className="w-full h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 text-[#0F1B4D] rounded-2xl font-black text-lg shadow-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {isSearching ? <><div className="w-5 h-5 border-2 border-[#0F1B4D] border-t-transparent rounded-full animate-spin" />{L.searching}</> : <><Search size={22} />{L.searchBtn}</>}
              </button>
            </motion.div>
          )}

          {/* STEP 5: Result */}
          {step === 5 && result && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Success badge */}
              <div className="text-center space-y-3">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}
                  className="w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-400/30">
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-white">{L.resultFound} ✅</h2>
              </div>

              {/* Record Card */}
              <div className="bg-white rounded-[28px] p-7 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center">
                    <FileText size={24} className="text-[#1E3A8A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">सातबारा उतारा · 7/12 Extract</p>
                    <p className="text-[#1E3A8A] font-black text-sm">{result.village || village} · {district}</p>
                  </div>
                </div>

                {[
                  { label: L.ownerName, value: result.owner, bold: true },
                  { label: L.surveyNo, value: result.surveyNo },
                  { label: L.area, value: result.area },
                  { label: L.landType, value: result.type },
                  { label: L.lastMutation, value: result.lastMutation },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <span className="text-gray-400 font-bold text-sm">{item.label}</span>
                    <span className={`text-gray-900 text-right text-sm max-w-[55%] leading-snug ${item.bold ? 'font-black text-[#1E3A8A]' : 'font-bold'}`}>{item.value}</span>
                  </div>
                ))}

                <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100">{L.disclaimer}</p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button className="w-full h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 text-[#0F1B4D] rounded-2xl font-black text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Download size={22} />{L.downloadPDF}
                </button>
                <button className="w-full h-14 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                  <Bookmark size={18} />{L.saveRecord}
                </button>
                <button onClick={reset} className="w-full h-12 text-white/50 font-bold text-sm hover:text-white transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={16} />{L.newSearch}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

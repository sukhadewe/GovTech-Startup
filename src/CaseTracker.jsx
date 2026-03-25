import { useState } from 'react'
import { Map, AlertCircle, Clock, CheckCircle2, Search, ArrowRight } from 'lucide-react'

const L = {
  mr: { title: 'फेरफार ट्रॅकर (Case Status)', enterAppId: 'अर्जाचा क्रमांक टाका', placeholder: 'उदा. MR-1234567890', checkBtn: 'स्टेटस पहा', loading: 'माहिती शोधत आहे...', error: 'कृपया वैध अर्जाचा क्रमांक टाका', status: 'वर्तमान स्थिती', step1: 'अर्ज दाखल', step2: 'तलाठी तपासणी', step3: 'मंडळ अधिकारी मान्यता', step4: '७/१२ वर नोंद', noAlerts: 'तुमच्या जमिनीवरील नवीन सूचना', alert1: 'नवीन फेरफार नोंदवली गेली आहे', alert2: 'कर भरण्याची अंतिम मुदत - १५ दिवस' },
  hi: { title: 'फेरफार ट्रैकर (Case Status)', enterAppId: 'आवेदन संख्या डालें', placeholder: 'उदा. MR-1234567890', checkBtn: 'स्थिति जांचें', loading: 'जानकारी खोज रहा है...', error: 'कृपया वैध आवेदन संख्या डालें', status: 'वर्तमान स्थिति', step1: 'आवेदन दर्ज', step2: 'तलाठी जाँच', step3: 'मंडल अधिकारी मंजूरी', step4: '7/12 पर दर्ज', noAlerts: 'आपकी भूमि पर नई सूचनाएं', alert1: 'नया म्यूटेशन दर्ज किया गया है', alert2: 'कर भुगतान की अंतिम तिथि - 15 दिन' },
  en: { title: 'Mutation Tracker (Case Status)', enterAppId: 'Enter Application ID', placeholder: 'Ex. MR-1234567890', checkBtn: 'Check Status', loading: 'Fetching info...', error: 'Please enter a valid application ID', status: 'Current Status', step1: 'Application Filed', step2: 'Talathi Review', step3: 'Circle Officer Approval', step4: 'Added to 7/12', noAlerts: 'New Alerts on Your Land', alert1: 'New mutation entry registered', alert2: 'Tax payment deadline - 15 days' },
}

export default function CaseTracker({ lang = 'mr' }) {
  const [appId, setAppId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const l = L[lang] || L.en

  const handleTrack = () => {
    if (appId.length < 5) return alert(l.error)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResult({ currentStep: 2, steps: [l.step1, l.step2, l.step3, l.step4], date: '15 Mar 2026', office: 'Talathi Office, Haveli' })
    }, 1500)
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center">
          <Clock size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-text-main">{l.title}</h3>
          <p className="text-sm font-semibold text-text-sub mt-1">{l.noAlerts}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-sub/40" />
        <input 
          value={appId} onChange={e => setAppId(e.target.value)} placeholder={l.placeholder} 
          className="w-full bg-bg-primary border border-border-gray hover:border-[#1E3A8A] focus:border-[#1E3A8A] rounded-2xl pl-14 pr-32 py-5 outline-none font-bold text-lg transition-all shadow-sm"
        />
        <button onClick={handleTrack} className="absolute right-2 top-2 bottom-2 bg-[#1E3A8A] text-white px-6 rounded-xl font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer flex items-center gap-2">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : l.checkBtn}
        </button>
      </div>

      {result && (
        <div className="bg-bg-primary p-6 md:p-8 rounded-[24px] border border-border-gray mt-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-xl text-text-main">{l.status}</h4>
            <span className="bg-green-100 text-green-800 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest">{result.date}</span>
          </div>
          <div className="space-y-8 relative after:content-[''] after:absolute after:left-[19px] after:top-2 after:bottom-12 after:w-1 after:bg-border-gray">
            {result.steps.map((step, i) => (
              <div key={i} className={`flex items-start gap-6 relative z-10 ${i > result.currentStep ? 'opacity-40' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center border-4 border-bg-primary ${i < result.currentStep ? 'bg-green-500 text-white' : i === result.currentStep ? 'bg-[#1E3A8A] text-white shadow-[0_0_15px_rgba(30,58,138,0.5)]' : 'bg-gray-200 text-gray-500'}`}>
                  {i < result.currentStep ? <CheckCircle2 size={20} /> : <div className="w-3 h-3 bg-current rounded-full"></div>}
                </div>
                <div>
                  <h5 className={`font-black text-lg ${i <= result.currentStep ? 'text-text-main' : 'text-text-sub'}`}>{step}</h5>
                  {i === result.currentStep && <p className="text-sm font-bold text-[#1E3A8A] mt-1">{result.office}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Alerts */}
      <div className="pt-6 border-t border-border-gray space-y-3">
        <h4 className="font-bold text-text-main flex items-center gap-2 mb-4"><AlertCircle size={20} className="text-orange-500" /> Alerts</h4>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between group hover:bg-orange-100 transition-colors cursor-pointer">
          <span className="font-bold text-orange-800">{l.alert1}</span>
          <ArrowRight size={18} className="text-orange-600 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between group hover:bg-blue-100 transition-colors cursor-pointer">
          <span className="font-bold text-blue-800">{l.alert2}</span>
          <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  )
}

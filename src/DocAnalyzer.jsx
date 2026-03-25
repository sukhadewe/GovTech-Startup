import { useState } from 'react'
import { FileScan, UploadCloud, Info, CheckCircle2, ChevronRight } from 'lucide-react'

const L = {
  mr: { title: 'AI दस्तऐवज विश्लेषक', sub: 'कोणतेही कायदेशीर कागदपत्र अपलोड करा आणि AI कडून सोप्या भाषेत सारांश मिळवा.', uploadBtn: 'कागदपत्र अपलोड करा', scanBtn: 'विश्लेषण सुरू करा', loading: 'AI विश्लेषण करत आहे...', result: 'विश्लेषण पूर्ण', keyPoints: 'महत्त्वाचे मुद्दे', dragDrop: 'येथे कागदपत्र ड्रॅग आणि ड्रॉप करा' },
  hi: { title: 'AI दस्तावेज़ विश्लेषक', sub: 'कोई भी कानूनी दस्तावेज़ अपलोड करें और AI से आसान भाषा में सारांश पाएं।', uploadBtn: 'दस्तावेज़ अपलोड करें', scanBtn: 'विश्लेषण शुरू करें', loading: 'AI विश्लेषण कर रहा है...', result: 'विश्लेषण पूरा', keyPoints: 'मुख्य बिंदु', dragDrop: 'यहाँ दस्तावेज़ ड्रैग और ड्रॉप करें' },
  en: { title: 'AI Document Analyzer', sub: 'Upload any legal document and get an easy-to-understand summary from AI.', uploadBtn: 'Upload Document', scanBtn: 'Start Analysis', loading: 'AI is Analyzing...', result: 'Analysis Complete', keyPoints: 'Key Points', dragDrop: 'Drag and drop document here' },
}

export default function DocAnalyzer({ lang = 'mr' }) {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle, uploading, scanning, done
  const l = L[lang] || L.en

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus('scanning')
      setTimeout(() => setStatus('done'), 2500)
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4 border-b border-border-gray pb-6">
        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
          <FileScan size={28} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-text-main">{l.title}</h3>
            <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-widest">WOW Factor</span>
          </div>
          <p className="text-sm font-semibold text-text-sub mt-1 leading-relaxed">{l.sub}</p>
        </div>
      </div>

      {status === 'idle' && (
        <label className="border-2 border-dashed border-border-gray hover:border-[#1E3A8A] rounded-[32px] p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-bg-primary group">
          <div className="w-20 h-20 bg-white rounded-full shadow-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <UploadCloud size={32} className="text-[#1E3A8A]" />
          </div>
          <p className="text-xl font-bold text-text-main mb-2">{l.dragDrop}</p>
          <p className="text-xs font-semibold text-text-sub uppercase tracking-wider mb-8">PDF, PNG, JPG (Max 5MB)</p>
          <span className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1D4ED8] transition-colors shadow-lg">
            {l.uploadBtn} <ChevronRight size={18} />
          </span>
          <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} />
        </label>
      )}

      {status === 'scanning' && (
        <div className="p-10 flex flex-col items-center justify-center bg-bg-primary rounded-[32px] border border-border-gray animate-pulse">
          <div className="w-20 h-20 border-4 border-[#1E3A8A]/20 border-t-[#1E3A8A] rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-black text-[#1E3A8A]">{l.loading}</p>
          <p className="text-sm font-semibold text-text-sub mt-2">{file?.name}</p>
        </div>
      )}

      {status === 'done' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-green-600" />
              <div>
                <p className="font-bold text-green-800">{l.result}</p>
                <p className="text-xs font-semibold text-green-700">{file?.name}</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); setStatus('idle') }} className="text-sm font-bold text-green-700 hover:underline">
              {lang === 'mr' ? 'नवीन कागदपत्र' : lang === 'hi' ? 'नया दस्तावेज़' : 'New Document'}
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-text-main text-lg flex items-center gap-2"><Info size={20} className="text-[#1E3A8A]" /> {l.keyPoints}</h4>
            <div className="bg-bg-primary p-6 rounded-[24px] border border-border-gray space-y-4">
              <p className="font-semibold text-text-sub leading-relaxed">
                {lang === 'mr' ? 'हा एक खरेदी खताचा (Sale Deed) दस्तऐवज आहे. मालमत्ता "शिवाजी नगर, पुणे" येथे स्थित आहे. खरेदीचे मूल्य ₹१,०५,००,००० दर्शविले आहे. दस्तावर मागील मालक आणि नवीन खरेदीदार यांच्या सह्या आहेत. कोणतेही थकीत कर्ज किंवा बोजा दिसत नाही.' 
                : lang === 'hi' ? 'यह एक बिक्री विलेख (Sale Deed) दस्तावेज़ है। संपत्ति "शिवाजी नगर, पुणे" में स्थित है। खरीद मूल्य ₹1,05,00,000 दर्शाया गया है। दस्तावेज़ पर पिछले मालिक और नए खरीदार के हस्ताक्षर हैं। कोई बकाया ऋण या बोझ नहीं दिख रहा है।' 
                : 'This is a Sale Deed document. The property is located in "Shivaji Nagar, Pune". The purchase value indicated is ₹1,05,00,000. It bears signatures of the previous owner and the new buyer. No encumbrances are visible.'}
              </p>
              <div className="inline-flex font-bold text-xs bg-orange-100 text-orange-800 px-3 py-1.5 rounded uppercase tracking-wide">
                AI Confidence: 94%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

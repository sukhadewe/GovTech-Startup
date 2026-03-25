import { useState } from 'react'
import { FileText, Download, ChevronRight } from 'lucide-react'

const TEMPLATES = [
  { id: 'sale', icon: '📝', mr: 'खरेदी खत (Sale Deed)', hi: 'बिक्री विलेख (Sale Deed)', en: 'Sale Deed Format', size: '1.2 MB', ext: 'PDF' },
  { id: 'lease', icon: '📄', mr: 'भाडेपट्टा (Lease Agreement)', hi: 'लीज एग्रीमेंट', en: 'Lease Agreement', size: '845 KB', ext: 'DOCX' },
  { id: 'gift', icon: '🎁', mr: 'बक्षीस पत्र (Gift Deed)', hi: 'उपहार विलेख', en: 'Gift Deed Format', size: '1.5 MB', ext: 'PDF' },
  { id: 'power', icon: '⚡', mr: 'कुलमुखत्यार पत्र (Power of Attorney)', hi: 'पावर ऑफ अटॉर्नी', en: 'Power of Attorney', size: '920 KB', ext: 'DOCX' },
  { id: 'partition', icon: '✂️', mr: 'वाटप पत्र (Partition Deed)', hi: 'बंटवारा विलेख', en: 'Partition Deed', size: '1.1 MB', ext: 'PDF' },
  { id: 'affidavit', icon: '📜', mr: 'प्रतिज्ञापत्र (General Affidavit)', hi: 'शपथ पत्र', en: 'General Affidavit', size: '500 KB', ext: 'DOCX' },
]

const L = {
  mr: { title: 'दस्तऐवज नमुने (Templates)', sub: 'महत्त्वाचे कायदेशीर नमुने डाउनलोड करा', download: 'डाउनलोड' },
  hi: { title: 'दस्तावेज़ टेम्पलेट', sub: 'महत्वपूर्ण कानूनी टेम्पलेट डाउनलोड करें', download: 'डाउनलोड' },
  en: { title: 'Document Templates', sub: 'Download important legal document formats', download: 'Download' },
}

export default function DocTemplates({ lang = 'mr' }) {
  const l = L[lang] || L.en

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-text-main">{l.title}</h3>
          <p className="text-sm font-semibold text-text-sub mt-1">{l.sub}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="p-4 bg-bg-primary rounded-2xl border border-border-gray flex items-center justify-between group hover:border-[#1E3A8A] transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <h4 className="font-bold text-text-main group-hover:text-[#1E3A8A] transition-colors">
                  {lang === 'mr' ? t.mr : lang === 'hi' ? t.hi : t.en}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-text-sub uppercase bg-white px-2 py-0.5 rounded border border-border-gray">{t.ext}</span>
                  <span className="text-xs font-semibold text-text-sub">{t.size}</span>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-xl bg-white border border-border-gray flex items-center justify-center text-text-sub group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] transition-all">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

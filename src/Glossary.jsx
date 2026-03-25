import { useState } from 'react'
import { BookOpen, Search } from 'lucide-react'

const TERMS = [
  { mr: 'फेरफार', hi: 'फेरफार', en: 'Mutation', def_mr: 'मालमत्तेच्या मालकी हक्कात बदल झाल्यावर महसूल नोंदींमध्ये नवीन मालकाचे नाव नोंदवणे.', def_hi: 'संपत्ति की मालिकी बदलने पर राजस्व रिकॉर्ड में नए मालिक का नाम दर्ज करना।', def_en: 'Recording new owner name in revenue records after property ownership change.' },
  { mr: 'वारस नोंद', hi: 'वारिस नोंद', en: 'Heir Entry', def_mr: 'मूळ मालकाच्या मृत्यूनंतर कायदेशीर वारसांची नावे ७/१२ वर नोंदवणे.', def_hi: 'मूल मालिक की मृत्यु के बाद कानूनी वारिसों के नाम 7/12 पर दर्ज करना।', def_en: 'Recording legal heirs on 7/12 after original owner\'s death.' },
  { mr: 'मोजणी', hi: 'मोजणी', en: 'Land Survey', def_mr: 'शासकीय भूमापकामार्फत जमिनीच्या सीमा मोजून चिन्हांकित करणे.', def_hi: 'सरकारी सर्वेयर द्वारा जमीन की सीमाएं मापकर चिन्हित करना।', def_en: 'Measuring and marking land boundaries by government surveyor.' },
  { mr: 'गुंठा', hi: 'गुंठा', en: 'Guntha', def_mr: 'जमीन मोजण्याचे एकक. १ गुंठा = १,०८९ चौ. फूट = १०१.१७ चौ. मीटर.', def_hi: 'जमीन मापने की इकाई। 1 गुंठा = 1,089 वर्ग फीट = 101.17 वर्ग मीटर।', def_en: 'Land measurement unit. 1 Guntha = 1,089 sq ft = 101.17 sq m.' },
  { mr: 'सातबारा', hi: 'सातबारा', en: '7/12 Extract', def_mr: 'जमिनीच्या मालकी हक्काचा प्रमुख दस्तऐवज. ७ मालकीची माहिती, १२ पीक व कर माहिती दर्शवतो.', def_hi: 'जमीन मालिकी का प्रमुख दस्तावेज़। 7 मालिकी, 12 फसल व कर जानकारी दर्शाता है।', def_en: 'Primary land ownership document. Part 7 shows ownership, Part 12 shows crop & tax details.' },
  { mr: '८अ उतारा', hi: '8A उतारा', en: '8A Extract', def_mr: 'जमिनीचे वर्गीकरण (शेती/बिगरशेती) दर्शवणारा दस्तऐवज.', def_hi: 'जमीन का वर्गीकरण (कृषि/गैर-कृषि) दर्शाने वाला दस्तावेज़।', def_en: 'Document showing land classification (agricultural/non-agricultural).' },
  { mr: 'NA परवानगी', hi: 'NA परमिशन', en: 'NA Permission', def_mr: 'शेतजमीन बिगरशेती वापरासाठी रूपांतरित करण्याची कायदेशीर परवानगी.', def_hi: 'कृषि भूमि को गैर-कृषि उपयोग में बदलने की कानूनी अनुमति।', def_en: 'Legal permission to convert agricultural land to non-agricultural use.' },
  { mr: 'तलाठी', hi: 'तलाठी', en: 'Talathi', def_mr: 'गाव पातळीवरील महसूल अधिकारी जो जमीन नोंदी राखतो.', def_hi: 'गांव स्तर का राजस्व अधिकारी जो जमीन रिकॉर्ड रखता है।', def_en: 'Village-level revenue officer who maintains land records.' },
  { mr: 'तहसीलदार', hi: 'तहसीलदार', en: 'Tehsildar', def_mr: 'तालुका पातळीवरील प्रमुख महसूल अधिकारी.', def_hi: 'तहसील स्तर का प्रमुख राजस्व अधिकारी।', def_en: 'Head revenue officer at taluka level.' },
  { mr: 'रेडी रेकनर', hi: 'रेडी रेकनर', en: 'Ready Reckoner', def_mr: 'शासनाने ठरवलेला मालमत्तेचा किमान बाजार दर. मुद्रांक शुल्क गणनेसाठी वापरला जातो.', def_hi: 'सरकार द्वारा निर्धारित संपत्ति का न्यूनतम बाजार दर। स्टाम्प ड्यूटी गणना के लिए उपयोग।', def_en: 'Government-set minimum market rate for properties. Used for stamp duty calculation.' },
  { mr: 'बोजा (Encumbrance)', hi: 'बोझा (Encumbrance)', en: 'Encumbrance', def_mr: 'मालमत्तेवरील कर्ज, गहाण किंवा कायदेशीर दावा.', def_hi: 'संपत्ति पर ऋण, गिरवी या कानूनी दावा।', def_en: 'Loan, mortgage, or legal claim on a property.' },
  { mr: 'खरेदी खत', hi: 'खरीद खत', en: 'Sale Deed', def_mr: 'मालमत्ता विक्रीचा कायदेशीर दस्तऐवज. उपनिबंधकाकडे नोंदणी अनिवार्य.', def_hi: 'संपत्ति बिक्री का कानूनी दस्तावेज़। उपनिबंधक कार्यालय में पंजीकरण अनिवार्य।', def_en: 'Legal document for property sale. Must be registered at Sub-Registrar office.' },
]

const L = {
  mr: { title: 'जमीन शब्दकोश', search: 'शब्द शोधा...' },
  hi: { title: 'भूमि शब्दकोश', search: 'शब्द खोजें...' },
  en: { title: 'Land Glossary', search: 'Search term...' },
}

export default function Glossary({ lang = 'mr' }) {
  const [q, setQ] = useState('')
  const l = L[lang] || L.en
  const filtered = q.trim() ? TERMS.filter(t => `${t.mr} ${t.hi} ${t.en}`.toLowerCase().includes(q.toLowerCase())) : TERMS

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center"><BookOpen size={24} /></div>
        <h3 className="text-2xl font-bold text-text-main">{l.title}</h3>
      </div>
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub/40" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={l.search}
          className="w-full bg-bg-primary border border-border-gray rounded-xl pl-12 pr-4 h-14 outline-none focus:border-[#1E3A8A] font-bold" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-border-gray shadow-soft hover:border-[#1E3A8A] transition-all">
            <h4 className="font-bold text-[#1E3A8A] text-lg">{lang === 'mr' ? t.mr : lang === 'hi' ? t.hi : t.en}</h4>
            {lang !== 'en' && <span className="text-xs font-semibold text-text-sub">({t.en})</span>}
            <p className="text-text-sub font-semibold text-sm mt-2 leading-relaxed">{lang === 'mr' ? t.def_mr : lang === 'hi' ? t.def_hi : t.def_en}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

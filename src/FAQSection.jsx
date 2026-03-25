import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = {
  mr: [
    { q: '७/१२ उतारा म्हणजे काय?', a: '७/१२ उतारा हा जमिनीच्या मालकी हक्काचा दस्तऐवज आहे. यात जमिनीचा सर्व्हे नंबर, क्षेत्र, मालकाचे नाव, पीक माहिती आणि कर्जाची नोंद असते.' },
    { q: 'फेरफार (म्युटेशन) म्हणजे काय?', a: 'जमिनीची मालकी बदलल्यावर महसूल नोंदींमध्ये नवीन मालकाचे नाव नोंदवण्याची प्रक्रिया म्हणजे फेरफार. विक्री, वारसा किंवा दानानंतर फेरफार अनिवार्य आहे.' },
    { q: 'ऑनलाइन ७/१२ कसा डाउनलोड करावा?', a: 'bhulekh.mahabhumi.gov.in वर जा → विभाग, जिल्हा, तालुका, गाव निवडा → सर्व्हे नंबर टाका → ₹१५ शुल्क भरा → डिजिटल ७/१२ डाउनलोड करा.' },
    { q: 'वारस नोंद कशी करावी?', a: 'मूळ मालकाच्या निधनानंतर तलाठी कार्यालयात मृत्यू प्रमाणपत्र, वारसांचे आधार कार्ड आणि शपथपत्र सादर करून वारस नोंदीसाठी अर्ज करा. १५-३० दिवसांत पूर्ण होते.' },
    { q: 'जमिनीची NA परवानगी कशी मिळवावी?', a: 'जिल्हाधिकारी कार्यालयात कलम ४४ अंतर्गत अर्ज करा. ७/१२, ८अ, ग्रामपंचायत NOC, आर्किटेक्ट प्लान आवश्यक. ३-६ महिने लागतात.' },
    { q: 'शेतजमिनीवर कर्ज कसे मिळवावे?', a: 'ताजा ७/१२, ८अ उतारा, फेरफार नोंद, जमीन कर पावती, आधार-पॅन घेऊन बँकेच्या होम ब्रांचमध्ये KCC किंवा टर्म लोनसाठी अर्ज करा.' },
    { q: 'PM-KISAN योजनेसाठी पात्रता काय आहे?', a: 'सर्व जमीनधारक शेतकरी कुटुंबे पात्र आहेत. सरकारी कर्मचारी, आयकर भरणारे आणि व्यावसायिक अपात्र आहेत. दरवर्षी ₹६,००० मिळतात.' },
    { q: 'पीक विमा क्लेम कसा करावा?', a: 'नुकसान झाल्यापासून ७२ तासांत टोल-फ्री 14447 वर कॉल करा किंवा PMFBY ॲप वापरा. फोटो काढा आणि बँकेला कळवा.' },
  ],
  hi: [
    { q: '7/12 उतारा क्या है?', a: '7/12 उतारा जमीन के मालिकाना हक का दस्तावेज़ है। इसमें सर्वे नंबर, क्षेत्र, मालिक का नाम, फसल जानकारी और कर्ज का रिकॉर्ड होता है।' },
    { q: 'फेरफार (म्यूटेशन) क्या है?', a: 'जमीन की मालिकी बदलने पर राजस्व रिकॉर्ड में नए मालिक का नाम दर्ज करने की प्रक्रिया। बिक्री, विरासत या दान के बाद अनिवार्य है।' },
    { q: 'ऑनलाइन 7/12 कैसे डाउनलोड करें?', a: 'bhulekh.mahabhumi.gov.in पर जाएं → विभाग, जिला, तहसील, गांव चुनें → सर्वे नंबर डालें → ₹15 शुल्क दें → डिजिटल 7/12 डाउनलोड करें।' },
    { q: 'वारस नोंद कैसे करें?', a: 'मूल मालिक की मृत्यु के बाद तलाठी कार्यालय में मृत्यु प्रमाणपत्र, वारिसों के आधार और शपथपत्र देकर आवेदन करें। 15-30 दिन लगते हैं।' },
    { q: 'NA परमिशन कैसे लें?', a: 'जिला कलेक्टर कार्यालय में धारा 44 के तहत आवेदन करें। 7/12, 8A, ग्रामपंचायत NOC, आर्किटेक्ट प्लान ज़रूरी। 3-6 महीने लगते हैं।' },
    { q: 'खेती की जमीन पर लोन कैसे लें?', a: 'ताजा 7/12, 8A, फेरफार, जमीन कर रसीद, आधार-पैन लेकर होम ब्रांच में KCC या टर्म लोन के लिए अप्लाई करें।' },
    { q: 'PM-KISAN की पात्रता क्या है?', a: 'सभी भूमिधारक किसान परिवार पात्र हैं। सरकारी कर्मचारी, आयकरदाता और प्रोफेशनल अपात्र हैं। सालाना ₹6,000 मिलते हैं।' },
    { q: 'फसल बीमा क्लेम कैसे करें?', a: 'नुकसान के 72 घंटे में 14447 पर कॉल करें या PMFBY ऐप इस्तेमाल करें। फोटो लें और बैंक को सूचित करें।' },
  ],
  en: [
    { q: 'What is a 7/12 extract?', a: 'The 7/12 extract is a land ownership document containing survey number, area, owner name, crop details, and encumbrance records.' },
    { q: 'What is Ferfar (Mutation)?', a: 'Mutation is the process of recording a new owner\'s name in revenue records after a property transfer through sale, inheritance, or gift.' },
    { q: 'How to download 7/12 online?', a: 'Visit bhulekh.mahabhumi.gov.in → Select division, district, taluka, village → Enter survey number → Pay ₹15 → Download digital 7/12.' },
    { q: 'How to do Waras Nond (Heir Entry)?', a: 'After the original owner\'s death, apply at the Talathi office with death certificate, heirs\' Aadhaar cards, and affidavit. Takes 15-30 days.' },
    { q: 'How to get NA permission?', a: 'Apply at District Collector office under Section 44. Need 7/12, 8A, Gram Panchayat NOC, architect plan. Takes 3-6 months.' },
    { q: 'How to get a loan on agricultural land?', a: 'Take latest 7/12, 8A, mutation entry, land tax receipt, Aadhaar-PAN to your home branch and apply for KCC or term loan.' },
    { q: 'What is PM-KISAN eligibility?', a: 'All landholding farmer families are eligible. Government employees, taxpayers, and professionals are ineligible. ₹6,000 per year.' },
    { q: 'How to file crop insurance claim?', a: 'Call toll-free 14447 within 72 hours of damage or use the PMFBY app. Take photos and inform your bank.' },
  ],
}

export default function FAQSection({ lang = 'mr' }) {
  const [open, setOpen] = useState(null)
  const items = FAQS[lang] || FAQS.en
  const title = { mr: 'वारंवार विचारले जाणारे प्रश्न', hi: 'अक्सर पूछे जाने वाले सवाल', en: 'Frequently Asked Questions' }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
          <HelpCircle size={24} />
        </div>
        <h3 className="text-2xl font-bold text-text-main">{title[lang]}</h3>
      </div>
      <div className="space-y-3">
        {items.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border-gray shadow-soft overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-bg-primary/50 transition-colors">
              <span className="font-bold text-text-main pr-4">{faq.q}</span>
              <ChevronDown size={20} className={`text-text-sub flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-text-sub font-semibold leading-relaxed border-t border-border-gray pt-4">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

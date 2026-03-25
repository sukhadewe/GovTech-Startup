import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Mic, FileText, RefreshCw, Handshake, Users, Map,
  ArrowLeft, Send, CheckCircle2, AlertCircle, Info,
  ChevronRight, Download, Building2, MapPin,
  Bell, User as UserIcon, Layout, HelpCircle, Clock,
  Shield, BookOpen, Phone, Mail, ExternalLink, Menu, X, MessageCircle,
  Sun, CloudRain, Calendar, Calculator, Link2, Wrench, Share2, ShieldCheck, Navigation, CloudSun,
  Star, Smartphone, ClipboardCheck, PhoneCall
} from 'lucide-react'
import translations from './i18n'
import { landKnowledge as LAND_KNOWLEDGE } from './landKnowledge'
import { LangProvider, useLang } from './LangContext'
import StampDutyCalc from './StampDutyCalc'
import FAQSection from './FAQSection'
import OfficeLocator from './OfficeLocator'
import SchemeFinder from './SchemeFinder'
import Glossary from './Glossary'
import EMICalc from './EMICalc'
import DocTemplates from './DocTemplates'
import ReadyReckoner from './ReadyReckoner'
import DocAnalyzer from './DocAnalyzer'
import CaseTracker from './CaseTracker'
import CommunityForum from './CommunityForum'
import FarmerProfile from './FarmerProfile'
import SevenTwelveFlow from './SevenTwelveFlow'

// 1. ERASED (MOVED TO LangContext.jsx)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 text-center bg-red-50 min-h-screen flex items-center justify-center">
          <div className="max-w-xl p-10 bg-white rounded-[32px] shadow-strong border-4 border-red-500">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">CRASH DETECTED</h1>
            <p className="text-red-600 font-mono text-lg bg-red-50 p-6 rounded-xl mb-6 border border-red-200">
              {this.state.error?.toString()}
            </p>
            <button onClick={() => window.location.reload()} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-red-700 transition-all">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// =====================================================
// 3. CONSTANTS
// =====================================================
const QUICK_ACTION_META = [
  { id: 'quiz', labelKey: 'schemeFinder', img: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Clipboard/3D/clipboard_3d.png' },
  { id: '712', labelKey: 'qa712Label', img: '/icons/icon_property.png' },
  { id: 'ferfar', labelKey: 'qaFerfarLabel', img: '/icons/icon_mutation.png' },
  { id: 'transfer', labelKey: 'qaTransferLabel', img: '/icons/icon_transfer.png' },
  { id: 'waras', labelKey: 'qaWarasLabel', img: '/icons/icon_heir.png' },
]

const BLOG_POSTS = [
  {
    id: 1,
    title: {
      mr: '७/१२ उतारा: एक सविस्तर मार्गदर्शक',
      hi: '7/12 उतारा: एक विस्तृत मार्गदर्शक',
      en: '7/12 Extract: A Comprehensive Guide'
    },
    date: '22 Mar 2026',
    image: '/blog/712_guide.png',
    contentKey: 'blogPost1Content',
    excerpt: {
      mr: '७/१२ उतारा म्हणजे काय आणि तो का महत्त्वाचा आहे ते जाणून घ्या.',
      hi: 'जानें कि 7/12 उतारा क्या है और यह क्यों महत्वपूर्ण है।',
      en: 'Learn what 7/12 extract is and why it is crucial for land owners.'
    }
  },
  {
    id: 2,
    title: {
      mr: 'नवीन जमीन कायदे: २०२६ चे अपडेट्स',
      hi: 'नए भूमि कानून: 2026 के अपडेट',
      en: 'New Land Laws: 2026 Updates'
    },
    date: '20 Mar 2026',
    image: '/blog/land_laws.png',
    contentKey: 'blogPost2Content',
    excerpt: {
      mr: 'या वर्षीच्या जमीन महसूल कायद्यातील महत्त्वाच्या बदलांची माहिती.',
      hi: 'इस वर्ष के भूमि राजस्व कानूनों में महत्वपूर्ण बदलावों की जानकारी।',
      en: 'Information about key changes in land revenue laws this year.'
    }
  },
  {
    id: 3,
    title: {
      mr: 'शेतकऱ्यांसाठी डिजिटल बँकिंगचे फायदे',
      hi: 'किसानों के लिए डिजिटल बैंकिंग के लाभ',
      en: 'Benefits of Digital Banking for Farmers'
    },
    date: '18 Mar 2026',
    image: '/blog/farmer_support.png',
    contentKey: 'blogPost3Content',
    excerpt: {
      mr: 'डिजिटल पद्धतीने व्यवहार करून वेळ आणि मजुरी कशी वाचवाल.',
      hi: 'डिजिटल लेनदेन करके समय और मजदूरी कैसे बचाएं।',
      en: 'How to save time and labor costs by using digital transactions.'
    }
  },
  {
    id: 4,
    title: {
      mr: 'प्रॉपर्टी म्युटेशन ऑनलाइन कसे करावे: संपूर्ण स्टेप-बाय-स्टेप गाइड',
      hi: 'प्रॉपर्टी म्यूटेशन ऑनलाइन कैसे करें: पूरी स्टेप-बाय-स्टेप गाइड',
      en: 'How to Do Property Mutation Online: Complete Step-by-Step Guide'
    },
    date: '16 Mar 2026',
    image: '/blog/mutation_online.png',
    contentKey: 'blogPost4Content',
    excerpt: {
      mr: 'ई-हक्क प्रणालीद्वारे घरबसल्या फेरफार कसा करायचा ते शिका.',
      hi: 'ई-हक्क प्रणाली से घर बैठे फेरफार कैसे करें, सीखें।',
      en: 'Learn how to complete property mutation from home using the E-Haqq system.'
    }
  },
  {
    id: 5,
    title: {
      mr: 'डिजिटल ७/१२ उतारा कायदेशीर आहे का? सत्य जाणून घ्या',
      hi: 'क्या डिजिटल 7/12 उतारा कानूनी रूप से मान्य है? सच्चाई जानें',
      en: 'Is Digital 7/12 Extract Legally Valid? Know the Truth'
    },
    date: '14 Mar 2026',
    image: '/blog/digital_712_legal.png',
    contentKey: 'blogPost5Content',
    excerpt: {
      mr: 'डिजिटल स्वाक्षरी असलेला ७/१२ बँक, कोर्ट आणि शासकीय कामांसाठी चालतो का?',
      hi: 'डिजिटल हस्ताक्षर वाला 7/12 बैंक, कोर्ट और सरकारी कामों में चलता है या नहीं?',
      en: 'Does digitally signed 7/12 work for banks, courts, and government offices?'
    }
  },
  {
    id: 6,
    title: {
      mr: 'जमीन फसवणूक कशी ओळखावी आणि टाळावी: ५ धोक्याचे संकेत',
      hi: 'जमीन धोखाधड़ी कैसे पहचानें और बचें: 5 खतरे के संकेत',
      en: 'How to Spot and Avoid Land Fraud: 5 Warning Signs'
    },
    date: '12 Mar 2026',
    image: '/blog/land_fraud.png',
    contentKey: 'blogPost6Content',
    excerpt: {
      mr: 'बनावट कागदपत्रे, बेकायदेशीर विक्री आणि दुबार विक्री कशी ओळखावी.',
      hi: 'नकली दस्तावेज़, अवैध बिक्री और दोहरी बिक्री को कैसे पहचानें।',
      en: 'How to identify fake documents, illegal sales, and double-selling scams.'
    }
  },
  {
    id: 7,
    title: {
      mr: 'PM-KISAN योजना नोंदणी: पात्रता, कागदपत्रे आणि स्टेटस चेक',
      hi: 'PM-KISAN योजना रजिस्ट्रेशन: पात्रता, दस्तावेज़ और स्टेटस चेक',
      en: 'PM-KISAN Registration: Eligibility, Documents & Status Check'
    },
    date: '10 Mar 2026',
    image: '/blog/pm_kisan.png',
    contentKey: 'blogPost7Content',
    excerpt: {
      mr: 'पीएम-किसान योजनेचे ₹६,००० वार्षिक अनुदान कसे मिळवायचे ते शिका.',
      hi: 'पीएम-किसान योजना के ₹6,000 वार्षिक अनुदान कैसे प्राप्त करें, सीखें।',
      en: 'Learn how to get ₹6,000 annual benefit under PM-KISAN scheme.'
    }
  },
  {
    id: 8,
    title: {
      mr: 'जमीन खरेदी करताना मुद्रांक शुल्क कसे वाचवायचे: कायदेशीर मार्ग',
      hi: 'जमीन खरीदते समय स्टाम्प ड्यूटी कैसे बचाएं: कानूनी तरीके',
      en: 'How to Save Stamp Duty When Buying Land: Legal Methods'
    },
    date: '8 Mar 2026',
    image: '/blog/stamp_duty.png',
    contentKey: 'blogPost8Content',
    excerpt: {
      mr: 'मुद्रांक शुल्कावर कायदेशीररित्या बचत करण्याचे ५ मार्ग.',
      hi: 'स्टाम्प ड्यूटी पर कानूनी रूप से बचत करने के 5 तरीके।',
      en: '5 legal ways to reduce stamp duty costs on property purchase.'
    }
  },
  {
    id: 9,
    title: {
      mr: 'शेतजमीन कर्जासाठी कोणती कागदपत्रे लागतात? बँक लोन गाइड',
      hi: 'खेती की जमीन पर लोन के लिए कौन से दस्तावेज़ चाहिए? बैंक लोन गाइड',
      en: 'Documents Required for Agricultural Land Loan: Bank Loan Guide'
    },
    date: '6 Mar 2026',
    image: '/blog/land_loan.png',
    contentKey: 'blogPost9Content',
    excerpt: {
      mr: 'शेतजमिनीवर बँक कर्ज मिळवण्यासाठी आवश्यक कागदपत्रे आणि प्रक्रिया.',
      hi: 'खेती की जमीन पर बैंक लोन प्राप्त करने के लिए जरूरी दस्तावेज़ और प्रक्रिया।',
      en: 'Essential documents and process for getting a bank loan on agricultural land.'
    }
  },
  {
    id: 10,
    title: {
      mr: 'वारसा हक्काने मिळालेली जमीन कशी वाटावी: वाटप प्रक्रिया',
      hi: 'विरासत में मिली जमीन का बंटवारा कैसे करें: वाटप प्रक्रिया',
      en: 'How to Partition Inherited Land: Complete Legal Process'
    },
    date: '4 Mar 2026',
    image: '/blog/partition.png',
    contentKey: 'blogPost10Content',
    excerpt: {
      mr: 'कुटुंबातील जमीन वाटपाची प्रक्रिया, कागदपत्रे आणि टिप्स.',
      hi: 'परिवार में जमीन बंटवारे की प्रक्रिया, दस्तावेज़ और टिप्स।',
      en: 'Process, documents, and tips for partitioning family-owned property.'
    }
  },
  {
    id: 11,
    title: {
      mr: 'पीक विमा क्लेम कसा करावा? PMFBY ऑनलाइन प्रक्रिया',
      hi: 'फसल बीमा क्लेम कैसे करें? PMFBY ऑनलाइन प्रक्रिया',
      en: 'How to File Crop Insurance Claim? PMFBY Online Process'
    },
    date: '2 Mar 2026',
    image: '/blog/crop_insurance.png',
    contentKey: 'blogPost11Content',
    excerpt: {
      mr: 'नैसर्गिक आपत्तीमुळे पीक नुकसान झाल्यास विमा क्लेम कसा करावा.',
      hi: 'प्राकृतिक आपदा से फसल नुकसान होने पर बीमा क्लेम कैसे करें।',
      en: 'Step-by-step guide to filing crop insurance claims after natural disasters.'
    }
  },
  {
    id: 12,
    title: {
      mr: 'शेतजमीन NA करण्याची प्रक्रिया: बिगरशेती परवानगी गाइड',
      hi: 'खेती की जमीन NA करने की प्रक्रिया: गैर-कृषि अनुमति गाइड',
      en: 'How to Convert Agricultural Land to NA: Non-Agricultural Permission Guide'
    },
    date: '28 Feb 2026',
    image: '/blog/na_conversion.png',
    contentKey: 'blogPost12Content',
    excerpt: {
      mr: 'शेतजमीन NA (Non-Agricultural) करण्यासाठी संपूर्ण प्रक्रिया.',
      hi: 'खेती की जमीन को NA (Non-Agricultural) में बदलने की पूरी प्रक्रिया।',
      en: 'Complete process for converting agricultural land to non-agricultural use.'
    }
  },
  {
    id: 13,
    title: {
      mr: 'सरकारी जमीन ई-लिलाव: ऑनलाइन बोली कशी लावावी',
      hi: 'सरकारी जमीन ई-नीलामी: ऑनलाइन बोली कैसे लगाएं',
      en: 'Government Land E-Auction: How to Bid Online'
    },
    date: '26 Feb 2026',
    image: '/blog/e_auction.png',
    contentKey: 'blogPost13Content',
    excerpt: {
      mr: 'सरकारी जमिनीच्या ई-लिलावात सहभागी होण्याची संपूर्ण माहिती.',
      hi: 'सरकारी जमीन की ई-नीलामी में भाग लेने की पूरी जानकारी।',
      en: 'Complete guide to participating in government land e-auctions.'
    }
  }
]

const LANGUAGES = [
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'ENG' },
]

// =====================================================
// 3. COMPONENTS
// =====================================================

// Common Button Component
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyles = "flex items-center justify-center gap-2 h-[56px] px-[24px] rounded-[14px] text-[16px] font-[600] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 whitespace-nowrap"
  const variants = {
    primary: "bg-[#1E3A8A] text-white hover:bg-[#1D4ED8]",
    secondary: "bg-white text-[#111827] border border-[#E5E7EB] hover:bg-gray-50",
    outline: "bg-transparent text-[#1E3A8A] border-2 border-[#1E3A8A] hover:bg-blue-50"
  }
  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

const Navbar = ({ onNavigate }) => {
  const { lang, setLang, t } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  const menuItems = [
    { id: 'home', label: t('navHome') },
    { id: 'chat', label: t('navAskAI') },
    { id: 'docs', label: t('navDocs') },
    { id: 'tools', label: t('navTools') },
    { id: 'blog', label: t('navBlog') },
    { id: 'help', label: t('navHelp') },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-soft border-b border-border-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => { onNavigate('home'); setIsOpen(false) }} className="flex items-center gap-2 md:gap-3 group">
          <div className="bg-[#1E3A8A] p-2 rounded-xl text-white">
            <Map size={24} />
          </div>
          <div className="text-left">
            <h1 className="font-bold text-lg md:text-xl leading-none text-[#1E3A8A]">{t('navTitle')}</h1>
            <p className="text-[10px] text-text-sub font-medium">{t('navSubtitle')}</p>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className="text-sm font-semibold text-text-sub hover:text-[#1E3A8A] transition-colors cursor-pointer capitalize">
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4 relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-text-sub hover:bg-bg-primary rounded-xl transition-colors cursor-pointer mr-1 border border-transparent hover:border-border-gray">
            <Bell size={22} className={showNotif ? 'text-[#1E3A8A]' : ''} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-sm"></span>
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }} 
                className="absolute top-16 right-0 md:right-16 w-[320px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-border-gray rounded-[24px] overflow-hidden origin-top-right z-50 py-1">
                <div className="px-5 py-4 border-b border-border-gray flex justify-between items-center bg-gray-50/50">
                  <span className="font-extrabold text-text-main text-[16px]">{t('notifTitle')}</span>
                  <span className="bg-[#1E3A8A] text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">2 {t('notifNew')}</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  <div className="p-5 border-b border-border-gray hover:bg-blue-50/50 cursor-pointer transition-colors relative group">
                    <span className="absolute top-6 left-4 w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></span>
                    <p className="font-bold text-sm text-text-main pl-5 leading-tight">{t('notif712Update')}</p>
                    <span className="text-xs font-semibold text-text-sub pl-5 mt-2 block opacity-70">12 mins ago</span>
                  </div>
                  <div className="p-5 hover:bg-blue-50/50 cursor-pointer transition-colors relative group">
                    <span className="absolute top-6 left-4 w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></span>
                    <p className="font-bold text-sm text-text-main pl-5 leading-tight">{t('notifCropInsu')}</p>
                    <span className="text-xs font-semibold text-text-sub pl-5 mt-2 block opacity-70">2 hours ago</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-border-gray text-center">
                  <button className="text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer">{t('notifViewAll')}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => onNavigate('profile')} title={lang === 'mr' ? 'डॅशबोर्ड' : 'Profile'} className="p-2 md:p-2.5 text-text-sub hover:bg-bg-primary rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border-gray">
            <UserIcon size={22} />
          </button>

          <div className="flex bg-bg-primary p-1 rounded-xl border border-border-gray">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer ${lang === l.code ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-text-sub hover:text-[#1E3A8A]'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-text-sub cursor-pointer">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-border-gray overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {menuItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { onNavigate(item.id); setIsOpen(false) }} 
                  className="block w-full text-left py-3 px-4 text-base font-semibold text-text-main hover:bg-bg-primary rounded-xl cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const ContactForm = () => {
  const { t } = useLang()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-[#1E3A8A]/5 p-8 rounded-3xl border border-[#1E3A8A]/10 text-center space-y-4">
        <div className="w-16 h-16 bg-[#16A34A] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 size={32} />
        </div>
        <h4 className="text-xl font-bold text-text-main">{t('formSuccess')}</h4>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-soft border border-border-gray space-y-6">
      <h3 className="text-2xl font-bold text-text-main">{t('formContactTitle')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-text-sub px-1">{t('formName')}</label>
            <input required type="text" className="w-full bg-bg-primary border border-border-gray rounded-[14px] px-5 h-[56px] outline-none focus:border-[#1E3A8A] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-text-sub px-1">{t('formMobile')}</label>
            <input required type="tel" className="w-full bg-bg-primary border border-border-gray rounded-[14px] px-5 h-[56px] outline-none focus:border-[#1E3A8A] transition-all" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-text-sub px-1">{t('formVillage')}</label>
          <input required type="text" className="w-full bg-bg-primary border border-border-gray rounded-[14px] px-5 h-[56px] outline-none focus:border-[#1E3A8A] transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-text-sub px-1">{t('formQuestion')}</label>
          <textarea required rows="1" className="w-full bg-bg-primary border border-border-gray rounded-[14px] px-5 py-4 outline-none focus:border-[#1E3A8A] transition-all resize-none min-h-[100px]"></textarea>
        </div>
        <Button type="submit" className="w-full">{t('formSubmit')}</Button>
      </form>
    </div>
  )
}

const DocumentForm = ({ onShowDocs }) => {
  const { t } = useLang()
  const [selected, setSelected] = useState('')

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-soft border border-border-gray space-y-6">
      <h3 className="text-2xl font-bold text-text-main">{t('formDocTitle')}</h3>
      <div className="space-y-4">
        <select 
          value={selected} 
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-bg-primary border border-border-gray rounded-[14px] px-5 h-[56px] outline-none focus:border-[#1E3A8A] transition-all font-semibold appearance-none"
        >
          <option value="">{t('formDocSelect')}</option>
          <option value="712">{t('qa712Label')}</option>
          <option value="ferfar">{t('qaFerfarLabel')}</option>
          <option value="transfer">{t('qaTransferLabel')}</option>
          <option value="waras">{t('qaWarasLabel')}</option>
          <option value="map">{t('qaMapLabel')}</option>
        </select>
        <Button onClick={() => onShowDocs(selected)} disabled={!selected} className="w-full group">
          {t('formDocBtn')} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

const DocumentChecklist = ({ type }) => {
  const { t } = useLang()
  
  const content = {
    '712': { title: t('docTitle712'), items: t('doc712Items') },
    'ferfar': { title: t('docTitleFerfar'), items: t('docFerfarItems') },
    'transfer': { title: t('docTitleTransfer'), items: t('docTransferItems') },
    'waras': { title: t('qaWarasLabel'), items: [t('qaWarasLabel')] },
    'map': { title: t('qaMapLabel'), items: [t('qaMapLabel')] },
  }

  const active = content[type] || content['ferfar']

  return (
    <div className="space-y-8 animate-fade-in-up px-4 max-w-4xl mx-auto py-10">
      <div className="flex items-center gap-4">
        <button onClick={() => window.location.hash = ''} className="p-3 bg-bg-primary rounded-2xl hover:bg-gray-200 transition-colors shadow-sm">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-text-main">{active.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active.items.map((item, i) => (
          <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-border-gray shadow-soft group hover:border-[#1E3A8A] transition-all">
            <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 size={20} />
            </div>
            <p className="font-bold text-lg text-text-main mt-0.5">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- NEW TOOL COMPONENTS ---

const LandConverter = () => {
  const { t } = useLang()
  const [val, setVal] = useState(1)
  const [unit, setUnit] = useState('acre')

  const sqMeters = unit === 'hec' ? val * 10000 : unit === 'acre' ? val * 4046.856 : unit === 'gun' ? val * 101.171 : val

  const results = [
    { label: t('labelHectare'), val: (sqMeters / 10000).toFixed(3) },
    { label: t('labelAcre'), val: (sqMeters / 4046.856).toFixed(3) },
    { label: t('labelGuntha'), val: (sqMeters / 101.171).toFixed(3) },
    { label: t('labelSqM'), val: Math.round(sqMeters) }
  ]

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calculator size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/70 mb-1 block">Converter</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{t('calcTitle')}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input 
              type="number" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} 
              className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] px-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-2xl text-[#1E3A8A] transition-all" 
            />
          </div>
          <select 
            value={unit} onChange={(e) => setUnit(e.target.value)}
            className="sm:w-40 bg-[#1E3A8A] text-white border-none rounded-[22px] px-6 h-16 outline-none font-black text-sm cursor-pointer shadow-lg hover:bg-[#1D4ED8] transition-all appearance-none text-center"
          >
            <option value="hec">{t('unitHectare')}</option>
            <option value="acre">{t('unitAcre')}</option>
            <option value="gun">{t('unitGuntha')}</option>
            <option value="sqm">{t('unitSqM')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t-2 border-dashed border-gray-100 mt-6 pt-6">
          {results.map((r, i) => (
            <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm hover:border-[#1E3A8A]/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1E3A8A] transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
              <span className="block text-[11px] uppercase font-black text-gray-400 tracking-wider mb-2">{r.label}</span>
              <span className="block text-2xl font-black text-gray-900 group-hover:text-[#1E3A8A] transition-colors">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const WeatherCard = () => {
  const { t } = useLang()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getWeather = () => {
    setLoading(true)
    setError(null)
    if (!navigator.geolocation) {
      setError(t('weatherPermission'))
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`)
        const json = await res.json()
        if (!json || !json.current || !json.daily) throw new Error('Invalid response')
        setData({
          temp: json.current.temperature_2m,
          rainProb: json.daily.precipitation_probability_max[0],
          lat: latitude,
          lon: longitude
        })
      } catch (err) {
        console.error("Weather fetch error:", err)
        setError(t('weatherError'))
      } finally {
        setLoading(false)
      }
    }, (err) => {
      console.warn("Geolocation error:", err)
      setError(t('weatherPermission'))
      setLoading(false)
    }, {
      timeout: 10000,
      enableHighAccuracy: false,
      maximumAge: 300000
    })
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Sun size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/70 mb-1 block">Live Update</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{t('weatherTitle')}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-4">
        {!data && !loading && !error && (
          <div className="space-y-6">
            <p className="text-gray-500 font-bold text-base leading-relaxed">{t('weatherDesc')}</p>
            <button 
              onClick={getWeather} 
              className="w-full bg-orange-500 text-white rounded-[22px] h-16 font-black text-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all cursor-pointer flex items-center justify-center gap-3 group"
            >
              <Navigation size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              {t('weatherBtn')}
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">{t('weatherLoading')}</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 rounded-[24px] border border-red-100 text-center space-y-4">
             <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto"><AlertCircle size={24} /></div>
             <p className="font-bold text-red-600 leading-tight">{error}</p>
             <button onClick={getWeather} className="text-sm font-black text-red-500 underline underline-offset-4 cursor-pointer">Retry</button>
          </div>
        )}

        {data && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Temperature</span>
                <span className="text-7xl font-black text-[#1E3A8A] tracking-tighter">{data.temp}<span className="text-3xl font-bold ml-1">°C</span></span>
              </div>
              <div className="text-right pb-2">
                <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 inline-block">
                  <span className="block text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{t('weatherRainProb')}</span>
                  <span className="text-2xl font-black text-blue-800">{data.rainProb}%</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-[28px] text-center flex items-center justify-center gap-4 border-2 transition-all ${data.rainProb > 30 ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-lg shadow-blue-500/10' : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-lg shadow-emerald-500/10'}`}>
              {data.rainProb > 30 ? <CloudRain size={28} /> : <CloudSun size={28} />}
              <span className="text-xl font-black">{data.rainProb > 30 ? t('weatherRain') : t('weatherClear')}</span>
            </div>

            <div className="flex items-center gap-3 justify-center text-[11px] font-black text-gray-400 uppercase tracking-widest opacity-60">
               <MapPin size={14} /> {t('weatherLocation')}: {data.lat.toFixed(2)}, {data.lon.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const OfficialLinks = () => {
  const { t } = useLang()
  const links = [
    { label: t('link712'), url: 'https://bhulekh.mahabhumi.gov.in/' },
    { label: t('linkChawdi'), url: 'https://digitalsatbara.mahabhumi.gov.in/aaplichawdi/' },
    { label: t('linkDigital'), url: 'https://digitalsatbara.mahabhumi.gov.in/' },
  ]

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Link2 size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-1 block">Quick Access</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{t('linksTitle')}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {links.map((link, i) => (
          <a 
            key={i} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-[24px] border border-gray-100 hover:border-[#1E3A8A] hover:bg-white hover:shadow-md transition-all group lg:p-6"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1E3A8A] shadow-sm group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                  <ExternalLink size={18} />
               </div>
               <span className="font-black text-gray-800 group-hover:text-[#1E3A8A] transition-colors">{link.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-[#1E3A8A] group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </div>
  )
}

const PanchangCard = () => {
  const { t, lang } = useLang()
  const [saka, setSaka] = useState('')
  const [std, setStd] = useState('')

  useEffect(() => {
    try {
      const now = new Date()
      const s = new Intl.DateTimeFormat('mr-IN', { calendar: 'indian', month: 'long', day: 'numeric', year: 'numeric' }).format(now)
      const d = new Intl.DateTimeFormat(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now)
      setSaka(s)
      setStd(d)
    } catch (e) {
      setSaka(new Date().toLocaleDateString())
    }
  }, [lang])

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600/70 mb-1 block">Tithi & Date</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{t('panchangTitle')}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center text-center space-y-4">
        <div className="relative inline-block mx-auto bg-purple-50 px-8 py-6 rounded-[32px] border border-purple-100 shadow-inner group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="block text-4xl font-black text-[#1E3A8A] tracking-tight">{saka || t('panchangLoading')}</span>
          <span className="block text-lg font-bold text-purple-800 mt-2 opacity-80">{std}</span>
        </div>
      </div>

      <div className="p-5 bg-bg-primary rounded-[24px] text-center text-xs font-black text-gray-400 uppercase tracking-widest border border-gray-100">
        {t('panchangDesc')}
      </div>
    </div>
  )
}

const BlogView = ({ onNavigate }) => {
  const { t, lang } = useLang()
  
  return (
    <div className="space-y-12 pb-20 px-4">
      <header className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[12px] font-bold text-[#1E3A8A] uppercase tracking-wide">
          <BookOpen size={16} /> {t('navBlogUpdates')}
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
          {t('blogTitleMain')}
        </h2>
        <p className="text-text-sub text-lg font-bold max-w-2xl mx-auto leading-relaxed">
          {t('blogSubtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {BLOG_POSTS.map((post) => (
          <motion.div 
            key={post.id} 
            whileHover={{ y: -10 }}
            className="bg-white rounded-[32px] overflow-hidden shadow-soft border border-border-gray hover:shadow-strong transition-all flex flex-col group"
          >
            <div className="h-48 md:h-64 overflow-hidden relative">
              <img 
                src={post.image} 
                alt={post.title[lang]} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-[#1E3A8A] border border-blue-50 shadow-sm">
                {post.date}
              </div>
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col">
              <h3 className="text-xl md:text-2xl font-black text-text-main leading-tight group-hover:text-[#1E3A8A] transition-colors">
                {post.title[lang]}
              </h3>
              <p className="text-text-sub font-semibold leading-relaxed flex-1">
                {post.excerpt[lang]}
              </p>
              <div className="pt-4 border-t border-border-gray flex items-center justify-between">
                <span className="text-xs font-bold text-text-sub/60 uppercase tracking-widest">{t('blogDate')}: {post.date}</span>
                <button onClick={() => onNavigate(`blog/${post.id}`)} className="text-[#1E3A8A] font-black text-sm flex items-center gap-1 group/btn cursor-pointer">
                  {t('blogReadMore')} 
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


const BlogPostDetail = ({ post, onBack, onNavigate }) => {
  const { t, lang } = useLang()
  const [isPlaying, setIsPlaying] = useState(false)
  
  if (!post) return null

  const handleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert(t('ttsError'))
      return
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const textToRead = `${post.title[lang]}. ` + t(post.contentKey)
    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9
    
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  // Ensure TTS stops when user navigates away
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-fade-in-up">
      <nav className="flex items-center gap-4 text-sm font-bold text-text-sub">
        <button onClick={onBack} className="hover:text-[#1E3A8A] transition-colors cursor-pointer">{t('blogHome')}</button>
        <ChevronRight size={14} />
        <span className="text-text-main truncate max-w-[200px] md:max-w-none">{post.title[lang]}</span>
      </nav>

      <header className="space-y-6">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[12px] font-bold text-[#1E3A8A] uppercase tracking-wide">
          <BookOpen size={16} /> {t('blogPostDetail')}
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black text-text-main leading-tight">
          {post.title[lang]}
        </h1>
        <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 border-b border-border-gray pb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#1E3A8A]" />
            <span className="text-sm font-bold text-text-sub">{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon size={18} className="text-[#1E3A8A]" />
            <span className="text-sm font-bold text-text-sub">Land Sathi Editor</span>
          </div>
          <button 
            onClick={handleTTS} 
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all focus:outline-none ${isPlaying ? 'bg-orange-100 text-orange-600 border border-orange-200 animate-pulse' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
          >
            {isPlaying ? <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-600 rounded-full animate-ping"></span>{t('ttsReading')}</span> : <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h4l5 5V3l-5 5H7a2 2 0 00-2 2z" /></svg>{t('ttsListen')}</span>}
          </button>
        </div>
      </header>

      <div className="rounded-[40px] overflow-hidden shadow-strong aspect-video">
        <img src={post.image} alt={post.title[lang]} className="w-full h-full object-cover" />
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          {t(post.contentKey).split('\n\n').map((para, i) => (
            <p key={i} className="text-xl md:text-2xl font-semibold text-text-main leading-relaxed">
              {para.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  {j < para.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>
        
        <div className="p-8 bg-bg-primary rounded-[32px] border border-border-gray space-y-4">
          <h2 className="text-2xl font-black text-[#1E3A8A] flex items-center gap-3">
            <Info size={28} /> {t('helpCard3Title')}
          </h2>
          <p className="font-semibold text-text-sub leading-loose">
            {t('blogPostDisclaimer')}
          </p>
        </div>

        <section className="space-y-6 pt-10">
          <h2 className="text-2xl font-black text-text-main">{t('relatedTopics')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {BLOG_POSTS.filter(p => p.id !== post.id).map(p => (
               <button key={p.id} onClick={() => onNavigate(`blog/${p.id}`)} className="text-left p-6 bg-white border border-border-gray rounded-2xl hover:border-[#1E3A8A] transition-all group cursor-pointer">
                 <h4 className="font-bold text-text-main group-hover:text-[#1E3A8A]">{p.title[lang]}</h4>
                 <div className="flex items-center gap-2 mt-2 text-[#1E3A8A] font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('blogReadMore')} <ChevronRight size={14} />
                 </div>
               </button>
             ))}
          </div>
        </section>
      </div>

      <footer className="pt-12 border-t border-border-gray text-center">
        <Button onClick={onBack} variant="outline" className="mx-auto">
          <ArrowLeft size={20} /> {t('backToBlog')}
        </Button>
      </footer>
    </article>
  )
}


// WhatsApp Share Button
const WhatsAppShare = ({ lang = 'mr' }) => {
  const shareUrl = window.location.href
  const text = lang === 'mr' ? 'Land Sathi - जमीन माहिती मार्गदर्शक 🏡' : lang === 'hi' ? 'Land Sathi - जमीन जानकारी मार्गदर्शक 🏡' : 'Land Sathi - Digital Land Records Guide 🏡'
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`
  return (
    <a href={waUrl} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer">
      <Share2 size={24} />
    </a>
  )
}

// =====================================================
// 4. TOOLS VIEW
// =====================================================

const ToolsView = ({ onNavigate }) => {
  const { lang, t } = useLang()
  const title = { mr: 'सर्व साधने आणि कॅल्क्युलेटर', hi: 'सभी उपकरण और कैल्कुलेटर', en: 'All Tools & Calculators' }
  const sub = { mr: 'जमीन व्यवहारासाठी आवश्यक सर्व साधने एकाच ठिकाणी', hi: 'भूमि लेनदेन के लिए सभी जरूरी उपकरण एक जगह', en: 'All essential tools for land transactions in one place' }

  return (
    <div className="space-y-12 pb-20 px-4">
      <header className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[12px] font-bold text-[#1E3A8A] uppercase tracking-wide">
          <Wrench size={16} /> {t('toolsCalculators')}
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">{title[lang]}</h2>
        <p className="text-text-sub text-lg font-bold max-w-2xl mx-auto leading-relaxed">{sub[lang]}</p>
      </header>

      {/* Calculators Row */}
      <section className="max-w-7xl mx-auto space-y-6">
        <h3 className="text-2xl font-black text-text-main flex items-center gap-3"><Calculator size={24} className="text-[#1E3A8A]" /> {lang === 'mr' ? 'कॅल्क्युलेटर आणि साधने' : lang === 'hi' ? 'कैल्कुलेटर और उपकरण' : 'Calculators & Tools'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StampDutyCalc lang={lang} />
          <EMICalc lang={lang} />
          <LandConverter />
        </div>
      </section>

      {/* Advanced Features (Tier 3) */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DocAnalyzer lang={lang} />
        <CaseTracker lang={lang} />
      </section>

      {/* Scheme Finder, Office Locator, Ready Reckoner */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SchemeFinder lang={lang} />
        <OfficeLocator lang={lang} />
        <ReadyReckoner lang={lang} />
      </section>

      {/* Document Templates & Community */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DocTemplates lang={lang} />
        <CommunityForum lang={lang} />
      </section>

      {/* Glossary */}
      <section className="max-w-7xl mx-auto">
        <Glossary lang={lang} />
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto">
        <FAQSection lang={lang} />
      </section>

      {/* Weather + Panchang + Links */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <WeatherCard />
        <PanchangCard />
        <OfficialLinks />
      </section>
    </div>
  )
}

// =====================================================
// 5. MAIN VIEWS
// =====================================================

const HomeView = ({ onNavigate, onSelectAction }) => {
  const { t, lang } = useLang()
  const [show712, setShow712] = useState(false)
  const [isLoggedIn] = useState(false) // false = guest, set to true to test logged-in view

  // Labels in current language
  const L = {
    heroBtn: lang === 'mr' ? '🌾 माझी जमीन शोधा (1 क्लिक)' : lang === 'hi' ? '🌾 मेरी जमीन खोजें (1 क्लिक)' : '🌾 Find My Land (1 Click)',
    heroSub: lang === 'mr' ? '७/१२ · फेरफार · नकाशा — सगळे एकाच ठिकाणी' : lang === 'hi' ? '7/12 · फेरफार · नक्शा — सब एक जगह' : '7/12 · Mutation · Map — all in one place',
    mainActions: lang === 'mr' ? 'मुख्य सेवा' : lang === 'hi' ? 'मुख्य सेवाएं' : 'Core Services',
    mainActionsHint: lang === 'mr' ? 'एक क्लिकमध्ये तुमचे काम सुरू करा' : lang === 'hi' ? 'एक क्लिक में अपना काम शुरू करें' : 'Start your work in one click',
    discoveryTitle: lang === 'mr' ? 'जलद माहिती' : lang === 'hi' ? 'त्वरित जानकारी' : 'Quick Info',
    guestTitle: lang === 'mr' ? 'Login करा आणि जास्त फायदे मिळवा' : lang === 'hi' ? 'Login करें और अधिक लाभ पाएं' : 'Login for more features',
    guestSub: lang === 'mr' ? 'रेकॉर्ड सेव्ह करा, अलर्ट मिळवा, इतिहास पाहा' : lang === 'hi' ? 'रिकॉर्ड सेव करें, अलर्ट पाएं, इतिहास देखें' : 'Save records, get alerts, view history',
    loginBtn: lang === 'mr' ? 'Login / Register →' : lang === 'hi' ? 'Login / Register →' : 'Login / Register →',
    addLand: lang === 'mr' ? '+ नवीन जमीन जोडा' : lang === 'hi' ? '+ नई जमीन जोड़ें' : '+ Add New Land',
  }

  const PRIMARY_ACTIONS = [
    {
      id: '712-wizard',
      icon: <FileText size={32} className="text-white" />,
      label: lang === 'mr' ? '७/१२ डाउनलोड' : lang === 'hi' ? '7/12 डाउनलोड' : '7/12 Download',
      sub: lang === 'mr' ? 'सातबारा उतारा' : lang === 'hi' ? 'सातबारा उतारा' : 'Satbara Extract',
      color: 'from-[#1E3A8A] to-[#2563EB]',
      shadow: 'shadow-blue-500/30',
      action: () => setShow712(true)
    },
    {
      id: 'stamp',
      icon: <Calculator size={32} className="text-white" />,
      label: lang === 'mr' ? 'मुद्रांक शुल्क' : lang === 'hi' ? 'स्टाम्प ड्यूटी' : 'Stamp Duty',
      sub: lang === 'mr' ? 'कॅल्क्युलेटर' : lang === 'hi' ? 'कैलकुलेटर' : 'Calculator',
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30',
      action: () => onNavigate('tools')
    },
    {
      id: 'property',
      icon: <Building2 size={32} className="text-white" />,
      label: lang === 'mr' ? 'मालमत्ता माहिती' : lang === 'hi' ? 'संपत्ति जानकारी' : 'Property Info',
      sub: lang === 'mr' ? 'रेकॉर्ड तपासा' : lang === 'hi' ? 'रिकॉर्ड देखें' : 'Record Check',
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-purple-500/30',
      action: () => onSelectAction('712')
    },
  ]

  const DISCOVERY_CARDS = [
    {
      emoji: '🧾',
      title: lang === 'mr' ? 'Offline Records' : lang === 'hi' ? 'Offline Records' : 'Offline Records',
      benefit: lang === 'mr' ? 'Internet नसताना पण पाहा' : lang === 'hi' ? 'Internet न हो, तो भी देखें' : 'View even without internet',
      color: 'from-gray-800 to-indigo-900',
      action: () => onNavigate('profile')
    },
    {
      emoji: '🌾',
      title: 'PM Kisan Status',
      benefit: lang === 'mr' ? '₹6,000 येणार का? चेक करा' : lang === 'hi' ? '₹6,000 आएगा? चेक करें' : 'Check if ₹6,000 is coming',
      color: 'from-orange-500 to-red-500',
      action: () => onSelectAction('quiz')
    },
    {
      emoji: '✍️',
      title: lang === 'mr' ? 'Digital Sign ७/१२' : 'Digital Sign 7/12',
      benefit: lang === 'mr' ? 'बँकेसाठी अधिकृत प्रत मिळवा' : lang === 'hi' ? 'बैंक के लिए आधिकारिक प्रति' : 'Official copy for bank use',
      color: 'from-blue-500 to-indigo-600',
      action: () => setShow712(true)
    },
    {
      emoji: '📊',
      title: lang === 'mr' ? 'Market Rate 2026' : 'Market Rate 2026',
      benefit: lang === 'mr' ? 'जमिनीची सरकारी किंमत पाहा' : lang === 'hi' ? 'सरकारी जमीन दर देखें' : 'Check official land rates',
      color: 'from-purple-500 to-pink-600',
      action: () => onNavigate('tools')
    },
  ]

  return (
    <>
      {/* 7/12 Wizard Overlay */}
      <AnimatePresence>
        {show712 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SevenTwelveFlow onBack={() => setShow712(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10 px-4 pb-24 pt-4 max-w-2xl mx-auto">

        {/* 1. Header */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('profile')} className="w-12 h-12 bg-[#1E3A8A] rounded-[18px] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all">
              <UserIcon size={22} />
            </button>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                {isLoggedIn ? 'Rajesh Patil' : (lang === 'mr' ? 'स्वागत आहे 👋' : lang === 'hi' ? 'स्वागत है 👋' : 'Welcome 👋')}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Land Sathi</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50"><Bell size={20} /></button>
            <button onClick={() => onNavigate('chat')} className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all"><MessageCircle size={20} /></button>
          </div>
        </section>

        {/* 2. HERO: माझी जमीन शोधा */}
        <motion.section whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <button onClick={() => setShow712(true)} className="w-full relative overflow-hidden bg-gradient-to-br from-[#0F1B4D] via-[#1E3A8A] to-[#2563EB] rounded-[28px] p-6 text-left shadow-[0_20px_60px_rgba(30,58,138,0.35)] group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full -ml-8 -mb-8 blur-xl" />
            <div className="relative flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-emerald-400/20 border border-emerald-400/30 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-300 text-[10px] font-black uppercase tracking-widest">Free • No Login</span>
                </div>
                <h1 className="text-2xl font-black text-white leading-tight">{L.heroBtn}</h1>
                <p className="text-white/60 text-xs font-bold">{L.heroSub}</p>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-white/20 transition-all shrink-0 ml-4">
                🔍
              </div>
            </div>
          </button>
        </motion.section>

        {/* 3. 3 PRIMARY CTAs */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-gray-900 text-base">{L.mainActions}</h3>
              <p className="text-gray-400 text-xs font-bold">{L.mainActionsHint}</p>
            </div>
            <button onClick={() => onNavigate('tools')} className="text-[#1E3A8A] text-xs font-black hover:underline">
              {lang === 'mr' ? 'सर्व पाहा →' : lang === 'hi' ? 'सब देखें →' : 'See all →'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {PRIMARY_ACTIONS.map((action, i) => (
              <motion.button
                key={action.id}
                onClick={action.action}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`bg-gradient-to-br ${action.color} rounded-[22px] p-5 text-left shadow-xl ${action.shadow} flex flex-col gap-4 cursor-pointer active:opacity-90 transition-all`}
              >
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
                  {action.icon}
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-tight">{action.label}</p>
                  <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-wider">{action.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 4. GUEST / LOGIN CARD */}
        {!isLoggedIn ? (
          <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-[24px] p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-black text-gray-900 text-sm">{L.guestTitle}</h4>
              <p className="text-gray-500 text-xs font-bold">{L.guestSub}</p>
            </div>
            <button onClick={() => onNavigate('profile')} className="shrink-0 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-2xl font-black text-xs whitespace-nowrap shadow-md hover:bg-[#1D4ED8] transition-all">
              {L.loginBtn}
            </button>
          </section>
        ) : (
          <section className="relative overflow-hidden rounded-[28px] shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB]" />
            <div className="relative p-6 flex items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex gap-6">
                  <div><span className="block text-white/50 text-[9px] font-black uppercase tracking-widest">Lands</span><span className="text-3xl font-black text-white">04</span></div>
                  <div><span className="block text-white/50 text-[9px] font-black uppercase tracking-widest">Verified</span><span className="text-3xl font-black text-emerald-400">03</span></div>
                </div>
                <button onClick={() => onNavigate('profile')} className="text-white/80 text-xs font-black uppercase tracking-widest hover:text-white">{L.addLand}</button>
              </div>
              <button onClick={() => onNavigate('profile')} className="shrink-0 px-6 py-3 bg-white text-[#1E3A8A] rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">
                {t('manageViewBenefits')}
              </button>
            </div>
          </section>
        )}

        {/* 5. DISCOVERY HUB — 4 cards with benefit text */}
        <section className="space-y-4">
          <div>
            <h3 className="font-black text-gray-900 text-base">{L.discoveryTitle}</h3>
            <p className="text-gray-400 text-xs font-bold">{lang === 'mr' ? 'एक टॅपमध्ये जाणून घ्या' : lang === 'hi' ? 'एक टैप में जानें' : 'Know in one tap'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {DISCOVERY_CARDS.map((card, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                onClick={card.action}
                className={`bg-gradient-to-br ${card.color} rounded-[20px] p-5 cursor-pointer relative overflow-hidden shadow-lg`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-4 -mt-4 blur-xl" />
                <div className="relative space-y-3">
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <p className="text-white font-black text-sm leading-snug">{card.title}</p>
                    <p className="text-white/60 text-[10px] font-bold mt-1">{card.benefit}</p>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Quick Tools Row */}
        <section className="space-y-4">
          <h3 className="font-black text-gray-900 text-base">{lang === 'mr' ? 'साधने' : lang === 'hi' ? 'उपकरण' : 'Tools'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StampDutyCalc lang={lang} />
            <EMICalc lang={lang} />
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="space-y-5 pt-2 border-t border-gray-100">
          <div>
            <span className="text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest">{t('successStories')}</span>
            <h3 className="text-xl font-black text-gray-900 mt-1">{t('trustedByThousands')}</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: 'Suresh More', location: 'Satara', text: t('testimonial1') },
              { name: 'Vithal Patil', location: 'Nashik', text: t('testimonial3') },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                <div className="flex gap-1 text-emerald-500 mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}</div>
                <p className="text-gray-600 font-bold text-sm">"{item.text}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center font-black text-[#1E3A8A] text-sm">{item.name[0]}</div>
                  <div><p className="font-black text-gray-900 text-sm">{item.name}</p><p className="text-[10px] font-bold text-gray-400">{item.location}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. AI Help CTA */}
        <section className="bg-[#1E3A8A] rounded-[28px] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-black text-white">{t('needExpertHelp')}</h3>
              <p className="text-white/60 font-bold text-sm max-w-xs">{t('expertHelpDesc')}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button className="px-6 py-3 bg-white text-[#1E3A8A] rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"><PhoneCall size={16} />{t('callNow')}</button>
              <button onClick={() => onNavigate('chat')} className="px-6 py-3 bg-white/10 text-white rounded-2xl font-black text-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"><MessageCircle size={16} />{t('askAI')}</button>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

const AIAssistantChat = ({ initialAction, onBack }) => {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeProcess, setActiveProcess] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    setIsTyping(true)
    const timeout = setTimeout(() => {
      const greeting = t('aiDefaultGreeting')
      let roadmap = null
      if (initialAction === 'ferfar') {
        roadmap = {
          steps: [
            { title: t('aiFerfarStep1'), desc: t('aiFerfarStep1Desc'), office: t('officeTalathi'), icon: <FileText size={20} /> },
            { title: t('aiFerfarStep2'), desc: t('aiFerfarStep2Desc'), office: t('officeTalathi'), icon: <Search size={20} /> },
            { title: t('aiFerfarStep3'), desc: t('aiFerfarStep3Desc'), office: t('officeVillage'), icon: <Clock size={20} /> },
            { title: t('aiFerfarStep4'), desc: t('aiFerfarStep4Desc'), office: t('officeTehsil'), icon: <CheckCircle2 size={20} /> },
          ]
        }
      }
      setMessages([{ id: 1, text: greeting, isAI: true }])
      if (roadmap) setActiveProcess(roadmap)
      setIsTyping(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [initialAction]) // Removed t to prevent loop

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    const userText = inputValue
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isAI: false }])
    setInputValue('')
    setIsTyping(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: lang,
          sessionId: localStorage.getItem('land_sathi_sid') || undefined
        })
      });

      const data = await response.json();
      if (data.sessionId) localStorage.setItem('land_sathi_sid', data.sessionId);

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: data.reply, 
        isAI: true,
        source: data.source 
      }]);
    } catch (err) {
      console.error("AI Error:", err)
      // Fallback if backend is down
      let botText = t('aiError')
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, isAI: true }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-bg-primary overflow-hidden pt-16 md:pt-20">
      <div className="bg-white border-b border-border-gray px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-bg-primary rounded-xl cursor-pointer"><ArrowLeft size={24} /></button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center relative">
              <MessageCircle size={20} className="text-[#1E3A8A]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A] rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{t('chatTitle')}</h3>
              <p className="text-xs text-[#16A34A] font-bold">{t('chatSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] rounded-[24px] p-5 shadow-soft shadow-black/5 ${m.isAI ? 'bg-white border border-border-gray text-text-main' : 'bg-[#1E3A8A] text-white'}`}>
              <p className="text-lg font-bold leading-relaxed whitespace-pre-line">{m.text}</p>
              
              {m.isAI && m.qaKey && LAND_KNOWLEDGE.qa[m.qaKey] && (
                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200">
                    <Building2 size={12} /> {LAND_KNOWLEDGE.qa[m.qaKey][lang]?.office || LAND_KNOWLEDGE.qa[m.qaKey]['en']?.office}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-800 bg-green-100 px-2.5 py-1.5 rounded-lg border border-green-200">
                    <FileText size={12} /> {LAND_KNOWLEDGE.qa[m.qaKey][lang]?.docs || LAND_KNOWLEDGE.qa[m.qaKey]['en']?.docs}
                  </div>
                </div>
              )}

              {m.isAI && (
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-text-sub uppercase tracking-widest border-t border-border-gray pt-3">
                  <CheckCircle2 size={12} className="text-[#16A34A]" /> {t('chatVerified')}
                </div>
              )}
            </div>
          </div>
        ))}
        {activeProcess && !isTyping && (
          <div className="bg-white rounded-[28px] shadow-strong border border-border-gray overflow-hidden">
            <div className="bg-[#1E3A8A]/5 p-5 border-b border-border-gray flex items-center justify-between">
              <h4 className="font-bold text-lg text-[#1E3A8A]">{t('chatGuideTitle')}</h4>
              <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">{t('chatGuideSubtitle')}</span>
            </div>
            <div className="p-6 space-y-6 relative after:content-[''] after:absolute after:left-[35px] after:top-14 after:bottom-14 after:w-0.5 after:bg-border-gray">
              {activeProcess.steps.map((step, i) => (
                <div key={i} className="flex gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 bg-white flex-shrink-0 ${i === 0 ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-border-gray text-text-sub'}`}>
                    {step.icon}
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-base text-text-main">{step.title}</h5>
                    <p className="text-sm font-semibold text-text-sub">{step.desc}</p>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#1E3A8A] mt-1">{step.office}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-bg-primary p-4 grid grid-cols-2 gap-3">
               <button className="py-4 bg-white border border-border-gray rounded-2xl flex flex-col items-center gap-2 hover:border-[#1E3A8A] transition-all cursor-pointer">
                  <FileText size={20} className="text-[#1E3A8A]" />
                  <span className="font-bold text-[10px] text-text-sub uppercase">{t('chatDocBtn')}</span>
               </button>
               <button className="py-4 bg-white border border-border-gray rounded-2xl flex flex-col items-center gap-2 hover:border-[#1E3A8A] transition-all cursor-pointer">
                  <Download size={20} className="text-[#1E3A8A]" />
                  <span className="font-bold text-[10px] text-text-sub uppercase">{t('chatDownloadBtn')}</span>
               </button>
            </div>
          </div>
        )}
        {isTyping && (
          <div className="flex justify-start px-10">
            <div className="bg-white px-5 py-3 rounded-full shadow-soft flex gap-2 items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-border-gray">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-bg-primary rounded-[20px] p-2 border border-border-gray focus-within:border-[#1E3A8A] transition-all">
          <button className="p-4 text-text-sub hover:text-[#1E3A8A] cursor-pointer"><Mic size={24} /></button>
          <input 
            value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder={t('chatPlaceholder')} className="flex-1 bg-transparent px-2 py-4 outline-none font-bold text-lg" 
          />
          <button onClick={handleSend} className="bg-[#1E3A8A] text-white p-4 rounded-2xl shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all">
            <Send size={24} />
          </button>
        </div>
        <p className="text-center text-[10px] font-bold text-text-sub mt-3 opacity-50 uppercase tracking-widest">{t('chatDisclaimer')}</p>
      </div>
    </div>
  )
}

function Main() {
  const [view, setView] = useState('home')
  const [selectedAction, setSelectedAction] = useState(null)
  const langContext = useLang()
  
  if (!langContext) return <div className="p-20 text-red-500 font-bold">CRITICAL: LangContext is null! Check Provider nesting.</div>
  
  const { t, lang } = langContext

  useEffect(() => {
    window.onerror = (msg, url, line, col, error) => {
      console.log(`%c CRASH: ${msg}`, 'background: red; color: white; padding: 4px;');
      if (error) console.error(error);
    };
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash.startsWith('docs/')) {
        setSelectedAction(hash.split('/')[1])
        setView('docs')
      } else if (hash === 'chat') {
        setView('chat')
      } else if (hash === 'blog') {
        setView('blog')
        setSelectedAction(null)
      } else if (hash === 'tools') {
        setView('tools')
      } else if (hash === 'profile') {
        setView('profile')
      } else if (hash.startsWith('blog/')) {
        setSelectedAction(hash.split('/')[1])
        setView('blog-detail')
      } else {
        setView('home')
        setSelectedAction(null)
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Dynamic Metadata Effect
  useEffect(() => {
    if (view === 'blog-detail' && selectedAction) {
      const post = BLOG_POSTS.find(p => p.id === parseInt(selectedAction))
      if (post) {
        document.title = `${post.title[lang]} | Land Sathi Blog`
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) metaDesc.setAttribute('content', post.excerpt[lang])
      }
    } else {
      document.title = 'Land Sathi - Digital Land Records Guide'
    }
  }, [view, selectedAction, lang])

  const navigate = (to) => {
    if (to.startsWith('docs/')) {
      setSelectedAction(to.split('/')[1])
      setView('docs')
      window.location.hash = to
    } else if (to === 'chat') {
      setView('chat')
      window.location.hash = 'chat'
    } else if (to === 'blog') {
      setView('blog')
      window.location.hash = 'blog'
    } else if (to === 'tools') {
      setView('tools')
      window.location.hash = 'tools'
    } else if (to === 'profile') {
      setView('profile')
      window.location.hash = 'profile'
    } else if (to.startsWith('blog/')) {
      setSelectedAction(to.split('/')[1])
      setView('blog-detail')
      window.location.hash = to
    } else {
      setView('home')
      window.location.hash = ''
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-bg-primary min-h-screen font-inter">
      <Navbar onNavigate={navigate} />
      
      <main className="max-w-7xl mx-auto pt-20 md:pt-28">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <HomeView onNavigate={navigate} onSelectAction={(id) => { setSelectedAction(id); navigate('chat') }} />
            </motion.div>
          )}
          {view === 'chat' && (
            <motion.div key="chat" initial={{ x: '100vw' }} animate={{ x: 0 }} exit={{ x: '100vw' }} className="fixed inset-0 z-[60] pt-0">
               <AIAssistantChat initialAction={selectedAction} onBack={() => navigate('home')} />
            </motion.div>
          )}
          {view === 'docs' && (
            <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedAction === 'quiz' ? <div className="max-w-4xl mx-auto py-10"><SchemeFinder lang={lang} /></div> : <DocumentChecklist type={selectedAction} />}
            </motion.div>
          )}
          {view === 'blog' && (
            <motion.div key="blog" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <BlogView onNavigate={navigate} />
            </motion.div>
          )}
          {view === 'tools' && (
            <motion.div key="tools" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <ToolsView onNavigate={navigate} />
            </motion.div>
          )}
          {view === 'blog-detail' && (
            <motion.div key="blog-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <BlogPostDetail 
                post={BLOG_POSTS.find(p => p.id === parseInt(selectedAction))} 
                onBack={() => navigate('blog')} 
                onNavigate={navigate}
              />
            </motion.div>
          )}
          {view === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <FarmerProfile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* WhatsApp Share Button */}
      {view !== 'chat' && <WhatsAppShare lang={lang} />}

      {/* Floating AI Assistant Button */}
      {view === 'home' && (
        <button 
          onClick={() => navigate('chat')}
          className="fixed bottom-6 right-6 z-40 bg-[#1E3A8A] text-white p-4 md:p-5 rounded-full shadow-[0_10px_40px_rgba(30,58,138,0.4)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <MessageCircle size={28} />
          <span className="hidden md:inline font-bold text-lg pr-2">{t('navAskAIButton')}</span>
        </button>
      )}

      {view !== 'chat' && (
        <footer className="border-t border-border-gray bg-white py-16 px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
            {/* Blog Quick Navigation Section */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-16 pb-16 border-b border-border-gray">
               <div className="col-span-1 md:col-span-1 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-[#1E3A8A] p-2 rounded-xl text-white shadow-lg"><Map size={24} /></div>
                     <span className="font-black text-2xl text-[#1E3A8A] tracking-tighter">{t('navTitle')}</span>
                  </div>
                  <p className="text-sm font-bold text-text-sub leading-relaxed">{t('footerDisclaimer')}</p>
               </div>
               
               <div className="md:col-span-2 space-y-6">
                  <h4 className="font-black text-sm uppercase tracking-widest text-text-main flex items-center gap-2">
                     <BookOpen size={16} className="text-[#1E3A8A]" /> {t('blogTitle')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {BLOG_POSTS.slice(0, 4).map(post => (
                        <button key={post.id} onClick={() => navigate(`blog/${post.id}`)} className="text-left group cursor-pointer space-y-1">
                           <span className="block text-xs font-black text-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">→</span>
                           <h5 className="text-[13px] font-bold text-text-sub group-hover:text-[#1E3A8A] transition-colors leading-tight line-clamp-1">{post.title[lang]}</h5>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="font-black text-sm uppercase tracking-widest text-text-main flex items-center gap-2">
                     <Link2 size={16} className="text-[#1E3A8A]" /> {t('footerAbout')}
                  </h4>
                  <div className="flex flex-col gap-3">
                     {['footerAbout', 'footerLegal', 'footerHelp', 'footerPrivacy'].map(key => (
                        <button key={key} className="text-left text-sm font-bold text-text-sub hover:text-[#1E3A8A] transition-all cursor-pointer">{t(key)}</button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 border-t border-border-gray pt-10 w-full justify-between">
              <p className="text-xs text-text-sub font-bold">{t('footerCopyright')}</p>
              <div className="flex items-center gap-10 text-sm font-bold text-text-main">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-[#1E3A8A]" />
                  <span>{t('footerEmail')}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <LangProvider>
      <Main />
    </LangProvider>
  )
}

export default App

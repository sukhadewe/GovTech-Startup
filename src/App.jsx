import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Mic, FileText, RefreshCw, Handshake, Users, Map,
  ArrowLeft, Send, CheckCircle2, AlertCircle, Info,
  ChevronRight, Download, Building2, MapPin,
  Bell, User as UserIcon, Layout, HelpCircle, Clock,
  Shield, BookOpen, Phone, Mail, ExternalLink, Menu, X, MessageCircle,
  Sun, CloudRain, Calendar, Calculator, Link2
} from 'lucide-react'
import translations from './i18n'

import { landKnowledge as LAND_KNOWLEDGE } from './landKnowledge'

// =====================================================
// 1. LANGUAGE CONTEXT
// =====================================================
const LangContext = createContext()
const useLang = () => useContext(LangContext)

const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('mr')
  const t = (key) => {
    try {
      if (!translations[lang]) return translations['en']?.[key] || key
      return translations[lang][key] || translations['en']?.[key] || key
    } catch (e) {
      return key
    }
  }
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

// =====================================================
// 2. CONSTANTS
// =====================================================
const QUICK_ACTION_META = [
  { id: '712', labelKey: 'qa712Label', subKey: 'qa712Sub', icon: <FileText size={36} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'ferfar', labelKey: 'qaFerfarLabel', subKey: 'qaFerfarSub', icon: <RefreshCw size={36} />, color: 'bg-green-50 text-green-600 border-green-100' },
  { id: 'transfer', labelKey: 'qaTransferLabel', subKey: 'qaTransferSub', icon: <Handshake size={36} />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 'waras', labelKey: 'qaWarasLabel', subKey: 'qaWarasSub', icon: <Users size={36} />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 'map', labelKey: 'qaMapLabel', subKey: 'qaMapSub', icon: <Map size={36} />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
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

  const menuItems = [
    { id: 'home', label: t('navHome') },
    { id: 'chat', label: t('navAskAI') },
    { id: 'docs', label: t('navDocs') },
    { id: 'offices', label: 'Offices' }, // Could add to i18n
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
        <div className="flex items-center gap-2 md:gap-4">
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
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Calculator size={24} />
        </div>
        <h3 className="text-xl font-bold text-text-main">{t('calcTitle')}</h3>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input 
            type="number" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} 
            className="flex-1 bg-bg-primary border border-border-gray rounded-xl px-4 h-14 outline-none focus:border-[#1E3A8A] font-bold text-lg" 
          />
          <select 
            value={unit} onChange={(e) => setUnit(e.target.value)}
            className="bg-bg-primary border border-border-gray rounded-xl px-2 h-14 outline-none focus:border-[#1E3A8A] font-bold text-sm md:text-base cursor-pointer"
          >
            <option value="hec">{t('unitHectare')}</option>
            <option value="acre">{t('unitAcre')}</option>
            <option value="gun">{t('unitGuntha')}</option>
            <option value="sqm">{t('unitSqM')}</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {results.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 p-4 rounded-2xl border border-blue-50 transition-all hover:bg-blue-50/30">
              <span className="block text-[10px] uppercase font-bold text-text-sub/60 mb-1">{r.label}</span>
              <span className="block text-xl font-black text-[#1E3A8A]">{r.val}</span>
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
        setData({
          temp: json.current.temperature_2m,
          rainProb: json.daily.precipitation_probability_max[0],
          lat: latitude,
          lon: longitude
        })
      } catch (err) {
        setError(t('weatherError'))
      } finally {
        setLoading(false)
      }
    }, () => {
      setError(t('weatherPermission'))
      setLoading(false)
    })
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
          <Sun size={24} />
        </div>
        <h3 className="text-xl font-bold text-text-main">{t('weatherTitle')}</h3>
      </div>
      <div className="min-h-[140px] flex flex-col justify-center">
        {!data && !loading && !error && (
          <div className="space-y-4">
            <p className="text-text-sub font-semibold text-sm">{t('weatherDesc')}</p>
            <Button onClick={getWeather} className="w-full">{t('weatherBtn')}</Button>
          </div>
        )}
        {loading && <p className="text-center font-bold text-text-sub animate-pulse">{t('weatherLoading')}</p>}
        {error && <p className="text-center font-bold text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
        {data && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <span className="text-5xl font-black text-[#1E3A8A]">{data.temp}°C</span>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-text-sub uppercase tracking-wider">{t('weatherRainProb')}</span>
                <span className={`text-2xl font-black ${data.rainProb > 30 ? 'text-green-600' : 'text-text-main'}`}>{data.rainProb}%</span>
              </div>
            </div>
            <div className={`p-4 rounded-2xl text-center font-bold text-sm ${data.rainProb > 30 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-bg-primary text-text-main border border-border-gray'}`}>
              {data.rainProb > 30 ? t('weatherRain') : t('weatherClear')}
            </div>
            <p className="text-[10px] text-center text-text-sub font-bold opacity-60 uppercase">{t('weatherLocation')}: {data.lat.toFixed(2)}, {data.lon.toFixed(2)}</p>
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
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
          <Link2 size={24} />
        </div>
        <h3 className="text-xl font-bold text-text-main">{t('linksTitle')}</h3>
      </div>
      <div className="space-y-3">
        {links.map((link, i) => (
          <a 
            key={i} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-bg-primary rounded-xl border border-border-gray hover:border-[#1E3A8A] hover:bg-white transition-all group"
          >
            <span className="font-bold text-text-main group-hover:text-[#1E3A8A]">{link.label}</span>
            <ExternalLink size={18} className="text-text-sub group-hover:text-[#1E3A8A]" />
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
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
          <Calendar size={24} />
        </div>
        <h3 className="text-xl font-bold text-text-main">{t('panchangTitle')}</h3>
      </div>
      <div className="py-2 text-center space-y-2">
        <span className="block text-2xl font-black text-[#1E3A8A]">{saka || t('panchangLoading')}</span>
        <span className="block text-lg font-bold text-text-main">{std}</span>
      </div>
      <div className="p-4 bg-bg-primary rounded-2xl text-center text-sm font-bold text-text-sub opacity-80 border border-border-gray">
        {t('panchangDesc')}
      </div>
    </div>
  )
}

// =====================================================
// 4. MAIN VIEWS
// =====================================================

const HomeView = ({ onNavigate, onSelectAction }) => {
  const { t } = useLang()
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-16 md:space-y-24 px-4 pb-20">
      {/* Header Layout */}
      <section className="text-center pt-8 md:pt-16 space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[12px] font-bold text-[#1E3A8A] uppercase tracking-wide">
            <Shield size={16} /> {t('heroBadge')}
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tight leading-tight">
            {t('heroTitle1')} <span className="text-[#1E3A8A] italic">{t('heroTitleAccent')}</span> {t('heroTitle2')}
          </h2>
          <p className="text-text-sub text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>

        {/* Search Layout */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white shadow-strong rounded-[24px] flex items-center p-2 border-2 border-transparent focus-within:border-[#1E3A8A] transition-all">
            <div className="pl-5 text-text-sub/40"><Search size={28} /></div>
            <input 
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onNavigate('chat')} 
              placeholder={t('searchPlaceholder')} className="w-full bg-transparent px-4 py-5 md:py-6 outline-none text-xl font-bold placeholder:text-text-sub/30 text-text-main" 
            />
            <div className="pr-2 flex items-center gap-2">
              <button className="hidden md:flex p-4 text-[#1E3A8A] bg-bg-primary hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"><Mic size={28} /></button>
              <Button onClick={() => onNavigate('chat')} className="px-8 md:px-12 group">
                {t('searchBtn')} <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
        {QUICK_ACTION_META.map((action) => (
          <motion.div key={action.id} whileHover={{ y: -8 }} className="group">
            <button
              onClick={() => onSelectAction(action.id)}
              className="w-full flex flex-col items-center justify-center p-8 md:p-10 bg-white rounded-[28px] shadow-soft border border-border-gray transition-all hover:shadow-strong group-hover:border-[#1E3A8A] cursor-pointer"
            >
              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[22px] mb-4 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${action.color}`}>
                {action.icon}
              </div>
              <span className="font-bold text-lg md:text-xl text-text-main text-center leading-tight">{t(action.labelKey)}</span>
              <span className="text-[10px] uppercase font-bold text-text-sub mt-2 tracking-wider opacity-60">{t(action.subKey)}</span>
            </button>
          </motion.div>
        ))}
      </section>

      {/* Forms & Docs Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <ContactForm />
        <DocumentForm onShowDocs={(id) => onNavigate(`docs/${id}`)} />
      </section>

      {/* Land Tools Grid */}
      <section className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-block px-4 py-2 bg-blue-50 text-[#1E3A8A] text-xs font-bold rounded-lg uppercase tracking-widest">{t('toolTitleBadge')}</span>
          <h2 className="text-3xl md:text-4xl font-black text-text-main">{t('toolTitleMain')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <LandConverter />
          <WeatherCard />
          <OfficialLinks />
          <PanchangCard />
        </div>
      </section>

      {/* Help Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[
          { icon: <MessageCircle size={32} />, title: t('helpCard1Title'), desc: t('helpCard1Desc'), color: 'bg-blue-50 text-[#1E3A8A]' },
          { icon: <BookOpen size={32} />, title: t('helpCard2Title'), desc: t('helpCard2Desc'), color: 'bg-green-50 text-[#16A34A]' },
          { icon: <Layout size={32} />, title: t('helpCard3Title'), desc: t('helpCard3Desc'), color: 'bg-orange-50 text-[#F59E0B]' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-soft border border-border-gray hover:shadow-strong transition-all group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${card.color}`}>
              {card.icon}
            </div>
            <h4 className="text-xl font-bold text-text-main mb-3">{card.title}</h4>
            <p className="text-text-sub font-semibold leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
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
            { title: t('aiFerfarStep1'), desc: t('aiFerfarStep1Desc'), office: 'Talathi Office', icon: <FileText size={20} /> },
            { title: t('aiFerfarStep2'), desc: t('aiFerfarStep2Desc'), office: 'Talathi Office', icon: <Search size={20} /> },
            { title: t('aiFerfarStep3'), desc: t('aiFerfarStep3Desc'), office: 'Village Board', icon: <Clock size={20} /> },
            { title: t('aiFerfarStep4'), desc: t('aiFerfarStep4Desc'), office: 'Tehsil Office', icon: <CheckCircle2 size={20} /> },
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
      let botText = "Disconnected from AI server. Please check your connection."
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
  const { t } = useLang()

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash.startsWith('docs/')) {
      setSelectedAction(hash.split('/')[1])
      setView('docs')
    } else if (hash === 'chat') {
      setView('chat')
    } else {
      setView('home')
    }
  }, [])

  const navigate = (to) => {
    if (to.startsWith('docs/')) {
      setSelectedAction(to.split('/')[1])
      setView('docs')
      window.location.hash = to
    } else if (to === 'chat') {
      setView('chat')
      window.location.hash = 'chat'
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
              <DocumentChecklist type={selectedAction} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating AI Assistant Button */}
      {view === 'home' && (
        <button 
          onClick={() => navigate('chat')}
          className="fixed bottom-6 right-6 z-40 bg-[#1E3A8A] text-white p-4 md:p-5 rounded-full shadow-[0_10px_40px_rgba(30,58,138,0.4)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <MessageCircle size={28} />
          <span className="hidden md:inline font-bold text-lg pr-2">Ask Land Sathi AI</span>
        </button>
      )}

      {view !== 'chat' && (
        <footer className="border-t border-border-gray bg-white py-16 px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <Map size={24} className="text-[#1E3A8A]" />
                <span className="font-bold text-2xl text-[#1E3A8A]">{t('navTitle')}</span>
              </div>
              <p className="text-[14px] text-text-sub font-bold max-w-lg">{t('footerDisclaimer')}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10 text-sm font-bold uppercase tracking-widest text-text-sub">
              <button className="hover:text-[#1E3A8A] cursor-pointer">About</button>
              <button className="hover:text-[#1E3A8A] cursor-pointer">Legal</button>
              <button className="hover:text-[#1E3A8A] cursor-pointer">Help</button>
              <button className="hover:text-[#1E3A8A] cursor-pointer">Privacy</button>
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

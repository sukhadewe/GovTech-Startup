import { useState } from 'react'
import { Search, MapPin, Phone, Clock, ExternalLink } from 'lucide-react'

const OFFICES = [
  { dist: 'Pune', taluka: 'Haveli', name: 'Talathi Office Haveli', addr: 'Pune-Satara Rd, Haveli', phone: '020-26120000', hours: 'Mon-Sat 10AM-5PM', lat: 18.5204, lon: 73.8567 },
  { dist: 'Pune', taluka: 'Mulshi', name: 'Talathi Office Mulshi', addr: 'Mulshi Taluka Office, Pirangut', phone: '020-22940100', hours: 'Mon-Sat 10AM-5PM', lat: 18.4983, lon: 73.6714 },
  { dist: 'Nashik', taluka: 'Nashik', name: 'Tehsil Office Nashik', addr: 'Old Agra Rd, Nashik', phone: '0253-2310500', hours: 'Mon-Sat 10AM-5PM', lat: 19.9975, lon: 73.7898 },
  { dist: 'Nagpur', taluka: 'Nagpur', name: 'Tehsil Office Nagpur', addr: 'Civil Lines, Nagpur', phone: '0712-2560344', hours: 'Mon-Sat 10AM-5PM', lat: 21.1458, lon: 79.0882 },
  { dist: 'Aurangabad', taluka: 'Aurangabad', name: 'Tehsil Office Aurangabad', addr: 'Kranti Chowk, Aurangabad', phone: '0240-2331255', hours: 'Mon-Sat 10AM-5PM', lat: 19.8762, lon: 75.3433 },
  { dist: 'Kolhapur', taluka: 'Karveer', name: 'Talathi Office Karveer', addr: 'Tarabai Park, Kolhapur', phone: '0231-2651001', hours: 'Mon-Sat 10AM-5PM', lat: 16.7050, lon: 74.2433 },
  { dist: 'Satara', taluka: 'Satara', name: 'Tehsil Office Satara', addr: 'Powai Naka, Satara', phone: '02162-234567', hours: 'Mon-Sat 10AM-5PM', lat: 17.6805, lon: 74.0183 },
  { dist: 'Solapur', taluka: 'Solapur North', name: 'Tehsil Office Solapur', addr: 'Railway Lines, Solapur', phone: '0217-2315000', hours: 'Mon-Sat 10AM-5PM', lat: 17.6599, lon: 75.9064 },
  { dist: 'Sangli', taluka: 'Miraj', name: 'Talathi Office Miraj', addr: 'Station Rd, Miraj', phone: '0233-2211000', hours: 'Mon-Sat 10AM-5PM', lat: 16.8289, lon: 74.6467 },
  { dist: 'Ahmednagar', taluka: 'Ahmednagar', name: 'Tehsil Office Ahmednagar', addr: 'Savedi Rd, Ahmednagar', phone: '0241-2324100', hours: 'Mon-Sat 10AM-5PM', lat: 19.0948, lon: 74.7480 },
]

const L = {
  mr: { title: 'तलाठी/तहसील कार्यालय शोधा', search: 'जिल्हा किंवा तालुका शोधा...', noResult: 'कोणतेही कार्यालय सापडले नाही', mapBtn: 'नकाशा पहा' },
  hi: { title: 'तलाठी/तहसील कार्यालय खोजें', search: 'जिला या तहसील खोजें...', noResult: 'कोई कार्यालय नहीं मिला', mapBtn: 'मैप देखें' },
  en: { title: 'Find Talathi/Tehsil Office', search: 'Search district or taluka...', noResult: 'No offices found', mapBtn: 'View Map' },
}

export default function OfficeLocator({ lang = 'mr' }) {
  const [q, setQ] = useState('')
  const l = L[lang] || L.en
  const filtered = q.trim() ? OFFICES.filter(o => 
    `${o.dist} ${o.taluka} ${o.name}`.toLowerCase().includes(q.toLowerCase())
  ) : OFFICES.slice(0, 4)

  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8 flex flex-col h-full transform transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MapPin size={30} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600/70 mb-1 block">Locator</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{l.title}</h3>
          </div>
        </div>
      </div>

      <div className="relative group">
        <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1E3A8A] transition-colors" />
        <input 
          value={q} onChange={e => setQ(e.target.value)} placeholder={l.search}
          className="w-full bg-[#F8FAFC] border-2 border-gray-100 rounded-[22px] pl-16 pr-6 h-16 outline-none focus:border-[#1E3A8A] focus:bg-white font-black text-lg text-[#1E3A8A] transition-all" 
        />
      </div>

      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar flex-1">
        {filtered.length === 0 && (
          <div className="text-center py-20 space-y-4">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto"><Search size={32} className="text-gray-200" /></div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-xs">{l.noResult}</p>
          </div>
        )}
        {filtered.map((o, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:border-[#1E3A8A] hover:shadow-md transition-all group lg:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <ExternalLink size={20} className="text-[#1E3A8A]" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-xl mb-4 group-hover:text-[#1E3A8A] transition-colors">{o.name}</h4>
            <div className="space-y-3 pb-4">
              <div className="flex items-start gap-3 text-gray-500 font-bold text-sm leading-snug">
                <MapPin size={18} className="text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                {o.addr}
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                <Phone size={18} className="text-[#1E3A8A]" />
                {o.phone}
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                <Clock size={18} className="text-[#1E3A8A]" />
                {o.hours}
              </div>
            </div>
            <a 
              href={`https://www.google.com/maps?q=${o.lat},${o.lon}`} target="_blank" rel="noopener noreferrer"
              className="w-full h-12 bg-[#F8FAFC] text-[#1E3A8A] rounded-[18px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1E3A8A] hover:text-white transition-all border border-gray-100"
            >
              {l.mapBtn}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

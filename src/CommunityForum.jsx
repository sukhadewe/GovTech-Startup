import { useState } from 'react'
import { Users, Search, MessageCircle, Heart, Share2, Plus, ArrowUpRight } from 'lucide-react'

const L = {
  mr: { title: 'शेतकरी मंच (Community)', newPost: 'प्रश्न विचारा', trending: 'ट्रेन्डिंग विषय', search: 'शोधा', ans: 'उत्तरे', likes: 'लाईक्स', time: 'तासांपूर्वी' },
  hi: { title: 'किसान मंच (Community)', newPost: 'प्रश्न पूछें', trending: 'ट्रेंडिंग विषय', search: 'खोजें', ans: 'उत्तर', likes: 'लाइक', time: 'घंटे पहले' },
  en: { title: 'Farmer Community Forum', newPost: 'Ask Question', trending: 'Trending Topics', search: 'Search', ans: 'Answers', likes: 'Likes', time: 'h ago' },
}

const POSTS = [
  { id: 1, author: 'Suresh P.', role: 'Farmer, Pune', roleCol: 'bg-green-100 text-green-800', mr: 'माझ्या जमिनीचा ७/१२ ऑनलाइन दिसत नाही, काय करावे?', hi: 'मेरी जमीन का 7/12 ऑनलाइन नहीं दिख रहा है, क्या करूं?', en: 'My 7/12 is not visible online, what should I do?', tags: ['7/12', 'Online Portal'], ans: 12, likes: 45, time: 2 },
  { id: 2, author: 'Kiran D.', role: 'Legal Expert', roleCol: 'bg-blue-100 text-blue-800', mr: 'शेतजमीन खरेदी करताना घ्याव्या लागणाऱ्या ५ मुख्य काळजी.', hi: 'कृषि भूमि खरीदते समय बरतने वाली 5 मुख्य सावधानियां।', en: '5 precautions to take while buying agricultural land.', tags: ['Buying', 'Legal'], ans: 34, likes: 128, time: 5 },
  { id: 3, author: 'Ramesh Katra', role: 'Farmer, Nashik', roleCol: 'bg-green-100 text-green-800', mr: 'PM-KISAN योजनेचा १४वा हप्ता कधी येणार?', hi: 'PM-KISAN योजना की 14वीं किश्त कब आएगी?', en: 'When will the 14th installment of PM-KISAN arrive?', tags: ['PM-KISAN', 'Subsidy'], ans: 8, likes: 32, time: 10 },
  { id: 4, author: 'Amit Sharma', role: 'Property Consultant', roleCol: 'bg-purple-100 text-purple-800', mr: '२०२६ चे नवीन रेडी रेकनर दर - महत्त्वपूर्ण बदल.', hi: '2026 के नए रेडी रेकनर दर - महत्वपूर्ण बदलाव।', en: 'New Ready Reckoner Rates 2026 - Key changes.', tags: ['Ready Reckoner', 'Market Info'], ans: 56, likes: 210, time: 24 },
]

export default function CommunityForum({ lang = 'mr' }) {
  const l = L[lang] || L.en
  const [q, setQ] = useState('')

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-soft border border-border-gray space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-main">{l.title} 💬</h3>
            <p className="text-sm font-semibold text-text-sub mt-1">2,450+ Active Members</p>
          </div>
        </div>
        <button className="bg-[#1E3A8A] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-colors shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-1">
          <Plus size={20} /> {l.newPost}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-sub/50" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={l.search}
            className="w-full bg-bg-primary border border-border-gray hover:border-[#1E3A8A] focus:border-[#1E3A8A] focus:shadow-[0_0_15px_rgba(30,58,138,0.1)] rounded-2xl pl-12 pr-6 py-4 outline-none font-bold text-lg transition-all" />
        </div>
        <div className="flex gap-2 bg-bg-primary p-2 rounded-2xl border border-border-gray">
          {['Latest', 'Top'].map(f => (
            <button key={f} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${f === 'Latest' ? 'bg-white shadow border border-border-gray text-text-main' : 'text-text-sub hover:text-text-main'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-text-sub text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
          <ArrowUpRight size={18} className="text-orange-500" /> {l.trending}
        </h4>
        
        {POSTS.filter(p => (lang === 'mr' ? p.mr : lang === 'hi' ? p.hi : p.en).toLowerCase().includes(q.toLowerCase())).map(p => (
          <div key={p.id} className="p-6 bg-white border border-border-gray rounded-3xl shadow-sm hover:shadow-strong hover:border-[#1E3A8A] transition-all cursor-pointer group animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-500 text-lg">{p.author[0]}</div>
                <div>
                  <p className="font-bold text-text-main">{p.author}</p>
                  <p className={`text-[10px] font-bold px-2 py-0.5 mt-0.5 rounded-full inline-block ${p.roleCol}`}>{p.role}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-text-sub">{p.time} {l.time}</span>
            </div>
            
            <h5 className="text-xl font-bold text-text-main leading-snug group-hover:text-[#1E3A8A] transition-colors mb-4 pr-10">
              {lang === 'mr' ? p.mr : lang === 'hi' ? p.hi : p.en}
            </h5>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {p.tags.map(tag => <span key={tag} className="bg-bg-primary border border-border-gray text-text-sub text-xs font-bold px-3 py-1 rounded-lg">#{tag}</span>)}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-gray">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-text-sub hover:text-[#1E3A8A] transition-colors font-bold text-sm">
                  <MessageCircle size={18} /> {p.ans} <span className="hidden sm:inline">{l.ans}</span>
                </button>
                <button className="flex items-center gap-2 text-text-sub hover:text-red-500 transition-colors font-bold text-sm">
                  <Heart size={18} /> {p.likes} <span className="hidden sm:inline">{l.likes}</span>
                </button>
              </div>
              <button className="text-text-sub hover:text-[#1E3A8A] p-2 bg-bg-primary rounded-full transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from './LangContext';
import { User, CheckCircle, MapPin, FileText, Bookmark, Clock, ChevronRight, AlertCircle, Phone, CreditCard, ShieldCheck, Map } from 'lucide-react';

const TRANSLATIONS = {
  mr: {
    dashboard: 'शेतकरी डॅशबोर्ड',
    kyc: 'आधार केवायसी पूर्ण',
    myLands: 'माझी जमीन (My Lands)',
    addLand: '+ नवीन सातबारा जोडा',
    activeCases: 'सध्याचे अर्ज (Active Cases)',
    savedSchemes: 'जतन केलेल्या योजना',
    landAddress: 'गट क्र. १४२, शिरूर, पुणे',
    landType: 'जिरायती (Agricultural)',
    area: '२.५ एकर',
    mutationPending: 'फेरफार प्रलंबित (Mutation Pending)',
    pmKisan: 'पंतप्रधान किसान सन्मान निधी',
    nextInstallment: 'पुढचा हप्ता: १५ एप्रिल',
    logout: 'लॉग आउट'
  },
  hi: {
    dashboard: 'किसान डैशबोर्ड',
    kyc: 'आधार केवाईसी पूर्ण',
    myLands: 'मेरी ज़मीन (My Lands)',
    addLand: '+ नया 7/12 जोड़ें',
    activeCases: 'वर्तमान आवेदन (Active Cases)',
    savedSchemes: 'सहेजी गई योजनाएं',
    landAddress: 'गट क्र. 142, शिरूर, पुणे',
    landType: 'कृषि (Agricultural)',
    area: '2.5 एकड़',
    mutationPending: 'म्यूटेशन लंबित (Mutation Pending)',
    pmKisan: 'पीएम किसान सम्मान निधि',
    nextInstallment: 'अगली किस्त: 15 अप्रैल',
    logout: 'लॉग आउट'
  },
  en: {
    dashboard: 'Farmer Dashboard',
    kyc: 'Aadhaar KYC Verified',
    myLands: 'My Registered Lands',
    addLand: '+ Add New 7/12 Record',
    activeCases: 'Active Applications',
    savedSchemes: 'Saved Schemes',
    landAddress: 'Gat No. 142, Shirur, Pune',
    landType: 'Agricultural (Jirayati)',
    area: '2.5 Acres',
    mutationPending: 'Mutation Pending',
    pmKisan: 'PM Kisan Samman Nidhi',
    nextInstallment: 'Next Installment: 15 Apr',
    logout: 'Log Out'
  }
};

const FarmerProfile = () => {
  const { lang } = useLang();
  const t = (key) => TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 min-h-screen">
      {/* Profile Header */}
      <section className="bg-white rounded-[24px] p-6 shadow-sm border border-border-gray flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-green-500 opacity-20"></div>
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#1E3A8A] border-4 border-white shadow-md z-10">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" alt="User Avatar" className="w-full h-full rounded-full" />
        </div>
        <div className="z-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-text-main">Rajesh Patil</h2>
          <p className="text-text-sub font-semibold">9876543210 • rajesh@farmer.in</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-200">
            <ShieldCheck size={16} /> {t('kyc')}
          </div>
        </div>
        <div className="md:ml-auto z-10 hidden md:block">
           <button className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-colors">
              {t('logout')}
           </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Lands */}
        <div className="lg:col-span-2 space-y-8">
          <section>
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MapPin className="text-[#1E3A8A]" /> {t('myLands')}</h3>
             </div>
             <div className="space-y-4">
                {/* Land Card 1 */}
                <div className="bg-white rounded-2xl p-5 border border-border-gray shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">7/12 Utara</span>
                         <h4 className="font-bold text-lg mt-2 text-gray-800">{t('landAddress')}</h4>
                      </div>
                      <button className="text-[#1E3A8A] hover:bg-blue-50 p-2 rounded-lg transition-colors"><ChevronRight /></button>
                   </div>
                   <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-sm text-text-sub font-semibold">
                      <div className="flex items-center gap-1"><MapPin size={16}/> {t('area')}</div>
                      <div className="flex items-center gap-1"><FileText size={16}/> {t('landType')}</div>
                   </div>
                </div>

                {/* Add New Land Button */}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center text-text-sub font-bold hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors bg-gray-50/50">
                   {t('addLand')}
                </button>
             </div>
          </section>

          <section>
             <h3 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4"><Clock className="text-orange-500" /> {t('activeCases')}</h3>
             <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                   <span className="font-bold text-orange-800 tracking-wide text-sm">App ID: MH-2026-8921</span>
                   <span className="px-2 py-1 bg-white rounded text-orange-600 text-xs font-bold shadow-sm">{t('mutationPending')}</span>
                </div>
                <div className="p-5">
                   <h4 className="font-bold text-gray-800">Ferfar (Mutation) Application</h4>
                   <p className="text-sm text-text-sub mt-1">Submitted on 12 Mar 2026. Currently under review by Talathi office.</p>
                   
                   {/* Progress Tracker Mini */}
                   <div className="mt-6 relative">
                     <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                     <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-orange-500 -z-10"></div>
                     <div className="flex justify-between">
                        <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                        <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                        <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white"></div>
                     </div>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Schemes & Wallets */}
        <div className="space-y-8">
          <section className="bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-20"><CreditCard size={100} /></div>
             <h3 className="font-bold opacity-80 text-sm tracking-wide mb-1">Government Wallet</h3>
             <div className="text-3xl font-black tracking-tight mb-6">₹ 8,000</div>
             <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                   <div className="text-xs font-semibold opacity-90">{t('pmKisan')}</div>
                   <div className="font-bold mt-1 text-green-300">{t('nextInstallment')}</div>
                </div>
             </div>
          </section>

          <section>
             <h3 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4"><Bookmark className="text-green-500" /> {t('savedSchemes')}</h3>
             <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-border-gray shadow-sm flex items-start gap-4 hover:border-green-300 transition-colors cursor-pointer">
                   <div className="bg-green-100 p-2 rounded-lg text-green-700"><CheckCircle size={20} /></div>
                   <div>
                      <h4 className="font-bold text-sm text-gray-800">Shetkari Sanman Yojana</h4>
                      <p className="text-xs text-text-sub mt-1">Eligible • Deadline: 30 Mar</p>
                   </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-border-gray shadow-sm flex items-start gap-4 hover:border-blue-300 transition-colors cursor-pointer">
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><CheckCircle size={20} /></div>
                   <div>
                      <h4 className="font-bold text-sm text-gray-800">Kusum Solar Pump</h4>
                      <p className="text-xs text-text-sub mt-1">Draft saved • Requires 7/12</p>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
      {/* Digital Vault & Offline Records Section */}
      <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck size={30} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/70 mb-1 block">Verified Documents</span>
              <h3 className="text-3xl font-black text-gray-900 leading-tight">Digital Vault & Offline Records</h3>
            </div>
          </div>
          <button className="bg-blue-50 text-[#1E3A8A] px-6 py-2 rounded-xl font-black text-sm border border-blue-100 hover:bg-blue-100 transition-colors">
            Sync All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Saved Doc 1 */}
          <div className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-[#1E3A8A] hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                   </div>
                   <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100 flex items-center gap-1">
                      <CheckCircle size={12} /> Offline Ready
                   </span>
                </div>
                <div>
                   <h4 className="font-black text-gray-900 text-xl leading-snug">7/12 Extract</h4>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gat No. 142 • Shirur</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 opacity-60 group-hover:opacity-100 transition-opacity">
                   <Clock size={14} className="text-gray-400" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Synced: 2 hours ago</span>
                </div>
             </div>
          </div>

          {/* Saved Doc 2 */}
          <div className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Bookmark size={24} />
                   </div>
                   <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100 flex items-center gap-1">
                      <CheckCircle size={12} /> Offline Ready
                   </span>
                </div>
                <div>
                   <h4 className="font-black text-gray-900 text-xl leading-snug">Mutation Copy</h4>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">App ID: MH-2026-8921</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 opacity-60 group-hover:opacity-100 transition-opacity">
                   <Clock size={14} className="text-gray-400" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saved: 3 days ago</span>
                </div>
             </div>
          </div>

          {/* Saved Doc 3 */}
          <div className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <Map size={24} />
                   </div>
                   <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100 flex items-center gap-1">
                      <CheckCircle size={12} /> Offline Ready
                   </span>
                </div>
                <div>
                   <h4 className="font-black text-gray-900 text-xl leading-snug">Village Map</h4>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Shirur Taluka • Pune</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 opacity-60 group-hover:opacity-100 transition-opacity">
                   <Clock size={14} className="text-gray-400" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Synced: Yesterday</span>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmerProfile;

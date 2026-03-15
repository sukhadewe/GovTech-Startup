// =====================================================
// LAND SATHI — FRONTEND APPLICATION
// Pure Vanilla JS — AI Chat with Conversation History
// =====================================================

(() => {
  'use strict';

  // =====================================================
  // STATE
  // =====================================================
  let sessionId = localStorage.getItem('landSathi_sessionId') || null;
  let currentLang = localStorage.getItem('landSathi_lang') || 'mr';

  // =====================================================
  // DOM REFERENCES
  // =====================================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  let chatSendBtn = $('#chatSendBtn');
  const chatClearBtn = $('#chatClearBtn');
  const heroSearch = $('#heroSearch');
  const heroSearchBtn = $('#heroSearchBtn');
  const fabBtn = $('#fabBtn');
  const navbar = $('#navbar');

  // =====================================================
  // INITIALIZATION
  // =====================================================
  function init() {
    setupNavbar();
    setupLangSwitcher();
    setupSearch();
    setupChat();
    setupQuickActions();
    setupFAB();
    setupLandConverter();
    setupWeather();
    setupPanchang();
    setupFooterPages();
    addWelcomeMessage();
    loadChatHistory();
  }

  // =====================================================
  // LAND CONVERTER
  // =====================================================
  function setupLandConverter() {
    const valInput = $('#unitValue');
    const unitSelect = $('#fromUnit');
    const resultBoard = $('#resultBoard');

    if (!valInput || !unitSelect) return;

    function calculate() {
      const val = parseFloat(valInput.value) || 0;
      const unit = unitSelect.value;
      
      let sqMeters = 0;
      if (unit === 'hec') sqMeters = val * 10000;
      else if (unit === 'acre') sqMeters = val * 4046.856;
      else if (unit === 'gun') sqMeters = val * 101.171;
      else if (unit === 'sqm') sqMeters = val;
      else sqMeters = val;

      const data = [
        { label: 'हेक्टर (Hectare)', val: (sqMeters / 10000).toFixed(3) },
        { label: 'एकर (Acre)', val: (sqMeters / 4046.856).toFixed(3) },
        { label: 'गुंठा (Guntha)', val: (sqMeters / 101.171).toFixed(3) },
        { label: 'चौ. मीटर (Sq.M)', val: Math.round(sqMeters) }
      ];

      resultBoard.innerHTML = data.map(item => `
        <div class="result-item">
          <span class="result-label">${item.label}</span>
          <span class="result-val">${item.val}</span>
        </div>
      `).join('');
    }

    valInput.addEventListener('input', calculate);
    unitSelect.addEventListener('change', calculate);
    calculate(); // Initial run
  }

  // =====================================================
  // WEATHER FORECAST
  // =====================================================
  function setupWeather() {
    const btn = $('#getWeatherBtn');
    const content = $('#weatherContent');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      content.innerHTML = '<p style="text-align:center; padding:10px;">माहिती शोधत आहे... ⏳</p>';
      
      if (!navigator.geolocation) {
        content.innerHTML = '<p style="color:red; font-size:12px;">Geolocation support नाही.</p>';
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
          const data = await res.json();
          
          const temp = data.current.temperature_2m;
          const rainProb = data.daily.precipitation_probability_max[0];
          const isRainy = rainProb > 30;
          const colorCode = isRainy ? '#10b981' : 'var(--text-main)';
          const bgColor = isRainy ? '#047857' : 'var(--text-main)';
          const weatherMsg = isRainy ? '🌧️ आज पाऊस पडण्याची शक्यता आहे. काळजी घ्या!' : '☀️ आज हवामान स्वच्छ राहण्याची शक्यता आहे.';

          content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:32px; font-weight:800; color:var(--primary);">${temp}°C</span>
              <div style="text-align:right;">
                <span style="display:block; font-size:12px; font-weight:700; color:var(--text-muted);">पावसाची शक्यता</span>
                <span style="font-size:16px; font-weight:800; color:${colorCode}">${rainProb}%</span>
              </div>
            </div>
            <div style="padding:10px; background:var(--bg); border-radius:8px; font-size:13px; font-weight:600; text-align:center; color:${bgColor}">
              ${weatherMsg}
            </div>
            <p style="font-size:11px; color:var(--text-muted); margin-top:10px; text-align:center;">लोकेशन: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}</p>
          `;
        } catch (err) {
          content.innerHTML = '<p style="color:red; font-size:12px;">माहिती मिळवता आली नाही.</p>';
        }
      }, () => {
        content.innerHTML = '<p style="color:red; font-size:12px;">कृपया लोकेशन Permission द्या.</p>';
      });
    });
  }

  // =====================================================
  // PANCHANG (TODAY'S TITHI)
  // =====================================================
  function setupPanchang() {
    const pDate = $('#panchangDate');
    const pTime = $('#panchangTime');
    if (!pDate || !pTime) return;

    try {
      const now = new Date();
      // Indian National Calendar (Saka) gives standard Chaitra, Vaisakha, etc.
      const sakaDate = new Intl.DateTimeFormat('mr-IN', {
        calendar: 'indian',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(now);

      const standardDate = new Intl.DateTimeFormat('mr-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }).format(now);

      pDate.textContent = sakaDate;
      pTime.textContent = standardDate;
    } catch (e) {
      pDate.textContent = new Date().toLocaleDateString('mr-IN');
      pTime.textContent = '';
    }
  }

  // =====================================================
  // NAVBAR SCROLL EFFECT
  // =====================================================
  function setupNavbar() {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // =====================================================
  // LANGUAGE SWITCHER
  // =====================================================
  function setupLangSwitcher() {
    const langBtns = $$('.lang-btn');

    // Set initial active
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        localStorage.setItem('landSathi_lang', currentLang);
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateUILanguage();
        updateWelcomeMessage();
      });
    });
  }

  function updateUILanguage() {
    const translations = {
      hi: {
        heroBadge: '100% सुरक्षित Land Records Guide',
        heroTitle: 'ज़मीन के सवालों का <em>AI-powered</em> जवाब',
        heroDesc: '7/12 उतारा, फेरफार, वारस नोंद — सब कुछ सरल हिंदी में समझें।',
        searchPlaceholder: '7/12 उतारा कैसे निकालें?',
        searchBtn: 'पूछें',
        chatSubtitle: '🟢 Live — जवाब तैयार हैं',
        chatPlaceholder: 'अपना सवाल यहाँ लिखें...',
        chatDisclaimer: 'यह जानकारी केवल मार्गदर्शन के लिए है। आधिकारिक कार्य के लिए संबंधित कार्यालय से संपर्क करें।',
        featuresTitle: 'Land Sathi आपकी कैसे मदद करता है?',
        feat1Title: 'AI मार्गदर्शन',
        feat1Desc: 'Gemini AI की मदद से हर प्रक्रिया का सरल जवाब — हिंदी, मराठी, English में।',
        feat2Title: 'दस्तावेज़ चेकलिस्ट',
        feat2Desc: 'कौन से कागज़ चाहिए — सब एक जगह देखें।',
        feat3Title: 'Step-by-Step प्रक्रिया',
        feat3Desc: 'हर काम की पूरी प्रक्रिया — आसान भाषा में।',
        feat4Title: 'योजना और सब्सिडी',
        feat4Desc: 'किसानों के लिए नई सरकारी योजनाओं की जानकारी।',
        footerDisclaimer: 'यह प्लेटफॉर्म सूचनात्मक मार्गदर्शन प्रदान करता है। यह कोई आधिकारिक सरकारी वेबसाइट नहीं है।',
        qa712: '7/12 उतारा',
        qaFerfar: 'फेरफार',
        qaTransfer: 'ज़मीन ट्रांसफर',
        qaWaras: 'वारस नोंद',
        qaTalathi: 'तलाठी ऑफिस',
        panchangTitle: 'आज का दिनविशेष 📆',
        panchangDesc: 'शुभ मुहूर्त और पंचांग के अनुसार काम करें।',
        footerAbout: 'हमारे बारे में',
        footerPrivacy: 'गोपनीयता नीति',
        footerTerms: 'नियम और शर्तें',
        footerContact: 'संपर्क करें',
        aboutTitle: 'Land Sathi के बारे में',
        aboutContent: 'Land Sathi एक AI-आधारित प्लेटफ़ॉर्म है जो महाराष्ट्र के किसानों और ज़मीन मालिकों को ज़मीन से जुड़े दस्तावेज़ों (जैसे 7/12 उतारा, फेरफार) को समझने में मदद करता है। हमारा लक्ष्य सरकारी प्रक्रियाओं को सरल और पारदर्शी बनाना है।',
        privacyTitle: 'गोपनीयता नीति',
        privacyContent: 'हम आपकी गोपनीयता का सम्मान करते हैं। आपके द्वारा साझा की गई जानकारी का उपयोग केवल बेहतर मार्गदर्शन प्रदान करने के लिए किया जाता है। हम आपका व्यक्तिगत डेटा किसी तीसरे पक्ष के साथ साझा नहीं करते हैं।',
        termsTitle: 'नियम और शर्तें',
        termsContent: 'यह प्लेटफ़ॉर्म केवल सूचनात्मक उद्देश्यों के लिए है। प्रदान की गई जानकारी कानूनी सलाह नहीं है। आधिकारिक दस्तावेज़ों के लिए कृपया संबंधित सरकारी कार्यालय से संपर्क करें।',
        contactTitle: 'संपर्क करें',
        contactContent: 'किसी भी प्रश्न या सहायता के लिए, हमें यहाँ ईमेल करें: help@landsathi.ai'
      },
      mr: {
        heroBadge: '१००% सुरक्षित Land Records Guide',
        heroTitle: 'जमिनीच्या प्रश्नांचे <em>AI-powered</em> उत्तर',
        heroDesc: '७/१२ उतारा, फेरफार, वारस नोंद — सर्व माहिती सोप्या मराठीत.',
        searchPlaceholder: '७/१२ उतारा कसा काढायचा?',
        searchBtn: 'विचारा',
        chatSubtitle: '🟢 Live — उत्तर तयार आहेत',
        chatPlaceholder: 'तुमचा प्रश्न इथे लिहा...',
        chatDisclaimer: 'ही माहिती फक्त मार्गदर्शनासाठी आहे. अधिकृत कामासाठी संबंधित कार्यालयाशी संपर्क साधा.',
        featuresTitle: 'Land Sathi तुम्हाला कशी मदत करतो?',
        feat1Title: 'AI मार्गदर्शन',
        feat1Desc: 'Gemini AI च्या मदतीने सोप्या भाषेत उत्तर — मराठी, हिंदी, English.',
        feat2Title: 'दस्तावेज चेकलिस्ट',
        feat2Desc: 'कोणती कागदपत्रे लागतात ते पहा.',
        feat3Title: 'Step-by-Step प्रक्रिया',
        feat3Desc: 'प्रत्येक कामाची संपूर्ण प्रक्रिया — सोप्या भाषेत.',
        feat4Title: 'योजना व सबसिडी',
        feat4Desc: 'शेतकऱ्यांसाठी नवीन सरकारी योजनांची माहिती व अपडेट्स.',
        footerDisclaimer: 'हे व्यासपीठ माहितीपूर्ण मार्गदर्शन प्रदान करते. हे अधिकृत सरकारी संकेतस्थळ नाही.',
        qa712: '७/१२ उतारा',
        qaFerfar: 'फेरफार',
        qaTransfer: 'जमीन हस्तांतरण',
        qaWaras: 'वारस नोंद',
        qaTalathi: 'तलाठी ऑफिस',
        panchangTitle: 'आजचा दिनविशेष 📆',
        panchangDesc: 'शुभ मुहूर्त आणि तिथी नुसार कामे करा.',
        footerAbout: 'आमच्याबद्दल',
        footerPrivacy: 'गोपनीयता धोरण',
        footerTerms: 'अटी आणि शर्ती',
        footerContact: 'संपर्क',
        aboutTitle: 'Land Sathi बद्दल',
        aboutContent: 'Land Sathi हे एक AI-आधारित प्लॅटफॉर्म आहे जे महाराष्ट्रातील शेतकरी आणि जमीन मालकांना जमिनीशी संबंधित कागदपत्रे (उदा. ७/१२ उतारा, फेरफार) समजून घेण्यास मदत करते. सरकारी प्रक्रिया सोपी आणि पारदर्शक करणे हे आमचे ध्येय आहे.',
        privacyTitle: 'गोपनीयता धोरण',
        privacyContent: 'आम्ही तुमच्या गोपनीयतेचा आदर करतो. तुमच्याद्वारे शेअर केलेली माहिती केवळ अधिक चांगल्या मार्गदर्शनासाठी वापरली जाते. आम्ही तुमचा वैयक्तिक डेटा कोणत्याही त्रयस्थांशी शेअर करत नाही.',
        termsTitle: 'अटी आणि शर्ती',
        termsContent: 'हे प्लॅटफॉर्म केवळ माहितीपूर्ण उद्देशांसाठी आहे. प्रदान केलेली माहिती कायदेशीर सल्ला नाही. अधिकृत कागदपत्रांसाठी कृपया संबंधित सरकारी कार्यालयाशी संपर्क साधा.',
        contactTitle: 'संपर्क',
        contactContent: 'कोणत्याही प्रश्नासाठी किंवा मदतीसाठी, आम्हाला येथे ईमेल करा: help@landsathi.ai'
      },
      en: {
        heroBadge: '100% Secure Land Records Guide',
        heroTitle: '<em>AI-powered</em> Answers for Land Queries',
        heroDesc: '7/12 Extract, Mutation, Heir Entry — explained in simple language.',
        searchPlaceholder: 'How to get 7/12 extract?',
        searchBtn: 'Ask',
        chatSubtitle: '🟢 Live — Ready to help',
        chatPlaceholder: 'Type your question here...',
        chatDisclaimer: 'This information is for guidance only. For official work, contact the relevant office.',
        featuresTitle: 'How Land Sathi Helps You',
        feat1Title: 'AI Guidance',
        feat1Desc: 'Simple answers powered by Gemini AI — in Hindi, Marathi, and English.',
        feat2Title: 'Document Checklist',
        feat2Desc: 'See exactly which documents you need.',
        feat3Title: 'Step-by-Step Process',
        feat3Desc: 'Complete process guide — in easy language.',
        feat4Title: 'Schemes & Subsidy',
        feat4Desc: 'Updates on new government schemes for farmers.',
        footerDisclaimer: 'This platform provides informational guidance. It is not an official government website.',
        qa712: '7/12 Extract',
        qaFerfar: 'Mutation',
        qaTransfer: 'Land Transfer',
        qaWaras: 'Heir Entry',
        qaTalathi: 'Talathi Office',
        panchangTitle: 'Today\'s Panchang 📆',
        panchangDesc: 'Plan your agricultural tasks by auspicious timing.',
        footerAbout: 'About Us',
        footerPrivacy: 'Privacy Policy',
        footerTerms: 'Terms & Conditions',
        footerContact: 'Contact',
        aboutTitle: 'About Land Sathi',
        aboutContent: 'Land Sathi is an AI-powered platform helping farmers and land owners in Maharashtra understand land records (like 7/12 Extract, Mutation). Our goal is to make government processes simple and transparent.',
        privacyTitle: 'Privacy Policy',
        privacyContent: 'We respect your privacy. The information shared is only used to provide better guidance. We do not share your personal data with third parties.',
        termsTitle: 'Terms & Conditions',
        termsContent: 'This platform is for informational purposes only. The information provided is not legal advice. For official documents, please contact the relevant government office.',
        contactTitle: 'Contact Us',
        contactContent: 'For any queries or help, email us at: help@landsathi.ai'
      }
    };

    const t = translations[currentLang] || translations['mr'];
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) el.innerHTML = t[key];
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) el.placeholder = t[key];
    });
  }

  // =====================================================
  // SEARCH
  // =====================================================
  function setupSearch() {
    heroSearchBtn.addEventListener('click', () => {
      const query = heroSearch.value.trim();
      if (query) {
        sendMessage(query);
        heroSearch.value = '';
        if (!$('#chatSection').classList.contains('active')) {
          toggleChat();
        }
      }
    });
    heroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') heroSearchBtn.click();
    });
  }

  // =====================================================
  // QUICK ACTIONS
  // =====================================================
  function setupQuickActions() {
    $$('.qa-card').forEach(card => {
      card.addEventListener('click', () => {
        const query = card.dataset.query;
        if (query) {
          sendMessage(query);
          if (!$('#chatSection').classList.contains('active')) {
            toggleChat();
          }
        }
      });
    });
  }

  // =====================================================
  // FAB / WIDGET TOGGLE
  // =====================================================
  function setupFAB() {
    fabBtn.addEventListener('click', toggleChat);
    const chatCloseBtn = $('#chatCloseBtn');
    if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChat);
  }

  function toggleChat() {
    const chatSection = $('#chatSection');
    chatSection.classList.toggle('active');
    if (chatSection.classList.contains('active')) {
      // Only auto-focus on desktop, mobile keyboard auto-popup ruins UX
      if (window.innerWidth > 768) {
        setTimeout(() => chatInput.focus(), 300);
      }
    }
  }

  // =====================================================
  // CHAT ENGINE
  // =====================================================
  function setupChat() {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatSendBtn.click();
      }
    });

    chatClearBtn.addEventListener('click', clearChat);

    // =====================================================
    // DOCUMENT UPLOAD LOGIC
    // =====================================================
    const fileBtn = $('#chatFileBtn');
    const fileInput = $('#chatFileInput');
    let selectedFile = null;

    if (fileBtn && fileInput) {
      fileBtn.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          selectedFile = e.target.files[0];
          const fileName = selectedFile.name;
          const previewText = currentLang === 'mr' ? `📄 निवडलेला दस्तऐवज: ${fileName}` : currentLang === 'hi' ? `📄 चुना गया दस्तावेज़: ${fileName}` : `📄 Selected document: ${fileName}`;
          
          // Show preview in input box visually
          chatInput.value = "";
          chatInput.placeholder = previewText;
          chatInput.style.color = 'var(--primary)';
        }
      });
    }

    // Override existing click handler for send
    // Removing the old listener to replace it with the new comprehensive one
    chatSendBtn.replaceWith(chatSendBtn.cloneNode(true));
    chatSendBtn = $('#chatSendBtn'); // Re-select

    chatSendBtn.addEventListener('click', async () => {
      const msg = chatInput.value.trim();
      const currentFile = selectedFile; // Capture current state

      if (!msg && !currentFile) return;

      // Reset UI state before sending
      chatInput.value = '';
      chatInput.placeholder = getTranslations().chatPlaceholder || "तुमचा प्रश्न इथे लिहा...";
      chatInput.style.color = '';
      selectedFile = null;
      fileInput.value = ''; // clear input

      if (currentFile) {
        // Handle File + Text
        const previewHTML = `<div style="display:flex; align-items:center; gap:8px; background:rgba(30,58,138,0.1); padding:8px 12px; border-radius:8px; margin-bottom:8px; width:fit-content; border: 1px solid rgba(30,58,138,0.2);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span style="font-size:12px; font-weight:700; color:var(--primary);">${currentFile.name}</span>
        </div>`;
        const userMsgText = msg ? `<strong>Q:</strong> ${escapeHtml(msg)}` : `<em>(चित्र पाठवले / Image sent)</em>`;
        
        appendMessageRaw('user', previewHTML + userMsgText);
        await sendDocumentMessage(msg, currentFile);
      } else {
        // Handle Text Only
        sendMessage(msg);
      }
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatSendBtn.click();
      }
    });

    // Voice Input Setup
    const micBtn = $('#chatMicBtn');
    if (micBtn) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const resetPlaceholder = () => {
          const t = getTranslations();
          chatInput.placeholder = t.chatPlaceholder || "तुमचा प्रश्न इथे लिहा...";
          micBtn.classList.remove('listening');
        };

        recognition.onstart = () => {
          micBtn.classList.add('listening');
          chatInput.placeholder = currentLang === 'mr' ? "ऐकत आहे..." : currentLang === 'hi' ? "सुन रहा हूँ..." : "Listening...";
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          chatInput.value = transcript;
          resetPlaceholder();
        };

        recognition.onerror = resetPlaceholder;
        recognition.onend = resetPlaceholder;

        micBtn.addEventListener('click', () => {
          if (micBtn.classList.contains('listening')) {
            recognition.stop();
          } else {
            recognition.lang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US';
            try { recognition.start(); } catch(e){}
          }
        });
      } else {
        micBtn.style.display = 'none'; // Not supported
      }
    }
  }

  function addWelcomeMessage() {
    // Only add if chat is empty
    if (chatMessages.children.length > 0) return;

    const welcomeTexts = {
      mr: `🙏 नमस्ते! मी **Land Sathi AI** आहे.\n\nजमिनीशी संबंधित कोणताही प्रश्न विचारा:\n\n🔹 ७/१२ उतारा\n🔹 फेरफार (Mutation)\n🔹 वारस नोंद (Heir Entry)\n🔹 जमीन हस्तांतरण\n🔹 तलाठी कार्यालय\n\nवरील बटणावर क्लिक करा किंवा तुमचा प्रश्न टाइप करा!`,
      hi: `🙏 नमस्ते! मैं **Land Sathi AI** हूँ।\n\nमुझसे ज़मीन से जुड़ा कोई भी सवाल पूछें:\n\n🔹 7/12 उतारा\n🔹 फेरफार (Mutation)\n🔹 वारस नोंद (Heir Entry)\n🔹 ज़मीन ट्रांसफर\n🔹 तलाठी ऑफिस\n\nऊपर के बटनों पर क्लिक करें या अपना सवाल टाइप करें!`,
      en: `🙏 Hello! I am **Land Sathi AI**.\n\nAsk me anything about land records:\n\n🔹 7/12 Extract\n🔹 Mutation (Ferfar)\n🔹 Heir Entry\n🔹 Land Transfer\n🔹 Talathi Office`
    };

    appendMessage('ai', welcomeTexts[currentLang] || welcomeTexts['mr'], 'welcome');
  }

  function updateWelcomeMessage() {
    if (chatMessages.children.length === 1) {
      chatMessages.innerHTML = '';
      addWelcomeMessage();
    }
  }

  async function sendDocumentMessage(text, file) {
    const typingEl = showTypingIndicator();

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('message', text);
      formData.append('language', currentLang);
      if (sessionId) formData.append('sessionId', sessionId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData // No Context-Type header for FormData, browser sets it automatically with boundary
      });

      const data = await response.json();
      removeTypingIndicator(typingEl);

      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('landSathi_sessionId', sessionId);
      }

      appendMessage('ai', data.reply, data.source);
    } catch (error) {
      console.error('Upload Error:', error);
      removeTypingIndicator(typingEl);
      appendMessage('ai', '⚠️ कागदपत्र अपलोड करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    }
  }

  async function sendMessage(text) {
    appendMessage('user', text);
    const typingEl = showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, language: currentLang })
      });

      const data = await response.json();
      removeTypingIndicator(typingEl);

      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('landSathi_sessionId', sessionId);
      }

      appendMessage('ai', data.reply, data.source);
    } catch (error) {
      console.error('Chat Error:', error);
      removeTypingIndicator(typingEl);
      appendMessage('ai', '⚠️ कृपया बाद में पुन: प्रयास करें। / Please try again later.');
    }
  }

  function appendMessage(type, text, source) {
    appendMessageRaw(type, escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'), source);
  }

  function appendMessageRaw(type, htmlContent, source) {
    const row = document.createElement('div');
    row.className = `msg-row ${type}`;

    if (type === 'ai') {
      const avatar = document.createElement('div');
      avatar.className = 'msg-ai-avatar';
      avatar.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M7 5H3"/></svg>`;
      row.appendChild(avatar);
    }

    const div = document.createElement('div');
    if (source === 'welcome') {
      div.className = `msg ${type} welcome-msg`;
    } else {
      div.className = `msg ${type}`;
    }

    div.innerHTML = htmlContent;

    // Add verified badge for AI messages
    if (type === 'ai') {
      const meta = document.createElement('div');
      meta.className = 'msg-meta';
      meta.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Land Sathi ${source === 'gemini' ? '• Gemini AI' : source === 'gemini-vision' ? '• Gemini Vision' : source === 'openai' ? '• OpenAI GPT' : '• Verified'}
      `;
      div.appendChild(meta);
    }

    row.appendChild(div);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'msg-row ai';

    const avatar = document.createElement('div');
    avatar.className = 'msg-ai-avatar';
    avatar.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M7 5H3"/></svg>`;
    row.appendChild(avatar);

    const div = document.createElement('div');
    div.className = 'msg ai typing-indicator';
    div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

    row.appendChild(div);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return row;
  }

  function removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  async function clearChat() {
    chatMessages.innerHTML = '';
    if (sessionId) {
      try {
        await fetch('/api/chat/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch (e) { /* ignore */ }
    }
    sessionId = null;
    localStorage.removeItem('landSathi_sessionId');
    addWelcomeMessage();
  }

  async function loadChatHistory() {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat/history/${sessionId}`);
      const data = await res.json();
      if (data.history && data.history.length > 0) {
        chatMessages.innerHTML = ''; // Clear welcome
        data.history.forEach(msg => {
          appendMessage(msg.role === 'user' ? 'user' : 'ai', msg.text);
        });
      }
    } catch (e) { /* ignore */ }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // =====================================================
  // FOOTER PAGES MODAL
  // =====================================================
  function setupFooterPages() {
    const pageLinks = $$('.page-link');
    const modal = $('#pageModal');
    const closeBtn = $('#closeModal');
    const modalTitle = $('#modalTitle');
    const modalBody = $('#modalBody');

    if (!modal || !closeBtn) return;

    pageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        const translations = getTranslations();
        
        modalTitle.textContent = translations[`${page}Title`];
        modalBody.textContent = translations[`${page}Content`];
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBtn.click();
    });
  }

  function getTranslations() {
    const translations = {
      hi: {
        aboutTitle: 'Land Sathi के बारे में',
        aboutContent: 'Land Sathi एक AI-आधारित प्लेटफ़ॉर्म है जो महाराष्ट्र के किसानों और ज़मीन मालिकों को ज़मीन से जुड़े दस्तावेज़ों (जैसे 7/12 उतारा, फेरफार) को समझने में मदद करता है। हमारा लक्ष्य सरकारी प्रक्रियाओं को सरल और पारदर्शी बनाना है।',
        privacyTitle: 'गोपनीयता नीति',
        privacyContent: 'हम आपकी गोपनीयता का सम्मान करते हैं। आपके द्वारा साझा की गई जानकारी का उपयोग केवल बेहतर मार्गदर्शन प्रदान करने के लिए किया जाता है। हम आपका व्यक्तिगत डेटा किसी तीसरे पक्ष के साथ साझा नहीं करते हैं।',
        termsTitle: 'नियम और शर्तें',
        termsContent: 'यह प्लेटफ़ॉर्म केवल सूचनात्मक उद्देश्यों के लिए है। प्रदान की गई जानकारी कानूनी सलाह नहीं है। आधिकारिक दस्तावेज़ों के लिए कृपया संबंधित सरकारी कार्यालय से संपर्क करें।',
        contactTitle: 'संपर्क करें',
        contactContent: 'किसी भी प्रश्न या सहायता के लिए, हमें यहाँ ईमेल करें: help@landsathi.ai'
      },
      mr: {
        aboutTitle: 'Land Sathi बद्दल',
        aboutContent: 'Land Sathi हे एक AI-आधारित प्लॅटफॉर्म आहे जे महाराष्ट्रातील शेतकरी आणि जमीन मालकांना जमिनीशी संबंधित कागदपत्रे (उदा. ७/१२ उतारा, फेरफार) समजून घेण्यास मदत करते. सरकारी प्रक्रिया सोपी आणि पारदर्शक करणे हे आमचे ध्येय आहे.',
        privacyTitle: 'गोपनीयता धोरण',
        privacyContent: 'आम्ही तुमच्या गोपनीयतेचा आदर करतो. तुमच्याद्वारे शेअर केलेली माहिती केवळ अधिक चांगल्या मार्गदर्शनासाठी वापरली जाते. आम्ही तुमचा वैयक्तिक डेटा कोणत्याही त्रयस्थांशी शेअर करत नाही.',
        termsTitle: 'अटी आणि शर्ती',
        termsContent: 'हे प्लॅटफॉर्म केवळ माहितीपूर्ण उद्देशांसाठी आहे. प्रदान केलेली माहिती कायदेशीर सल्ला नाही. अधिकृत कागदपत्रांसाठी कृपया संबंधित सरकारी कार्यालयाशी संपर्क साधा.',
        contactTitle: 'संपर्क',
        contactContent: 'कोणत्याही प्रश्नासाठी किंवा मदतीसाठी, आम्हाला येथे ईमेल करा: help@landsathi.ai'
      },
      en: {
        aboutTitle: 'About Land Sathi',
        aboutContent: 'Land Sathi is an AI-powered platform helping farmers and land owners in Maharashtra understand land records (like 7/12 Extract, Mutation). Our goal is to make government processes simple and transparent.',
        privacyTitle: 'Privacy Policy',
        privacyContent: 'We respect your privacy. The information shared is only used to provide better guidance. We do not share your personal data with third parties.',
        termsTitle: 'Terms & Conditions',
        termsContent: 'This platform is for informational purposes only. The information provided is not legal advice. For official documents, please contact the relevant government office.',
        contactTitle: 'Contact Us',
        contactContent: 'For any queries or help, email us at: help@landsathi.ai'
      }
    };
    return translations[currentLang] || translations['mr'];
  }

  // =====================================================
  // START APPLICATION
  // =====================================================
  document.addEventListener('DOMContentLoaded', init);
})();

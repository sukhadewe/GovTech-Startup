import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { landKnowledge } from '../src/landKnowledge.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Multer for handling file uploads
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
const upload = multer({ dest: 'uploads/' });

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// AI SETUP (OpenAI + Gemini)
// =====================================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getSystemPrompt(lang) {
  let langStr = "Marathi";
  if (lang === 'hi') langStr = "Hindi";
  if (lang === 'en') langStr = "English";

  return `You are "Land Sathi AI" — an expert assistant for Indian land records, Talathi office processes, and rural government services.

You MUST follow these rules STRICTLY:

1. LANGUAGE: Always answer ONLY in simple ${langStr} language. Do not mix languages.

2. EXPERTISE: You answer questions about:
   - 7/12 Extract (Satbara Utara)
   - Mutation (Ferfar)
   - Land Transfer (Jamin Hastantaran)
   - Heir Entry (Waras Nond)
   - Land Maps and Survey Numbers
   - Talathi Office procedures
   - Land Registration
   - Land Verification
   - Farmer schemes related to land
   - Land dispute resolution
   - Online land record portals (Mahabhulekh, etc.)

3. STYLE: 
   - Use very simple language that rural users can understand.
   - Explain step-by-step processes.
   - Mention required documents when relevant.
   - Mention which office handles the task (Talathi, Tehsil, Sub-Registrar, etc.).
   - Avoid complicated legal language.
   - Focus on practical guidance.
   - Be warm, helpful, and supportive.

4. DISCLAIMER: At the end of important answers, add a brief note:
   "📋 Note: This is guidance only. For official work, please visit your local Talathi/Tehsil office."

5. IDENTITY: You are NOT a government service. You are "Land Sathi" — an independent digital guide that helps citizens understand land processes.

6. If the user asks something unrelated to land records, politely redirect them by saying you specialize in land-related guidance only.`;
}

// In-memory conversation storage (per session)
const conversations = new Map();

// =====================================================
// API ROUTES
// =====================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Land Sathi API is running' });
});

// Chat endpoint with conversation history
app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body || {};
    const message = body.message;
    const sessionId = body.sessionId;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation history
    const sid = sessionId || generateSessionId();
    if (!conversations.has(sid)) conversations.set(sid, []);
    const history = conversations.get(sid);

    const lang = body.language || 'mr';
    const systemPrompt = getSystemPrompt(lang);

    // ========== TIER 1: Try OpenAI ==========
    if (process.env.OPENAI_API_KEY) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.map(h => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.text
          })),
          { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        // Save to history
        history.push({ role: 'user', text: message });
        history.push({ role: 'model', text: reply });
        if (history.length > 40) history.splice(0, history.length - 40);

        console.log('✅ Response from OpenAI GPT-4o-mini');
        return res.json({ reply, sessionId: sid, source: 'openai' });
      } catch (err) {
        console.log(`⚠️ OpenAI failed: ${err.message.substring(0, 100)}`);
      }
    }

    // ========== TIER 2: Try Gemini ==========
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
      const modelsToTry = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          });

          const chat = model.startChat({
            history: history.map(h => ({
              role: h.role,
              parts: [{ text: h.text }]
            })),
          });

          const result = await chat.sendMessage(message);
          const reply = result.response.text();

          history.push({ role: 'user', text: message });
          history.push({ role: 'model', text: reply });
          if (history.length > 40) history.splice(0, history.length - 40);

          console.log(`✅ Response from Gemini ${modelName}`);
          return res.json({ reply, sessionId: sid, source: 'gemini' });
        } catch (err) {
          console.log(`⚠️ ${modelName} failed: ${err.message.substring(0, 80)}`);
          continue;
        }
      }
    }

    // ========== TIER 3: Fallback Knowledge Base ==========
    console.log('📚 Using fallback knowledge base');
    const reply = getFallbackResponse(message, lang);
    history.push({ role: 'user', text: message });
    history.push({ role: 'model', text: reply });
    if (history.length > 40) history.splice(0, history.length - 40);

    res.json({ reply, sessionId: sid, source: 'fallback' });
  } catch (error) {
    console.error('Chat Error:', error.message);
    const body = req.body || {};
    res.json({
      reply: getFallbackResponse(body.message || '', body.language || 'mr'),
      sessionId: body.sessionId || generateSessionId(),
      source: 'fallback',
      error: error.message
    });
  }
});

// =====================================================
// DOCUMENT UPLOAD & ANALYSIS ENDPOINT
// =====================================================
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ reply: '⚠️ कृपया कागदपत्र अपलोड करा. (Please upload a document.)' });
    }

    const lang = req.body.language || 'mr';
    const message = req.body.message || (lang === 'mr' ? 'या कागदपत्रात काय लिहिले आहे ते सोप्या भाषेत सांगा.' : lang === 'hi' ? 'इस दस्तावेज़ में क्या लिखा है, सरल भाषा में बताएं।' : 'Explain what is written in this document in simple language.');

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      // Fallback if no API key
      fs.unlinkSync(req.file.path);
      return res.json({ 
        reply: (lang === 'mr' ? '⚠️ सर्व्हरवर AI Key सेट केलेली नाही. कागदपत्र वाचता आले नाही.' : lang === 'hi' ? '⚠️ सर्वर पर AI Key सेट नहीं है। दस्तावेज़ नहीं पढ़ा जा सका।' : '⚠️ AI Key not set on server. Could not read document.') 
      });
    }

    console.log(`📤 Uploaded file: ${req.file.originalname} (${req.file.path})`);
    
    // Upload standard file to Gemini File API
    const uploadResult = await fileManager.uploadFile(req.file.path, {
      mimeType: req.file.mimetype,
      displayName: req.file.originalname,
    });
    
    console.log(`✅ Uploaded to Gemini as: ${uploadResult.file.uri}`);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: getSystemPrompt(lang),
    });

    const result = await model.generateContent([
      uploadResult.file,
      { text: message }
    ]);

    const reply = result.response.text();
    console.log('✅ Document analyzed successfully.');

    // Cleanup local file and Gemini Remote File (async)
    fs.unlinkSync(req.file.path);
    fileManager.deleteFile(uploadResult.file.name).catch(e => console.error("Error deleting remote file:", e));

    res.json({ reply, source: 'gemini-vision' });

  } catch (error) {
    console.error('Upload Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    const lang = req.body.language || 'mr';
    res.json({
      reply: (lang === 'mr' ? '⚠️ कागदपत्र वाचताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' : lang === 'hi' ? '⚠️ दस्तावेज़ पढ़ने में त्रुटि। कृपया पुनः प्रयास करें।' : '⚠️ Error reading document. Please try again.')
    });
  }
});

// Clear conversation
app.post('/api/chat/clear', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && conversations.has(sessionId)) {
    conversations.delete(sessionId);
  }
  res.json({ status: 'cleared' });
});

// Get conversation history
app.get('/api/chat/history/:sessionId', (req, res) => {
  const history = conversations.get(req.params.sessionId) || [];
  res.json({ history });
});

// =====================================================
// FALLBACK KNOWLEDGE BASE (when Gemini is unavailable)
// =====================================================
function getFallbackResponse(message, lang) {
  const full = getFallbackResponseFull(message);
  
  const mMatch = full.indexOf('**मराठी:**');
  const hMatch = full.indexOf('**हिंदी:**');
  const eMatch = full.indexOf('**English:**');
  
  if (mMatch !== -1 && hMatch !== -1 && eMatch !== -1) {
    const pMr = full.substring(mMatch + 10, hMatch).trim();
    const pHi = full.substring(hMatch + 9, eMatch).trim();
    let pEn = full.substring(eMatch + 12).trim();

    // Preserve the disclaimer note if present in English part
    let note = '';
    if (pEn.includes('📋 Note:')) {
      const noteIndex = pEn.indexOf('📋 Note:');
      note = '\\n\\n' + pEn.substring(noteIndex);
      pEn = pEn.substring(0, noteIndex).trim();
    }

    if (lang === 'mr') return pMr;
    if (lang === 'hi') return pHi;
    if (lang === 'en') return pEn;
  }
  
  // If parsing fails or it's a generic welcome message, handle differently
  // Actually the welcome message is also formatted exactly the same way
  return full;
}

function getFallbackResponseFull(message) {
  const lower = message.toLowerCase();

  if (lower.includes('7/12') || lower.includes('सातबारा') || lower.includes('satbara') || lower.includes('extract')) {
    return `**मराठी:**
७/१२ उतारा हा जमिनीचा सर्वात महत्त्वाचा कायदेशीर दस्तऐवज आहे. यामध्ये जमिनीचा मालक, क्षेत्रफळ आणि पिकांची माहिती असते.

📍 कुठे मिळेल: तलाठी कार्यालय किंवा महाभूलेख पोर्टल (bhulekh.mahabhumi.gov.in)
📄 आवश्यक: सर्वे नंबर / गट नंबर

**हिंदी:**
7/12 उतारा (सातबारा) ज़मीन का सबसे मुख्य कागज़ होता है। यह सरकारी रजिस्टर का हिस्सा है जो बताता है:
• ज़मीन का मालिक कौन है
• ज़मीन कितनी बड़ी है (क्षेत्रफल)
• कौन सी फसल उगाई जा रही है
• सर्वे नंबर क्या है

📍 कहाँ मिलेगा: तलाठी कार्यालय या महाभूलेख पोर्टल
📄 ज़रूरी: सर्वे नंबर / गट नंबर

**English:**
The 7/12 extract (Satbara) is the most important land document. It shows ownership, area, crops, and survey number.

📍 Where: Talathi Office or Mahabhulekh Portal
📄 Required: Survey Number / Gut Number

📋 Note: This is guidance only. For official work, please visit your local Talathi office.`;
  }

  if (lower.includes('फेरफार') || lower.includes('mutation') || lower.includes('ferfar')) {
    return `**मराठी:**
फेरफार म्हणजे सरकारी नोंदीत मालकी हक्क बदलणे. जमीन खरेदी किंवा वारसा हक्काने मिळाल्यावर हे करणे आवश्यक आहे.

📌 प्रक्रिया:
1. तलाठी कार्यालयात नमुना ९ अर्ज भरा
2. खरेदीखत आणि ७/१२ प्रत जमा करा
3. १५ दिवसांचा जाहीर नोटीस कालावधी
4. मंडल अधिकाऱ्यांकडून अंतिम मंजुरी

📄 कागदपत्रे: खरेदीखत, ७/१२ उतारा, आधार कार्ड, अर्ज
⏱️ कालावधी: १५-३० दिवस

**हिंदी:**
फेरफार (Mutation) का अर्थ है सरकारी रिकॉर्ड में मालिकाना हक बदलना। ज़मीन खरीदने या वारिस मिलने पर यह ज़रूरी है।

📌 प्रक्रिया:
1. तलाठी कार्यालय में फॉर्म नंबर 9 भरें
2. सेल डीड और 7/12 की कॉपी जमा करें
3. 15 दिन की सार्वजनिक सूचना अवधि
4. सर्कल ऑफिसर द्वारा अंतिम मंजूरी

📄 दस्तावेज़: सेल डीड, 7/12 उतारा, आधार कार्ड, आवेदन पत्र
⏱️ समय: 15-30 दिन

**English:**
Mutation (Ferfar) updates ownership in government records after a land transaction.

Process: Form 9 → Document Verification → 15-day Notice → Final Approval
Time: 15-30 days

📋 Note: This is guidance only. For official work, please visit your local Talathi office.`;
  }

  if (lower.includes('वारस') || lower.includes('waras') || lower.includes('heir') || lower.includes('वारिस')) {
    return `**मराठी:**
वारस नोंद — मृत व्यक्तीच्या जमिनीवर कायदेशीर वारसांची नावे लावण्याची प्रक्रिया.

📌 प्रक्रिया:
1. तलाठ्याकडे अर्ज करा
2. मृत्यू प्रमाणपत्र आणि वारस दाखला जमा करा
3. सर्व वारसांचे आधार कार्ड द्या
4. १५ दिवसांचा नोटीस कालावधी
5. ७/१२ वर नावे अपडेट

📄 आवश्यक: मृत्यू प्रमाणपत्र, वारस दाखला, आधार कार्ड
📍 कार्यालय: तलाठी / तहसील

**हिंदी:**
वारस नोंद (Heir Entry) — मृत व्यक्ति की ज़मीन उसके कानूनी वारिसों के नाम करने की प्रक्रिया।

📌 प्रक्रिया:
1. तलाठी को आवेदन दें
2. मृत्यु प्रमाणपत्र और वारस प्रमाणपत्र जमा करें
3. सभी वारिसों के आधार कार्ड दें
4. 15 दिन की नोटिस अवधि
5. 7/12 पर नाम अपडेट

📄 दस्तावेज़: मृत्यु प्रमाणपत्र, वारस प्रमाणपत्र, आधार कार्ड
📍 कार्यालय: तलाठी / तहसील

**English:**
Heir Entry transfers land ownership from a deceased person to their legal heirs.

Documents: Death Certificate, Heir Certificate, Aadhaar
Office: Talathi / Tehsil

📋 Note: This is guidance only. For official work, please visit your local Talathi office.`;
  }

  if (lower.includes('transfer') || lower.includes('हस्तांतरण') || lower.includes('नाम') || lower.includes('खरीद')) {
    return `**मराठी:**
जमीन आपल्या नावावर करण्यासाठी:
1. दुय्यम निबंधक कार्यालयात खरेदीखत नोंदणी करा
2. मुद्रांक शुल्क आणि नोंदणी फी भरा
3. तलाठ्याकडे फेरफारसाठी अर्ज करा
4. ७/१२ वर नाव बदला

📄 कागदपत्रे: खरेदीखत, ७/१२, आधार कार्ड, साक्षीदारांचे ओळखपत्र
📍 कार्यालय: दुय्यम निबंधक → तलाठी

**हिंदी:**
ज़मीन अपने नाम करने के लिए:
1. सब-रजिस्ट्रार कार्यालय में सेल डीड रजिस्टर कराएं
2. स्टाम्प ड्यूटी और रजिस्ट्रेशन फीस भरें
3. तलाठी के पास फेरफार के लिए आवेदन करें
4. 7/12 पर नाम बदलवाएं

📄 दस्तावेज़: सेल डीड, 7/12, आधार कार्ड, गवाहों के आईडी
📍 कार्यालय: सब-रजिस्ट्रार → तलाठी

**English:**
To transfer land to your name:
1. Register Sale Deed at Sub-Registrar office
2. Pay stamp duty and registration fees
3. Apply for Mutation at Talathi office
4. Get 7/12 updated

📋 Note: This is guidance only. For official work, please visit your local Talathi office.`;
  }

  if (lower.includes('तलाठी') || lower.includes('talathi')) {
    return `**मराठी:**
तलाठी हा गावस्तरावरील महसूल अधिकारी आहे. तलाठ्यांची कामे:
• ७/१२ उतारा देणे
• फेरफार प्रक्रिया सुरू करणे
• वारस नोंद करणे
• पीक पंचनामा
• जमिनीच्या नोंदी ठेवणे

📍 कार्यालय वेळ: सकाळी १० ते सायंकाळी ५ (सोम-शनि)

**हिंदी:**
तलाठी गाँव स्तर का राजस्व अधिकारी होता है। उसके काम:
• 7/12 उतारा देना
• फेरफार प्रक्रिया शुरू करना
• वारस नोंद करना
• फसल पंचनामा
• ज़मीन रिकॉर्ड रखना

📍 तलाठी कार्यालय का समय: सुबह 10 से शाम 5 बजे (सोम-शनि)

**English:**
Talathi is the village-level revenue officer. Responsibilities:
• Issue 7/12 extracts
• Process mutations
• Record heir entries
• Conduct crop surveys
• Maintain land records

📍 Office hours: 10 AM to 5 PM (Mon-Sat)

📋 Note: This is guidance only. For official work, please visit your local Talathi office.`;
  }

  if (lower.includes('नक्शा') || lower.includes('map') || lower.includes('survey') || lower.includes('मोजणी')) {
    return `**मराठी:**
जमिनीचा नकाशा पाहण्यासाठी:
• ऑनलाइन: mahabhunakasha.mahabhumi.gov.in वेबसाइट वापरा
• जिल्हा, तालुका, गाव निवडा
• गट नंबर टाका — नकाशा दिसेल

मोजणीसाठी भूमी अभिलेख विभागात अर्ज करा.
शुल्क: ₹१०००-₹५००० (क्षेत्रफळानुसार)

**हिंदी:**
ज़मीन का नक्शा और सर्वे नंबर जानने के लिए:
• ऑनलाइन: mahabhunakasha.mahabhumi.gov.in पर जाएं
• जिला, तहसील, गाँव चुनें
• गट नंबर डालें — नक्शा दिखेगा

मोजणी (Survey) के लिए भूमि अभिलेख विभाग में आवेदन करें।
फीस: ₹1000-₹5000 (क्षेत्रफल अनुसार)

**English:**
To view land maps:
• Online: visit mahabhunakasha.mahabhumi.gov.in
• Select District, Taluka, Village
• Enter Gut Number to see the map

For surveys, apply to the Land Records department.
Fee: ₹1000-₹5000 (varies by area)

📋 Note: This is guidance only. For official work, please visit your local Talathi office.`;
  }

  // Default response
  return `**मराठी:**
नमस्ते! मी **Land Sathi AI** आहे. मी तुम्हाला जमिनीशी संबंधित प्रत्येक प्रश्नात मदत करू शकतो:

🔹 ७/१२ उतारा (सातबारा) — जमिनीचे मुख्य अभिलेख
🔹 फेरफार (Mutation) — मालकी हक्क बदलणे
🔹 वारस नोंद (Heir Entry) — पैतृक जमीन नावावर करणे
🔹 जमीन हस्तांतरण — खरेदी/विक्री प्रक्रिया
🔹 जमीन नकाशा — सर्वे आणि मोजणी
🔹 तलाठी कार्यालय — सर्व सरकारी प्रक्रिया

तुमचा प्रश्न मराठी, हिंदी किंवा English मध्ये विचारा!

**हिंदी:**
नमस्ते! मैं **Land Sathi AI** हूँ। मैं आपकी ज़मीन से जुड़ी हर समस्या में मदद कर सकता हूँ:

🔹 7/12 उतारा (सातबारा) — ज़मीन का मुख्य रिकॉर्ड
🔹 फेरफार (Mutation) — मालिकाना हक बदलना
🔹 वारस नोंद (Heir Entry) — पैतृक ज़मीन नाम करना
🔹 ज़मीन ट्रांसफर — ज़मीन खरीद/बिक्री
🔹 ज़मीन नक्शा — सर्वे और मोजणी
🔹 तलाठी कार्यालय — सभी सरकारी प्रक्रियाएं

अपना सवाल मराठी, हिंदी या English में पूछें!

**English:**
Hello! I am **Land Sathi AI**. I can help you with all land-related queries:

🔹 7/12 Extract (Satbara) — Main land record
🔹 Mutation (Ferfar) — Ownership change
🔹 Heir Entry (Waras Nond) — Ancestral land transfer
🔹 Land Transfer — Buy/Sell process
🔹 Land Map — Survey and measurement
🔹 Talathi Office — All government procedures

Ask in Marathi, Hindi, or English!`;
}

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// =====================================================
// SERVE FRONTEND
// =====================================================
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
  let aiStatus = 'Fallback Mode (No API Key)';
  if (hasOpenAI && hasGemini) aiStatus = 'OpenAI + Gemini ✅';
  else if (hasOpenAI) aiStatus = 'OpenAI Connected ✅';
  else if (hasGemini) aiStatus = 'Gemini Connected ✅';

  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🌾 Land Sathi Server Running 🌾      ║
  ║                                          ║
  ║  Local:  http://localhost:${PORT}            ║
  ║  Status: Ready                           ║
  ║  AI:     ${aiStatus.padEnd(28)}║
  ╚══════════════════════════════════════════╝
  `);
});

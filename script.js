// ======================================
// 🌍 Multi-Language AI Chatbot 🚀 (API-Free)
// ======================================

// 🎤 Speech Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "auto"; 
recognition.onresult = (event) => {
    document.getElementById("user-input").value = event.results[0][0].transcript;
    sendMessage();
};

// 🔊 Start Voice Recognition
function startVoiceRecognition() {
    recognition.start();
}

// 🎯 Offline Language Detection (Basic Model)
function detectLanguage(text) {
    const langPatterns = {
        en: /^[a-zA-Z\s.,?!'"]+$/, // English
        es: /^[a-zA-Záéíóúñü\s.,?!'"]+$/, // Spanish
        fr: /^[a-zA-Zàâçéèêëîïôûùüÿ\s.,?!'"]+$/, // French
        de: /^[a-zA-Zäöüß\s.,?!'"]+$/, // German
        hi: /^[\u0900-\u097F\s]+$/, // Hindi
        zh: /^[\u4e00-\u9fff\s]+$/, // Chinese
        ar: /^[\u0600-\u06FF\s]+$/, // Arabic
        ru: /^[а-яА-ЯёЁ\s.,?!'"]+$/ // Russian
    };

    for (const [lang, pattern] of Object.entries(langPatterns)) {
        if (pattern.test(text)) return lang;
    }
    return "en"; // Default to English
}

// 🌎 Offline Basic Translation (Limited Dictionary)
const translationDict = {
    en: { hello: "hello", thanks: "thanks", bye: "bye" },
    es: { hello: "hola", thanks: "gracias", bye: "adiós" },
    fr: { hello: "bonjour", thanks: "merci", bye: "au revoir" },
    de: { hello: "hallo", thanks: "danke", bye: "tschüss" },
    hi: { hello: "नमस्ते", thanks: "धन्यवाद", bye: "अलविदा" },
    zh: { hello: "你好", thanks: "谢谢", bye: "再见" },
    ar: { hello: "مرحبا", thanks: "شكرا", bye: "وداعا" },
    ru: { hello: "привет", thanks: "спасибо", bye: "пока" }
};

// 🌍 Translate Text Locally (Word Matching)
function translateText(text, fromLang, toLang) {
    if (fromLang === toLang) return text; // No translation needed

    const words = text.toLowerCase().split(" ");
    return words.map(word => translationDict[toLang]?.[word] || word).join(" ");
}

// 🤖 Offline AI Chatbot (Rule-Based Logic)
function getAIResponse(userText, lang) {
    userText = userText.toLowerCase();

    const responses = {
        hello: "Hello! How can I assist you?",
        thanks: "You're welcome!",
        bye: "Goodbye! Have a great day!"
    };

    // Detect keyword and respond
    for (const [keyword, response] of Object.entries(responses)) {
        if (userText.includes(keyword)) {
            return translateText(response, "en", lang);
        }
    }
    
    return translateText("I'm still learning! Ask me something else.", "en", lang);
}

// 📤 Send Message and Get AI Response
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    const chatBox = document.getElementById("chat-box");

    // Detect Language
    const detectedLang = detectLanguage(userInput);

    // Get AI Response
    const aiResponse = getAIResponse(userInput, detectedLang);

    // Append User Message
    chatBox.innerHTML += `<p class="user-message">${userInput}</p>`;
    document.getElementById("user-input").value = "";

    // Append AI Response
    setTimeout(() => {
        chatBox.innerHTML += `<p class="bot-message">${aiResponse}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        speak(aiResponse, detectedLang);
    }, 500);
}

// 🔊 AI Speaks in User's Language
function speak(text, lang) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    window.speechSynthesis.speak(speech);
}

// 🖱️ Handle Enter Key Press
document.getElementById("user-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// ================================
// 🌍 Multi-Language AI Chatbot 🚀
// ================================

// 🚀 Free AI API (OpenRouter.ai) - Get API key from https://openrouter.ai
const OPENROUTER_API_KEY = "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";

// 🌐 Free Translation API (LibreTranslate) - No API Key Required
const LIBRETRANSLATE_URL = "https://libretranslate.com/translate";

// 🎤 Speech Recognition (Understands Multiple Languages)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "auto"; // Auto-detects language
recognition.onresult = (event) => {
    document.getElementById("user-input").value = event.results[0][0].transcript;
    sendMessage();
};

// 🔊 Start Voice Recognition
function startVoiceRecognition() {
    recognition.start();
}

// 🎯 Detect Language using LibreTranslate API (Free)
async function detectLanguage(text) {
    try {
        let response = await fetch(`${LIBRETRANSLATE_URL}/detect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text })
        });
        let data = await response.json();
        return data[0]?.language || "en"; // Default to English
    } catch (error) {
        console.error("Language detection failed:", error);
        return "en";
    }
}

// 🌎 Translate Text to English (For AI Processing)
async function translateToEnglish(text, lang) {
    if (lang === "en") return text; // No need to translate

    try {
        let response = await fetch(`${LIBRETRANSLATE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, source: lang, target: "en", format: "text" })
        });
        let data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Translation to English failed:", error);
        return text;
    }
}

// 🤖 Get AI Response using OpenRouter API (Free)
async function getAIResponse(userText) {
    try {
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Free model
                messages: [{ role: "user", content: userText }]
            })
        });

        let data = await response.json();
        return data.choices?.[0]?.message?.content || "I couldn't understand that. Can you try again?";
    } catch (error) {
        console.error("AI API Error:", error);
        return "Sorry, I'm currently unavailable. Try again later!";
    }
}

// 🌍 Translate AI Response Back to User's Language
async function translateToUserLanguage(text, lang) {
    if (lang === "en") return text; // No need to translate

    try {
        let response = await fetch(`${LIBRETRANSLATE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, source: "en", target: lang, format: "text" })
        });
        let data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Translation back to user language failed:", error);
        return text;
    }
}

// 📤 Send User Message and Get AI Response
async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");

    // Append User Message
    chatBox.innerHTML += `<p class="user-message">${userInput}</p>`;
    document.getElementById("user-input").value = "";

    // Detect Language
    let lang = await detectLanguage(userInput);

    // Translate to English for AI Processing
    let englishText = await translateToEnglish(userInput, lang);

    // Get AI Response in English
    let aiResponse = await getAIResponse(englishText);

    // Translate AI Response to User's Language
    let finalResponse = await translateToUserLanguage(aiResponse, lang);

    // Append AI Response
    setTimeout(() => {
        chatBox.innerHTML += `<p class="bot-message">${finalResponse}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        speak(finalResponse, lang); // AI Speaks in Detected Language
    }, 500);
}

// 🔊 AI Speaks in User's Language
function speak(text, lang) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    window.speechSynthesis.speak(speech);
}

// 🖱️ Handle Enter Key Press
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// ======================================
// 🌍 Multi-Language AI Chatbot 🚀
// ======================================

// 🚀 OpenAI API Key (Use your own)
const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key

// 🌐 Free Translation API (LibreTranslate) - No API Key Required
const LIBRETRANSLATE_URL = "https://libretranslate.com/translate";

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

// 🎯 Detect Language (Optimized)
async function detectLanguage(text) {
    try {
        const response = await fetch(`${LIBRETRANSLATE_URL}/detect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text })
        });
        const data = await response.json();
        return data[0]?.language || "en"; 
    } catch (error) {
        console.error("Language detection error:", error);
        return "en";
    }
}

// 🌎 Translate to English (Only if needed)
async function translateToEnglish(text, lang) {
    if (lang === "en") return text; 
    try {
        const response = await fetch(LIBRETRANSLATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, source: lang, target: "en", format: "text" })
        });
        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Translation to English error:", error);
        return text;
    }
}

// 🤖 Get AI Response from OpenAI (Improved API Call)
async function getAIResponse(userText) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userText }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenAI API Error:", data.error.message);
            return "Error: " + data.error.message;
        }

        return data.choices?.[0]?.message?.content || "I couldn't understand that.";
    } catch (error) {
        console.error("AI API Error:", error);
        return "Sorry, AI is currently unavailable. Try again later!";
    }
}

// 🌍 Translate AI Response Back (Only if needed)
async function translateToUserLanguage(text, lang) {
    if (lang === "en") return text; 
    try {
        const response = await fetch(LIBRETRANSLATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, source: "en", target: lang, format: "text" })
        });
        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Translation back error:", error);
        return text;
    }
}

// 📤 Send Message and Get AI Response
async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    const chatBox = document.getElementById("chat-box");

    // Append User Message
    chatBox.innerHTML += `<p class="user-message">${userInput}</p>`;
    document.getElementById("user-input").value = "";

    // Detect Language
    const lang = await detectLanguage(userInput);

    // Translate to English (Only if needed)
    const englishText = await translateToEnglish(userInput, lang);

    // Get AI Response
    const aiResponse = await getAIResponse(englishText);

    // Translate AI Response Back
    const finalResponse = await translateToUserLanguage(aiResponse, lang);

    // Append AI Response
    setTimeout(() => {
        chatBox.innerHTML += `<p class="bot-message">${finalResponse}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        speak(finalResponse, lang);
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

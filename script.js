// Speech Recognition (Understands Multiple Languages)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "auto"; // Detects any language automatically
recognition.onresult = (event) => {
    document.getElementById("user-input").value = event.results[0][0].transcript;
    sendMessage();
};

// Start Voice Recognition
function startVoiceRecognition() {
    recognition.start();
}

// Handle Enter Key Press
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// AI Responses in Multiple Languages
const responses = {
    "hello": { en: "Hello! 😊", es: "¡Hola! 😊", fr: "Bonjour! 😊", hi: "नमस्ते! 😊" },
    "how are you": { en: "I'm great! How about you?", es: "¡Estoy bien! ¿Y tú?", fr: "Je vais bien! Et toi?", hi: "मैं अच्छा हूँ! आप कैसे हैं?" },
    "what is your name": { en: "I am your AI chatbot! 🤖", es: "¡Soy tu chatbot de IA! 🤖", fr: "Je suis ton chatbot IA! 🤖", hi: "मैं आपका एआई चैटबॉट हूँ! 🤖" },
    "bye": { en: "Goodbye! Have a great day! 👋", es: "¡Adiós! ¡Que tengas un gran día! 👋", fr: "Au revoir! Passe une bonne journée! 👋", hi: "अलविदा! आपका दिन शुभ हो! 👋" },
    "default": { en: "I'm still learning! Can you ask something else?", es: "¡Todavía estoy aprendiendo! ¿Puedes preguntar otra cosa?", fr: "J'apprends encore! Peux-tu demander autre chose?", hi: "मैं अभी भी सीख रहा हूँ! क्या आप कुछ और पूछ सकते हैं?" }
};

// Detect Language
function detectLanguage(text) {
    if (/^[a-zA-Z\s]+$/.test(text)) return "en";
    if (/^[\u0900-\u097F\s]+$/.test(text)) return "hi"; // Hindi
    if (/^[\u00C0-\u017F\s]+$/.test(text)) return "fr"; // French
    if (/^[\u00E1-\u00FC\s]+$/.test(text)) return "es"; // Spanish
    return "en"; // Default to English
}

// Send Message
function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");

    // Append User Message
    chatBox.innerHTML += `<p class="user-message">${userInput}</p>`;
    document.getElementById("user-input").value = "";

    // Detect Language
    let lang = detectLanguage(userInput);
    
    // Get Response in the Same Language
    let response = responses[userInput.toLowerCase()]?.[lang] || responses["default"][lang];

    // Append Bot Message
    setTimeout(() => {
        chatBox.innerHTML += `<p class="bot-message">${response}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        speak(response, lang); // AI Speaks
    }, 500);
}

// AI Text-to-Speech (Speaks in Same Language)
function speak(text, lang) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    window.speechSynthesis.speak(speech);
}

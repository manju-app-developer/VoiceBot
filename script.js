// Speech Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.onresult = (event) => {
    document.getElementById("user-input").value = event.results[0][0].transcript;
    sendMessage();
};

// Function to Start Voice Recognition
function startVoiceRecognition() {
    recognition.start();
}

// Function to Handle Enter Key
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// Function to Send Message
async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");

    // Append User Message
    chatBox.innerHTML += `<p class="user-message">${userInput}</p>`;
    document.getElementById("user-input").value = "";

    // Typing Indicator
    chatBox.innerHTML += `<p class="bot-message typing">Bot is typing...</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    // Fetch AI Response
    const response = await fetch("https://api.deepai.org/api/text-generator", {
        method: "POST",
        headers: { 
            "api-key": "YOUR_DEEPAI_API_KEY", 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: userInput })
    });

    const data = await response.json();
    let botReply = data.output || "I didn't understand that.";

    // Remove Typing Indicator & Show Bot Message
    document.querySelector(".typing").remove();
    chatBox.innerHTML += `<p class="bot-message">${botReply}</p>`;

    // Scroll to Bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Speak Response
    speak(botReply);
}

// Text-to-Speech Function
function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

const huggingFaceAPI = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        let userText = event.results[0][0].transcript;
        document.getElementById("response").innerText = "You: " + userText;
        getAIResponse(userText);
    };
}

async function getAIResponse(userText) {
    const response = await fetch(huggingFaceAPI, {
        method: "POST",
        headers: { "Authorization": "Bearer YOUR_HUGGINGFACE_API_KEY", "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: userText }),
    });

    const data = await response.json();
    let botReply = data.generated_text || "Sorry, I didn't understand.";
    
    document.getElementById("response").innerText += "\nBot: " + botReply;
    responsiveVoice.speak(botReply, "UK English Male");
}

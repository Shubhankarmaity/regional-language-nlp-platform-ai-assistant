// Main Global Answer box for text/voice (top row)
function updateGlobalAnswer(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    let answerBlock = doc.getElementById("outputBlock");
    let answer = answerBlock.innerHTML;
    document.getElementById("outputBlock").innerHTML = answer;
    // Language detection from backend response
    let userLang = answerBlock.getAttribute("data-lang") || "hi";
    let ttsLang = {
        "hi": "hi-IN",
        "bn": "bn-IN",
        "ta": "ta-IN",
        "en": "en-US"
    }[userLang] || "hi-IN";
    speakText(answer, ttsLang);
}


// Text input AJAX
document.addEventListener("DOMContentLoaded", function () {
    let textForm = document.getElementById("textForm");
    if (textForm) {
        textForm.onsubmit = function (e) {
            e.preventDefault();
            const data = "prompt=" + encodeURIComponent(document.getElementById("inputText").value);
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            }).then(resp => resp.text()).then(updateGlobalAnswer);
        };
    }

    // Voice language selector
    let voiceBtn = document.getElementById('voiceBtn');
    let voiceInput = document.getElementById('voiceInput');
    let micLangSel = document.getElementById('micLang'); // <select id="micLang">
    if (voiceBtn) {
        voiceBtn.onclick = function () {
            if (!('webkitSpeechRecognition' in window)) {
                alert("Speech Recognition not supported in this browser!");
                return;
            }
            voiceBtn.innerText = "🎤 Listening...";
            let recog = new window.webkitSpeechRecognition();
            let langCode = micLangSel ? micLangSel.value : "hi-IN";
            recog.lang = langCode; // 'hi-IN' for Hindi, 'bn-IN' for Bengali, as required
            recog.start();
            recog.onresult = function (event) {
                let transcript = event.results[0][0].transcript;
                voiceInput.value = transcript;
            };
            recog.onend = function () {
                voiceBtn.innerText = "🎤 Speak";
            };
        }
    }

    // Stop speech synthesis button
    let stopBtn = document.getElementById('stopTTSBtn');
    if (stopBtn && 'speechSynthesis' in window) {
        stopBtn.onclick = function () {
            window.speechSynthesis.cancel();
        };
    }
});

// Voice input AJAX
function sendVoice() {
    const value = document.getElementById("voiceInput").value.trim();
    if (!value) { alert("Speak your question!"); return; }
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "prompt=" + encodeURIComponent(value)
    }).then(resp => resp.text()).then(updateGlobalAnswer);
}

// Digital service card -- text & voice both
window.serviceChat = function (textbox, num) {
    const value = textbox.value.trim();
    if (!value) { textbox.focus(); return; }
    const outdiv = document.getElementById('servout' + num);
    outdiv.innerHTML = "⏳ Please wait...";
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "prompt=" + encodeURIComponent(value)
    }).then(resp => resp.text()).then(function (html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let answer = doc.getElementById("outputBlock").innerHTML.replace(/^Answer:/, "").trim();
        outdiv.innerHTML = answer;
        speakText(answer);
    });
}

window.voiceService = function (idx) {
    let inputbox = document.querySelectorAll('.servchat-in')[idx];
    let micLangSel = document.getElementById('micLang');
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech Recognition not supported in this browser!");
        return;
    }
    inputbox.value = "Listening...";
    var recog = new window.webkitSpeechRecognition();
    let langCode = micLangSel ? micLangSel.value : "hi-IN";
    recog.lang = langCode; // Hindi/Bengali/English as per selection
    recog.start();
    recog.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        inputbox.value = transcript;
    };
    recog.onend = function () {
        if (inputbox.value == "Listening...") { inputbox.value = ""; }
    };
}



// Answer ko voice me bolne ka function, auto-language selection
function speakText(text, lang) {
    if ('speechSynthesis' in window) {
        let utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 1.04;
        utter.volume = 1;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
    }
}

// Top level global output box update, text + voice output
function updateGlobalAnswer(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    let answerBlock = doc.getElementById("outputBlock");
    let answer = answerBlock.innerHTML;
    document.getElementById("outputBlock").innerHTML = answer;
    // Output language from backend attribute
    let userLang = answerBlock.getAttribute("data-lang") || "hi";
    let ttsLang = {
        "hi": "hi-IN",
        "bn": "bn-IN",
        "en": "en-US",
        "ta": "ta-IN"
    }[userLang] || "hi-IN";
    speakText(answer, ttsLang);
}

// Text input AJAX (main input bar)
document.addEventListener("DOMContentLoaded", function () {
    let textForm = document.getElementById("textForm");
    if (textForm) {
        textForm.onsubmit = function (e) {
            e.preventDefault();
            const data = "prompt=" + encodeURIComponent(document.getElementById("inputText").value);
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            }).then(resp => resp.text()).then(updateGlobalAnswer);
        };
    }

    // Voice recognition for main input
    let voiceBtn = document.getElementById('voiceBtn');
    let voiceInput = document.getElementById('voiceInput');
    let micLangSel = document.getElementById('micLang');
    if (voiceBtn) {
        voiceBtn.onclick = function () {
            if (!('webkitSpeechRecognition' in window)) {
                alert("Speech Recognition not supported in this browser!");
                return;
            }
            voiceBtn.innerText = "🎤 Listening...";
            let recog = new window.webkitSpeechRecognition();
            let langCode = micLangSel ? micLangSel.value : "hi-IN";
            recog.lang = langCode;
            recog.start();
            recog.onresult = function (event) {
                let transcript = event.results[0][0].transcript;
                voiceInput.value = transcript;
            };
            recog.onend = function () {
                voiceBtn.innerText = "🎤 Speak";
            };
        }
    }

    // Stop TTS button
    let stopBtn = document.getElementById('stopTTSBtn');
    if (stopBtn && 'speechSynthesis' in window) {
        stopBtn.onclick = function () {
            window.speechSynthesis.cancel();
        };
    }
});

// Voice input send AJAX (main bar)
function sendVoice() {
    const value = document.getElementById("voiceInput").value.trim();
    if (!value) { alert("Speak your question!"); return; }
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "prompt=" + encodeURIComponent(value)
    }).then(resp => resp.text()).then(updateGlobalAnswer);
}

// Digital service card -- text & voice both (AJAX)
window.serviceChat = function (textbox, num) {
    const value = textbox.value.trim();
    if (!value) { textbox.focus(); return; }
    const outdiv = document.getElementById('servout' + num);
    outdiv.innerHTML = "⏳ Please wait...";
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "prompt=" + encodeURIComponent(value)
    }).then(resp => resp.text()).then(function (html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let answerBlock = doc.getElementById("outputBlock");
        let answer = answerBlock.innerHTML.replace(/^Answer:/, "").trim();
        outdiv.innerHTML = answer;
        let userLang = answerBlock.getAttribute("data-lang") || "hi";
        let ttsLang = {
            "hi": "hi-IN",
            "bn": "bn-IN",
            "en": "en-US",
            "ta": "ta-IN"
        }[userLang] || "hi-IN";
        speakText(answer, ttsLang);
    });
}

// Digital service card -- voice input for service blocks
window.voiceService = function (idx) {
    let inputbox = document.querySelectorAll('.servchat-in')[idx];
    let micLangSel = document.getElementById('micLang');
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech Recognition not supported in this browser!");
        return;
    }
    inputbox.value = "Listening...";
    var recog = new window.webkitSpeechRecognition();
    let langCode = micLangSel ? micLangSel.value : "hi-IN";
    recog.lang = langCode;
    recog.start();
    recog.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        inputbox.value = transcript;
    };
    recog.onend = function () {
        if (inputbox.value == "Listening...") { inputbox.value = ""; }
    };
}

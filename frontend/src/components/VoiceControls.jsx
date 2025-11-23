import { useState, useEffect } from "react";

export default function VoiceControls({ onVoiceFinalInput }) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [tempTranscript, setTempTranscript] = useState("");

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;   // allow long pauses
      recog.interimResults = true;
      recog.lang = "en-US";

      recog.onresult = (event) => {
        let finalText = "";
        for (let i = 0; i < event.results.length; i++) {
          finalText += event.results[i][0].transcript + " ";
        }
        setTempTranscript(finalText.trim());  // store only
      };

      recog.onerror = () => setListening(false);

      setRecognition(recog);
    }
  }, []);

  function startListening() {
    if (!recognition) return alert("Voice recognition not supported.");
    setTempTranscript("");   // clear old text
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    if (!recognition) return;
    recognition.stop();
    setListening(false);

    // ✔ ONLY SEND TO FRONTEND WHEN STOP IS CLICKED
    if (tempTranscript.trim()) {
      onVoiceFinalInput(tempTranscript.trim());
    } else {
      alert("No voice input detected. Try speaking again.");
    }
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? "🛑 Stop" : "🎤 Speak"}
      </button>

      {tempTranscript && listening && (
        <p style={{ fontStyle: "italic", marginTop: "5px" }}>
          Listening: {tempTranscript}
        </p>
      )}
    </div>
  );
}

// mic_capture.js

let socket;
let audioContext;
let processor;
let audioStream;

async function startMicStreaming() {
  console.log("Capture window: Starting direct microphone capture.");

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
    socket = new WebSocket("ws://localhost:3000/audio");
    socket.binaryType = "arraybuffer";

    socket.onopen = async () => {
      audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.audioWorklet.addModule("pcm-processor.js");
      const source = audioContext.createMediaStreamSource(audioStream);
      processor = new AudioWorkletNode(audioContext, "pcm-processor");

      processor.port.onmessage = (event) => {
        const pcmData = event.data;
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(pcmData.buffer);
        }
      };
      source.connect(processor);

    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.glosa) {
        chrome.runtime.sendMessage({
            type: "transcription-update",
            glosa: data.glosa,
            original: data.original,
            isFinal: data.isFinal,
        });
        }
    };

  } catch (error) {
    console.error("Error in microphone capture window:", error);
    document.body.innerHTML = `<h1>Error</h1><p>Could not capture microphone. Check permissions.</p><p>${error.message}</p>`;
  }
}

window.addEventListener('beforeunload', () => {
  if (processor) { processor.disconnect(); }
  if (audioContext) { audioContext.close(); }
  if (audioStream) { audioStream.getTracks().forEach((track) => track.stop()); }
  if (socket && socket.readyState === WebSocket.OPEN) { socket.close(); }
  console.log("Capture window closed, streaming stopped.");
});

startMicStreaming();
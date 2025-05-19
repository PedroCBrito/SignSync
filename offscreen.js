let socket;
let audioContext;
let processor;
let tabStream; // <- stream da aba para parar depois

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "offscreen") {
    if (message.type === "start-recording") {
      await startStreaming(message.data);
    } else if (message.type === "stop-recording") {
      stopStreaming();
    }
  }
});

async function startStreaming(streamId) {
  socket = new WebSocket("ws://localhost:3000/audio");
  socket.binaryType = "arraybuffer";

  socket.onopen = async () => {
    // Captura o áudio da aba usando o streamId
    tabStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    });

    // Cria o contexto de áudio com sampleRate de 16000Hz
    audioContext = new AudioContext({ sampleRate: 16000 });

    // Adiciona o processador personalizado (AudioWorklet)
    await audioContext.audioWorklet.addModule("pcm-processor.js");
    const source = audioContext.createMediaStreamSource(tabStream);
    processor = new AudioWorkletNode(audioContext, "pcm-processor");

    // Recebe buffers de áudio processados e envia via WebSocket
    processor.port.onmessage = (event) => {
      const float32Samples = event.data;
      const int16Samples = float32ToInt16(float32Samples);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(int16Samples.buffer);
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    const outputNode = audioContext.createGain();
    source.connect(outputNode);
    outputNode.connect(audioContext.destination);
  };

 socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.transcript || data.word) {
    chrome.runtime.sendMessage({
      type: "transcription-update",
      transcription: data.transcript,
      word: data.word,
      isFinal: data.isFinal,
    });
  }
};

}

function stopStreaming() {
  // Desconecta o processador
  if (processor) {
    processor.disconnect();
    processor = null;
  }

  // Fecha o contexto de áudio
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  // Para as tracks do stream da aba
  if (tabStream) {
    tabStream.getTracks().forEach((track) => track.stop());
    tabStream = null;
  }

  // Fecha o WebSocket
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    socket = null;
  }
}

// Converte Float32 para Int16 (Linear PCM 16-bit)
function float32ToInt16(float32Array) {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
  }
  return int16Array;
}

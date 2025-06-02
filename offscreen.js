let socket;
let audioContext;
let processor;
let tabStream;

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
    // Captures the tab audio using the streamId
    tabStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    });

    // Creates the audio context with a 16000Hz sample rate
    audioContext = new AudioContext({ sampleRate: 16000 });

    // Adds the custom processor (AudioWorklet)
    await audioContext.audioWorklet.addModule("pcm-processor.js");
    const source = audioContext.createMediaStreamSource(tabStream);
    processor = new AudioWorkletNode(audioContext, "pcm-processor");

    // Receives processed audio buffers and sends them via WebSocket
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
  if (processor) {
    processor.disconnect();
    processor = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  if (tabStream) {
    tabStream.getTracks().forEach((track) => track.stop());
    tabStream = null;
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    socket = null;
  }
}

function float32ToInt16(float32Array) {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
  }
  return int16Array;
}

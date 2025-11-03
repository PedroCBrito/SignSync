let socket;
let audioContext;
let processor;
let audioStream;

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "offscreen") {
    if (message.type === "start-recording") {
      await startStreaming(message.data.streamId);
    } else if (message.type === "stop-recording") {
      stopStreaming();
    }
  }
});

async function startStreaming(streamId) {
  if (!streamId) {
    console.error("Offscreen: streamId not provided.");
    return;
  }

  socket = new WebSocket("ws://tradutor-glosa-service-50664657729.southamerica-east1.run.app/audio");
  socket.binaryType = "arraybuffer";

  socket.onopen = async () => {
    try {
      const streamConstraints = {
        audio: {
          mandatory: {
            chromeMediaSource: "tab",
            chromeMediaSourceId: streamId,
          },
        },
        video: false,
      };
      audioStream = await navigator.mediaDevices.getUserMedia(streamConstraints);

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
      processor.connect(audioContext.destination);

      const outputNode = audioContext.createGain();
      source.connect(outputNode);
      outputNode.connect(audioContext.destination);
      
    } catch (error) {
      console.error("Error getting audio stream in offscreen:", error);
    }
  };

  socket.onmessage = (event) => {
   const data = JSON.parse(event.data);
   if (data.glosa) {
     chrome.runtime.sendMessage({
       type: "transcription-update",
       glosa: data.glosa,
       original: data.original,
       isPartial: data.isPartial,
     });
   }
 };
}

function stopStreaming() {
  if (processor) { processor.disconnect(); processor = null; }
  if (audioContext) { audioContext.close(); audioContext = null; }
  if (audioStream) { audioStream.getTracks().forEach((track) => track.stop()); audioStream = null; }
  if (socket && socket.readyState === WebSocket.OPEN) { socket.close(); socket = null; }
  console.log("Streaming stopped.");
}
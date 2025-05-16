// AudioWorklet que envia amostras PCM (Float32Array)
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    const channel = input[0];
    if (channel.length > 0) {
      this.port.postMessage(channel); // envia o canal mono como Float32Array
    }
    return true;
  }
}
registerProcessor("pcm-processor", PCMProcessor);

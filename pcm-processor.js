// AudioWorklet that sends PCM samples (Float32Array)
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    const channel = input[0];
    if (channel.length > 0) {
      this.port.postMessage(channel); // sends the mono channel as a Float32Array
    }
    return true;
  }
}
registerProcessor("pcm-processor", PCMProcessor);

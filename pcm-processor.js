// pcm-processor.js

class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    // Pega o primeiro canal de áudio (mono)
    const channelData = inputs[0][0];

    // Se não houver dados, não faz nada
    if (!channelData) {
      return true;
    }

    // Cria um novo array para armazenar os dados convertidos para 16-bit
    const int16Samples = new Int16Array(channelData.length);

    // Itera sobre cada amostra Float32 e a converte para Int16
    for (let i = 0; i < channelData.length; i++) {
      // Garante que a amostra esteja entre -1.0 e 1.0
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      // Converte para a faixa de valores de 16-bit
      // Se for negativo, multiplica por 32768, se for positivo, por 32767
      int16Samples[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    // Envia os dados já convertidos para Int16Array para o offscreen.js
    this.port.postMessage(int16Samples);

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
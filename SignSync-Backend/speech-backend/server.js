const express = require("express");
const { WebSocketServer } = require("ws");
const { SpeechClient } = require("@google-cloud/speech");

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Servidor de transcrição ativo."));
const server = app.listen(port, () =>
  console.log(`Server HTTP: http://localhost:${port}`)
);

const wss = new WebSocketServer({ server });
const speechClient = new SpeechClient();

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  let lastTranscript = "";

  const recognizeStream = speechClient
    .streamingRecognize({
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "pt-BR",
      },
      interimResults: true,
    })
    .on("data", (data) => {
      const result = data.results[0];
      if (result?.alternatives[0]) {
        const transcript = result.alternatives[0].transcript.trim();
        const isFinal = result.isFinal;

        const newPart = transcript.substring(lastTranscript.length).trim();
        if (newPart) {
          const newWords = newPart.split(/\s+/);
          newWords.forEach((word) => {
            console.log(`[Transcrição ${isFinal ? "FINAL" : "PARCIAL"}]: ${word}`);

            // Envia cada nova palavra com o transcript completo
            ws.send(
              JSON.stringify({
                word,
                transcript,
                isFinal,
              })
            );
          });
        }

        // Atualiza histórico do transcript
        if (!isFinal) {
          lastTranscript = transcript;
        } else {
          lastTranscript = "";
        }
      }
    })
    .on("error", (err) => {
      console.error("Erro de reconhecimento:", err.message);
    });

  ws.on("message", (audioChunk) => {
    recognizeStream.write(audioChunk);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
    recognizeStream.end();
  });
});

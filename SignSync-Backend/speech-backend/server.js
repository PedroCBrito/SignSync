const express = require("express");
const { WebSocketServer } = require("ws");
const { SpeechClient } = require("@google-cloud/speech");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// --- Configurações de Desempenho ---
const WORD_LIMIT_FOR_TRANSLATION = 8; // Envia para tradução a cada 8 palavras.
const PAUSE_DETECTION_THRESHOLD_MS = 700; // Considera uma pausa se não houver novas palavras por 700ms.

const apiKey = process.env.SUA_CHAVE_API_GEMINI;
if (!apiKey) {
  throw new Error("A variável de ambiente SUA_CHAVE_API_GEMINI não está definida.");
}

const genAI = new GoogleGenerativeAI(apiKey);
// <<< OTIMIZAÇÃO 1: Troca do Modelo >>>
// gemini-pro é geralmente mais rápido para tarefas de tradução em tempo real.
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

app.get("/", (req, res) => res.send("Servidor de Tradução para Glosa está ATIVO."));
const server = app.listen(port, () =>
  console.log(`Servidor HTTP rodando em: http://localhost:${port}`)
);
const wss = new WebSocketServer({ server });
const speechClient = new SpeechClient();

async function streamTranslateToGlosa(ws, textToTranslate) {
  if (!textToTranslate || textToTranslate.trim() === "") {
    return;
  }
  
  const prompt = `Traduza para a Glosa de LIBRAS, seguindo a estrutura SUJEITO-OBJETO-VERBO, sem artigos, preposições ou pontuação. Exemplos: (Qual seu nome? -> NOME SEU QUAL?), (Vou para casa amanhã. -> AMANHÃ CASA EU IR). FRASE: "${textToTranslate}"`;

  try {
    const streamResult = await geminiModel.generateContentStream(prompt);
    
    let fullGlosatranslation = "";
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      fullGlosatranslation += chunkText;
      
      ws.send(JSON.stringify({
          glosa: fullGlosatranslation,
          original: textToTranslate,
          isPartial: true
      }));
    }
    
    const finalResult = fullGlosatranslation.trim();
    ws.send(JSON.stringify({
        glosa: finalResult,
        original: textToTranslate,
        isPartial: false
    }));

    console.log(`[Tradução Gemini]: ${textToTranslate} -> ${finalResult}`);

  } catch (error) {
    console.error("Erro na API Gemini (Stream):", error);
    ws.send(JSON.stringify({
        glosa: `[ERRO DE TRADUÇÃO]`,
        original: textToTranslate,
        isPartial: false
    }));
  }
}

wss.on("connection", (ws) => {
  console.log("Cliente conectado. Iniciando stream de reconhecimento.");

  const sendBoundTranslation = streamTranslateToGlosa.bind(null, ws);
  
  let fullTranscript = "";
  let processedChars = 0; 
  let pauseTimer = null;

  const flushRemainingBufferAndReset = () => {
    if (pauseTimer) clearTimeout(pauseTimer);
    
    const remainingText = fullTranscript.substring(processedChars).trim();
    if (remainingText) {
      sendBoundTranslation(remainingText);
    }
    
    fullTranscript = "";
    processedChars = 0;
  };

  const recognizeStream = speechClient
    .streamingRecognize({
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "pt-BR",
        enableAutomaticPunctuation: true,
      },
      interimResults: true,
    })
    .on("data", async (data) => {
      if (pauseTimer) clearTimeout(pauseTimer);

      if (data.results?.[0]?.alternatives?.[0]) {
        fullTranscript = data.results[0].alternatives[0].transcript;

        while (true) {
            const unprocessedPart = fullTranscript.substring(processedChars);
            const words = unprocessedPart.trim().split(/\s+/).filter(word => word.length > 0);

            if (words.length >= WORD_LIMIT_FOR_TRANSLATION) {
                const chunkToSend = words.slice(0, WORD_LIMIT_FOR_TRANSLATION).join(" ");
                console.log(`Enviando: "${chunkToSend}"`);
                
                sendBoundTranslation(chunkToSend);

                const newPosition = fullTranscript.indexOf(chunkToSend, processedChars) + chunkToSend.length;
                processedChars = newPosition;
            } else {
                break;
            }
        }

        if (data.results[0].isFinal) {
          console.log("[Gatilho isFinal]: Fim da sentença detectado.");
          flushRemainingBufferAndReset();
        } 
        else {
          pauseTimer = setTimeout(() => {
            console.log(`[Gatilho de Pausa]: Pausa de ${PAUSE_DETECTION_THRESHOLD_MS}ms detectada.`);
            flushRemainingBufferAndReset();
          }, PAUSE_DETECTION_THRESHOLD_MS);
        }
      }
    })
    .on("error", (err) => console.error("Erro no stream de reconhecimento da fala:", err.message))
    .on("end", () => {
      console.log("Stream de reconhecimento finalizado.");
      flushRemainingBufferAndReset();
    });

  ws.on("message", (audioChunk) => {
    if (recognizeStream.writable) {
      recognizeStream.write(audioChunk);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado. Finalizando stream.");
    recognizeStream.end();
  });
});


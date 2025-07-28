const express = require("express");
const { WebSocketServer } = require("ws");
const { SpeechClient } = require("@google-cloud/speech");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Substitua 'SUA_CHAVE_API_GEMINI' pela sua chave real e mantenha-a segura
const genAI = new GoogleGenerativeAI('SUA_CHAVE_API_GEMINI');
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => res.send("Servidor de Tradução para Glosa está ATIVO."));
const server = app.listen(port, () =>
  console.log(`Servidor HTTP rodando em: http://localhost:${port}`)
);
const wss = new WebSocketServer({ server });
const speechClient = new SpeechClient();

async function streamTranslateToGlosa(ws, textToTranslate) {
  const prompt = `
    Você é um tradutor especialista de português do Brasil para a estrutura gramatical de Glosa de LIBRAS.
    Sua tarefa é reescrever a frase em português para a ordem de palavras e estrutura corretas para LIBRAS.
    Remova artigos, preposições e conjunções que não são usados na sinalização.
    Retorne apenas o texto em Glosa, sem explicações, textos adicionais ou pontuação.

    Exemplos:
    Português: "Eu vou para a casa de minha mãe amanhã."
    Glosa: "AMANHÃ MÃE CASA EU IR."

    Português: "Qual é o seu nome?"
    Glosa: "NOME SEU QUAL?"

    Português: "Eu quero comer uma maçã vermelha."
    Glosa: "MAÇÃ VERMELHA EU QUERER COMER."

    Traduza a seguinte frase para a Glosa de LIBRAS:
    Português: "${textToTranslate}"
  `;

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
  
  let processedChars = 0;

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
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        if (result?.alternatives[0]) {
          const transcript = result.alternatives[0].transcript;
          
          const status = result.isFinal ? "Final" : "Parcial";
          console.log(`[Speech-to-Text - ${status}]: ${transcript}`);
          
          if (transcript) {
            while (true) {
                const unprocessedPart = transcript.substring(processedChars);
                const match = unprocessedPart.match(/(.*?[.,?!])\s+\w/);

                if (match) {
                    const sentenceToTranslate = match[1].trim();                    
                    processedChars += match[1].length;
                    
                    sendBoundTranslation(sentenceToTranslate);
                } else {
                    break;
                }
            }
            if (result.isFinal) {
                const finalUtterance = transcript.substring(processedChars).trim();
                if (finalUtterance) {
                    sendBoundTranslation(finalUtterance);
                }
                processedChars = 0;
            }
          }
        }
      }
    })
    .on("error", (err) => {
      console.error("Erro no stream de reconhecimento da fala:", err.message);
    })
    .on("end", () => {
        console.log("Stream de reconhecimento finalizado.");
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

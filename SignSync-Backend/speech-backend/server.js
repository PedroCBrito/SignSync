const express = require("express");
const { WebSocketServer } = require("ws");
const { SpeechClient } = require("@google-cloud/speech");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

const apiKey = process.env.SUA_CHAVE_API_GEMINI;

if (!apiKey) {
    console.error("ERRO CRÍTICO: A variável de ambiente SUA_CHAVE_API_GEMINI não foi encontrada!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.get("/", (req, res) => res.send("Servidor de Tradução para Glosa está ATIVO."));
const server = app.listen(port, () =>
    console.log(`Servidor HTTP rodando em: http://localhost:${port}`)
);
const wss = new WebSocketServer({ server });
const speechClient = new SpeechClient();

async function streamTranslateToGlosa(ws, chatSession, textToTranslate) {
    const prompt = `Português: "${textToTranslate}"`;

    try {
        const streamResult = await chatSession.sendMessageStream(prompt);

        let fullGlosatranslation = "";
        for await (const chunk of streamResult.stream) {
            const chunkText = chunk.text();
            fullGlosatranslation += chunkText;

            // Enviando chunks parciais para o cliente para feedback rápido
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

    const systemPrompt = `
                            ### Papel ###
                            Você é um tradutor especialista de Português do Brasil para Glosa de LIBRAS, operando em TEMPO REAL.

                            ### Tarefa ###
                            Sua tarefa é traduzir o FRAGMENTO de texto em português recebido para a estrutura correta de Glosa de LIBRAS. Seja o mais rápido e direto possível.

                            ### Regras de Tradução (Glosa) ###
                            1.  **Reordene:** Sempre reestruture para a ordem de palavras de LIBRAS (ex: Tempo, Objeto, Sujeito, Verbo).
                            2.  **Remova:** ELIMINE artigos (o, a, os, as), preposições (de, para, em, com) e conjunções (e, mas, que) que não são usados na sinalização.
                            3.  **Verbos:** Use verbos SEMPRE no INFINITIVO (ex: COMER, IR, QUERER).

                            ### Regras de Saída (Formato Estrito) ###
                            1.  **APENAS GLOSA:** Retorne APENAS o texto em Glosa.
                            2.  **LETRAS MAIÚSCULAS:** O retorno DEVE ser 100% em LETRAS MAIÚSCULAS.
                            3.  **SEM PONTUAÇÃO:** NUNCA inclua pontos, vírgulas, ou qualquer outro sinal de pontuação.
                            4.  **SEM EXTRAS:** NUNCA inclua explicações (ex: "Aqui está:"), comentários ou o texto original.
                            5.  **FRAGMENTOS INVÁLIDOS:** Se o fragmento recebido for impossível de traduzir ou for apenas uma palavra de ligação (ex: "o", "de", "e", "mas"), retorne uma string vazia ("").

                            ### Exemplos ###
                            Português: "Eu vou para a casa de minha mãe amanhã."
                            Glosa: "AMANHÃ MÃE CASA EU IR."

                            Português: "Qual é o seu nome?"
                            Glosa: "NOME SEU QUAL?"

                            Português: "Eu quero comer uma maçã vermelha."
                            Glosa: "MAÇÃ VERMELHA EU QUERER COMER."

                            Português: "Eu gosto de..."
                            Glosa: "EU GOSTAR"

                            Português: "mas"
                            Glosa: ""
                        `;

    const chat = geminiModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "ENTENDIDO. PRONTO TRADUZIR." }] }
        ]
    });

    const translationQueue = [];
    let isTranslating = false;

    const sendBoundTranslation = streamTranslateToGlosa.bind(null, ws, chat);

    async function processTranslationQueue() {
        if (isTranslating || translationQueue.length === 0) {
            return; // Ou está ocupado, ou a fila está vazia
        }

        isTranslating = true;
        const textToTranslate = translationQueue.shift(); // Pega o primeiro item

        try {
            // Espera a tradução (incluindo o streaming) terminar
            await sendBoundTranslation(textToTranslate);
        } catch (error) {
            console.error("Erro ao processar item da fila de tradução:", error);
        } finally {
            isTranslating = false;
            // Tenta processar o próximo item da fila
            process.nextTick(processTranslationQueue);
        }
    }

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

                const stability = result.stability || 0;

                if (stability < 0.60) {
                    return;
                }


                if (result?.alternatives[0]) {
                    const transcript = result.alternatives[0].transcript;

                    if (transcript) {
                        const regex = /(.*?(?:[.,?!]| (e|mas|que|porque|pois|logo|portanto) ))(?=\s+|$)/i;

                        while (true) {
                            const unprocessedPart = transcript.substring(processedChars);
                            const match = unprocessedPart.match(regex);

                            if (match) {
                                const sentenceToTranslate = match[1].trim();
                                processedChars += match[0].length;

                                if (sentenceToTranslate) {
                                    translationQueue.push(sentenceToTranslate);
                                    processTranslationQueue();
                                }
                            } else {
                                break;
                            }
                        }

                        if (result.isFinal) {
                            const finalUtterance = transcript.substring(processedChars).trim();
                            if (finalUtterance) {
                                translationQueue.push(finalUtterance);
                                processTranslationQueue();
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
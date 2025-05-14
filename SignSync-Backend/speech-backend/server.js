const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const { SpeechClient } = require("@google-cloud/speech");
const stream = require("stream");
require("dotenv").config();

const app = express();
const upload = multer();
const client = new SpeechClient();

app.post("/transcribe", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const wavBuffer = await convertToWav(file.buffer);
    const audioBytes = wavBuffer.toString("base64");

    // Config Google Speech API 
    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "pt-BR",
      },
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
      .map((r) => r.alternatives[0].transcript)
      .join("\n");

    res.json({ transcription });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server in http://localhost:3000");
});


/**
 * @param {Buffer} inputBuffer
 * @returns {Promise<Buffer>}
 */
function convertToWav(inputBuffer) {
  return new Promise((resolve, reject) => {
    const inputStream = new stream.PassThrough();
    inputStream.end(inputBuffer);

    const outputStream = new stream.PassThrough();
    const chunks = [];

    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    outputStream.on("error", (err) => {
      if (err.message.includes("Output stream closed")) {
        console.warn("Output stream was closed.");
      } else {
        console.error("Error on ffmpeg stream:", err.message);
        reject(err);
      }
    });

    ffmpeg(inputStream)
      .inputFormat("webm")
      .outputOptions(["-ac 1", "-ar 16000", "-f wav"])
      .pipe(outputStream);
  });
}


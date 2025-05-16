const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const { SpeechClient } = require("@google-cloud/speech");
const stream = require("stream");
const fs = require("fs");
require("dotenv").config();

const app = express();
const upload = multer();
const client = new SpeechClient();

app.post("/transcribe", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No File Uploaded." });

  try {
    const wavBuffer = await convertToWav(file.buffer);
    const audioBytes = wavBuffer.toString("base64");

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
    console.error("Transcription failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

/**
 * Converte um buffer WebM em WAV compatível com Google Speech
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
      const finalBuffer = Buffer.concat(chunks);
      if (finalBuffer.length === 0) {
        return reject(new Error("Converted WAV buffer is empty."));
      }
      resolve(finalBuffer);
    });

    outputStream.on("error", (err) => {
      console.error("Output stream error:", err.message);
      reject(err);
    });

    ffmpeg(inputStream)
      .inputFormat("webm")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .on("start", (cmd) => {
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        reject(err);
      })
      .on("end", () => {
      })
      .pipe(outputStream, { end: true });
  });
}

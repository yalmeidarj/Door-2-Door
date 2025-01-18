import { NextResponse } from "next/server";
import fs from "fs";
// import * as dotenv from "dotenv";
// import OpenAI from "openai";
// import { env } from "../../config/env";

// dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Define interface for request body
interface RequestBody {
  audio: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // const body: RequestBody = await req.json();
    // const base64Audio = body.audio;

    // // Convert the base64 audio data to a Buffer
    // const audio = Buffer.from(base64Audio, "base64");

    // // Define the file path for storing the temporary WAV file
    // const filePath = "tmp/input.wav";

    // // Write the audio data to a temporary WAV file synchronously
    // fs.writeFileSync(filePath, audio);

    // // Create a readable stream from the temporary WAV file
    // const readStream = fs.createReadStream(filePath);

    // const data = await openai.audio.transcriptions.create({    
    //   file: readStream,
    //   model: "whisper-1",
    // });
    // // Remove the temporary file after successful processing
    // fs.unlinkSync(filePath);
    const data = {
      file: "readStream",
      model: "whisper-1",
    };


    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    // return NextResponse.error();
  }
}

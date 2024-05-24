import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import OpenAI from "openai";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { analyzeAudioPrompt, questionsPrompt } from "./prompts/prompt";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

@Injectable()
export class ApplicationService {
  async analyzeRecording(
    fileName: string,
    language: string,
    questions: string,
  ) {
    console.log(language);
    try {
      const tanscribeAudio = await openai.audio.transcriptions.create({
        file: fs.createReadStream(`./uploads/${fileName}`),
        model: "whisper-1",
        language: language,
      });

      const generatePrompt = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: analyzeAudioPrompt(language),
          },
          {
            role: "user",
            content: `${questions} ${tanscribeAudio.text}`,
          },
        ],

        model: "gpt-4o",
        response_format: { type: "json_object" },
      });

      const results = JSON.parse(generatePrompt.choices[0].message.content);

      return { ...results, transcription: tanscribeAudio.text };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "Could not analyze recording",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateQuestions(language: string) {
    try {
      const questions = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: questionsPrompt(language),
          },
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
      });
      return JSON.parse(questions.choices[0].message.content || "");
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "Could not set questions",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

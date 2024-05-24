import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { ApplicationService } from "./application.service";
import { QuestionDto } from "./application.dto";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

@Controller("application")
export class ApplicationController {
  @Post()
  @UseInterceptors(
    FileInterceptor("audio", {
      storage: diskStorage({
        destination: "./uploads", // Directory where files will be stored
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, `${uniqueSuffix}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() reqBody: any,
  ) {
    try {
      const { name, email, language, questions, phone } = reqBody;
      const { analyzeRecording } = new ApplicationService();
      const marks = await analyzeRecording(file.filename, language, questions);
      const sendToSheets = await axios.post(
        "https://hook.eu2.make.com/15kmchafmqyax5mvijxq68j1ydoxqnu4",
        {
          name,
          email,
          language,
          phone,
          questions,
          ...marks,
        },
        { headers: { Authorization: process.env.MAKE_API } },
      );
      return sendToSheets;
    } catch (error) {
      console.log(error);
    }

    return {
      message: "File uploaded successfully",
      filename: file.filename,
    };
  }

  @Get("questions/:language")
  async setQuestions(@Param() language: QuestionDto) {
    try {
      const { generateQuestions } = new ApplicationService();
      const questions = await generateQuestions(language.language);

      return {
        ...questions,
      };
    } catch (error) {
      throw error;
    }
  }
}

import axios from "axios";
import Navbar from "../components/Navbar";
import { useState, useRef, useEffect, CSSProperties } from "react";
import * as ISO6391 from "iso-639-1";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

const ApplicationFormTest = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedLanguage) {
      setLoading(true);
      const getQuestions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/application/questions/${selectedLanguage}`
          );
          setLoading(false);
          console.log(response.data);
          setQuestions(response.data.questions);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      };
      getQuestions();
    }
  }, [selectedLanguage]);

  const languageToISO6391 = (language: string): string | null => {
    const code = ISO6391.default.getCode(language);
    return code ? code : null;
  };
  console.log(languageToISO6391(selectedLanguage || ""));

  const submitForm = async (file: File) => {
    const formData = new FormData();
    formData.append("audio", file);
    const basicData = localStorage.getItem("applicationData");

    if (basicData) {
      const parsedData = JSON.parse(basicData);
      formData.append("name", parsedData.name);
      formData.append("email", parsedData.email);
      formData.append("phone", parsedData.phone);
      formData.append(
        "language",
        languageToISO6391(selectedLanguage || "") || selectedLanguage || ""
      );
      formData.append("questions", JSON.stringify(questions));
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/application",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        console.log("Form and audio file uploaded successfully");
      } else {
        console.error("Failed to upload form and audio file");
      }
    } catch (error) {
      console.error("Error uploading form and audio file:", error);
    }
  };

  const startRecording = async () => {
    try {
      const basicData = localStorage.getItem("applicationData");

      if (!basicData) {
        setError(
          "You have to fill the form on the previous page before recording."
        );
        return;
      }

      if (questions.length < 5) {
        setError("Please select a language first");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });

        await submitForm(audioFile);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#0A0925] overflow-y-hidden h-screen">
      <Navbar />
      <div className="w-full relative top-[5rem] pt-5 bg-[#0A0925] flex h-[87vh]">
        <div className="w-[44%] px-[5%]">
          <h1 className="font-montserratalt text-white font-extrabold text-[2rem] mb-5">
            Time to test how fluent you're. <br />
            Please select a language below
          </h1>
          <div className="w-[90%]">
            <div className="w-full">
              <input
                type="text"
                placeholder="search"
                className="w-full text-white font-montserrat h-10 px-3 rounded-md outline-none mb-3 bg-[#222234]"
              />
              <img src="" alt="" />
            </div>
            <div className="rounded-md max-h-[15rem]">
              {["French", "Spanish", "Portuguese", "Chinese", "english"].map(
                (item, index) => {
                  return (
                    <div
                      className={`bg-white hover:bg-[#222234] hover:text-white font-montserrat py-2 px-3 cursor-pointer ${
                        index === 4
                          ? "rounded-b-md"
                          : index === 0
                          ? "rounded-t-md"
                          : ""
                      } `}
                      key={item} // Ensuring key is unique
                      onClick={() => setSelectedLanguage(item)}
                    >
                      {item}
                    </div>
                  );
                }
              )}
            </div>
            <p className="font-montserrat text-red-600 text-[1rem]">{error}</p>
          </div>
        </div>
        <div className="w-[56%] bg-[#5D5FEF] px-[15%] pb-7 pt-5 rounded-tl-2xl h-full overflow-y-scroll">
          <div className="bg-[#0A0925] text-white p-3 font-montserrat text-[0.8rem] rounded-2xl mb-5">
            <h3 className="font-bold text-[1rem] mb-1 underline">
              Instructions
            </h3>
            <p>
              Please answer the questions below in the order that the questions
              were set. You're to click on the mic icon below and answer the
              questions verbally. Once your mic is on and you're answering the
              questions, you're required to answer all the questions one after
              the other before you turn off your mic. Note: Answer all questions
              in the language you selected.
            </p>
          </div>

          {loading ? (
            <ClipLoader
              color="#3498db"
              loading={loading}
              size={90}
              cssOverride={override}
            />
          ) : (
            questions &&
            questions.map((item, index) => {
              return (
                <div
                  className="text-center font-montserrat py-3 px-2 bg-white my-5 font-semibold rounded-md"
                  key={index}
                >
                  {item}
                </div>
              );
            })
          )}

          <div className="w-full flex justify-center">
            <div
              className="w-12 h-12 bg-[#dfdfdf] rounded-full fixed bottom-3 right-[27%] cursor-pointer hover:bg-[#b4b4b4] flex items-center justify-center"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <div
                className={`w-6 h-6 ${
                  isRecording ? "" : "rounded-full"
                } bg-red-600`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormTest;

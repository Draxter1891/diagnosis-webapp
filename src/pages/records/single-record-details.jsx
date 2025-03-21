import {
  IconChevronRight,
  IconFileUpload,
  IconProgress,
} from "@tabler/icons-react";
import React, { useState } from "react";
import RecordDetailsHeader from "./components/record-details-header";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "./components/file-upload-modal";
import { useStateContext } from "../../context";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";

const geminiAPIkey = import.meta.env.VITE_GEMINI_API_KEY;

const SingleRecordDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || "",
  );
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateRecord } = useStateContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileType(file.type);
    setFileName(file.name);
    setFile(file);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    const genAI = new GoogleGenerativeAI(geminiAPIkey);

    try {
      const base64Data = await readFileAsBase64(file);

      if (typeof base64Data !== "string") {
        console.error("Error: base64Data is not a string", base64Data);
        throw new Error("File conversion to Base64 failed.");
      }

      const base64Only = base64Data.split(",")[1] || "";
      if (!base64Only) {
        console.error("Error extracting Base64 content:", base64Data);
        throw new Error("Invalid Base64 format");
      }

      const imageParts = [
        {
          inlineData: {
            data: base64Only,
            mimeType: fileType,
          },
        },
      ];

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const prompt = `You are an expert cancer and any disease diagnosis analyst. Use your knowledge base to answer questions about giving personalized recommended treatments.Give a detailed treatment plan for me, make it more readable, clear and easy to understand make it paragraphs to make it more readable`;

      const results = await model.generateContent([prompt, ...imageParts]);

      const response = await results.response;

      const text = response.text();
      setAnalysisResult(text);

      await updateRecord({
        documentId: state.id,
        analysisResult: text,
        kanbanRecords: "",
      });

      setUploadSuccess(true);
      setIsModalOpen(false);
      setFileName("");
      setFile(null);
      setFileType("");
    } catch (error) {
      console.error("Error uploading file", error);
      setUploadSuccess(false);
      setIsModalOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const processTreatmentPlan = async () => {
    setProcessing(true);
  
    const genAI = new GoogleGenerativeAI(geminiAPIkey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  
    const prompt = `Your role is to format the treatment plan ${analysisResult} into JSON strictly in this format: 
                  - Todo: Tasks that need to be started
                  - Doing: Tasks that are in progress
                  - Done: Tasks that are completed
  
  Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
            
  Please provide the results in the following  format for easy front-end display no quotating or what so ever just pure the structure below:
    
    {
      "columns": [
        { "id": "todo", "title": "Todo" },
        { "id": "doing", "title": "Work in progress" },
        { "id": "done", "title": "Done" }
      ],
      "tasks": [
        { "id": "1", "columnId": "todo", "content": "Example task 1" },
        { "id": "2", "columnId": "todo", "content": "Example task 2" },
        { "id": "3", "columnId": "doing", "content": "Example task 3" },
        { "id": "4", "columnId": "doing", "content": "Example task 4" },
        { "id": "5", "columnId": "done", "content": "Example task 5" }
      ]
    }
  
    **Only return valid JSON. Do NOT include any additional text, explanations, or formatting (such as triple backticks).**`;
  
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
  
      // 🔹 Remove unwanted formatting (Markdown code block)
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "").trim();
  
      // 🔹 Ensure JSON validity
      const parsedResponse = JSON.parse(text);
  
      await updateRecord({
        documentId: state.id,
        kanbanRecords: text,
      });
  
      navigate(`/screening-schedules`, { state: parsedResponse });
  
    } catch (error) {
      console.error("Error processing treatment plan:", error);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        onClick={handleOpenModal}
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
      >
        <IconFileUpload />
        Upload Reports
      </button>

      {/* file upload modal */}
      <FileUploadModal
        onClose={handleCloseModal}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        fileName={fileName}
        isOpen={isModalOpen}
      />
      <RecordDetailsHeader recordName={state.recordName} />

      <div className="w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              <div className="overflow-hidden rounded-xl border border-neutral-700 bg-[#13131a] shadow-sm">
                <div className="border-b border-neutral-700 px-6 py-4">
                  <h1 className="text-xl font-semibold text-neutral-200">
                    Personalized AI-Driven Treatment plan
                  </h1>
                  <p className="text-sm text-neutral-400">
                    A tailored medical strategy leveraging advanced AI insights
                  </p>
                </div>
                <div className="flex w-full flex-col px-6 py-4 text-white">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Analysis Result
                    </h2>
                    <div className="space-y-2">
                      <ReactMarkdown>{analysisResult}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 sm:flex">
                    <button
                      type="button"
                      className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                      onClick={processTreatmentPlan}
                    >
                      View Treatment Plan
                      <IconChevronRight size={20} />
                      {processing && (
                        <IconProgress
                          className="mr-3 h-5 w-5 animate-spin"
                          size={10}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRecordDetails;

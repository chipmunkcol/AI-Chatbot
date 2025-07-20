"use client";

import React, { useState } from "react";
import { Bot, Upload, X, FileText, Plus, Loader2 } from "lucide-react";

interface CustomBotCreatorProps {
  onClose: () => void;
  onBotCreated: (bot: any) => void;
}

const CustomBotCreator: React.FC<CustomBotCreatorProps> = ({
  onClose,
  onBotCreated,
}) => {
  const [step, setStep] = useState(1); // 1: 봇 생성, 2: 파일 업로드
  const [botData, setBotData] = useState({
    name: "",
    description: "",
    instructions: "",
  });
  const [createdBot, setCreatedBot] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleCreateBot = async () => {
    if (!botData.name.trim()) {
      alert("봇 이름을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/custom-bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(botData),
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedBot(data.customBot);
        setStep(2);
      } else {
        const error = await response.json();
        alert(error.error || "봇 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating bot:", error);
      alert("봇 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      setStep(3); // 파일 없이 완료
      return;
    }

    setUploading(true);
    const newProgress: { [key: string]: string } = {};

    for (const file of files) {
      try {
        newProgress[file.name] = "업로드 중...";
        setUploadProgress({ ...newProgress });

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `/api/custom-bots/${createdBot.id}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          newProgress[file.name] = `완료 (${data.chunksProcessed}개 청크 생성)`;
        } else {
          const error = await response.json();
          newProgress[file.name] = `실패: ${error.error}`;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        newProgress[file.name] = "업로드 실패";
      }

      setUploadProgress({ ...newProgress });
    }

    setUploading(false);
    setStep(3);
  };

  const handleComplete = () => {
    onBotCreated(createdBot);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Bot className="w-6 h-6 mr-2" />
            커스텀 챗봇 만들기
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 단계 표시 */}
        <div className="flex items-center mb-6">
          <div
            className={`flex items-center ${
              step >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                step >= 1
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              1
            </div>
            <span className="ml-2">봇 설정</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4"></div>
          <div
            className={`flex items-center ${
              step >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                step >= 2
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              2
            </div>
            <span className="ml-2">지식 업로드</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4"></div>
          <div
            className={`flex items-center ${
              step >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                step >= 3
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300"
              }`}
            >
              3
            </div>
            <span className="ml-2">완료</span>
          </div>
        </div>

        {/* 단계 1: 봇 생성 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                봇 이름 *
              </label>
              <input
                type="text"
                value={botData.name}
                onChange={(e) =>
                  setBotData({ ...botData, name: e.target.value })
                }
                placeholder="예: 마케팅 전문가"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                설명
              </label>
              <input
                type="text"
                value={botData.description}
                onChange={(e) =>
                  setBotData({ ...botData, description: e.target.value })
                }
                placeholder="이 봇이 어떤 도움을 줄 수 있는지 설명해주세요"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                행동 지침
              </label>
              <textarea
                value={botData.instructions}
                onChange={(e) =>
                  setBotData({ ...botData, instructions: e.target.value })
                }
                placeholder="이 봇이 어떻게 행동해야 하는지 지침을 작성해주세요"
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            <button
              onClick={handleCreateBot}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {loading ? "생성 중..." : "봇 생성하기"}
            </button>
          </div>
        )}

        {/* 단계 2: 파일 업로드 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                지식 파일 업로드
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                PDF, DOCX, TXT, MD 파일을 업로드하여 봇에게 지식을 제공할 수
                있습니다.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  파일을 선택하거나 여기에 드래그하세요
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  PDF, DOCX, TXT, MD (최대 10MB)
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 dark:text-white">
                  선택된 파일:
                </h4>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            )}

            {Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 dark:text-white">
                  업로드 진행상황:
                </h4>
                {Object.entries(uploadProgress).map(([fileName, status]) => (
                  <div
                    key={fileName}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {fileName}
                    </span>
                    <span className="text-sm text-gray-500">{status}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => handleUploadFiles()}
                disabled={uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploading
                  ? "업로드 중..."
                  : files.length > 0
                  ? "파일 업로드"
                  : "건너뛰기"}
              </button>
            </div>
          </div>
        )}

        {/* 단계 3: 완료 */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              봇 생성 완료!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>{createdBot?.name}</strong> 봇이 성공적으로
              생성되었습니다. 이제 이 봇과 대화를 시작할 수 있습니다.
            </p>
            <button
              onClick={handleComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-200"
            >
              완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomBotCreator;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, Menu } from "lucide-react";
import ChatHistory from "./ChatHistory";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! Gemini AI와 함께하는 챗봇입니다. 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [currentCustomBotId, setCurrentCustomBotId] = useState<string | null>(
    null
  );
  const [selectedBotInfo, setSelectedBotInfo] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateConversationTitle = (firstMessage: string): string => {
    // 첫 번째 메시지의 첫 30자를 제목으로 사용
    return firstMessage.length > 30
      ? firstMessage.substring(0, 30) + "..."
      : firstMessage;
  };

  const createNewConversation = async (
    firstMessage?: string
  ): Promise<string | null> => {
    try {
      const title = firstMessage
        ? generateConversationTitle(firstMessage)
        : `새 대화 ${new Date().toLocaleString("ko-KR")}`;

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.conversation.id;
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
    return null;
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.created_at),
        }));

        // 메시지가 있으면 로드된 메시지로 교체, 없으면 초기 메시지 유지
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
        } else {
          setMessages([
            {
              id: "1",
              text: "안녕하세요! Gemini AI와 함께하는 챗봇입니다. 무엇을 도와드릴까요?",
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }

        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: "1",
        text: currentCustomBotId
          ? `안녕하세요! ${
              selectedBotInfo?.name || "커스텀 봇"
            }과 함께하는 챗봇입니다. 무엇을 도와드릴까요?`
          : "안녕하세요! Gemini AI와 함께하는 챗봇입니다. 무엇을 도와드릴까요?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  const handleSelectConversation = (conversationId: string) => {
    loadConversation(conversationId);
    setCurrentCustomBotId(null);
    setSelectedBotInfo(null);
    setShowHistory(false);
  };

  const handleSelectCustomBot = async (customBotId: string) => {
    if (customBotId) {
      setCurrentCustomBotId(customBotId);

      // 커스텀 봇 정보 가져오기
      try {
        const response = await fetch(`/api/custom-bots/${customBotId}/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "info" }),
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedBotInfo(data.botInfo);
        }
      } catch (error) {
        console.error("Error fetching bot info:", error);
      }

      // 새 대화 시작
      handleNewConversation();
    } else {
      setCurrentCustomBotId(null);
      setSelectedBotInfo(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const currentInput = inputText;
    let convId = currentConversationId;

    // 새 대화인 경우 대화 생성
    if (!convId) {
      convId = await createNewConversation(currentInput);
      if (convId) {
        setCurrentConversationId(convId);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setError(null);

    // 진행 중인 요청이 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();

    // 스트리밍 봇 메시지 생성
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      // 채팅 히스토리 준비 (스트리밍 중인 메시지와 초기 봇 메시지 제외)
      const chatHistory = messages.filter(
        (msg) =>
          !msg.isStreaming &&
          !(
            msg.sender === "bot" &&
            (msg.text.includes("Gemini AI와 함께하는 챗봇입니다") ||
              msg.text.includes("커스텀 봇"))
          )
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          chatHistory: chatHistory,
          conversationId: convId,
          customBotId: currentCustomBotId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              // 스트리밍 완료
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
                )
              );
              setIsTyping(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              accumulatedText += parsed.text;

              // 실시간으로 메시지 업데이트
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? { ...msg, text: accumulatedText }
                    : msg
                )
              );
            } catch (e) {
              // JSON 파싱 에러 무시
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        // 요청이 취소된 경우
        return;
      }

      console.error("Error:", error);
      setError("응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.");

      // 에러 메시지로 봇 메시지 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getBotDisplayName = () => {
    if (currentCustomBotId && selectedBotInfo) {
      return selectedBotInfo.name;
    }
    return "AI 챗봇";
  };

  const getBotIcon = () => {
    if (currentCustomBotId) {
      return "🤖";
    }
    return null;
  };

  return (
    <div className="flex h-screen max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* 히스토리 사이드바 */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowHistory(false)}
          />
          <div
            className={`${
              showHistory ? "block" : "hidden"
            } lg:block fixed lg:relative z-50 lg:z-auto`}
          >
            <ChatHistory
              currentConversationId={currentConversationId}
              currentCustomBotId={currentCustomBotId}
              onSelectConversation={handleSelectConversation}
              onSelectCustomBot={handleSelectCustomBot}
              onNewConversation={handleNewConversation}
            />
          </div>
        </>
      )}

      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 채팅 헤더 */}
        <div
          className={`${
            currentCustomBotId
              ? "bg-purple-600 dark:bg-purple-700"
              : "bg-blue-600 dark:bg-blue-700"
          } text-white p-4`}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`lg:hidden p-1 rounded ${
                currentCustomBotId
                  ? "hover:bg-purple-700 dark:hover:bg-purple-600"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`hidden lg:block p-1 rounded ${
                currentCustomBotId
                  ? "hover:bg-purple-700 dark:hover:bg-purple-600"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              {getBotIcon() ? (
                <span className="text-lg mr-2">{getBotIcon()}</span>
              ) : (
                <Bot className="w-6 h-6 mr-2" />
              )}
              <div>
                <h2 className="text-xl font-semibold">{getBotDisplayName()}</h2>
                {currentCustomBotId && selectedBotInfo?.description && (
                  <p className="text-sm opacity-80">
                    {selectedBotInfo.description}
                  </p>
                )}
              </div>
            </div>
            <div className="ml-auto">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="ml-2 text-sm">온라인</span>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div
                  className={`flex-shrink-0 w-8 h-8 ${
                    currentCustomBotId ? "bg-purple-600" : "bg-blue-600"
                  } rounded-full flex items-center justify-center`}
                >
                  {getBotIcon() ? (
                    <span className="text-sm">{getBotIcon()}</span>
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? currentCustomBotId
                      ? "bg-purple-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                {message.isStreaming && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex space-x-1">
                      <div
                        className={`w-1 h-1 ${
                          currentCustomBotId ? "bg-purple-500" : "bg-blue-500"
                        } rounded-full animate-pulse`}
                      ></div>
                      <div
                        className={`w-1 h-1 ${
                          currentCustomBotId ? "bg-purple-500" : "bg-blue-500"
                        } rounded-full animate-pulse`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className={`w-1 h-1 ${
                          currentCustomBotId ? "bg-purple-500" : "bg-blue-500"
                        } rounded-full animate-pulse`}
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">입력 중...</span>
                  </div>
                )}
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div
                className={`flex-shrink-0 w-8 h-8 ${
                  currentCustomBotId ? "bg-purple-600" : "bg-blue-600"
                } rounded-full flex items-center justify-center`}
              >
                {getBotIcon() ? (
                  <span className="text-sm">{getBotIcon()}</span>
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* 에러 메시지 표시 */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isTyping ? "AI가 응답하는 중..." : "메시지를 입력하세요..."
              }
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className={`${
                currentCustomBotId
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[44px]`}
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

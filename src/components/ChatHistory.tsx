"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Plus, Clock, Bot, Settings } from "lucide-react";
import CustomBotCreator from "./CustomBotCreator";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface CustomBot {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ChatHistoryProps {
  currentConversationId: string | null;
  currentCustomBotId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onSelectCustomBot: (customBotId: string) => void;
  onNewConversation: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  currentConversationId,
  currentCustomBotId,
  onSelectConversation,
  onSelectCustomBot,
  onNewConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [customBots, setCustomBots] = useState<CustomBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBotCreator, setShowBotCreator] = useState(false);
  const [activeTab, setActiveTab] = useState<"conversations" | "bots">(
    "conversations"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [conversationsRes, botsRes] = await Promise.all([
        fetch("/api/conversations"),
        fetch("/api/custom-bots"),
      ]);

      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json();
        setConversations(conversationsData.conversations || []);
      }

      if (botsRes.ok) {
        const botsData = await botsRes.json();
        setCustomBots(botsData.customBots || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "오늘";
    } else if (diffDays === 2) {
      return "어제";
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR");
    }
  };

  const handleBotCreated = (newBot: CustomBot) => {
    setCustomBots((prev) => [newBot, ...prev]);
    onSelectCustomBot(newBot.id);
    setActiveTab("bots");
  };

  return (
    <>
      <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              채팅
            </h2>
            <button
              onClick={onNewConversation}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              title="새 대화"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("conversations")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "conversations"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-1" />
              대화기록
            </button>
            <button
              onClick={() => setActiveTab("bots")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "bots"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Bot className="w-4 h-4 inline mr-1" />
              커스텀 봇
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              로딩 중...
            </div>
          ) : activeTab === "conversations" ? (
            // 대화 기록 탭
            conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>저장된 대화가 없습니다</p>
                <p className="text-sm mt-1">새 대화를 시작해보세요!</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      onSelectCustomBot(""); // 일반 대화 선택시 커스텀 봇 해제
                    }}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      currentConversationId === conversation.id &&
                      !currentCustomBotId
                        ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {conversation.title}
                        </h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(conversation.updated_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // 커스텀 봇 탭
            <div className="p-2">
              <button
                onClick={() => setShowBotCreator(true)}
                className="w-full p-3 mb-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">새 커스텀 봇 만들기</span>
              </button>

              {customBots.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>커스텀 봇이 없습니다</p>
                  <p className="text-sm mt-1">첫 번째 봇을 만들어보세요!</p>
                </div>
              ) : (
                customBots.map((bot) => (
                  <div
                    key={bot.id}
                    onClick={() => {
                      onSelectCustomBot(bot.id);
                      onNewConversation(); // 새 대화 시작
                    }}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      currentCustomBotId === bot.id
                        ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1 min-w-0">
                        <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {bot.name}
                          </h3>
                          {bot.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {bot.description}
                            </p>
                          )}
                          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(bot.updated_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 커스텀 봇 생성 모달 */}
      {showBotCreator && (
        <CustomBotCreator
          onClose={() => setShowBotCreator(false)}
          onBotCreated={handleBotCreated}
        />
      )}
    </>
  );
};

export default ChatHistory;

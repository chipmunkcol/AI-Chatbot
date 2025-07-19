import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="h-full p-4">
        <div className="h-full flex flex-col">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            AI 챗봇
          </h1>
          <div className="flex-1">
            <Chatbot />
          </div>
        </div>
      </div>
    </main>
  );
}

import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="h-full p-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <Chatbot />
          </div>
        </div>
      </div>
    </main>
  );
}

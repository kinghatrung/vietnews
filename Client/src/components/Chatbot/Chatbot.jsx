import React, { useState, useRef, useEffect } from "react";
import { Button, Input, List } from "antd";
import { chatBotGeminiAPI } from "~/api";
import { Link } from "react-router-dom";

const Chatbot = React.memo(function Chatbot() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await chatBotGeminiAPI(input);
      const botMessage = {
        text:
          response.data.reply ||
          "Mình chưa rõ bạn đang tìm tin tức gì. Bạn có thể cung cấp thêm từ khóa để mình hỗ trợ tốt hơn nhé!",
        sender: "bot",
        relatedNews: response.data.relatedNews || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Lỗi kết nối đến Chatbot, vui lòng kiểm tra lại Internet hoặc thử lại sau.",
          sender: "bot",
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="cursor-pointer fixed bottom-12 left-8 bg-blue-400 text-white w-16 h-16 rounded-full shadow-md hover:bg-blue-500 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        <span class="sr-only">Chat với chúng tôi</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {visible && (
        <div
          className={`fixed bottom-20 left-6 w-96 bg-white rounded-2xl shadow-xl flex flex-col h-[500px] transition-all duration-500 transform ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          } z-50`}
        >
          <div className="bg-gray-100 text-gray-800 p-4 rounded-t-2xl flex items-center justify-between border-b border-gray-200">
            <h3 className="text-lg font-semibold tracking-tight">
              VietNews Chatbot
            </h3>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-600 hover:text-gray-800 text-lg font-medium cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-white">
            <List
              dataSource={messages}
              locale={{
                emptyText:
                  "Xin chào! Tôi là VietNews Chatbot, sẵn sàng hỗ trợ bạn!",
              }}
              renderItem={(item) => (
                <List.Item
                  className={`flex ${
                    item.sender === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
                      item.sender === "user"
                        ? "bg-blue-100 text-gray-800"
                        : "bg-gray-100 text-gray-700"
                    } transition-all duration-200`}
                  >
                    <p className="break-words whitespace-normal">{item.text}</p>
                    {item.relatedNews && item.relatedNews.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-blue-600 mt-[12px]">
                        {item.relatedNews.map((news, idx) => (
                          <li key={idx} className="text-[14px]">
                            <Link
                              to={news.routePath || `/news/${news._id}`}
                              className="hover:underline"
                            >
                              {news.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Aaa... Nhập câu hỏi của bạn"
              className="rounded-lg border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              suffix={
                <Button
                  type="primary"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="rounded-lg bg-blue-500 hover:bg-blue-600 border-none text-white font-medium"
                >
                  Gửi
                </Button>
              }
            />
          </div>
        </div>
      )}
    </>
  );
});

export default Chatbot;

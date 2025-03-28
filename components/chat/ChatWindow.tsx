'use client';
import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Image from 'next/image';
import Aaron from '@/public/Aaron.jpg';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything about my portfolio.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, data.reply]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="w-full p-3 bg-white dark:bg-gray-950">
      <div
        className="h-64 px-2 py-2 mb-3 space-y-1 overflow-y-auto"
        ref={chatContainerRef}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="flex justify-start mb-2">
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 overflow-hidden rounded-full">
                <Image
                  src={Aaron}
                  alt="Aaron"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="px-3 py-2 text-gray-800 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-200">
              <div className="flex items-center space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full dark:bg-gray-500 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full dark:bg-gray-500 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full dark:bg-gray-500 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex">
        <input
          className="flex-1 p-2 text-gray-800 bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-l-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Don't be shy..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-white transition bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

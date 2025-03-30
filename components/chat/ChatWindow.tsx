'use client';
import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Image from 'next/image';
import Aaron from '@/public/Aaron.jpg';
import { IoSend } from 'react-icons/io5';

interface ChatWindowProps {
  messages: any[];
  onMessagesUpdate: (messages: any[]) => void;
}

export default function ChatWindow({
  messages,
  onMessagesUpdate,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    onMessagesUpdate(newMessages);
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
      onMessagesUpdate([...newMessages, data.reply]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
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
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-950">
      <div
        className="mb-2 flex-1 space-y-1 overflow-y-auto px-2 py-2"
        ref={chatContainerRef}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="mb-2 flex justify-start">
            <div className="mr-2 flex-shrink-0">
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={Aaron}
                  alt="Aaron"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="rounded-lg bg-gray-200 px-3 py-2 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <div className="flex items-center space-x-1">
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pb-3">
        <div className="relative">
          <input
            ref={inputRef}
            className="w-full rounded-md border border-gray-300 bg-gray-100 p-3 pr-12 text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Don't be shy..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 transition-all dark:text-gray-400 ${
              input.trim()
                ? 'hover:scale-[1.15] active:scale-105'
                : 'cursor-not-allowed opacity-50'
            }`}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <IoSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

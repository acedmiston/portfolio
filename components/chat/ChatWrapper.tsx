'use client';
import { useState, useRef, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import { ChatMessage } from '@/lib/types';

export default function ChatWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef(null);
  const lastOpenedRef = useRef<number>(Date.now());

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const lastOpened = localStorage.getItem('chatLastOpened');

    if (lastOpened) {
      lastOpenedRef.current = parseInt(lastOpened);
    }

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);

        // Count unread AI messages
        const count = countUnreadMessages(parsedMessages);
        setUnreadCount(count);
      } catch (e) {
        console.error('Error parsing saved messages', e);
      }
    } else {
      // Set initial welcome message
      const initialMessage: ChatMessage = {
        role: 'assistant',
        content: "Hi! Ask me anything about Aaron\'s portfolio.",
        timestamp: Date.now(),
      };
      setMessages([initialMessage]);
      localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
      setUnreadCount(1); // Initial message is unread
    }
  }, []);

  // Count unread messages (after the last time chat was opened)
  const countUnreadMessages = (msgs: ChatMessage[]): number => {
    return msgs.filter(
      (msg) =>
        msg.role === 'assistant' &&
        ((msg.timestamp ?? 0) > lastOpenedRef.current || !msg.timestamp)
    ).length;
  };
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Clear notification when chat is opened and update last opened timestamp
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
      const now = Date.now();
      lastOpenedRef.current = now;
      localStorage.setItem('chatLastOpened', now.toString());
    }
  }, [isOpen, unreadCount]);

  // Handler for new messages
  const handleNewMessage = (newMessages: ChatMessage[]): void => {
    // Add timestamp to new assistant messages
    const timestampedMessages = newMessages.map((msg) => {
      if (msg.role === 'assistant' && !msg.timestamp) {
        return { ...msg, timestamp: Date.now() };
      }
      return msg;
    });

    setMessages(timestampedMessages);

    // If chat is closed and last message is from AI, increment unread count
    const lastMsg = timestampedMessages[timestampedMessages.length - 1];
    if (!isOpen && lastMsg && lastMsg.role === 'assistant') {
      setUnreadCount((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-5 right-5">
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full border border-gray-600 border-opacity-50 bg-blue-600 text-white shadow-2xl backdrop-blur-[0.5rem] transition-all hover:scale-[1.15] hover:bg-blue-700 active:scale-105 dark:border-gray-100 dark:bg-blue-700 dark:hover:bg-blue-600"
            aria-label="Open chat"
          >
            <FaCommentDots className="w-5 h-5" />
          </button>

          {unreadCount > 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] animate-pulse items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {unreadCount}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="flex h-[40rem] max-h-[80vh] w-[20rem] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 dark:border-gray-700 dark:bg-gray-950 sm:h-[45rem] sm:w-[24rem]"
          ref={wrapperRef}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Aaron&#39;s Portfolio Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close chat"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatWindow
              messages={messages}
              onMessagesUpdate={handleNewMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

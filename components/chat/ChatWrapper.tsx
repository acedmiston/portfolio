'use client';
import { useState, useRef } from 'react';
import ChatWindow from './ChatWindow';
import { FaCommentDots, FaTimes } from 'react-icons/fa';

export default function ChatWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-5 right-5">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            w-[3rem] h-[3rem] 
            bg-blue-600 dark:bg-blue-700
            text-white backdrop-blur-[0.5rem] 
            border border-gray-600 border-opacity-50 dark:border-gray-100
            shadow-2xl rounded-full flex items-center justify-center 
            hover:scale-[1.15] active:scale-105 transition-all 
            hover:bg-blue-700 dark:hover:bg-blue-600
          "
          aria-label="Open chat"
        >
          <FaCommentDots className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div
          className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300 overflow-hidden w-[20rem] sm:w-[24rem]"
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

          <ChatWindow />
        </div>
      )}
    </div>
  );
}

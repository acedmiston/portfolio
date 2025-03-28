import React from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import Aaron from '@/public/Aaron.jpg';

interface MessageBubbleProps {
  role: string;
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isUser && (
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
      )}
      <div
        className={`
          relative max-w-[75%] px-3 py-2 rounded-lg 
          ${
            isUser
              ? 'bg-blue-600 text-white dark:bg-blue-700'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }
        `}
      >
        <div className="text-sm whitespace-pre-line">{content}</div>
        <div
          className={`absolute top-2 ${isUser ? 'right-[-8px]' : 'left-[-8px]'} 
            w-4 h-4 transform rotate-45
            ${
              isUser
                ? 'bg-blue-600 dark:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700'
            }
          `}
        />
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <FaUserCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
}

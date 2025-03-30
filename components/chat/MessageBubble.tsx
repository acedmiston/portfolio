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
      )}
      <div
        className={`relative max-w-[75%] rounded-lg px-3 py-2 ${
          isUser
            ? 'bg-blue-600 text-white dark:bg-blue-700'
            : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        } `}
      >
        <div className="whitespace-pre-line text-sm">{content}</div>
        <div
          className={`absolute top-2 ${isUser ? 'right-[-8px]' : 'left-[-8px]'} h-4 w-4 rotate-45 transform ${
            isUser
              ? 'bg-blue-600 dark:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-700'
          } `}
        />
      </div>
      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <FaUserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
}


import React from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, TutorIcon } from './Icons';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const bubbleClasses = isUser
    ? 'bg-cyan-600/80 rounded-br-none'
    : 'bg-slate-700/80 rounded-bl-none';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-end gap-3 max-w-xl ${containerClasses} ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-600">
          <TutorIcon className="w-6 h-6 text-cyan-400" />
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl shadow-md text-white ${bubbleClasses}`}
      >
        <p className="whitespace-pre-wrap">{message.text || '...'}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-600">
          <UserIcon className="w-6 h-6 text-slate-400" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

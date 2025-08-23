import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Haz una pregunta sobre geometría moderna..."
          disabled={isLoading}
          className="w-full p-3 pr-12 bg-slate-800 border border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-200 text-gray-200 placeholder-slate-500 max-h-48"
          rows={1}
          aria-label="Chat input"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-12 h-12 flex items-center justify-center bg-cyan-600 text-white rounded-full transition-all duration-200 ease-in-out disabled:bg-slate-700 disabled:cursor-not-allowed hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transform hover:scale-105 disabled:scale-100"
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          <SendIcon className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
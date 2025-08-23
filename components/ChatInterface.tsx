import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import type { ChatMessage as Message } from '../types';
import { createTutorChat } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { WelcomeIcon, KeyIcon } from './Icons';

const ApiKeyForm: React.FC<{ onKeySubmit: (key: string) => void, error: string | null }> = ({ onKeySubmit, error }) => {
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.trim()) {
            onKeySubmit(key.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <KeyIcon className="w-16 h-16 mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold mb-2 text-white">Ingresa tu Clave de API de Gemini</h2>
            <p className="max-w-md mb-6 text-slate-400">
                Para comenzar a chatear con Geo, necesitas una clave de API de Google Gemini. Pega tu clave a continuación. No se almacenará en nuestros servidores.
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-4 py-2 mb-4 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    placeholder="Tu clave de API..."
                    aria-label="Gemini API Key"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-700"
                    disabled={!key.trim()}
                >
                    Iniciar Chat
                </button>
                {error && <p className="text-red-400 mt-4" role="alert">{error}</p>}
            </form>
        </div>
    );
};

const ChatInterface: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini_api_key'));
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiKey) {
      try {
        setInitError(null);
        const newChat = createTutorChat(apiKey);
        setChat(newChat);
        setMessages([
          {
            id: 'initial',
            text: "¡Hola! Soy Geo, tu tutor de Geometría Moderna. ¿Cómo puedo ayudarte a explorar un concepto o un problema hoy? Recuerda, estoy aquí para guiarte, no para darte las respuestas.",
            sender: 'ai'
          }
        ]);
      } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        setMessages([]);
        setInitError("Hubo un error al inicializar el tutor. Por favor, asegúrate de que tu clave de API sea correcta y vuelve a intentarlo.");
        localStorage.removeItem('gemini_api_key');
        setApiKey(null);
      }
    }
  }, [apiKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading || !chat) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = { id: aiMessageId, text: '', sender: 'ai' };
    setMessages(prev => [...prev, aiMessagePlaceholder]);
    
    try {
        const stream = await chat.sendMessageStream({ message: inputText });
        let responseText = '';
        for await (const chunk of stream) {
            responseText += chunk.text;
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, text: responseText } : msg
            ));
        }
    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = "Lo siento, pero he encontrado un error. Por favor, intenta reformular tu pregunta o revisa la consola para más detalles.";
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: errorMessage } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, chat]);

  const handleKeySubmit = (key: string) => {
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
  };
  
  const handleChangeKey = () => {
      setApiKey(null);
      setChat(null);
      setMessages([]);
      localStorage.removeItem('gemini_api_key');
  };

  if (!apiKey) {
      return <ApiKeyForm onKeySubmit={handleKeySubmit} error={initError} />;
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto scroll-smooth">
        {messages.length > 0 ? (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <WelcomeIcon className="w-24 h-24 mb-4"/>
            <p className="text-lg">El historial del chat aparecerá aquí.</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900/50 border-t border-slate-700/50">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <div className="text-center mt-2">
            <button onClick={handleChangeKey} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Cambiar Clave de API
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
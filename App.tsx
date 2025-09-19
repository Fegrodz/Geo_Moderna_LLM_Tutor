import React from 'react';
import ChatInterface from './components/ChatInterface';
import { BrainCircuitIcon } from './components/Icons';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-slate-800 font-sans">
      <header className="p-4 border-b border-slate-700/50 shadow-lg bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-center">
          <BrainCircuitIcon className="w-8 h-8 mr-3 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200">
            Tutor de Geometría Moderna
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col min-h-0">
        <ChatInterface />
      </main>
      
      <footer className="text-center p-2 text-xs text-slate-500 border-t border-slate-700/50">
          <p>Impulsado por Gemini. Esto es una ayuda de estudio.</p>
          <p>Verifica siempre la información crítica.</p>
      </footer>
    </div>
  );
};

export default App;

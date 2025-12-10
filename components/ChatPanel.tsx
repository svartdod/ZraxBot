import React, { useState, useRef, useEffect } from 'react';
import { generateRAGResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ArrowLeft, Send, Bot, User, Settings, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  chunks: string[];
  onBack: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ chunks, onBack, selectedModel, onModelChange }) => {
  const [_systemPrompt_, _setSystemPrompt_] = useState(
    "You are a helpful and precise assistant. Answer the user's questions based strictly on the provided context."
  );
  const [_input_, _setInput_] = useState("");
  const [_messages_, _setMessages_] = useState<ChatMessage[]>([]);
  const [_loading_, _setLoading_] = useState(false);
  const _messagesEndRef_ = useRef<HTMLDivElement>(null);

  const _scrollToBottom_ = () => {
    _messagesEndRef_.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    _scrollToBottom_();
  }, [_messages_]);

  const _handleSend_ = async () => {
    if (!_input_.trim() || _loading_) return;

    const _userMsg_: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: _input_,
      timestamp: Date.now(),
    };

    _setMessages_(_prev_ => [..._prev_, _userMsg_]);
    _setInput_("");
    _setLoading_(true);

    try {
      const _responseText_ = await generateRAGResponse(_userMsg_.text, chunks, _systemPrompt_, selectedModel);
      
      const _modelMsg_: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: _responseText_,
        timestamp: Date.now(),
      };
      _setMessages_(_prev_ => [..._prev_, _modelMsg_]);
    } catch (_err_) {
      console.error(_err_);
    } finally {
      _setLoading_(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6 animate-fade-in">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={24} /> RAG Chatbot
          </h2>
          <p className="text-slate-400">Step 3: Test your data with Gemini.</p>
        </div>
        <button 
           onClick={onBack}
           className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors bg-slate-800 hover:bg-slate-700"
         >
           <ArrowLeft size={18} /> Back to Config
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
        
        <div className="lg:col-span-1 bg-slate-900 border border-slate-700 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50">
             <h3 className="font-semibold text-slate-200 flex items-center gap-2">
               <Settings size={18} /> Configuration
             </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-xs text-slate-500 mb-2">Instructions for the LLM behavior:</p>
            <textarea
              value={_systemPrompt_}
              onChange={(_e_) => _setSystemPrompt_(_e_.target.value)}
              className="w-full h-40 bg-slate-950 p-4 text-slate-300 text-sm rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-800 mb-4"
              placeholder="Enter system instructions..."
            />
          </div>
          <div className="p-4 border-t border-slate-700 bg-slate-900/50">
            <div className="text-xs text-slate-500 flex justify-between mb-3">
              <span>Context Chunks:</span>
              <span className="font-mono text-blue-400">{chunks.length}</span>
            </div>
            
            <label className="block text-xs text-slate-500 mb-1">Model Selection:</label>
            <select 
              value={selectedModel}
              onChange={(_e_) => onModelChange(_e_.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Fast)</option>
              <option value="gemini-3-pro-preview">gemini-3-pro-preview (Reasoning)</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {_messages_.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Bot size={64} className="mb-4 text-slate-400" />
                <p className="text-slate-400 text-lg">Ready to chat with your data</p>
              </div>
            )}
            
            {_messages_.map((_msg_) => (
              <div 
                key={_msg_.id} 
                className={`flex gap-4 ${_msg_.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${_msg_.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  {_msg_.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  _msg_.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{_msg_.text}</p>
                </div>
              </div>
            ))}
            
            {_loading_ && (
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                 </div>
                 <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
            )}
            <div ref={_messagesEndRef_} />
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={_input_}
                onChange={(_e_) => _setInput_(_e_.target.value)}
                onKeyDown={(_e_) => _e_.key === 'Enter' && _handleSend_()}
                placeholder="Ask a question about your documents..."
                className="w-full bg-slate-950 text-white pl-4 pr-12 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-lg"
              />
              <button 
                onClick={_handleSend_}
                disabled={!_input_.trim() || _loading_}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2">
               <p className="text-[10px] text-slate-600">
                 AI can make mistakes. Verify important information.
               </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
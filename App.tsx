import React, { useState, useEffect } from 'react';
import { IngestionPanel } from './components/IngestionPanel';
import { VectorConfigPanel } from './components/VectorConfigPanel';
import { ChatPanel } from './components/ChatPanel';
import { processText, chunkText } from './utils/textProcessor';
import { AppView, CleaningOptions, VectorConfig, FileData, AugmentationOptions } from './types';
import { Database } from 'lucide-react';
import { augmentText } from './services/geminiService';

const App: React.FC = () => {
  const [_view_, _setView_] = useState<AppView>(AppView.INGESTION);
  
  const [_fileData_, _setFileData_] = useState<FileData | null>(null);
  const [_isAugmenting_, _setIsAugmenting_] = useState(false);
  
  const [_cleaningOptions_, _setCleaningOptions_] = useState<CleaningOptions>({
    removeHtml: true,
    normalizeWhitespace: true,
    removeBoilerplate: false,
    removeUrls: false,
    removeEmails: false,
    removeSpecialChars: false,
    lowercase: false
  });

  const [_augmentationOptions_, _setAugmentationOptions_] = useState<AugmentationOptions>({
    paraphrasing: false,
    backTranslation: false,
    swapEntities: false,
    synonyms: false
  });
  
  const [_vectorConfig_, _setVectorConfig_] = useState<VectorConfig>({
    chunkSize: 500,
    chunkOverlap: 50
  });

  const [_selectedModel_, _setSelectedModel_] = useState<string>('gemini-3-pro-preview');

  const [_chunks_, _setChunks_] = useState<string[]>([]);

  useEffect(() => {
    if (_fileData_?.rawContent) {
      const _cleaned_ = processText(_fileData_.rawContent, _cleaningOptions_);
      _setFileData_(_prev_ => _prev_ ? { ..._prev_, cleanedContent: _cleaned_ } : null);
    }
  }, [_fileData_?.rawContent, _cleaningOptions_]);

  useEffect(() => {
    if (_fileData_?.cleanedContent) {
      const _newChunks_ = chunkText(_fileData_.cleanedContent, _vectorConfig_);
      _setChunks_(_newChunks_);
    } else {
      _setChunks_([]);
    }
  }, [_fileData_?.cleanedContent, _vectorConfig_]);

  const _handleFileUpload_ = async (_file_: File) => {
    try {
      const _text_ = await _file_.text();
      _setFileData_({
        name: _file_.name,
        rawContent: _text_,
        cleanedContent: _text_
      });
    } catch (_e_) {
      console.error("Failed to read file", _e_);
      alert("Failed to read file contents.");
    }
  };

  const _handleRunAugmentation_ = async () => {
    if (!_fileData_?.cleanedContent) return;
    
    const _hasAugmentation_ = Object.values(_augmentationOptions_).some(_v_ => _v_);
    if (!_hasAugmentation_) {
      alert("Please select at least one augmentation technique.");
      return;
    }

    _setIsAugmenting_(true);
    try {
      const _augmented_ = await augmentText(_fileData_.cleanedContent, _augmentationOptions_, _selectedModel_);
      _setFileData_(_prev_ => _prev_ ? { ..._prev_, cleanedContent: _augmented_ } : null);
    } catch (_error_) {
      console.error(_error_);
      alert("Augmentation failed. See console for details.");
    } finally {
      _setIsAugmenting_(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               <Database size={18} />
             </div>
             <h1 className="font-bold text-lg tracking-tight text-white">ZraxBot</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
             <span className={`px-3 py-1 rounded-full transition-colors ${_view_ === AppView.INGESTION ? 'bg-blue-500/10 text-blue-400' : ''}`}>1. Ingest</span>
             <span className="text-slate-700">/</span>
             <span className={`px-3 py-1 rounded-full transition-colors ${_view_ === AppView.CHUNKING ? 'bg-blue-500/10 text-blue-400' : ''}`}>2. Chunk</span>
             <span className="text-slate-700">/</span>
             <span className={`px-3 py-1 rounded-full transition-colors ${_view_ === AppView.CHAT ? 'bg-blue-500/10 text-blue-400' : ''}`}>3. Chat</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 h-[calc(100vh-64px)]">
        
        {_view_ === AppView.INGESTION && (
          <IngestionPanel
            fileData={_fileData_}
            cleaningOptions={_cleaningOptions_}
            setCleaningOptions={_setCleaningOptions_}
            augmentationOptions={_augmentationOptions_}
            setAugmentationOptions={_setAugmentationOptions_}
            onFileUpload={_handleFileUpload_}
            onClear={() => _setFileData_(null)}
            onNext={() => _setView_(AppView.CHUNKING)}
            onRunAugmentation={_handleRunAugmentation_}
            isAugmenting={_isAugmenting_}
          />
        )}

        {_view_ === AppView.CHUNKING && (
          <VectorConfigPanel 
            chunks={_chunks_}
            config={_vectorConfig_}
            setConfig={_setVectorConfig_}
            onNext={() => _setView_(AppView.CHAT)}
            onBack={() => _setView_(AppView.INGESTION)}
          />
        )}

        {_view_ === AppView.CHAT && (
          <ChatPanel 
            chunks={_chunks_}
            onBack={() => _setView_(AppView.CHUNKING)}
            selectedModel={_selectedModel_}
            onModelChange={_setSelectedModel_}
          />
        )}

      </main>
    </div>
  );
};

export default App;
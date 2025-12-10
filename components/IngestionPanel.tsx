import React, { useRef } from 'react';
import { FileData, CleaningOptions, AugmentationOptions } from '../types';
import { Upload, FileText, Trash2, ArrowRight, CheckSquare, Wand2, RefreshCw } from 'lucide-react';

interface IngestionPanelProps {
  fileData: FileData | null;
  cleaningOptions: CleaningOptions;
  setCleaningOptions: (opts: CleaningOptions) => void;
  augmentationOptions: AugmentationOptions;
  setAugmentationOptions: (opts: AugmentationOptions) => void;
  onFileUpload: (file: File) => void;
  onClear: () => void;
  onNext: () => void;
  onRunAugmentation: () => void;
  isAugmenting: boolean;
}

export const IngestionPanel: React.FC<IngestionPanelProps> = ({
  fileData,
  cleaningOptions,
  setCleaningOptions,
  augmentationOptions,
  setAugmentationOptions,
  onFileUpload,
  onClear,
  onNext,
  onRunAugmentation,
  isAugmenting
}) => {
  const _fileInputRef_ = useRef<HTMLInputElement>(null);

  const _handleFileChange_ = (_e_: React.ChangeEvent<HTMLInputElement>) => {
    if (_e_.target.files && _e_.target.files[0]) {
      onFileUpload(_e_.target.files[0]);
    }
  };

  const _toggleOption_ = (_key_: keyof CleaningOptions) => {
    setCleaningOptions({ ...cleaningOptions, [_key_]: !cleaningOptions[_key_] });
  };

  const _toggleAugmentation_ = (_key_: keyof AugmentationOptions) => {
    setAugmentationOptions({ ...augmentationOptions, [_key_]: !augmentationOptions[_key_] });
  };

  const _selectAllOptions_ = () => {
    setCleaningOptions({
      removeHtml: true,
      normalizeWhitespace: true,
      removeBoilerplate: true,
      removeUrls: true,
      removeEmails: true,
      removeSpecialChars: true,
      lowercase: true,
    });
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Ingestion & Processing</h2>
          <p className="text-slate-400">Step 1: Upload, clean, and augment your data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
          
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex-shrink-0">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Upload size={18} /> File Upload
            </h3>
            
            {!fileData ? (
              <div 
                onClick={() => _fileInputRef_.current?.click()}
                className="border-2 border-dashed border-slate-700 rounded-lg h-32 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer bg-slate-900/50"
              >
                <FileText size={40} className="mb-2" />
                <span className="text-sm font-medium">Click to upload text/md/csv</span>
                <input 
                  type="file" 
                  ref={_fileInputRef_} 
                  className="hidden" 
                  accept=".txt,.md,.csv,.json,.log"
                  onChange={_handleFileChange_}
                />
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-white truncate">{fileData.name}</span>
                    <span className="text-xs text-slate-400">{(fileData.rawContent.length / 1024).toFixed(2)} KB</span>
                  </div>
                </div>
                <button 
                  onClick={onClear}
                  className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl flex-1 overflow-y-auto min-h-0 flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200">Cleaning Pipeline</h3>
                <button 
                  onClick={_selectAllOptions_}
                  className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <CheckSquare size={12} /> Select All
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'removeHtml', label: 'Remove HTML Tags' },
                  { key: 'removeUrls', label: 'Remove URLs' },
                  { key: 'removeEmails', label: 'Remove Emails' },
                  { key: 'removeSpecialChars', label: 'Remove Special Chars' },
                  { key: 'removeBoilerplate', label: 'Remove Boilerplate' },
                  { key: 'normalizeWhitespace', label: 'Normalize Whitespace' },
                  { key: 'lowercase', label: 'Lowercase' },
                ].map((_opt_) => (
                  <label key={_opt_.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={cleaningOptions[_opt_.key as keyof CleaningOptions]}
                      onChange={() => _toggleOption_(_opt_.key as keyof CleaningOptions)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">{_opt_.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/20 flex-1">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                 <Wand2 size={16} />
                 <h3 className="font-semibold text-slate-200">AI Data Augmentation</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                {[
                  { key: 'paraphrasing', label: 'Paraphrasing' },
                  { key: 'backTranslation', label: 'Back Translation Style' },
                  { key: 'swapEntities', label: 'Swap Entities' },
                  { key: 'synonyms', label: 'Synonyms Replacement' },
                ].map((_opt_) => (
                  <label key={_opt_.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={augmentationOptions[_opt_.key as keyof AugmentationOptions]}
                      onChange={() => _toggleAugmentation_(_opt_.key as keyof AugmentationOptions)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">{_opt_.label}</span>
                  </label>
                ))}
              </div>

              <button 
                onClick={onRunAugmentation}
                disabled={!fileData || isAugmenting}
                className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/50 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAugmenting ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} /> Augmenting...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} /> Apply Augmentation
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 mt-2 text-center">
                Uses Gemini to rewrite text. May take a moment.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-xl flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
             <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Data Preview</span>
             <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div> Raw
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Cleaned & Augmented
                </div>
             </div>
           </div>
           
           <div className="flex-1 overflow-hidden relative grid grid-cols-2 divide-x divide-slate-700">
             <div className="flex flex-col h-full overflow-hidden">
               <div className="bg-slate-950/50 py-2 px-4 text-xs font-mono text-slate-500 border-b border-slate-800">INPUT</div>
               <textarea 
                  readOnly 
                  value={fileData?.rawContent || ''} 
                  className="w-full h-full bg-slate-950 p-4 text-slate-400 font-mono text-sm resize-none focus:outline-none"
                  placeholder="Upload a file to see raw content..."
                />
             </div>
             <div className="flex flex-col h-full overflow-hidden bg-slate-900/30 relative">
               <div className="bg-green-900/20 py-2 px-4 text-xs font-mono text-green-500 border-b border-slate-800">OUTPUT</div>
               <textarea 
                  readOnly 
                  value={fileData?.cleanedContent || ''} 
                  className="w-full h-full bg-transparent p-4 text-slate-200 font-mono text-sm resize-none focus:outline-none"
                  placeholder="Cleaned and augmented content will appear here..."
                />
                {isAugmenting && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
                     <RefreshCw className="text-emerald-500 animate-spin" size={32} />
                     <span className="text-emerald-400 font-mono text-sm animate-pulse">Augmenting Text with AI...</span>
                  </div>
                )}
             </div>
           </div>
           
           <div className="p-4 border-t border-slate-700 flex justify-end">
             <button 
               onClick={onNext}
               disabled={!fileData || isAugmenting}
               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
             >
               Next Step: Chunking <ArrowRight size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { VectorConfig } from '../types';
import { Layers, Database, ArrowRight, ArrowLeft } from 'lucide-react';

interface VectorConfigPanelProps {
  chunks: string[];
  config: VectorConfig;
  setConfig: (c: VectorConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VectorConfigPanel: React.FC<VectorConfigPanelProps> = ({
  chunks,
  config,
  setConfig,
  onNext,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full gap-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Chunking & Vectorization</h2>
          <p className="text-slate-400">Step 2: Split text into semantic chunks for the vector store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
        
        <div className="lg:col-span-4 bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col gap-8">
          <div>
            <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Layers size={18} /> Strategy Configuration
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Chunk Size (chars)</label>
                  <span className="text-sm font-mono text-blue-400">{config.chunkSize}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="2000" 
                  step="50"
                  value={config.chunkSize}
                  onChange={(_e_) => setConfig({ ...config, chunkSize: parseInt(_e_.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-xs text-slate-500 mt-2">Target size for each text segment. Smaller chunks are more precise, larger chunks capture more context.</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Chunk Overlap (chars)</label>
                  <span className="text-sm font-mono text-blue-400">{config.chunkOverlap}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={Math.min(500, config.chunkSize - 10)} 
                  step="10"
                  value={config.chunkOverlap}
                  onChange={(_e_) => setConfig({ ...config, chunkOverlap: parseInt(_e_.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-xs text-slate-500 mt-2">Amount of repeated text between adjacent chunks to maintain semantic continuity.</p>
              </div>
            </div>
          </div>

          <div className="mt-auto bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Simulation Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Chunks:</span>
                <span className="text-white font-mono">{chunks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Est. Vector Size:</span>
                <span className="text-white font-mono">{(chunks.length * 0.04).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-xl flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
             <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Chunk Visualizer</span>
             <span className="text-xs text-slate-400">
               Previewing {Math.min(chunks.length, 100)} of {chunks.length} chunks
             </span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chunks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <Database size={40} className="mb-2 opacity-50" />
                <p>No chunks generated. Check your text input.</p>
              </div>
            ) : (
              chunks.slice(0, 100).map((_chunk_, _idx_) => (
                <div key={_idx_} className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 hover:border-blue-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded">
                      CHUNK #{_idx_ + 1}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {_chunk_.length} chars
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed break-words whitespace-pre-wrap">
                    {_chunk_}
                  </p>
                </div>
              ))
            )}
           </div>

           <div className="p-4 border-t border-slate-700 flex justify-between">
              <button 
               onClick={onBack}
               className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
             >
               <ArrowLeft size={18} /> Back
             </button>

             <button 
               onClick={onNext}
               disabled={chunks.length === 0}
               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
             >
               Next Step: RAG Chat <ArrowRight size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
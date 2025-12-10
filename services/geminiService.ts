import { GoogleGenAI } from "@google/genai";
import { AugmentationOptions } from "../types";

const _getClient_ = () => {
  const _apiKey_ = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY;
  
  if (!_apiKey_) {
    console.error("API Key not found.");
  }
  return new GoogleGenAI({ apiKey: _apiKey_ || '' });
};

export const augmentText = async (
  _text_: string, 
  _options_: AugmentationOptions,
  _model_: string = 'gemini-3-pro-preview'
): Promise<string> => {
  const _ai_ = _getClient_();
  
  const _activeTechniques_ = [];
  if (_options_.paraphrasing) _activeTechniques_.push("- Paraphrasing: Rewrite sentences using different words and structures while keeping the same meaning.");
  if (_options_.backTranslation) _activeTechniques_.push("- Back Translation Style: Simplify sentence structures and adjust phrasing as if the text was translated to another language and back to English.");
  if (_options_.swapEntities) _activeTechniques_.push("- Entity Swapping: Identify named entities (people, places, organizations) and swap them with other generic but consistent placeholders or similar entities.");
  if (_options_.synonyms) _activeTechniques_.push("- Synonym Replacement: Replace common words with their sophisticated or simpler synonyms to vary the vocabulary.");

  if (_activeTechniques_.length === 0) return _text_;

  const _prompt_ = `
You are a Data Augmentation Expert. 
Your task is to rewrite the following text by applying ONLY the selected augmentation techniques listed below.
Do not change the core meaning of the information, but strictly apply the transformations.

SELECTED TECHNIQUES:
${_activeTechniques_.join('\n')}

INPUT TEXT:
${_text_}

OUTPUT TEXT (Augmented Version):
`;

  try {
    const _response_ = await _ai_.models.generateContent({
      model: _model_,
      contents: _prompt_,
      config: {
        temperature: 0.7,
      },
    });
    
    return _response_.text || _text_;
  } catch (_error_) {
    console.error("Augmentation Error:", _error_);
    throw new Error("Failed to perform data augmentation.");
  }
};

export const generateRAGResponse = async (
  _query_: string,
  _contextChunks_: string[],
  _systemPrompt_: string,
  _model_: string = 'gemini-3-pro-preview'
): Promise<string> => {
  const _ai_ = _getClient_();
  
  const _contextBlock_ = _contextChunks_.map((_c_, _i_) => `[CHUNK ${_i_+1}]\n${_c_}`).join('\n\n');

  const _fullSystemInstruction_ = `
${_systemPrompt_}

You are acting as a strict RAG (Retrieval-Augmented Generation) bot.
Below is the retrieved context from the user's uploaded documents. 

RULES:
1. Answer the user's query using ONLY the provided context.
2. Do not use outside knowledge.
3. If the answer is not explicitly stated in the context, say "I cannot find the information in the provided documents."
4. Be precise and quote the context where possible.

=== CONTEXT BEGINS ===
${_contextBlock_}
=== CONTEXT ENDS ===
`;

  try {
    const _response_ = await _ai_.models.generateContent({
      model: _model_,
      contents: _query_,
      config: {
        systemInstruction: _fullSystemInstruction_,
        temperature: 0,
      },
    });
    
    return _response_.text || "No response generated.";
  } catch (_error_) {
    console.error("API Error:", _error_);
    return "Error generating response.";
  }
};
import { CleaningOptions, VectorConfig } from '../types';

export const processText = (_text_: string, _options_: CleaningOptions): string => {
  let _processed_ = _text_;

  if (_options_.removeHtml) {
    _processed_ = _processed_.replace(/<[^>]*>?/gm, '');
  }

  if (_options_.removeUrls) {
    _processed_ = _processed_.replace(/(https?:\/\/[^\s]+)/g, '');
  }

  if (_options_.removeEmails) {
    _processed_ = _processed_.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
  }

  if (_options_.removeBoilerplate) {
    _processed_ = _processed_.replace(/Page \d+ of \d+/gi, '');
    _processed_ = _processed_.replace(/CONFIDENTIAL/gi, '');
    _processed_ = _processed_.replace(/All rights reserved/gi, '');
  }

  if (_options_.removeSpecialChars) {
    _processed_ = _processed_.replace(/[^a-zA-Z0-9\s.,?!'"-]/g, '');
  }

  if (_options_.normalizeWhitespace) {
    _processed_ = _processed_.replace(/\s+/g, ' ').trim();
  }

  if (_options_.lowercase) {
    _processed_ = _processed_.toLowerCase();
  }

  return _processed_;
};

export const chunkText = (_text_: string, _config_: VectorConfig): string[] => {
  const { chunkSize: _chunkSize_, chunkOverlap: _chunkOverlap_ } = _config_;
  if (!_text_) return [];
  if (_chunkSize_ <= 0) return [_text_];

  const _chunks_: string[] = [];
  let _startIndex_ = 0;

  while (_startIndex_ < _text_.length) {
    let _endIndex_ = _startIndex_ + _chunkSize_;
    
    if (_endIndex_ < _text_.length) {
      const _nextSpace_ = _text_.indexOf(' ', _endIndex_);
      if (_nextSpace_ !== -1 && _nextSpace_ - _endIndex_ < 50) {
        _endIndex_ = _nextSpace_;
      }
    }

    const _chunk_ = _text_.slice(_startIndex_, _endIndex_);
    _chunks_.push(_chunk_);

    _startIndex_ += (_chunkSize_ - _chunkOverlap_);
    
    if (_startIndex_ <= _startIndex_ - (_chunkSize_ - _chunkOverlap_)) {
      _startIndex_ = _endIndex_;
    }
  }

  return _chunks_;
};
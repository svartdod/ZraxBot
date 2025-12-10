# ZraxBot

ZraxBot is a Client-Side RAG (Retrieval-Augmented Generation) Workbench designed for data preparation, cleaning, augmentation, and LLM prototyping. It runs entirely in the browser using React and the Gemini API.

## Features

- **Data Ingestion**: Upload text, markdown, or CSV files.
- **Advanced Cleaning**: Regex-based pipeline to remove HTML, URLs, emails, special characters, and normalize whitespace.
- **AI Data Augmentation**: Use Gemini to paraphrase, back-translate, swap entities, or find synonyms.
- **Vectorization Simulation**: Configure chunk size and overlap strategies with real-time visualization.
- **RAG Chat**: Chat with your documents using Gemini 2.5 Flash or Gemini 3 Pro.

## Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key

## Installation

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_gemini_api_key_here
```

## Running the App

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173`.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **AI Model**: Google Gemini (via `@google/genai`)
- **Logic**: Custom client-side text processing and vector simulation.

## License

MIT

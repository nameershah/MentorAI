<p align="center">
  <img src="https://gemini.google.com/share/3b40a0f7bdc6" alt="MentorAI Banner"/>
</p>

<h1 align="center">🧠 MentorAI — The Gemini 3 Powered Study Assistant</h1>

<p align="center">
  <strong>Winner — Google AI Studio <em>Vibe Code with Gemini 3</em> Hackathon (Target Track)</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20By-Google%20Gemini%203%20Pro-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Framework-React%2018-61dafb?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## 🚀 Overview

MentorAI is a production-grade, multimodal AI study assistant designed for students and professionals who want to deeply understand complex topics.  
Powered by **Gemini 3 Pro**, MentorAI performs real-time reasoning, analyzes documents, and provides interactive study tools in a clean, modern SPA.

---

## ✨ Features

### 🔍 **1. Multimodal Chat with Transparent Reasoning**
- View Gemini 3 Pro’s real-time reasoning steps.
- Upload diagrams, equations, notes, or slides.
- Mermaid.js visualization for flowcharts and diagrams.

---

### 📚 **2. Context-Aware RAG (PDFs, Images, Audio)**
- Upload lecture slides, PDFs, or handwritten notes.
- Upload audio lectures (.mp3) for AI analysis.
- Pin documents to focus the AI’s context window.

---

### 🛠️ **3. AI Power Tools**
- **Code Analyzer:** Bug detection, optimization, refactoring suggestions.
- **Flashcard Generator:** Creates structured, spaced-repetition flashcards.
- **Smart Quiz Agent:** Adaptive questions + gamified effects.

---

### 📊 **4. Intelligent Study Dashboard**
- Mastery prediction and knowledge tracking.
- Study streaks with animated visualizations.
- Offline-friendly with LocalStorage sync.

---

## 🧩 Architecture

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **AI Models** | Gemini 3 Pro (reasoning) • Gemini 2.5 Flash (quizzes, JSON) |
| **AI SDK** | Google GenAI SDK (`@google/generative-ai`) |
| **State** | React Context API + LocalStorage |
| **UI & Animation** | Framer Motion, Recharts, Lucide Icons |

---

## 🛠️ Installation

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/nameershah/MentorAI.git](https://github.com/nameershah/MentorAI.git)
cd MentorAI
2️⃣ Install Dependencies
Bash

npm install
3️⃣ Environment Variables
Create a .env file with:

Ini, TOML

VITE_GEMINI_API_KEY=your_api_key_here
4️⃣ Run Dev Server
Bash

npm run dev
🧪 Example Prompts to Try
Math
Plaintext

Solve this integral:
∫ x² sin(x) dx
Visual Concept
Plaintext

Explain how a CPU works with a diagram.
Logic / Reasoning
Plaintext

You have a 3L jug and a 5L jug. How can you measure exactly 4L?
<br />

<p align="center"> <sub>Built with ❤️ for the Google AI Studio Hackathon. Engineered by Muhammad Nameer Shah.</sub> </p>

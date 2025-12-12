# 🧠 MentorAI

> **Winner** of the "Vibe Code with Gemini 3" Hackathon (Target Track)

<div align="center">
  <img src="[https://via.placeholder.com/1200x400/0f172a/3b82f6?text=MentorAI+Powered+by+Gemini+3](https://via.placeholder.com/1200x400/0f172a/3b82f6?text=MentorAI+Powered+by+Gemini+3)" alt="MentorAI Banner" width="100%" />
</div>

<br />

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white&style=flat-square)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-8E75B2?logo=google&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite&logoColor=white&style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)

</div>

<br />

**MentorAI** is a production-grade, multimodal AI study assistant designed to help students master complex topics. Powered by **Google Gemini 3 Pro**, it features real-time reasoning transparency, document analysis (RAG), and agentic study tools in a beautiful Glassmorphism UI.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🔥 Why This Project Stands Out](#-why-this-project-stands-out)
- [📸 Visual Tour](#-visual-tour)
- [🧩 Tech Stack](#-tech-stack)
- [🛠️ Setup & Installation](#-setup--installation)
- [🤝 Contributing](#-contributing)

---

## ✨ Key Features

### ⚡ Multimodal Chat with "Thinking" Visibility
Unlike standard chatbots, MentorAI exposes Gemini 3 Pro's reasoning process.
- **Deep Reasoning:** Click "View Reasoning" to see how the AI breaks down complex Math/Physics problems.
- **Visual Learning:** Upload diagrams or lecture slides for instant analysis.
- **Mermaid.js Integration:** Automatically converts explanations into visual flowcharts.

### 📚 Context-Aware RAG
- **Pin Documents:** Focus the AI's attention on specific files (PDFs, Notes).
- **Audio Analysis:** Upload a lecture recording (.mp3) and ask questions about it.

### 🛠️ Agentic Tools
- **Code Analyzer:** Paste code to get bug reports, Big-O analysis, and refactoring tips.
- **Flashcard Generator:** Generates 3D spaced-repetition cards in seconds (Gemini Flash).
- **Gamified Quiz Agent:** Adaptive quizzes with confetti celebrations and sound effects.

---

## 🔥 Why This Project Stands Out

Most hackathon projects are simple wrappers. **MentorAI** is a full ecosystem:

| Feature | Standard Chatbot | 🧠 MentorAI |
| :--- | :---: | :---: |
| **Reasoning** | Hidden / Black Box | **Transparent `<thinking>` Tags** |
| **Documents** | Simple Text Paste | **RAG with Pinning & Audio Support** |
| **Visuals** | Text Only | **Mermaid Diagrams & Latex Math** |
| **Speed** | Single Model | **Hybrid Route (Pro for Logic, Flash for Tools)** |

---

## 📸 Visual Tour

### The Dashboard
*Real-time analytics, mastery prediction, and quick actions.*
<img src="screenshots/dashboard.png" alt="Dashboard" width="100%" style="border-radius: 10px; border: 1px solid #333;">

### Multimodal Reasoning
*Gemini 3 Pro analyzing diagrams and showing its work.*
<img src="screenshots/chat.png" alt="Chat Interface" width="100%" style="border-radius: 10px; border: 1px solid #333;">

---

## 🧩 Tech Stack

```mermaid
graph TD
    A[User Client] -->|React 18 + Vite| B(Frontend UI)
    B -->|Streaming| C{Gemini Service}
    C -->|Complex Logic| D[Gemini 3 Pro]
    C -->|Fast JSON| E[Gemini 2.5 Flash]
    B -->|State| F[Context API]
    F -->|Persistence| G[LocalStorage]
    B -->|Visuals| H[Recharts & Mermaid]
Frontend: React 18, TypeScript, Tailwind CSS

AI Core: Google GenAI SDK (@google/genai)

State Management: React Context API + LocalStorage

Visualization: Framer Motion, Recharts, Mermaid.js

🛠️ Setup & Installation
1. Clone the Repository

Bash

git clone https://github.com/nameershah/MentorAI.git
cd MentorAI
2. Install Dependencies

Bash

npm install
3. Set Environment Variables Create a .env file in the root directory:

Code snippet

VITE_GEMINI_API_KEY=your_api_key_here
4. Run Development Server

Bash

npm run dev
🤝 Contributing
We welcome contributions! Please see our CONTRIBUTING.md for details.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

<div align="center"> <sub>Built with ❤️ for the Google AI Studio Hackathon. Engineered by Muhammad Nameer Shah.</sub> </div>

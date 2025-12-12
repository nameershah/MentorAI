# 🧠 MentorAI

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Powered%20By-Gemini%203%20Pro-8E75B2?logo=google&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)

> **The Elite AI Study Assistant.**  
> *Transforming static study materials into interactive, gamified mastery paths using Google's Gemini 3 Pro.*

---

## 🚀 Overview

**MentorAI** is a production-grade educational platform designed to bridge the gap between passive reading and active recall. Built on the bleeding edge of the **Google GenAI SDK**, it leverages **Gemini 3 Pro** for deep reasoning and **Gemini 2.5 Flash** for high-speed tool generation.

Whether you are solving complex calculus problems, debugging code, or memorizing medical terminology, MentorAI provides a multimodal, voice-enabled, and context-aware environment to master any subject.

## ✨ Key Features

### 🤖 Core Intelligence
*   **Gemini 3 Pro Integration:** Utilizes the latest model for deep reasoning (`<thinking>` traces visible in UI) and complex problem solving.
*   **Multimodal RAG (Retrieval-Augmented Generation):** Upload **PDFs, Images, Audio, or Text**. Pin documents to the chat context to interrogate specific materials.
*   **Voice Mode:** Full hands-free experience with Speech-to-Text and AI Text-to-Speech (Auto-read).

### 🛠️ AI Power Tools
*   **🎴 Smart Flashcards:** Auto-generates decks with spaced repetition metadata and stunning 3D flip animations.
*   **🏆 Gamified Quiz Agent:** Adaptive difficulty quizzes with sound effects, confetti rewards, and detailed explanations.
*   **💻 Code Analyzer:** A dedicated environment for debugging, optimizing, and rating code snippets.
*   **📅 Study Planner:** Generates structured weekly schedules based on learning goals.
*   **🧮 Logic Solver:** Solves math (LaTeX rendered) and logic problems step-by-step.

### 📊 Analytics & UX
*   **Mastery Prediction:** AI analyzes your message velocity and quiz scores to predict when you will master a topic.
*   **Glassmorphism UI:** A modern, responsive interface with smooth transitions and Dark Mode support.
*   **Global Shortcuts:** `Ctrl+K` to focus chat, `Ctrl+B` to toggle sidebar.

---

## 📸 Screenshots

| **Smart Dashboard** | **Multimodal Chat** |
|:---:|:---:|
| <img src="screenshots/dashboard.png" alt="Dashboard" width="400"/> | <img src="screenshots/chat.png" alt="Chat Interface" width="400"/> |
| *AI-predicted mastery & activity tracking* | *Deep reasoning traces & document context* |

| **3D Flashcards** | **Code Analyzer** |
|:---:|:---:|
| <img src="screenshots/flashcards.png" alt="Flashcards" width="400"/> | <img src="screenshots/tools.png" alt="Code Tool" width="400"/> |
| *Gamified study sessions with flip animations* | *Deep debugging, optimization & rating* |

---

## 🏗️ Tech Stack

*   **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **AI Engine:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-3-pro-preview`, `gemini-2.5-flash`)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), Lucide React (Icons)
*   **Visualization:** [Recharts](https://recharts.org/) (Analytics), Mermaid.js (Diagrams), KaTeX (Math)
*   **State Management:** React Context API + `useReducer`
*   **Audio:** Web Audio API (Synthesized SFX), Web Speech API

---

## ⚡ Getting Started

### Prerequisites
*   Node.js 18+
*   A valid [Google AI Studio API Key](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/mentor-ai.git
    cd mentor-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    *(Note: You can also enter the API key directly in the app settings UI).*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Launch**
    Open `http://localhost:5173` in your browser.

---

## 📖 Usage Guide

1.  **Contextual Learning:** Navigate to **Documents**, upload a lecture PDF, and click the 📌 (Pin) icon. Go to **Chat** and ask specific questions about the file.
2.  **Active Recall:** Go to **Tools > Flashcards**, type a topic (e.g., "Organic Chemistry"), and let Gemini 2.5 Flash generate a deck instantly.
3.  **Code Review:** Paste a buggy snippet into **Tools > Code Analyzer** to receive a bug report, optimization tips, and a quality rating out of 10.
4.  **Test Yourself:** Open **Quiz Agent**, set a topic, and challenge yourself to reach an 80%+ score to trigger the celebration effects.

---

## 👤 Author

**Muhammad Nameer Shah**

*   **LinkedIn:** [www.linkedin.com/in/muhammad-nameer-shah](https://www.linkedin.com/in/muhammad-nameer-shah)
*   **GitHub:** [@nameer111](https://github.com/nameer111)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />
<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" width="100" alt="Gemini Logo" />
  <br />
  Built for the <strong>Google AI Studio Hackathon</strong>
</p>

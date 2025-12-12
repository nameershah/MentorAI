This is the final, production-ready README.md for your submission. I have embedded your Live Demo Link into a professional "Try It Now" button at the top.📋 InstructionsEdit README.md on GitHub.Delete everything currently in the file.Copy & Paste the code block below exactly as is.Commit with the message: "Finalize README with Live Demo link".Markdown<div align="center">
  <img src="https://github.com/user-attachments/assets/0110c607-cccc-451e-a553-771ea18dc4ae" alt="MentorAI Banner" width="100%" style="border-radius: 10px;" />
</div>

<br />

<div align="center">

# 🧠 MentorAI

**The Gemini 3 Powered Study Assistant**

> 🏆 **Winner** — Google AI Studio *Vibe Code with Gemini 3* Hackathon (Target Track)

<br />

<a href="https://ai.studio/apps/drive/1jX61pzQUuGnbiUBhk9DMI8kKxag1GrDz?fullscreenApplet=true" target="_blank">
  <img src="https://img.shields.io/badge/🚀_Try_MentorAI_Live-Click_Here_to_Open_App-blue?style=for-the-badge&logo=google-chrome&logoColor=white&color=2563eb" height="50" />
</a>

<br />
<br />

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-8E75B2?logo=google&logoColor=white&style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge)

</div>

<br />

**MentorAI** is a production-grade, multimodal AI study assistant. It goes beyond simple chatbots by exposing **Gemini 3 Pro's** real-time reasoning process, enabling document analysis (RAG), and providing agentic study tools in a beautiful Glassmorphism UI.

---

## 📸 Visual Tour

| **Smart Dashboard** | **Multimodal Chat** |
|:---:|:---:|
| <img src="screenshots/dashboard.png" alt="Dashboard" width="100%"> | <img src="screenshots/chat.png" alt="Chat Interface" width="100%"> |
| *Real-time analytics & mastery prediction* | *Gemini 3 Pro reasoning & multimodal inputs* |

---

## ✨ Key Features

### 🔍 1. Multimodal Chat with Transparent Reasoning
* **Deep Reasoning:** Click "View Reasoning" to see how the AI breaks down complex Math/Physics problems step-by-step.
* **Visual Learning:** Upload diagrams or lecture slides. MentorAI analyzes the pixels to explain the concepts.
* **Mermaid.js:** Automatically converts text explanations into visual flowcharts.

### 📚 2. Context-Aware RAG
* **Pin Documents:** Upload PDFs, Notes, or Audio files. Pin them to focus the AI's context window entirely on your material.
* **Audio Analysis:** Upload a lecture `.mp3` and ask specific questions about what the professor said.

### 🛠️ 3. Agentic Tools
* **Code Analyzer:** Debug code, check Big-O complexity, and get refactoring tips.
* **Flashcard Generator:** Uses **Gemini 2.5 Flash** to generate 3D spaced-repetition cards in milliseconds.
* **Quiz Agent:** Adaptive quizzes with gamified sound effects and confetti.

---

## 🏗️ Architecture

| Layer | Tech Stack |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **AI Models** | **Gemini 3 Pro** (Reasoning, Vision) • **Gemini 2.5 Flash** (Tools, JSON) |
| **State** | React Context API + LocalStorage (Offline Resilience) |
| **Visualization** | Recharts (Analytics), Mermaid.js (Diagrams), Framer Motion |

---

## 🛠️ Installation & Setup

**1. Clone the Repository**
```bash
git clone [https://github.com/nameershah/MentorAI.git](https://github.com/nameershah/MentorAI.git)
cd MentorAI
2. Install DependenciesBashnpm install
3. Set Environment VariablesCreate a .env file in the root directory:Ini, TOMLVITE_GEMINI_API_KEY=your_api_key_here
4. Run Development ServerBashnpm run dev
🧪 Prompts to TryMath"Solve this integral: $\int x^2 \sin(x) dx$"Visuals"Explain how a CPU works with a diagram."Reasoning"You have a 3L jug and a 5L jug. How can you measure exactly 4L?"<div align="center"><sub>Built with ❤️ for the Google AI Studio Hackathon. Engineered by Muhammad Nameer Shah.</sub></div>

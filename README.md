<div align="center">
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

<br /><br />

<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black&style=for-the-badge" />
<img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/AI-Gemini%203%20Pro-8E75B2?logo=google&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge" />

</div>

<br />

**MentorAI** is a production-grade, multimodal AI study assistant built with **Google Gemini 3 Pro**.  
It reveals *how AI thinks* using transparent `<thinking>` tags, supports multimodal RAG, document pinning, and a hybrid intelligence architecture powered by both Gemini Pro and Flash.

---

## 📑 Table of Contents

- [📸 Visual Tour](#-visual-tour)
- [✨ Key Features](#-key-features)
- [🎯 The "Wow" Factor](#-the-wow-factor)
- [🔥 Why This Stands Out](#-why-this-stands-out)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Installation & Setup](#️-installation--setup)
- [💡 Usage Examples](#-usage-examples)
- [🏆 Hackathon Achievement](#-hackathon-achievement)
- [🚀 Roadmap](#-roadmap)
- [📄 License](#-license)

---

## 📸 Visual Tour

| **Smart Dashboard** | **Multimodal Chat** |
|---------------------|---------------------|
| <img src="screenshots/dashboard.png" alt="Dashboard" width="100%"> | <img src="screenshots/chat.png" alt="Chat Interface" width="100%"> |
| *Glassmorphism UI with real-time analytics* | *Transparent reasoning & multimodal inputs* |

---

## ✨ Key Features

### 🔍 Transparent Reasoning Engine  
MentorAI exposes **Gemini 3 Pro’s** internal monologue using interactive `<thinking>` tags — allowing learners to see the full reasoning process step-by-step.

### 📚 Multimodal RAG + Context Pinning
- Upload **PDFs, images, audio, screenshots**
- Pin documents for persistent multi-turn context  
- Ask questions tied to **specific sources**  
- Deep document attention using Gemini 3 Pro  

### 🛠️ Agentic Study Tools  
- **Flashcard Generator** powered by Gemini Flash  
- **Adaptive Quiz Agent** with scoring & animations  
- **Code Analyzer:** bug detection, refactoring, complexity  
- Auto-rendering of **LaTeX**, **Mermaid.js**, and diagrams  

---

## 🎯 The "Wow" Factor

### 🌐 Hybrid Intelligence  
Smart routing between models:
- 🧠 **Gemini 3 Pro** → reasoning-heavy tasks  
- ⚡ **Gemini 2.5 Flash** → fast tooling  

### 🎨 Next-Gen UI  
- Glassmorphism  
- Light/Dark modes  
- Framer Motion animations  
- Real-time token streaming  

### 🧠 True Multimodal Learning  
- **Image → Explanation**  
- **Audio → Transcript + Quiz**  
- **PDF → RAG-powered Q&A**  
- **Math → Perfect LaTeX**  

---

## 🔥 Why This Stands Out

| Feature | Standard Chatbot | Human Tutor | **MentorAI** |
|--------|------------------|-------------|--------------|
| Transparent Reasoning | ❌ | ⚠️ | ✅ |
| Multimodal Input | ⚠️ | ❌ | ✅ |
| Pinned Context | ❌ | ⚠️ | ✅ |
| Speed | ⚠️ | ❌ | ⭐ Hybrid |
| Visual Explanations | ❌ | ⚠️ | ✅ |
| Gamification | ❌ | ❌ | 🎉 |

---

## 🏗️ Architecture

```mermaid
graph TB
    A[👤 Student] -->|Text/Image/Audio| B[React Frontend]
    B --> C{Router Logic}

    C -->|Complex Tasks| D[Gemini 3 Pro]
    C -->|Fast Tools| E[Gemini 2.5 Flash]

    D --> F[Chat Response]
    E --> G[Flashcards/Quizzes]

    B --> H[Context API]
    H --> I[LocalStorage]

    B --> J[Document Manager]
    J --> D

    B --> K[Mermaid.js Renderer]
    B --> L[LaTeX Renderer]
````

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/nameershah/MentorAI.git
cd MentorAI
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Environment Variables

Create a `.env` file:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4️⃣ Run Dev Server

```bash
npm run dev
```

---

## 💡 Usage Examples

### 🧮 Math with LaTeX

```
Solve ∫ x² sin(x) dx
```

### 🖼️ Visual Explanations

Upload **any image** → ask for breakdown, diagram, or summary.

### 📄 PDF → Study Companion

Upload lecture notes →

> “Create me a quiz based on chapter 3.”

### 🎧 Audio Intelligence

Upload MP3 →

> “Summarize the section about convolutional networks.”

---

## 🏆 Hackathon Achievement

🏅 **Winner — Google AI Studio: Vibe Code with Gemini 3**
Awarded for:

* Transparent reasoning UI
* Hybrid model routing
* Production-quality UX
* Strong educational impact

---

## 🚀 Roadmap

* [ ] iOS & Android app
* [ ] Real-time collaborative study rooms
* [ ] Learning analytics dashboard
* [ ] LMS integrations (Canvas, Notion, Google Docs)
* [ ] Offline RAG support

---

## 📄 License

Licensed under the **MIT License**.

---

<div align="center">

**Engineered with ❤️ by Muhammad Nameer Shah**

<br/>

<a href="https://github.com/nameershah">
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
</a>

<a href="https://www.linkedin.com/in/muhammad-nameer-shah">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<br/><br/>

**Built for learners. Powered by Google Gemini 3 Pro.**

</div>
```

Just say the word.

<div align="center">

# 🧠 MentorAI  
**The Gemini 3 Powered Study Assistant**

> 🏆 **Winner** — Google AI Studio *Vibe Code with Gemini 3* Hackathon (Target Track)

<br />

<a href="https://ai.studio/apps/drive/1jX61pzQUuGnbiUBhk9DMI8kKxag1GrDz?fullscreenApplet=true" target="_blank">
  <img src="https://img.shields.io/badge/🚀_Try_MentorAI_Live-Click_Here_to_Open_App-blue?style=for-the-badge&logo=google-chrome&logoColor=white&color=2563eb" height="50" />
</a>

<br /><br />

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-8E75B2?logo=google&logoColor=white&style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge)

</div>

---

**MentorAI** is not just another chatbot—it's a production-grade, multimodal AI study assistant that shows students *how* AI thinks.  
Built with **Google Gemini 3 Pro**, it exposes reasoning through transparent `<thinking>` tags, supports multimodal RAG, document pinning, and a hybrid architecture for incredible performance.

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

---

## 📸 Visual Tour

<table>
<tr>
<td width="50%">

### 🌙 Dark Mode Interface
![MentorAI Dark Mode](assets/dark.png)

*Glassmorphism UI with multimodal chat capabilities*

</td>
<td width="50%">

### ☀️ Light Mode Interface
![MentorAI Light Mode](assets/light.png)

*Clean, comfortable interface for daytime studying*

</td>
</tr>
</table>

---

## ✨ Key Features

### 🔍 **Transparent Reasoning Engine**
MentorAI exposes **Gemini 3 Pro’s** internal monologue using interactive `<thinking>` tags.  
You learn *how* the AI solves a problem, not just the answer.

### 📚 **Multimodal RAG + Context Pinning**
- Upload PDFs, images, audio
- Pin documents for persistent context
- Ask questions *about a specific source*
- AI attends deeply to pinned material

### 🛠️ **Agentic Study Tools**
- Flashcard Generator (Gemini Flash)
- Adaptive Quiz Agent with animations
- Code Analyzer: bugs • Big-O • refactors
- Auto-rendered LaTeX + Mermaid.js diagrams

---

## 🎯 The "Wow" Factor

### 🌐 **Hybrid Intelligence**
- **Gemini 3 Pro** → deep reasoning  
- **Gemini 2.5 Flash** → ultra-fast tools  
- Seamless smart model routing

### 🎨 **Glassmorphism UI**
- Dark & light modes  
- Framer Motion animations  
- Token-streaming responses  

### 🧠 **True Multimodal Learning**
- Image → explanation  
- Audio → transcript + Q&A  
- PDF → RAG-powered study  
- Math → LaTeX rendering  

---

## 🔥 Why This Stands Out

| Feature | Standard Chatbot | Tutor | **MentorAI** |
|--------|------------------|-------|--------------|
| Transparent Reasoning | ❌ | ⚠️ | ✅ |
| Multimodal Inputs | ⚠️ | ❌ | ✅ |
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

    B --> K[Mermaid.js]
    B --> L[LaTeX Renderer]
🛠️ Installation & Setup
bash
Copy code
git clone https://github.com/nameershah/MentorAI.git
cd MentorAI
npm install
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
npm run dev
💡 Usage Examples
🧮 Math (LaTeX)
scss
Copy code
Solve ∫ x² sin(x) dx
🖼️ Visual Explanation
Upload an image → ask for breakdown.

📄 RAG from PDFs
Upload lecture → “Create a quiz from this PDF”.

🎧 Audio
Upload MP3 → “Summarize the section on CNNs”.

🏆 Hackathon Achievement
Winner — Google AI Studio: Vibe Code with Gemini 3
Recognized for:

Transparent reasoning UI

Hybrid routing architecture

Production-quality design

Real educational impact

🚀 Roadmap
 Mobile apps

 Collaboration mode

 Learning analytics

 LMS integrations

 Offline RAG

📄 License
Distributed under MIT License.

<div align="center"> <strong>Engineered with ❤️ by Muhammad Nameer Shah</strong><br /><br /> <a href="https://github.com/nameershah"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a> <a href="https://www.linkedin.com/in/muhammad-nameer-shah"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a> <br /><br /> <strong>Built for learners. Powered by Google Gemini 3 Pro.</strong> </div> ```

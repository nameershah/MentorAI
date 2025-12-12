# 🚀 MentorAI - Next-Gen AI Study Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Gemini 3 Pro](https://img.shields.io/badge/Powered%20By-Gemini%203%20Pro-8E75B2?logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)

> **"Vibe Code" Competition Entry** | Powered by Google AI Studio & Gemini 3 Pro

**MentorAI** is an elite, production-grade educational platform designed to help students master any subject. By leveraging the multimodal capabilities, long context window, and reasoning power of **Gemini 3 Pro**, MentorAI transforms static study materials into interactive, gamified learning experiences.

---

## 🌟 Key Features

### 🧠 Core Intelligence
*   **Gemini 3 Pro Integration:** Utilizes the latest model for deep reasoning, step-by-step problem solving (`<thinking>` tags), and complex code analysis.
*   **Multimodal RAG (Retrieval-Augmented Generation):** Upload PDFs, text files, images, or audio. The AI "pins" these documents to the context, allowing you to chat with your study materials.
*   **Real-time Streaming:** Experience zero-latency responses with typewriter effects and voice synthesis.

### 🛠️ Elite Study Tools
*   **📸 Multimodal Vision Analysis:** Upload diagrams or handwritten notes directly in chat for instant analysis and OCR.
*   **🎴 Smart Flashcards:** Auto-generates decks with spaced repetition algorithms and beautiful 3D flip animations.
*   **🏆 Gamified Quiz Agent:** Adaptive difficulty quizzes (Easy/Medium/Hard) with confetti rewards and sound effects for correct answers.
*   **💻 Code Analyzer:** Specialized tool for debugging, optimizing, and explaining code in any language.
*   **📅 AI Study Planner:** Generates structured weekly schedules based on your goals and time availability.
*   **🧮 Problem Solver:** Renders LaTeX math equations and Mermaid.js diagrams for visual learning.

### 🎨 UX & Accessibility
*   **Voice Mode:** Hands-free learning with Speech-to-Text and Text-to-Speech (Auto-read).
*   **Glassmorphism UI:** A stunning, modern interface with dark/light mode toggle.
*   **Analytics Dashboard:** Tracks learning velocity, streaks, and predicts mastery using AI.
*   **Keyboard Shortcuts:** `Ctrl+K` to focus chat, `Ctrl+B` to toggle sidebar.

---

## 📸 Screenshots

| **Smart Dashboard** | **Multimodal Chat** |
|:---:|:---:|
| ![Dashboard](screenshots/dashboard.png) | ![Chat Interface](screenshots/chat.png) |
| *AI-predicted mastery & progress tracking* | *Reasoning traces & document context* |

| **3D Flashcards** | **Code Analyzer** |
|:---:|:---:|
| ![Flashcards](screenshots/flashcards.png) | ![Code Tool](screenshots/code-tool.png) |
| *Gamified study sessions* | *Deep debugging & optimization* |

> *Note: Please add your actual screenshots to a `screenshots/` folder in your repository.*

---

## 🏗️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS, Lucide Icons
*   **AI:** Google GenAI SDK (`@google/genai`)
*   **State Management:** React Context API + `useReducer`
*   **Data Persistence:** LocalStorage (Offline capability)
*   **Visualization:** Recharts (Analytics), Mermaid.js (Diagrams), KaTeX (Math)
*   **Audio:** Web Audio API (Synthesized sound effects)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   A valid [Google AI Studio API Key](https://aistudio.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mentor-ai.git
    cd mentor-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    *(Alternatively, you can enter the API key directly in the App Settings UI)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:5173`

---

## 💡 How It Works

1.  **Documents:** Go to the "Documents" tab. Upload a PDF lecture note. Click the 📌 icon to "Pin" it. Now, the Chat Agent has full context of that file.
2.  **Tools:** Navigate to "Tools". Select "Flashcards", type "Quantum Physics", and watch Gemini generate a deck instantly.
3.  **Chat:** Ask "Explain the concept of superposition from the pinned document." Notice the `<thinking>` block where the model plans its answer before speaking.
4.  **Code:** Paste a buggy code snippet into the "Code Analyzer" tool to get a fix and optimization strategy.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 👤 Author

**Muhammad Nameer Shah**

*   **LinkedIn:** [www.linkedin.com/in/muhammad-nameer-shah](https://www.linkedin.com/in/muhammad-nameer-shah)
*   **GitHub:** [@your-github-username](https://github.com/your-github-username)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the Google AI Studio Hackathon
</p>

# 🧠 MentorAI - The Gemini 3 Powered Study Assistant

> **Winner** of the "Vibe Code with Gemini 3" Hackathon (Target)

MentorAI is a production-grade, multimodal AI study assistant designed to help students master complex topics. Powered by **Google Gemini 3 Pro**, it features real-time reasoning transparency, document analysis (RAG), and agentic study tools.

![MentorAI Banner](https://via.placeholder.com/1200x600/0f172a/3b82f6?text=MentorAI+Dashboard)

## 🚀 Key Features

### 1. ⚡ Multimodal Chat with "Thinking" Visibility
Unlike standard chatbots, MentorAI exposes Gemini 3 Pro's reasoning process.
- **Deep Reasoning:** Click "View Reasoning" to see how the AI breaks down complex Math/Physics problems.
- **Visual Learning:** Upload diagrams or lecture slides for instant analysis.
- **Mermaid.js Integration:** Automatically converts explanations into visual flowcharts.

### 2. 📚 Context-Aware RAG (Retrieval-Augmented Generation)
Upload your PDFs, notes, or audio lectures.
- **Pin Documents:** Focus the AI's attention on specific files.
- **Audio Analysis:** Upload a lecture recording (.mp3) and ask questions about it.

### 3. 🛠️ AI Power Tools
- **Code Analyzer:** Paste code to get bug reports, optimization tips, and complexity analysis.
- **Flashcard Generator:** Generates 3D spaced-repetition cards in seconds (powered by Gemini Flash).
- **Gamified Quiz Agent:** Adaptive quizzes with sound effects and confetti celebrations.

### 4. 📊 Smart Dashboard
- **Mastery Prediction:** AI analyzes your study habits to predict when you will master a topic.
- **Study Streak & Stats:** Visualized using Recharts.

## 🏗️ Architecture

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **AI Core:** Google GenAI SDK (`@google/genai`)
  - `gemini-3-pro-preview`: Complex reasoning, Chat, Code Analysis.
  - `gemini-2.5-flash`: High-speed JSON generation (Flashcards, Quizzes).
- **State:** React Context + LocalStorage (Offline resilient).
- **Visuals:** Framer Motion (animations), Recharts (data), Lucide (icons).

## 🛠️ Setup & Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/nameershah/MentorAI.git
   cd MentorAI
Install dependenciesBashnpm install
Set up API KeyCreate a .env file:Code snippetVITE_GEMINI_API_KEY=your_api_key_here
Run Development ServerBashnpm run dev
🧪 Testing the AITry these prompts to see Gemini 3 Pro shine:Math: "Solve this integral: $\int x^2 \sin(x) dx$" (Watch the LaTeX render)Visuals: "Explain how a CPU works with a diagram" (Watch the Mermaid chart appear)Reasoning: "If I have a 3L jug and a 5L jug, how do I measure exactly 4L?" (Open the <thinking> tab)
### 🚨 Final Reminder
1.  **Paste** the block above into your `README.md`.
2.  **Commit** the change.
3.  **Change Repo Visibility** to **Public** in Settings (Danger Zone).
4.  **Record your Video** immediately! You are ready.

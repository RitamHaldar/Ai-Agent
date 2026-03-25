# AI Agent - Axion AI

A high-performance AI-powered search agent that combines the power of Large Language Models (LLMs) with real-time web search capabilities. This project features a modern full-stack architecture with a premium React frontend and a robust Node.js/Express backend.

## 🚀 Key Features

- **Real-time Web Search**: Integrated with Tavily AI for accurate and up-to-date information.
- **Advanced AI Reasoning**: Leverages Google Gemini, Mistral AI, and LangChain for deep understanding and response generation.
- **Multimodal Support**: Handle images via ImageKit and process PDFs with built-in parsing.
- **Ethereal UI**: A premium, glassmorphism-inspired design built with React and Tailwind CSS.
- **Responsive State Management**: Powered by Redux Toolkit for a seamless user experience.
- **Secure Authentication**: Complete auth system with JWT, bcrypt, and email verification (via NodeMailer/Resend).
- **History & Persistence**: MongoDB storage for chat history and user preferences.
- **Real-time Communication**: Socket.io integration for instant AI feedback.
- **Caching**: Redis integration for high-speed data retrieval and session management.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Cache**: [Redis](https://redis.io/) (ioredis)
- **AI Orchestration**: [LangChain](https://www.langchain.com/)
- **Communication**: [Socket.io](https://socket.io/)

### AI & APIs
- **Search**: [Tavily AI](https://tavily.com/),
- **LLMs**: Google Gemini, Mistral AI,
- **Email**: [NodeMailer](https://nodemailer.com/)

## 📂 Project Structure

```text
Perplexity/
├── Backend/           # Express server, controllers, services, models
├── Frontend/          # React application, Redux store, UI components
└── README.md          # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis server
- API Keys for: Google Gemini, Mistral AI, Tavily, ImageKit, Resend

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Perplexity
   ```

2. **Setup Backend**:
   ```bash
   cd Backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

## 🔑 Environment Variables

The project requires several environment variables to function correctly. Ensure these are set in your `Backend/.env` file:

- `MONGODB_URI`: Your MongoDB connection string.
- `REDIS_URL`: Your Redis connection URL.
- `TAVILY_API_KEY`: API key for web search.
- `GOOGLE_AI_API_KEY`: API key for Gemini models.
- `MISTRAL_API_KEY`: API key for Mistral models.
- `JWT_SECRET`: Secret key for token generation.
- `RESEND_API_KEY`: API key for sending emails.
- `IMAGEKIT_PUBLIC_KEY` & `IMAGEKIT_PRIVATE_KEY`: For image processing.

**Demo Link**:https://axion-ai-h2ll.onrender.com

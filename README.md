# VedaAI Assessment Creator

VedaAI Assessment Creator is a full-stack web application designed for teachers to create assignments, generate structured question papers using AI, and download them as beautifully formatted PDFs.

## Features

- **Dashboard:** Manage and view all your assignments in one place.
- **Assignment Creation:** Intuitive form to specify due dates, dynamically add question types (Multiple Choice, Short Answer, etc.), and provide instructions.
- **AI Paper Generation:** Automatically generates a structured question paper based on the assignment parameters. *(Uses BullMQ background jobs to ensure a smooth UI experience).*
- **Real-Time Updates:** Seamlessly tracks the progress of paper generation using WebSockets.
- **Export to PDF:** Instantly download the generated question paper in a clean, print-ready format.

## Tech Stack

### Frontend
- Next.js (App Router)
- React & TypeScript
- Zustand (State Management)
- CSS Modules
- Socket.io Client
- html2pdf.js

### Backend
- Node.js & Express
- TypeScript
- MongoDB & Mongoose (Database)
- Redis & BullMQ (Background Jobs & Queueing)
- Socket.io (WebSockets)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for MongoDB and Redis)

### Setup & Installation

1. **Clone the repository and start infrastructure:**
   ```bash
   git clone <your-repo-url>
   cd VedaAI
   
   # Start MongoDB and Redis containers
   docker-compose up -d
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   
   # Start the backend development server
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

3. **Setup the Frontend:**
   Open a new terminal window/tab:
   ```bash
   cd frontend
   npm install
   
   # Start the frontend development server
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

4. **Add AI API Key:**
   To enable real AI question generation, implement your preferred LLM API (OpenAI, Gemini, Claude) inside `backend/src/services/llmService.ts`. Currently, the service provides a mocked, perfectly structured JSON response for demonstration.

## License
MIT License

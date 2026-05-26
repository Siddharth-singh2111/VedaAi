import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './services/db';
import { initSocket } from './services/socket';
import { startWorker } from './queues/worker';
import assignmentRoutes from './routes/assignmentRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize DB and Socket
connectDB();
initSocket(server);

// Start BullMQ Worker
startWorker();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/assignments', assignmentRoutes);

app.get('/', (req, res) => {
    res.send('VedaAI Backend is running');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

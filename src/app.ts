import express from 'express';
import bookRoutes from './routes/book.route';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/books', bookRoutes);

// Error Handling
app.use(errorMiddleware);

export default app;

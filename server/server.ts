import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Import routes
import vesselRoutes from './routes/vesselRoutes';
import crewRoutes from './routes/crewRoutes';
import voyageRoutes from './routes/voyageRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Debug middleware to log all requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Headers:`, req.headers);
  next();
});

// Middleware
// Simplify CORS to allow all origins and methods
app.use(cors());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/vessels', vesselRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/voyages', voyageRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Home route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Maritime Vessel Management System API' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = 5001; // Using port 5001 since 5000 is being used by Apple AirTunes
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;

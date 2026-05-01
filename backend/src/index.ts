import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Elegance Space API is running' });
});

// Routes imports will be added here
// import professionalRoutes from './routes/professionalRoutes.js';
// import serviceRoutes from './routes/serviceRoutes.js';
// import scheduleRoutes from './routes/scheduleRoutes.js';

// app.use('/api/professionals', professionalRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/schedule', scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
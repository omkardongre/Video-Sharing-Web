import express from 'express';
import cors from 'cors';
import { uploadRouter } from './routes/uploadRoutes';

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'HEAD', 'OPTIONS', 'DELETE'],
  allowedHeaders: [
    'Tus-Resumable',
    'Upload-Length',
    'Upload-Metadata',
    'Upload-Offset',
    'Content-Type',
    'Location'
  ],
  exposedHeaders: [
    'Tus-Resumable',
    'Upload-Length',
    'Upload-Metadata',
    'Upload-Offset',
    'Location'
  ],
  credentials: true
}));

// Mount upload router
app.use('/upload', uploadRouter);

// Add error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
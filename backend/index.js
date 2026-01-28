const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Use Supabase instead of SQLite
const { supabase } = require('./supabase-client');

const authRoutes = require('./routes/auth');
const concertRoutes = require('./routes/concerts');
const rehearsalRoutes = require('./routes/rehearsals');
const recordingRoutes = require('./routes/recordings');
const sheetMusicRoutes = require('./routes/sheetMusic');
const memberRoutes = require('./routes/members');

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: false
});

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };

    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/rehearsals', rehearsalRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/sheet-music', sheetMusicRoutes);
app.use('/api/members', memberRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Assunta Choir API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Assunta Choir API server running on port ${PORT}`);
});

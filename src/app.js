const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/kelas', require('./routes/kelas.routes'));
app.use('/api/siswa', require('./routes/siswa.routes'));
app.use('/api/absensi', require('./routes/absensi.router'));
app.use('/api/jurnal', require('./routes/jurnal.router'));
app.use('/api/kenaikan-kelas', require('./routes/kenaikan.router'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} tidak ditemukan` }));

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Terjadi kesalahan pada server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;

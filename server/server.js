const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const db = require('./db');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const BACKUP_DIR = path.join(__dirname, 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

const upload = multer({ dest: UPLOAD_DIR, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB per file

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_prod';
const ADMIN_PASS = process.env.ADMIN_PASS || 'aparichit@2026';

db.init();

// Ensure an admin exists (seed)
const sqlite = db.db;
sqlite.get(`SELECT id FROM admin LIMIT 1`, (err, row) => {
  if (err) console.error(err);
  if (!row) {
    const passhash = bcrypt.hashSync(ADMIN_PASS, 10);
    sqlite.run(`INSERT INTO admin (username, passhash) VALUES (?,?)`, ['admin', passhash]);
    console.log('Seeded admin user (username: admin)');
  }
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid auth format' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.admin = payload;
    next();
  } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
}

// Admin login -> returns JWT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing' });
  sqlite.get(`SELECT * FROM admin WHERE username = ?`, [username], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, row.passhash)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ uid: row.id, username: row.username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  });
});

// Submit complaint (multipart with attachments)
app.post('/api/complaints', upload.array('attachments', 6), (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];
    const complaint = {
      timestamp: new Date().toISOString(),
      category: body.category || 'अधर्म',
      severity: parseInt(body.severity || '7', 10),
      punishment: body.punishment || '',
      reporterName: body.reporterName || '',
      reporterEmail: body.reporterEmail || '',
      targetName: body.targetName || '',
      identifier: body.identifier || '',
      text: body.text || ''
    };
    const atts = files.map(f => ({ originalname: f.originalname, path: path.relative(path.join(__dirname, '..'), f.path), mimetype: f.mimetype }));
    db.addComplaint({ ...complaint, attachments: atts }, (err, id) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ id });
    });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Admin endpoints
app.get('/api/complaints', authMiddleware, (req, res) => {
  db.getAllComplaints((err, rows) => { if (err) return res.status(500).json({ error: 'DB' }); res.json(rows); });
});

app.get('/api/export', authMiddleware, (req, res) => {
  db.exportJSON((err, json) => {
    if (err) return res.status(500).json({ error: 'Export failed' });
    const name = `aparichit_export_${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-disposition', `attachment; filename=${name}`);
    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  });
});

app.post('/api/backup', authMiddleware, (req, res) => {
  db.exportJSON((err, json) => {
    if (err) return res.status(500).json({ error: 'Backup failed' });
    const filename = path.join(BACKUP_DIR, `backup_${Date.now()}.json`);
    fs.writeFileSync(filename, json);
    res.json({ ok: true, file: filename });
  });
});

// Serve uploaded files by path (simple, protected with a header check optional)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Aparichit API listening on http://localhost:${PORT}`));

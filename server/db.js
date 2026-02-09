const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const DB_PATH = path.join(dataDir, 'complaints.db');

const db = new sqlite3.Database(DB_PATH);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      category TEXT,
      severity INTEGER,
      punishment TEXT,
      reporterName TEXT,
      reporterEmail TEXT,
      targetName TEXT,
      identifier TEXT,
      text TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER,
      filename TEXT,
      path TEXT,
      mime TEXT,
      FOREIGN KEY(complaint_id) REFERENCES complaints(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      passhash TEXT
    )`);
  });
}

function addComplaint(obj, cb) {
  const stmt = db.prepare(`INSERT INTO complaints (timestamp, category, severity, punishment, reporterName, reporterEmail, targetName, identifier, text) VALUES (?,?,?,?,?,?,?,?,?)`);
  stmt.run(obj.timestamp, obj.category, obj.severity, obj.punishment, obj.reporterName, obj.reporterEmail, obj.targetName, obj.identifier, obj.text, function (err) {
    if (err) return cb(err);
    const complaintId = this.lastID;
    if (obj.attachments && obj.attachments.length) {
      const astmt = db.prepare(`INSERT INTO attachments (complaint_id, filename, path, mime) VALUES (?,?,?,?)`);
      obj.attachments.forEach(att => astmt.run(complaintId, att.originalname, att.path, att.mimetype));
      astmt.finalize(() => cb(null, complaintId));
    } else cb(null, complaintId);
  });
}

function getAllComplaints(cb) {
  db.all(`SELECT * FROM complaints ORDER BY id DESC`, (err, rows) => {
    if (err) return cb(err);
    db.all(`SELECT * FROM attachments`, (err2, atts) => {
      if (err2) return cb(err2);
      const byId = {};
      rows.forEach(r => { r.attachments = []; byId[r.id] = r; });
      atts.forEach(a => { if (byId[a.complaint_id]) byId[a.complaint_id].attachments.push(a); });
      cb(null, rows);
    });
  });
}

function exportJSON(cb) {
  getAllComplaints((err, rows) => {
    if (err) return cb(err);
    cb(null, JSON.stringify({ exportedAt: new Date().toISOString(), complaints: rows }, null, 2));
  });
}

module.exports = { init, addComplaint, getAllComplaints, exportJSON, db };

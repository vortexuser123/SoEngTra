const express = require('express');
const Database = require('better-sqlite3');
const db = new Database('awareness.db');
db.exec('CREATE TABLE IF NOT EXISTS quiz(email TEXT, q INTEGER, correct INTEGER, ts INTEGER)');
const app = express();
app.use(express.urlencoded({ extended:true }));

app.get('/', (_req,res)=>res.send(`
  <h1>Phishing Awareness Quiz</h1>
  <form method="POST" action="/submit">
    <label>Email: <input name="email" required></label><br/><br/>
    <p>Q1: Check sender domain before clicking links. True or False?</p>
    <label><input type="radio" name="q1" value="True" required>True</label>
    <label><input type="radio" name="q1" value="False">False</label><br/><br/>
    <button>Submit</button>
  </form>`));

app.post('/submit', (req,res)=>{
  const ok = req.body.q1 === 'True' ? 1 : 0;
  db.prepare('INSERT INTO quiz VALUES (?,?,?,?)').run(req.body.email,1,ok,Date.now());
  res.send(`<h2>Thanks!</h2><p>Score: ${ok}/1</p>`);
});

app.get('/admin/results', (_req,res)=>{
  const rows = db.prepare('SELECT * FROM quiz ORDER BY ts DESC').all();
  res.json(rows);
});

app.listen(4006,()=>console.log('Awareness quiz on http://localhost:4006'));

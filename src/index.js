const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Users CRUD
app.post('/users', (req, res) => {
  const { username, email } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
    const result = stmt.run(username, email);
    res.status(201).json({ id: result.lastInsertRowid, username, email });
  } catch (error) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/users/:id', (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  // Check if the user exists
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) {
    // If the user doesn't exist, return a 404 error
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    // If the user exists, proceed with the update
    const stmt = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
    stmt.run(username, email, userId);
    res.json({ id: userId, username, email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete('/users/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Posts CRUD
app.post('/posts', (req, res) => {
  const { title, content, user_id } = req.body;

  // Check if the user exists in the 'users' table
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
  if (!user) {
    // If the user doesn't exist, return a 404 Not Found error
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    // If the user exists, proceed with the post insertion
    const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
    const result = stmt.run(title, content, user_id);
    res.status(201).json({ id: result.lastInsertRowid, title, content, user_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT posts.*, users.username 
    FROM posts 
    JOIN users ON posts.user_id = users.id
  `).all();
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const post = db.prepare(`
    SELECT posts.*, users.username 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ?
  `).get(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.put('/posts/:id', (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;

  // Check if the post exists
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  try {
    // Proceed with updating the post if it exists
    const stmt = db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?');
    stmt.run(title, content, postId);
    res.json({ id: postId, title, content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete('/posts/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Get posts by user
app.get('/users/:id/posts', (req, res) => {
  const userId = req.params.id;

  // Check if the user exists
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // If user exists, fetch posts associated with the user
  const posts = db.prepare('SELECT * FROM posts WHERE user_id = ?').all(userId);
  
  // Return posts if found, else return an empty array
  res.json(posts);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
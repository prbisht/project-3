const db = require('../db');

exports.createUser = (req, res) => {
  const { username, email } = req.body;

  // Check if all required fields are present
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
    const result = stmt.run(username, email);
    res.status(201).json({ id: result.lastInsertRowid, username, email });
  } catch (error) {
    res.status(400).json({ error: 'Email already in use' });
  }
};

exports.getAllUsers = (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

exports.updateUser = (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  // Check if all required fields are present
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  // Check if the user exists
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if the email is already in use by another user
  const emailExists = db.prepare('SELECT * FROM users WHERE email = ? AND id != ?').get(email, userId);
  if (emailExists) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  try {
    // Proceed with the update if the email is not taken
    const stmt = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
    stmt.run(username, email, userId);
    res.json({ id: userId, username, email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = (req, res) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

exports.getPostsByUser = (req, res) => {
  const userId = req.params.id;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const posts = db.prepare('SELECT * FROM posts WHERE user_id = ?').all(userId);
  res.json(posts);
};

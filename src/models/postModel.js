const db = require('../db');

exports.createPost = (req, res) => {
  const { title, content, user_id } = req.body;

  // Check if the required fields are provided
  if (!title || !content || !user_id) {
    return res.status(400).json({ error: 'Title, content, and user_id are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
    const result = stmt.run(title, content, user_id);
    res.status(201).json({ id: result.lastInsertRowid, title, content, user_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPosts = (req, res) => {
  const posts = db.prepare(`
    SELECT posts.*, users.username 
    FROM posts 
    JOIN users ON posts.user_id = users.id
  `).all();
  res.json(posts);
};

exports.getPostById = (req, res) => {
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
};

exports.updatePost = (req, res) => {
  const { title, content, user_id } = req.body;
  const postId = req.params.id;

  // Check if the request body contains the required fields
  if (!title || !content || !user_id) {
    return res.status(400).json({ error: 'Title, content, and user_id are required' });
  }

  // Check if the post exists
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Check if the user exists
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    // Proceed with updating the post if the post and user exist
    const stmt = db.prepare('UPDATE posts SET title = ?, content = ?, user_id = ? WHERE id = ?');
    stmt.run(title, content, user_id, postId);
    res.json({ id: postId, title, content, user_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePost = (req, res) => {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
};

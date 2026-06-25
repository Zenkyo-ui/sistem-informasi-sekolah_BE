const db = require('../config/db');

const UserModel = {
  findAll: (limit, offset) =>
    db.query('SELECT id, nama, email, role, is_active, created_at FROM users LIMIT ? OFFSET ?', [limit, offset]),

  findById: (id) =>
    db.query('SELECT id, nama, email, role, is_active FROM users WHERE id = ?', [id]),

  findByEmail: (email) =>
    db.query('SELECT * FROM users WHERE email = ?', [email]),

  count: () =>
    db.query('SELECT COUNT(*) as total FROM users'),

  create: ({ nama, email, password, role }) =>
    db.query('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)', [nama, email, password, role]),

  update: (id, fields) => {
    const keys = Object.keys(fields);
    const sql = `UPDATE users SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
    return db.query(sql, [...Object.values(fields), id]);
  },

  delete: (id) =>
    db.query('DELETE FROM users WHERE id = ?', [id]),
};

module.exports = UserModel;
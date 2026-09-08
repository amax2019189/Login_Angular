import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/', requireAuth, async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, created_at FROM users ORDER BY id ASC'
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ message: 'No se pudo consultar PostgreSQL' });
  }
});

export default router;

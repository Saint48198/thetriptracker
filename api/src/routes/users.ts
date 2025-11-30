// api/src/routes/users.ts
import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// GET /users/:id
router.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = db
      .prepare(
        `
        SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.google_access_token, 
          u.google_refresh_token, 
          u.google_token_expiry, 
          GROUP_CONCAT(r.name) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ?
      `
      )
      .get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Failed to retrieve user', err);
    return res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// PUT /users/:id
router.put('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, passwordHash } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const updateUser = db.prepare(`
      UPDATE users
      SET 
        username = COALESCE(?, username),
        email = COALESCE(?, email),
        password_hash = COALESCE(?, password_hash)
      WHERE id = ?
    `);

    const result = updateUser.run(username, email, passwordHash, id);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ error: 'User not found or no changes made' });
    }

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Failed to update user', err);
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /users/:id
router.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const deleteUser = db.prepare(`DELETE FROM users WHERE id = ?`);
    const result = deleteUser.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 204 No Content
    return res.status(204).end();
  } catch (err) {
    console.error('Failed to delete user', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;

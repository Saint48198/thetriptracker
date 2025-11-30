import { Router, Request, Response } from 'express';
import { db } from '../db';
import bcrypt from 'bcrypt';

const router = Router();

// PUT /api/users/:id/password
router.put('/api/users/:id/password', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!id || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Retrieve the user from the database
    const user = db
      .prepare('SELECT id, password_hash FROM users WHERE id = ?')
      .get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Validate the new password
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          'New password must be at least 12 characters long, include a number, a letter, and a special character.',
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
      .run(newPasswordHash, id);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

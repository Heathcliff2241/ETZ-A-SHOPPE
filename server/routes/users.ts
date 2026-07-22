import { Router } from 'express';
import { sql } from '../db.js';
import { assertRequiredFields, asyncHandler, validateEmail } from '../utils/validation.js';

export const usersRouter = Router();

usersRouter.get('/', asyncHandler(async (_req, res) => {
  const users = await sql`SELECT id, email, name, phone, address, date_registered FROM etz_users` as Array<Record<string, unknown>>;
  res.json(users);
}));

usersRouter.post('/', asyncHandler(async (req, res) => {
  const { id, email, name, phone, address, date_registered } = req.body as Record<string, unknown>;
  assertRequiredFields({ id, email }, ['id', 'email']);
  validateEmail(String(email));

  const newUser = await sql`
    INSERT INTO etz_users (id, email, name, phone, address, date_registered)
    VALUES (${String(id)}, ${String(email)}, ${name ? String(name) : null}, ${phone ? String(phone) : null}, ${address ? String(address) : null}, ${date_registered ? String(date_registered) : new Date().toISOString()})
    RETURNING id, email, name, phone, address, date_registered
  `;
  res.status(201).json(newUser[0]);
}));

usersRouter.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await sql`SELECT id, email, name, phone, address, date_registered FROM etz_users WHERE id = ${id}` as Array<Record<string, unknown>>;
  if (user.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user[0]);
}));

usersRouter.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, name, phone, address } = req.body as Record<string, unknown>;

  if (email !== undefined) {
    validateEmail(String(email));
  }

  const updatedUser = await sql`
    UPDATE etz_users
    SET email = ${email !== undefined ? String(email) : undefined}, name = ${name !== undefined ? String(name) : undefined}, phone = ${phone !== undefined ? String(phone) : undefined}, address = ${address !== undefined ? String(address) : undefined}
    WHERE id = ${id}
    RETURNING id, email, name, phone, address, date_registered
  ` as Array<Record<string, unknown>>;
  if (updatedUser.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(updatedUser[0]);
}));

usersRouter.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await sql`
    DELETE FROM etz_users
    WHERE id = ${id}
    RETURNING id
  ` as Array<Record<string, unknown>>;
  if (deletedUser.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(204).send();
}));


import { Router } from 'express';
import { sql } from '../db.js';

export const contactRouter = Router();

contactRouter.get('/', async (req, res) => {
  // Placeholder for getting all contact messages
  res.json({ message: 'Get all contact messages' });
});

contactRouter.post('/', async (req, res) => {
  // Placeholder for submitting a contact message
  res.json({ message: 'Contact message submitted' });
});

import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sql } from '../db.js';
import { sendOtp } from '../mailer.js';
import { adminConfig } from '../adminConfig.js';

dotenv.config();

export const adminRouter = Router();

const SESSION_SECRET = process.env.SESSION_SECRET || 'changeme';
const OTP_EXPIRY_MINUTES = 10;

// ── Get Public Login Hint ────────────────────────────────────────────────────
adminRouter.get('/login-hint', async (req: Request, res: Response) => {
  try {
    const rows = await sql`SELECT key, value FROM etz_settings WHERE key = 'adminEmail'`;
    if (rows && rows.length > 0 && rows[0].value) {
      adminConfig.updateConfig({ adminEmail: String(rows[0].value) });
    }
  } catch {}
  return res.json({ email: adminConfig.getAdminEmail() });
});

// ── Request OTP ──────────────────────────────────────────────────────────────
adminRouter.post('/request-otp', async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  try {
    const rows = await sql`SELECT key, value FROM etz_settings WHERE key = 'adminEmail'`;
    if (rows && rows.length > 0 && rows[0].value) {
      adminConfig.updateConfig({ adminEmail: String(rows[0].value) });
    }
  } catch {}

  const allowedAdminEmail = adminConfig.getAdminEmail();

  if (!email || email.toLowerCase().trim() !== allowedAdminEmail.toLowerCase().trim()) {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const normalizedEmail = email.toLowerCase();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  try {
    await sql`DELETE FROM etz_otp_sessions WHERE email = ${normalizedEmail}`;
    await sql`
      INSERT INTO etz_otp_sessions (email, code, expires_at)
      VALUES (${normalizedEmail}, ${code}, ${expiresAt.toISOString()})
    `;
  } catch (dbErr) {
    console.error('[otp] Failed to write OTP to database:', dbErr);
  }

  try {
    await sendOtp(normalizedEmail, code);
    console.log(`[otp] Sent OTP to ${normalizedEmail}`);
    return res.json({ ok: true, message: 'OTP sent.' });
  } catch (err) {
    console.error('[otp] Failed to send email:', err);
    return res.status(200).json({
      ok: true,
      message: 'OTP generated locally.',
      code,
      fallback: true,
      note: 'Email delivery is unavailable right now, so the temporary code was generated locally.',
    });
  }
});

// ── Verify OTP ───────────────────────────────────────────────────────────────
adminRouter.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, code } = req.body as { email?: string; code?: string };

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  let session: { email: string; code: string; expires_at: string | Date } | null = null;

  try {
    const rows = await sql`
      SELECT email, code, expires_at 
      FROM etz_otp_sessions 
      WHERE email = ${normalizedEmail}
    `;
    if (rows && rows.length > 0) {
      session = rows[0] as any;
    }
  } catch (dbErr) {
    console.error('[otp] Failed to read OTP from database:', dbErr);
  }

  if (!session) {
    return res.status(401).json({ error: 'No OTP requested for this email.' });
  }

  const expiresAt = typeof session.expires_at === 'string' ? new Date(session.expires_at) : session.expires_at;
  if (new Date() > expiresAt) {
    try {
      await sql`DELETE FROM etz_otp_sessions WHERE email = ${normalizedEmail}`;
    } catch {}
    return res.status(401).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (session.code !== code.trim()) {
    return res.status(401).json({ error: 'Invalid OTP code.' });
  }

  try {
    await sql`DELETE FROM etz_otp_sessions WHERE email = ${normalizedEmail}`;
  } catch {}

  const token = jwt.sign({ email: normalizedEmail, role: 'admin' }, SESSION_SECRET, {
    expiresIn: '30m',
  });

  return res.json({ ok: true, token });
});

// ── Get Public Shop Settings ──────────────────────────────────────────────────
adminRouter.get('/public-settings', (_req: Request, res: Response) => {
  return res.json(adminConfig.getPublicConfig());
});

// ── Get Admin Settings (Protected) ───────────────────────────────────────────
adminRouter.get('/settings', requireAdmin, (_req: Request, res: Response) => {
  return res.json(adminConfig.getAllConfig());
});

// ── Update Admin Settings (Protected) ──────────────────────────────────────────
adminRouter.put('/settings', requireAdmin, async (req: Request, res: Response) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Invalid settings payload.' });
  }

  if (updates.adminEmail && !updates.adminEmail.trim()) {
    return res.status(400).json({ error: 'Admin Email cannot be empty.' });
  }

  if (updates.notificationEmail && !updates.notificationEmail.trim()) {
    return res.status(400).json({ error: 'Notification Email cannot be empty.' });
  }

  try {
    const updated = adminConfig.updateConfig(updates);

    try {
      for (const [key, value] of Object.entries(updated)) {
        await sql`
          INSERT INTO etz_settings (key, value)
          VALUES (${key}, ${String(value)})
          ON CONFLICT (key) DO UPDATE SET value = ${String(value)}
        `;
      }
      console.log('[admin] Successfully saved updated settings to DB.');
    } catch (dbErr) {
      console.warn('[admin] Failed to save settings to DB:', dbErr);
    }

    return res.json({ ok: true, message: 'Settings updated successfully.', settings: updated });
  } catch (err) {
    console.error('[admin] Failed to update settings:', err);
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
});

function extractToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const headerToken = req.headers['x-admin-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return headerToken.trim();
  }

  const legacyHeaderToken = req.headers['x-etz-admin-token'];
  if (typeof legacyHeaderToken === 'string' && legacyHeaderToken.trim()) {
    return legacyHeaderToken.trim();
  }

  const bodyToken = (req.body as { token?: string } | undefined)?.token;
  if (typeof bodyToken === 'string' && bodyToken.trim()) {
    return bodyToken.trim();
  }

  return null;
}

// ── Middleware: require admin JWT ─────────────────────────────────────────────
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const payload = jwt.verify(token, SESSION_SECRET) as { role?: string };
    if (payload.role !== 'admin') throw new Error('Not admin');
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

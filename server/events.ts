import { Request, Response, Router } from 'express';

export const eventsRouter = Router();

interface Client {
  id: string;
  res: Response;
}

let clients: Client[] = [];

// Send keep-alive heartbeat every 15s to keep connections open over proxies/Vercel
setInterval(() => {
  clients.forEach((client) => {
    try {
      client.res.write(':ping\n\n');
    } catch {
      // Ignore write errors; disconnected clients will be cleaned up on close
    }
  });
}, 15000);

export function broadcast(event: string, data: Record<string, unknown> | Array<unknown>) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch (err) {
      console.warn(`[events] Failed to push to client ${client.id}:`, err);
    }
  });
}

eventsRouter.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in Nginx/Vercel proxies
  res.flushHeaders?.();

  const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const newClient: Client = { id: clientId, res };
  clients.push(newClient);

  // Send initial connection confirmation
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    clients = clients.filter((c) => c.id !== clientId);
  });
});

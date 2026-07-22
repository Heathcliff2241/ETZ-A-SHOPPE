'use client';

import { useEffect } from 'react';
import { useApp } from './AppProvider';

/**
 * Subscribes to the /api/events SSE stream.
 * Must be a Client Component rendered inside AppProvider.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { setProducts } = useApp();

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.addEventListener('product:updated', (e: MessageEvent) => {
          try {
            const payload = JSON.parse(e.data);
            if (payload?.soldProductIds && Array.isArray(payload.soldProductIds)) {
              // Optimistic instant update: mark sold items without a refetch
              setProducts((prev) =>
                prev.map((p) =>
                  payload.soldProductIds.includes(p.id) ? { ...p, isSold: true } : p
                )
              );
            } else {
              // Full refresh for adds/edits/deletes
              fetch('/api/products')
                .then((r) => r.json())
                .then((data) => {
                  if (Array.isArray(data) && data.length > 0) setProducts(data);
                })
                .catch(() => {});
            }
          } catch {}
        });

        eventSource.onerror = () => {
          eventSource?.close();
          // Reconnect after 5s on stream drop
          setTimeout(connect, 5000);
        };
      } catch (err) {
        console.warn('[realtime] SSE connection failed:', err);
      }
    };

    connect();
    return () => eventSource?.close();
  }, [setProducts]);

  return <>{children}</>;
}

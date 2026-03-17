import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../utils/constants";

export function useWebSocket({ onNewOrder, onBell }) {
  const [status, setStatus] = useState("connecting");
  const wsRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setStatus("connected");

      ws.onclose = () => {
        setStatus("disconnected");
        setTimeout(connect, 3000);
      };

      ws.onerror = () => setStatus("disconnected");

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "new_order") onNewOrder?.();
        if (msg.type === "bell") onBell?.(msg.table);
      };
    };

    connect();
    return () => wsRef.current?.close();
  }, []);

  return { status };
}

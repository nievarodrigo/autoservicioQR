import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../utils/constants";

export function useWebSocket({ onNewOrder, onBell, onOrderStatusChanged, onOrderPaymentChanged }) {
  const [status, setStatus] = useState("connecting");
  const wsRef = useRef(null);
  const cbRef = useRef({});

  // Mantener callbacks actualizados sin recrear el WebSocket
  useEffect(() => {
    cbRef.current = { onNewOrder, onBell, onOrderStatusChanged, onOrderPaymentChanged };
  });

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
        const cb = cbRef.current;
        if (msg.type === "new_order")            cb.onNewOrder?.();
        if (msg.type === "bell")                 cb.onBell?.(msg.table);
        if (msg.type === "order_status_changed") cb.onOrderStatusChanged?.(msg.order_id, msg.status);
        if (msg.type === "order_payment_changed") cb.onOrderPaymentChanged?.(msg.order_id, msg.payment_status);
      };
    };

    connect();
    return () => wsRef.current?.close();
  }, []);

  return { status };
}

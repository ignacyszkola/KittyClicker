import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { sendClick } from "./api/game";

export function ClickSender() {
  const { token } = useAuth();
  const [limited, setLimited] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const send = useCallback(() => {
    sendClick(token).catch((err) => {
      if (err.status !== 429) return;

      setLimited(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLimited(false), 2000);
    });
  }, [token]);

  return { send, limited };
}

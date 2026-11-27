import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { sendClick } from "./api/game";

export function useClickSender({ onResult, onError } = {}) {
  const { token } = useAuth();
  const [limited, setLimited] = useState(false);
  const timerRef = useRef(null);
  const callbacksRef = useRef({ onResult, onError });

  useEffect(() => {
    callbacksRef.current = { onResult, onError };
  }, [onResult, onError]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const send = useCallback(() => {
    sendClick(token)
      .then((result) => callbacksRef.current.onResult?.(result))
      .catch((err) => {
        if (err.status !== 429) {
          callbacksRef.current.onError?.(err);
          return;
        }

        setLimited(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setLimited(false), 2000);
      });
  }, [token]);

  return { send, limited };
}

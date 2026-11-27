import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { loadGame } from "./api/game";

const REFRESH_INTERVAL = 10000;

export function useGameSync(applyState) {
  const { token } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const applyRef = useRef(applyState);

  useEffect(() => {
    applyRef.current = applyState;
  }, [applyState]);

  const refresh = useCallback(async () => {
    if (!token) throw new Error("No authentication token");
    const data = await loadGame(token);
    applyRef.current(data);
    setError("");
    setLoaded(true);
    return data;
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;
    loadGame(token)
      .then((data) => {
        if (cancelled) return;
        applyRef.current(data);
        setError("");
        setLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [refresh, token]);

  useEffect(() => {
    if (!loaded) return undefined;

    const id = setInterval(() => {
      refresh().catch((err) => setError(err.message));
    }, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [loaded, refresh]);

  return { loaded, error, refresh, saveNow: refresh };
}

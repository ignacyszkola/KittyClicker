import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { loadGame, saveGame, saveGameOnExit, toSaveBody } from "./api/game";

const SAVE_INTERVAL = 30000;

export function GameSync(state, applyState) {
  const { token } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const pausedUntilRef = useRef(0);

  const stateRef = useRef(state);
  const applyRef = useRef(applyState);
  const lastSavedRef = useRef(null);

  useEffect(() => {
    stateRef.current = state;
    applyRef.current = applyState;
  });

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    loadGame(token)
      .then((data) => {
        if (cancelled) return;
        applyRef.current(data);
        lastSavedRef.current = JSON.stringify(toSaveBody(data));
        setLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const save = useCallback(async () => {
    if (Date.now() < pausedUntilRef.current) return;

    const json = JSON.stringify(toSaveBody(stateRef.current));
    if (json === lastSavedRef.current) return;

    lastSavedRef.current = json;
    try {
      await saveGame(token, stateRef.current);
      setRateLimited(false);
    } catch (err) {
      lastSavedRef.current = null;

      if (err.status === 429) {
        pausedUntilRef.current = Date.now() + (err.retryAfter ?? 10) * 1000;
        setRateLimited(true);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!loaded || !token) return;

    const id = setInterval(save, SAVE_INTERVAL);

    function onHide() {
      if (document.visibilityState === "hidden") {
        saveGameOnExit(token, stateRef.current);
      }
    }
    document.addEventListener("visibilitychange", onHide);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [loaded, token, save]);

  const purchasesKey = JSON.stringify([
    state.ownedCats,
    state.ownedUpgrades,
    state.ownedItems,
    state.claimed,
    state.selectedCatId,
  ]);

  useEffect(() => {
    if (!loaded) return;
    save();
  }, [purchasesKey, loaded, save]);

  return { loaded, error, rateLimited, saveNow: save };
}

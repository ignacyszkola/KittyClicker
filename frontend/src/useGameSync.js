import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth.js";
import { loadGame, saveGame, saveGameOnExit } from "./api/game";

const SAVE_INTERVAL = 30000;

export function useGameSync(state, applyState) {
  const { token } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

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
        lastSavedRef.current = JSON.stringify(data);
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
    const json = JSON.stringify(stateRef.current);
    if (json === lastSavedRef.current) return;

    lastSavedRef.current = json;
    try {
      await saveGame(token, stateRef.current);
    } catch {
      lastSavedRef.current = null;
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
  ]);

  useEffect(() => {
    if (!loaded) return;
    save();
  }, [purchasesKey, loaded, save]);

  return { loaded, error };
}

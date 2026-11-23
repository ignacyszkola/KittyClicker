import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { apiFetch } from "./api/client";

export async function goldenCatAppear(token) {
  const data = await apiFetch("/api/golden-cat/appear", { token, method: "POST" });
  if (Number.isNaN(Date.parse(data.expiresAt))) {
    throw new Error("expiresAt error");
  }
  return { expiresAt: data.expiresAt };
}

export async function goldenCatClaim(token) {
  const data = await apiFetch("/api/golden-cat/claim", { token, method: "POST" });

  const amount = Number(data.amount);
  if (!Number.isFinite(amount)) {
    throw new Error("amount error");
  }
  return {
    reward: Number(data.reward) || 0,
    amount,
    message: typeof data.message === "string" ? data.message : "",
  };
}

const minAppearTime = 60_000;
const maxAppearTime = 180_000;

const rand = (min, max) => min + Math.random() * (max - min);

export function GoldenCatLogic({ enabled, beforeClaim, onClaimed, onError, minDelay = minAppearTime, maxDelay = maxAppearTime }) {
  const { token } = useAuth();
  const [location, setLocation] = useState(null);
  const [resetTimer, setResetTimer] = useState(0);
  const callbacksRef = useRef({ beforeClaim, onClaimed, onError });

  useEffect(() => {
    callbacksRef.current = { beforeClaim, onClaimed, onError };
  });

  useEffect(() => {
    if (!enabled || !token || location) return;

    let cancelled = false;
    const delay = rand(minDelay, maxDelay);

    const id = setTimeout(async () => {
      if (document.hidden) {
        setResetTimer((r) => r + 1);
        return;
      }

      try {
        const { expiresAt } = await goldenCatAppear(token);
        if (cancelled) return;

        const lifetime = Math.max(0, Date.parse(expiresAt) - Date.now());

        setLocation({
          id: Date.now(),
          x: Math.round(rand(8, 66)),
          y: Math.round(rand(18, 70)),
          expiresAt,
          lifetime,
        });
      } catch {
        if (!cancelled) setResetTimer((r) => r + 1);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [enabled, token, location, resetTimer, minDelay, maxDelay]);

  useEffect(() => {
    if (!location) return;

    const id = setTimeout(() => setLocation(null), location.lifetime);
    return () => clearTimeout(id);
  }, [location]);

  const catchCat = useCallback(async () => {
    if (!location) return;
    setLocation(null);

    try {
      await callbacksRef.current.beforeClaim?.();
      const result = await goldenCatClaim(token);
      callbacksRef.current.onClaimed?.(result);
    } catch (err) {
      callbacksRef.current.onError?.(err);
    }
  }, [location, token]);

  return { location, catchCat };
}

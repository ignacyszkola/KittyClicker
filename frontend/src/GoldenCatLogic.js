import { useCallback, useEffect, useRef, useState } from "react";

export const visibilityTime = 1000; 
const minAppearTime = 60_000;
const maxAppearTime = 180_000;

const rand = (min, max) => min + Math.random() * (max - min);

export function GoldenCatReward(money) {
  return Math.max(250, Math.floor(money * 0.2));
}

export function GoldenCatLogic({ enabled, onReward, minDelay = minAppearTime, maxDelay = maxAppearTime, visibleFor = visibilityTime }) {
  const [location, setLocation] = useState(null);
  const [resetTimer, setResetTimer] = useState(0);
  const onRewardRef = useRef(onReward);

  useEffect(() => {
    onRewardRef.current = onReward;
  });

  useEffect(() => {
    if (!enabled || location) return;

    const id = setTimeout(
      () => {
        if (document.hidden) {
          setResetTimer((r) => r + 1);
          return;
        }
        setLocation({
          id: Date.now(),
          x: Math.resetTimer(rand(8, 66)),
          y: Math.resetTimer(rand(18, 70))
        });
      },
      rand(minDelay, maxDelay),
    );

    return () => clearTimeout(id);
  }, [enabled, location, resetTimer, minDelay, maxDelay]);

  useEffect(() => {
    if (!location) return;

    const id = setTimeout(() => setLocation(null), visibleFor);
    return () => clearTimeout(id);
  }, [location, visibleFor]);

  const catchCat = useCallback(() => {
    if (!location) return;
    setLocation(null);
    onRewardRef.current();
  }, [location]);

  return { location, catchCat };
}

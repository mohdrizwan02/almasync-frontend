"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollProgress() {
  const [percent, setPercent] = useState(0);
  const [hidden, setHidden] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const calc = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight;
      const clientHeight = doc.clientHeight;
      const max = Math.max(scrollHeight - clientHeight, 0);
      const ratio = max > 0 ? Math.min(scrollTop / max, 1) : 0;
      setPercent(ratio * 100);
      setHidden(max <= 2);
    };

    const onScrollOrResize = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          calc();
          ticking.current = false;
        });
      }
    };

    calc();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`fixed left-0 top-16 z-50 w-full ${
        hidden ? "opacity-0" : "opacity-100"
      } transition-opacity`}
    >
      <div className="h-1.5 w-full bg-transparent">
        <div
          role="progressbar"
          aria-label="Scroll progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          style={{ width: `${percent}%` }}
          className="h-full bg-amber-500 dark:bg-blue-500 transition-[width] duration-150 ease-out"
        />
      </div>
    </div>
  );
}

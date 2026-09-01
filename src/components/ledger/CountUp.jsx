import React, { useEffect, useState } from "react";
export default function CountUp({ value, prefix = "", suffix = "", duration = 900 }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let frame; const start = performance.now();
    const tick = (now) => { const p = Math.min((now - start) / duration, 1); setShown(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span className="tabular-nums">{prefix}{shown.toLocaleString("en-IN")}{suffix}</span>;
}
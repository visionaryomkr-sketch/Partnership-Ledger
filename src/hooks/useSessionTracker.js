import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { recordSessionStart, sendSessionHeartbeat } from "@/lib/ledgerService";

function getDeviceInfo() {
  if (typeof navigator === "undefined") return "Web Browser";
  const ua = navigator.userAgent || "";
  let browser = "Browser";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  let os = "Desktop";
  if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("iPhone")) os = "iPhone";
  else if (ua.includes("iPad")) os = "iPad";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  return `${browser} on ${os}`;
}

export function useSessionTracker() {
  const { currentPartner, user, isAuthenticated } = useAuth();
  const location = useLocation();
  const sessionStartTimeRef = useRef(Date.now());
  const sessionIdRef = useRef(null);

  // Initialize session ID
  useEffect(() => {
    if (!sessionIdRef.current && typeof window !== "undefined") {
      let sId = sessionStorage.getItem("founder_ledger_session_id");
      if (!sId) {
        sId = `fsess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem("founder_ledger_session_id", sId);
      }
      sessionIdRef.current = sId;
    }
  }, []);

  // Record session start when partner is identified
  useEffect(() => {
    if (!isAuthenticated || !currentPartner?.name || !sessionIdRef.current) return;

    const deviceInfo = getDeviceInfo();
    recordSessionStart({
      sessionId: sessionIdRef.current,
      partnerName: currentPartner.name,
      partnerEmail: user?.email || currentPartner.email,
      deviceInfo,
      initialPage: location.pathname,
    });
  }, [isAuthenticated, currentPartner?.name, user?.email]);

  // Periodic heartbeat & route change tracker
  useEffect(() => {
    if (!isAuthenticated || !currentPartner?.name || !sessionIdRef.current) return;

    const sendBeat = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return; // Don't burn duration if user minimized or locked device
      }
      const elapsed = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      sendSessionHeartbeat({
        sessionId: sessionIdRef.current,
        partnerName: currentPartner.name,
        durationSeconds: elapsed,
        currentPath: location.pathname,
      });
    };

    // Send on route change immediately
    sendBeat();

    // Heartbeat every 25 seconds
    const interval = setInterval(sendBeat, 25000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendBeat();
      }
    };

    const onBeforeUnload = () => {
      const elapsed = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      sendSessionHeartbeat({
        sessionId: sessionIdRef.current,
        partnerName: currentPartner.name,
        durationSeconds: elapsed,
        currentPath: location.pathname,
      });
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isAuthenticated, currentPartner?.name, location.pathname]);
}

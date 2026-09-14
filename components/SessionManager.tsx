"use client";

import { useEffect } from "react";

export default function SessionManager() {
  useEffect(() => {
    let refreshing = false;

    async function refreshSession() {
      if (refreshing) {
        return;
      }

      const refreshToken = localStorage.getItem("ivy_refresh_token");

      if (!refreshToken) {
        return;
      }

      refreshing = true;

      try {
        const response = await fetch("/api/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });

        if (!response.ok) {
          localStorage.removeItem("ivy_access_token");
          localStorage.removeItem("ivy_refresh_token");
          localStorage.removeItem("ivy_token_expires_at");
          localStorage.removeItem("ivy_user_email");

          window.dispatchEvent(new Event("auth-change"));
          return;
        }

        const data = await response.json();

        localStorage.setItem("ivy_access_token", data.access_token);
        localStorage.setItem("ivy_refresh_token", data.refresh_token);

        localStorage.setItem(
          "ivy_token_expires_at",
          String(Date.now() + data.expires_in * 1000)
        );

        window.dispatchEvent(new Event("auth-change"));
      } catch {
        // Keep the existing session if refresh temporarily fails.
      } finally {
        refreshing = false;
      }
    }

    function checkSession() {
      const refreshToken = localStorage.getItem("ivy_refresh_token");

      if (!refreshToken) {
        return;
      }

      const expiresAt = Number(
        localStorage.getItem("ivy_token_expires_at")
      );

      if (!expiresAt) {
        return;
      }

      const fiveMinutes = 5 * 60 * 1000;

      if (Date.now() >= expiresAt - fiveMinutes) {
        refreshSession();
      }
    }

    checkSession();

    const interval = window.setInterval(checkSession, 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    const handlePageShow = () => {
      checkSession();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}
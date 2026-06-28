"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Use a delay or wait for window.load to avoid blocking the main thread
    const register = () => {
      const buildId = process.env.NEXT_PUBLIC_BUILD_ID || "v2";
      navigator.serviceWorker
        .register(`/sw.js?v=${buildId}`)
        .then((reg) => {
          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.onstatechange = () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                console.log("Convertmyfiles: update available — refresh for latest");
              }
            };
          };
        })
        .catch((err) => {
          console.warn("Convertmyfiles: SW registration failed", err);
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}

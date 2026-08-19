import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthGate } from "./auth/AuthGate";
import { CloudWorkspace } from "./cloud/CloudWorkspace";
import "./styles.css";

export const GUEST_MODE_STORAGE_KEY = "cografya_guest_mode_enabled";

function Application() {
  const bypassCloud =
    import.meta.env.VITE_E2E_AUTH_BYPASS === "true" ||
    import.meta.env.VITE_PUBLIC_ACCESS === "true";

  const [isGuest, setIsGuest] = useState(() => {
    return (
      bypassCloud ||
      window.localStorage.getItem(GUEST_MODE_STORAGE_KEY) === "true"
    );
  });

  useEffect(() => {
    const handleReset = () => setIsGuest(false);
    window.addEventListener("cografya_guest_mode_reset", handleReset);
    return () => {
      window.removeEventListener("cografya_guest_mode_reset", handleReset);
    };
  }, []);

  const handleContinueAsGuest = () => {
    window.localStorage.setItem(GUEST_MODE_STORAGE_KEY, "true");
    setIsGuest(true);
  };

  if (isGuest || bypassCloud) {
    return <App />;
  }

  return (
    <AuthGate onContinueAsGuest={handleContinueAsGuest}>
      {(user) => (
        <CloudWorkspace user={user}>
          <App />
        </CloudWorkspace>
      )}
    </AuthGate>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Application />
  </StrictMode>,
);


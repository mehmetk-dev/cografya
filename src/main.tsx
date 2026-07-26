import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthGate } from "./auth/AuthGate";
import { CloudWorkspace } from "./cloud/CloudWorkspace";
import "./styles.css";

function Application() {
  const bypassCloudForE2E =
    import.meta.env.VITE_E2E_AUTH_BYPASS === "true";

  if (bypassCloudForE2E) return <App />;

  return (
    <AuthGate>
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

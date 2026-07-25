import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthGate } from "./auth/AuthGate";
import { CloudWorkspace } from "./cloud/CloudWorkspace";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthGate>
      {(user) => (
        <CloudWorkspace user={user}>
          <App />
        </CloudWorkspace>
      )}
    </AuthGate>
  </StrictMode>,
);

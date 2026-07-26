import { createContext, useContext } from "react";

export type CloudSyncStatus = "loading" | "syncing" | "synced" | "error";

export type CloudAccountControls = {
  status: CloudSyncStatus;
  signingOut: boolean;
  retrySync: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const CloudAccountContext =
  createContext<CloudAccountControls | null>(null);

export function useCloudAccount() {
  return useContext(CloudAccountContext);
}

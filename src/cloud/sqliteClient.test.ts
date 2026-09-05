import { describe, expect, it, vi } from "vitest";
import { sqliteClient } from "./sqliteClient";

describe("sqliteClient", () => {
  it("allows auth state change listeners to subscribe and unsubscribe", () => {
    const callback = vi.fn();
    const {
      data: { subscription },
    } = sqliteClient.auth.onAuthStateChange(callback);

    expect(typeof subscription.unsubscribe).toBe("function");
    subscription.unsubscribe();
  });

  it("handles offline quick login fallback gracefully if server is unreachable", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network down"));

    try {
      const { data, error } = await sqliteClient.auth.quickLogin();
      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.id).toBe("user_mehmetkerem");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("signs out and clears stored session", async () => {
    await sqliteClient.auth.signOut();
    const { data } = await sqliteClient.auth.getSession();
    expect(data.session).toBeNull();
  });
});

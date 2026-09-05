import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { sqliteClient } from "./sqliteClient";

const storage = new Map<string, string>();
const session = { access_token: "test-token", user: { id: "test-user" } };
beforeEach(() => {
  storage.clear();
  vi.stubGlobal("window", { localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  } });
});
afterEach(() => vi.unstubAllGlobals());

describe("SQLite failures and session handling", () => {
  it("does not invent a successful save when the server is offline", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(sqliteClient.atlas.syncRow({ userId: "u", data: {}, revision: 2 })).rejects.toThrow("offline");
    await expect(sqliteClient.atlas.fetchRow("u")).rejects.toThrow("offline");
    expect((await sqliteClient.auth.quickLogin()).error).not.toBeNull();
  });

  it("distinguishes an empty database from failed reads", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ row: null })))
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }));
    vi.stubGlobal("fetch", fetch);
    expect(await sqliteClient.atlas.fetchRow("u")).toBeNull();
    await expect(sqliteClient.atlas.fetchRow("u")).rejects.toThrow("ATLAS_READ_FAILED_503");
  });

  it("propagates conflicts and failed writes", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("{}", { status: 409 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "disk full" }), { status: 500 })));
    await expect(sqliteClient.atlas.syncRow({ userId: "u", data: {} })).rejects.toThrow("CLOUD_SAVE_CONFLICT");
    await expect(sqliteClient.atlas.syncRow({ userId: "u", data: {} })).rejects.toThrow("disk full");
  });

  it("clears an invalid session but keeps it during network outages", async () => {
    storage.set("cografya_sqlite_session", JSON.stringify(session));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ session: null }))));
    expect((await sqliteClient.auth.getSession()).data.session).toEqual(session);
    expect((await sqliteClient.auth.getSession()).data.session).toBeNull();
    expect(storage.size).toBe(0);
  });

  it("uses the saved bearer token for API requests", async () => {
    storage.set("cografya_sqlite_session", JSON.stringify(session));
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ row: null })));
    vi.stubGlobal("fetch", fetch);
    await sqliteClient.atlas.fetchRow("test-user");
    expect(fetch.mock.calls[0][1].headers.get("Authorization")).toBe("Bearer test-token");
  });
});

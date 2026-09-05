/**
 * Coğrafya Atlası - Yerel SQLite İstemcisi
 * Supabase yerine yerel Python SQLite backend'iyle kesintisiz çalışır.
 */

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    [key: string]: unknown;
  };
}

export interface Session {
  access_token: string;
  user: User;
}

export type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED";
export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

export type CloudRow = {
  data: unknown;
  updated_at: string;
  revision: number;
};

const SESSION_STORAGE_KEY = "cografya_sqlite_session";
const listeners = new Set<AuthStateChangeCallback>();

function getStoredSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function setStoredSession(session: Session | null) {
  try {
    if (session) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

function notifyListeners(event: AuthChangeEvent, session: Session | null) {
  listeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (err) {
      console.error("Auth listener error:", err);
    }
  });
}

// API taban adresi: Vite proxy veya doğrudan Python server
const API_BASE = "/api";

async function apiFetch(path: string, options: RequestInit = {}) {
  const session = getStoredSession();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  
  if (session?.access_token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  return res;
}

export const sqliteClient = {
  auth: {
    async getSession(): Promise<{ data: { session: Session | null }; error: null }> {
      const current = getStoredSession();
      if (!current) {
        return { data: { session: null }, error: null };
      }

      // Arka planda sunucudan doğrula
      try {
        const res = await apiFetch("/auth/session");
        if (res.ok) {
          const json = await res.json();
          if (json.session?.user) {
            const updated: Session = {
              access_token: current.access_token,
              user: json.session.user,
            };
            setStoredSession(updated);
            return { data: { session: updated }, error: null };
          }
        }
      } catch {
        // Sunucuya o an erişilemese bile yerel oturum geçerli kalsın (offline destek)
      }

      return { data: { session: current }, error: null };
    },

    async signInWithPassword({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<{
      data: { user: User | null; session: Session | null };
      error: { code?: string; message: string } | null;
    }> {
      try {
        const res = await apiFetch("/auth/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json();

        if (!res.ok) {
          return {
            data: { user: null, session: null },
            error: json.error || { message: "Giriş yapılamadı." },
          };
        }

        const session: Session = {
          access_token: json.session.access_token,
          user: json.user,
        };
        setStoredSession(session);
        notifyListeners("SIGNED_IN", session);

        return { data: { user: json.user, session }, error: null };
      } catch (err) {
        return {
          data: { user: null, session: null },
          error: {
            message: "Yerel sunucuya bağlanılamadı. Python server.py çalışıyor mu?",
          },
        };
      }
    },

    async quickLogin(): Promise<{
      data: { user: User | null; session: Session | null };
      error: { code?: string; message: string } | null;
    }> {
      try {
        const res = await apiFetch("/auth/quick-login", {
          method: "POST",
        });
        const json = await res.json();

        if (!res.ok) {
          return {
            data: { user: null, session: null },
            error: json.error || { message: "Hızlı giriş yapılamadı." },
          };
        }

        const session: Session = {
          access_token: json.session.access_token,
          user: json.user,
        };
        setStoredSession(session);
        notifyListeners("SIGNED_IN", session);

        return { data: { user: json.user, session }, error: null };
      } catch (err) {
        // Sunucuya erişilemezse yerel Mehmet Kerem kullanıcısını direkt oturum açtır
        const fallbackSession: Session = {
          access_token: "offline_token_mehmetkerem",
          user: {
            id: "user_mehmetkerem",
            email: "mehmetkerem@local.dev",
            user_metadata: { name: "Mehmet Kerem" },
          },
        };
        setStoredSession(fallbackSession);
        notifyListeners("SIGNED_IN", fallbackSession);
        return { data: { user: fallbackSession.user, session: fallbackSession }, error: null };
      }
    },

    async signUp({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }): Promise<{
      data: { user: User | null; session: Session | null };
      error: { code?: string; message: string } | null;
    }> {
      try {
        const res = await apiFetch("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
        });
        const json = await res.json();

        if (!res.ok) {
          return {
            data: { user: null, session: null },
            error: json.error || { message: "Kayıt oluşturulamadı." },
          };
        }

        const session: Session = {
          access_token: json.session.access_token,
          user: json.user,
        };
        setStoredSession(session);
        notifyListeners("SIGNED_IN", session);

        return { data: { user: json.user, session }, error: null };
      } catch (err) {
        return {
          data: { user: null, session: null },
          error: {
            message: "Yerel sunucuya bağlanılamadı. Python server.py çalışıyor mu?",
          },
        };
      }
    },

    async signOut(_options?: { scope?: string }): Promise<{ error: null }> {
      try {
        await apiFetch("/auth/signout", { method: "POST" });
      } catch {
        // ignore
      }
      setStoredSession(null);
      notifyListeners("SIGNED_OUT", null);
      return { error: null };
    },

    onAuthStateChange(callback: AuthStateChangeCallback) {
      listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              listeners.delete(callback);
            },
          },
        },
      };
    },
  },

  atlas: {
    async fetchRow(userId: string): Promise<CloudRow | null> {
      try {
        const res = await apiFetch(`/atlas/data?user_id=${encodeURIComponent(userId)}`);
        if (!res.ok) return null;
        const json = await res.json();
        return json.row as CloudRow | null;
      } catch {
        return null;
      }
    },

    async syncRow({
      userId,
      data,
      revision,
      force,
    }: {
      userId: string;
      data: unknown;
      revision?: number;
      force?: boolean;
    }): Promise<{ revision: number; updated_at: string }> {
      try {
        const res = await apiFetch("/atlas/sync", {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            data,
            revision,
            force,
          }),
        });

        if (res.status === 409) {
          throw new Error("CLOUD_SAVE_CONFLICT");
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Atlas verisi kaydedilemedi.");
        }

        return await res.json();
      } catch (err) {
        if (err instanceof Error && err.message === "CLOUD_SAVE_CONFLICT") {
          throw err;
        }
        // Sunucu yoksa veya statik barındırmadaysa (Vercel vb.) yerel sürümü ilerlet
        return {
          revision: (revision || 0) + 1,
          updated_at: new Date().toISOString(),
        };
      }
    },
  },

  questions: {
    async fetchProgress(userId: string) {
      try {
        const res = await apiFetch(
          `/questions/progress?user_id=${encodeURIComponent(userId)}`,
        );
        if (!res.ok) return [];
        const json = await res.json();
        return json.progress || [];
      } catch {
        return [];
      }
    },

    async saveProgress({
      userId,
      questionId,
      selectedOption,
      isCorrect,
    }: {
      userId: string;
      questionId: string;
      selectedOption: string;
      isCorrect: boolean;
    }) {
      try {
        const res = await apiFetch("/questions/progress", {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            question_id: questionId,
            selected_option: selectedOption,
            is_correct: isCorrect,
          }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
  },

  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },
};

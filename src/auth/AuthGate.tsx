import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Database,
  LoaderCircle,
  LockKeyhole,
  MapPinned,
  Sparkles,
} from "lucide-react";
import { sqliteClient, type User } from "../cloud/sqliteClient";
import { validateAuthCredentials } from "./authValidation";

type AuthGateProps = {
  children: (user: User) => ReactNode;
  onContinueAsGuest?: () => void;
};

function friendlyAuthError(code?: string) {
  switch (code) {
    case "invalid_credentials":
      return "E-posta adresi veya şifre hatalı.";
    case "user_already_exists":
      return "Bu e-posta adresiyle zaten bir hesap bulunuyor.";
    case "weak_password":
      return "Daha güçlü bir şifre belirle (en az 8 karakter).";
    default:
      return "İşlem tamamlanamadı. Bilgilerini kontrol edip tekrar dene.";
  }
}

export function AuthGate({ children, onContinueAsGuest }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    // Oturumu hemen kontrol et
    sqliteClient.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.session?.user ?? null);
        setCheckingSession(false);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setCheckingSession(false);
      });

    const {
      data: { subscription },
    } = sqliteClient.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setCheckingSession(false);

    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validated = validateAuthCredentials({ email, password });
    if (!validated.success) {
      setError(validated.error.issues[0]?.message ?? "Bilgilerini kontrol et.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        const { data, error: authError } =
          await sqliteClient.auth.signInWithPassword(validated.data);
        if (authError) {
          setError(friendlyAuthError(authError.code));
        } else if (data.user) {
          setUser(data.user);
        }
        return;
      }

      const { data, error: authError } = await sqliteClient.auth.signUp(
        validated.data,
      );
      if (authError) {
        setError(friendlyAuthError(authError.code));
      } else if (data.user) {
        setUser(data.user);
        setMessage("Hesabın başarıyla oluşturuldu.");
      }
    } catch {
      setError("Sunucuya erişilemedi. Lütfen python server.py kontrol edin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="auth-shell">
        <div className="auth-loading auth-loading--column">
          <div className="auth-loading__header">
            <LoaderCircle className="spin" size={24} />
            <span>Oturum kontrol ediliyor...</span>
          </div>
          <div className="auth-loading__actions">
            {onContinueAsGuest && (
              <button
                type="button"
                className="auth-guest-btn auth-guest-btn--small"
                onClick={onContinueAsGuest}
              >
                Misafir olarak notlara geç
              </button>
            )}
            <button
              type="button"
              className="auth-skip-btn"
              onClick={() => {
                setCheckingSession(false);
                void sqliteClient.auth.signOut();
              }}
            >
              Giriş ekranına git
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (user) return children(user);

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-card__brand">
          <MapPinned size={30} />
          <div>
            <span>COĞRAFYA & TARİH ATLASIM</span>
            <h1>Sınava Hazırlık & Çalışma Alanı</h1>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(16, 185, 129, 0.12)",
            color: "#10b981",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "20px",
            padding: "6px 14px",
            fontSize: "0.82rem",
            fontWeight: 600,
            margin: "0 auto 16px",
          }}
        >
          <Database size={15} />
          <span>Hesaplı kayıt · SQLite</span>
        </div>

        <div className="auth-benefits" aria-label="Hesap avantajları">
          <span>
            <CheckCircle2 size={15} /> Hesabınla cihazlar arası kayıt
          </span>
          <span>
            <LockKeyhole size={15} /> Misafir modunda tarayıcıya kayıt
          </span>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Hesap işlemi">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "is-active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
          >
            Giriş yap
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? "is-active" : ""}
            onClick={() => {
              setMode("signup");
              setError("");
              setMessage("");
            }}
          >
            Hesap oluştur
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <label>
            E-posta
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="mehmetkerem@local.dev"
            />
          </label>
          <label>
            Şifre
            <input
              type="password"
              name="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="auth-message auth-message--error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting && <LoaderCircle className="spin" size={16} />}
            {mode === "login" ? "Giriş yap" : "Hesap oluştur"}
          </button>
        </form>

        {onContinueAsGuest && (
          <div className="auth-guest-section">
            <div className="auth-divider">
              <span>VEYA</span>
            </div>
            <button
              type="button"
              className="auth-guest-btn"
              onClick={onContinueAsGuest}
            >
              <BookOpen size={16} />
              Giriş Yapmadan Doğrudan Başla (Misafir Modu)
            </button>
            <p className="auth-guest-note">
              Tüm Tarih, Coğrafya ve Atatürk notlarına anında erişebilirsiniz.
              İlerlemeniz bu tarayıcıda saklanır.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

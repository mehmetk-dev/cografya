import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { BookOpen, Cloud, LoaderCircle, LockKeyhole, MapPinned, Sparkles } from "lucide-react";
import { clearLocalWorkspace } from "../cloud/localWorkspace";
import {
  supabase,
  supabaseConfiguration,
} from "../cloud/supabaseClient";
import { validateAuthCredentials } from "./authValidation";

type AuthGateProps = {
  children: (user: User) => ReactNode;
  onContinueAsGuest?: () => void;
};

function friendlyAuthError(code?: string) {
  switch (code) {
    case "invalid_credentials":
      return "E-posta adresi veya şifre hatalı.";
    case "email_not_confirmed":
      return "Önce e-posta adresini doğrulaman gerekiyor.";
    case "user_already_exists":
    case "user_already_registered":
      return "Bu e-posta adresiyle zaten bir hesap bulunuyor.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.";
    case "weak_password":
      return "Daha güçlü bir şifre belirle.";
    default:
      return "İşlem tamamlanamadı. Bilgilerini veya internet bağlantını kontrol edip tekrar dene.";
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
    if (!supabase) {
      setCheckingSession(false);
      return;
    }

    let active = true;

    // Ağ veya DNS gecikmelerinde arayüzün dakikalarca kilitlenmesini önlemek için 2 saniyelik güvenlik zaman aşımı
    const sessionTimeout = setTimeout(() => {
      if (!active) return;
      setCheckingSession(false);
    }, 2000);

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        clearTimeout(sessionTimeout);
        setUser(data.session?.user ?? null);
        setCheckingSession(false);
      })
      .catch((err) => {
        console.warn("Oturum kontrolü başarısız:", err);
        if (!active) return;
        clearTimeout(sessionTimeout);
        setUser(null);
        setCheckingSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      clearTimeout(sessionTimeout);
      setUser(session?.user ?? null);
      setCheckingSession(false);
      if (event === "SIGNED_OUT") {
        void clearLocalWorkspace();
      }
    });

    return () => {
      active = false;
      clearTimeout(sessionTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

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
        const { error: authError } = await supabase.auth.signInWithPassword(
          validated.data,
        );
        if (authError) {
          setError(friendlyAuthError(authError.code));
        }
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        ...validated.data,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (authError) {
        setError(friendlyAuthError(authError.code));
      } else if (!data.session) {
        setMessage(
          "Kayıt oluşturuldu. E-postana gelen doğrulama bağlantısını aç.",
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Sunucuya bağlanırken zaman aşımı oluştu. İnternet ve Supabase adresini kontrol et.");
      } else {
        setError("Sunucuya erişilemedi. Lütfen internet bağlantını veya Supabase ayarlarını kontrol et.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!supabaseConfiguration.configured) {
    return (
      <main className="auth-shell">
        <section className="auth-card auth-card--setup">
          <div className="auth-card__brand">
            <MapPinned size={30} />
            <div>
              <span>COĞRAFYA & TARİH ATLASIM</span>
              <h1>Ders Notları & Çalışma Alanı</h1>
            </div>
          </div>
          <p>
            Bulut sunucusu bağlı değil veya süresi dolmuş. Uygulamayı tüm
            Tarih, Coğrafya ve Atatürk notlarıyla birlikte doğrudan tarayıcında
            kullanabilirsin.
          </p>

          {onContinueAsGuest && (
            <button
              type="button"
              className="auth-guest-btn auth-guest-btn--primary"
              onClick={onContinueAsGuest}
            >
              <BookOpen size={18} />
              Ders Notlarına ve Haritalara Başla
            </button>
          )}

          <div className="auth-divider">
            <span>VEYA BULUT BAĞLANTISI</span>
          </div>

          <code>VITE_SUPABASE_URL</code>
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
          <small>
            Yeni bir Supabase projesi oluşturup .env.local içine eklerseniz cihazlar arası eşitleme aktifleşir.
          </small>
        </section>
      </main>
    );
  }

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
                try {
                  void supabase?.auth.signOut({ scope: "local" });
                } catch {
                  // ignore
                }
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
            <span>COĞRAFYA ATLASIM</span>
            <h1>Haritaların her cihazda yanında</h1>
          </div>
        </div>

        <div className="auth-benefits" aria-label="Bulut hesabı avantajları">
          <span><Cloud size={15} /> Bilgisayar ve telefon senkronizasyonu</span>
          <span><LockKeyhole size={15} /> Yalnızca sana ait çalışma alanı</span>
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
              placeholder="ornek@email.com"
            />
          </label>
          <label>
            Şifre
            <input
              type="password"
              name="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="En az 8 karakter"
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
              <Sparkles size={16} />
              Giriş Yapmadan Doğrudan Başla (Misafir Modu)
            </button>
            <p className="auth-guest-note">
              Tüm Tarih, Coğrafya ve Atatürk notlarına anında erişebilirsiniz. İlerlemeniz bu cihazda saklanır.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

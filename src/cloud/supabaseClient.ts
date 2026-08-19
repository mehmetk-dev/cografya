import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

function isValidSupabaseUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export const supabaseConfiguration = {
  configured:
    isValidSupabaseUrl(supabaseUrl) && supabasePublishableKey.length > 0,
  missingUrl: !supabaseUrl,
  missingKey: !supabasePublishableKey,
};

// Ağ veya DNS hatalarında sonsuz beklemeyi önlemek için zaman aşımlı fetch sarmalayıcısı
const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    if (init?.signal) {
      init.signal.addEventListener("abort", () => controller.abort());
    }
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const supabase = supabaseConfiguration.configured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      global: {
        fetch: fetchWithTimeout,
      },
    })
  : null;

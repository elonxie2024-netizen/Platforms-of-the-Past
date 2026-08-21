"use strict";

(() => {
  const SUPABASE_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.min.js";
  let client = null;
  let initializePromise = null;
  let sdkPromise = null;
  const listeners = new Set();

  function loadSdk() {
    if (window.supabase?.createClient) return Promise.resolve(window.supabase);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = setTimeout(() => reject(new Error("Account service timed out.")), 8000);
      script.src = SUPABASE_SDK_URL;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", () => {
        clearTimeout(timeout);
        if (window.supabase?.createClient) resolve(window.supabase);
        else reject(new Error("Account service did not load."));
      }, { once: true });
      script.addEventListener("error", () => {
        clearTimeout(timeout);
        reject(new Error("Account service could not be reached."));
      }, { once: true });
      document.head.append(script);
    });
    return sdkPromise;
  }

  function notify(event, session) {
    for (const listener of listeners) listener(event, session);
  }

  function cleanDisplayName(value) {
    return String(value || "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 24);
  }

  function fallbackDisplayName(user) {
    return `Traveler-${String(user?.id || "player").slice(0, 6)}`;
  }

  function friendlyError(error) {
    const message = String(error?.message || error || "").toLowerCase();
    if (message.includes("invalid login credentials")) return "Email or password is incorrect.";
    if (message.includes("email not confirmed")) return "Verify your email before signing in.";
    if (message.includes("user already registered") || message.includes("already been registered")) return "An account already uses that email. Try signing in.";
    if (message.includes("password") && (message.includes("least") || message.includes("weak"))) return "Use a password with at least 6 characters.";
    if (message.includes("rate limit") || message.includes("too many")) return "Too many attempts. Wait a moment and try again.";
    if (message.includes("fetch") || message.includes("network") || message.includes("timed out") || message.includes("could not be reached")) return "Accounts are temporarily unavailable. You can keep playing as a guest.";
    if (message.includes("player_profiles") || message.includes("player_progress") || message.includes("schema cache")) return "Account database setup is incomplete. Guest play is still available.";
    return "That account request could not be completed. Please try again.";
  }

  async function initialize(url, publishableKey) {
    if (initializePromise) return initializePromise;
    initializePromise = (async () => {
      const sdk = await loadSdk();
      client = sdk.createClient(url, publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "platforms-past-auth-v1"
        }
      });
      client.auth.onAuthStateChange((event, session) => notify(event, session));
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      return data.session;
    })();
    return initializePromise;
  }

  function requireClient() {
    if (!client) throw new Error("Account service could not be reached.");
    return client;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  async function signUp(email, password, displayName, redirectTo) {
    const name = cleanDisplayName(displayName);
    if (!name) throw new Error("Choose a display name first.");
    const { data, error } = await requireClient().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: name }, emailRedirectTo: redirectTo }
    });
    if (error) throw error;
    return { ...data, needsVerification: !data.session };
  }

  async function signIn(email, password) {
    const { data, error } = await requireClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await requireClient().auth.signOut();
    if (error) throw error;
  }

  async function sendPasswordReset(email, redirectTo) {
    const { error } = await requireClient().auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) throw error;
  }

  async function updatePassword(password) {
    const { error } = await requireClient().auth.updateUser({ password });
    if (error) throw error;
  }

  async function loadOrCreateProfile(user, requestedName = "") {
    const database = requireClient();
    const { data, error } = await database
      .from("player_profiles")
      .select("user_id,display_name,created_at,updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
    const displayName = cleanDisplayName(requestedName || user.user_metadata?.display_name) || fallbackDisplayName(user);
    const { data: created, error: createError } = await database
      .from("player_profiles")
      .upsert({ user_id: user.id, display_name: displayName }, { onConflict: "user_id" })
      .select("user_id,display_name,created_at,updated_at")
      .single();
    if (createError) throw createError;
    return created;
  }

  async function updateProfile(userId, displayName) {
    const name = cleanDisplayName(displayName);
    if (!name) throw new Error("Choose a display name first.");
    const { data, error } = await requireClient()
      .from("player_profiles")
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select("user_id,display_name,created_at,updated_at")
      .single();
    if (error) throw error;
    return data;
  }

  async function loadProgress(userId) {
    const { data, error } = await requireClient()
      .from("player_progress")
      .select("user_id,highest_unlocked_level,completed_chapters,completed_gauntlets,menu_customization_unlocked,updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function saveProgress(userId, progress) {
    const { data, error } = await requireClient()
      .rpc("merge_player_progress", {
        p_highest_unlocked_level: progress.highest_unlocked_level,
        p_completed_chapters: progress.completed_chapters,
        p_completed_gauntlets: progress.completed_gauntlets,
        p_menu_customization_unlocked: progress.menu_customization_unlocked
      });
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }

  function accessToken() {
    return client?.auth ? client.auth.getSession().then(({ data }) => data.session?.access_token || "") : Promise.resolve("");
  }

  window.PlatformsAccount = {
    initialize,
    subscribe,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
    loadOrCreateProfile,
    updateProfile,
    loadProgress,
    saveProgress,
    accessToken,
    cleanDisplayName,
    friendlyError,
    isAvailable: () => Boolean(client)
  };
})();

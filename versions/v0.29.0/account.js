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

  function cleanUsername(value) {
    const username = String(value || "").trim().toLowerCase();
    return /^[a-z0-9][a-z0-9-]{2,23}$/.test(username) ? username : "";
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
    if (message.includes("duplicate key") && message.includes("username")) return "That username is already taken.";
    if (message.includes("at most 50 levels")) return "Your account already owns the maximum of 50 levels.";
    if (message.includes("could not share with that account")) return "Could not share with that account.";
    if (message.includes("custom_levels") || message.includes("custom_level_permissions") || message.includes("published_custom_levels")) return "Custom-level cloud setup is incomplete. Run the latest Supabase migration.";
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

  async function signUp(email, password, displayName, username, redirectTo) {
    const name = cleanDisplayName(displayName);
    if (!name) throw new Error("Choose a display name first.");
    const handle = cleanUsername(username);
    if (!handle) throw new Error("Choose a username using 3–24 lowercase letters, numbers, or hyphens.");
    const { data, error } = await requireClient().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: name, username: handle }, emailRedirectTo: redirectTo }
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
      .select("user_id,display_name,username,created_at,updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
    const displayName = cleanDisplayName(requestedName || user.user_metadata?.display_name) || fallbackDisplayName(user);
    const requestedUsername = cleanUsername(user.user_metadata?.username);
    const username = requestedUsername || `traveler-${String(user.id).replaceAll("-", "").slice(0, 15)}`;
    let { data: created, error: createError } = await database
      .from("player_profiles")
      .upsert({ user_id: user.id, display_name: displayName, username }, { onConflict: "user_id" })
      .select("user_id,display_name,username,created_at,updated_at")
      .single();
    if (createError?.code === "23505" && requestedUsername) {
      ({ data: created, error: createError } = await database
        .from("player_profiles")
        .upsert({ user_id: user.id, display_name: displayName, username: `traveler-${String(user.id).replaceAll("-", "").slice(0, 15)}` }, { onConflict: "user_id" })
        .select("user_id,display_name,username,created_at,updated_at")
        .single());
    }
    if (createError) throw createError;
    return created;
  }

  async function updateProfile(userId, displayName, username) {
    const name = cleanDisplayName(displayName);
    if (!name) throw new Error("Choose a display name first.");
    const handle = cleanUsername(username);
    if (!handle) throw new Error("Choose a username using 3–24 lowercase letters, numbers, or hyphens.");
    const { data, error } = await requireClient()
      .from("player_profiles")
      .update({ display_name: name, username: handle, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select("user_id,display_name,username,created_at,updated_at")
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

  async function loadCustomLevelWorkspace(userId) {
    const database = requireClient();
    const { data: levels, error: levelError } = await database
      .from("custom_levels")
      .select("id,owner_id,title,created_at,updated_at")
      .order("updated_at", { ascending: false });
    if (levelError) throw levelError;
    const levelIds = (levels || []).map(level => level.id);
    if (!levelIds.length) return [];
    const [{ data: permissions, error: permissionError }, { data: publications, error: publicationError }] = await Promise.all([
      database.from("custom_level_permissions").select("level_id,owner_id,user_id,role,created_at,updated_at").in("level_id", levelIds),
      database.from("published_custom_levels").select("level_id,version,published_at,updated_at").in("level_id", levelIds)
    ]);
    if (permissionError) throw permissionError;
    if (publicationError) throw publicationError;
    const profileIds = [...new Set([...(levels || []).map(level => level.owner_id), ...(permissions || []).map(permission => permission.user_id)])];
    const profiles = await loadPublicProfiles(profileIds);
    return (levels || []).map(level => ({
      ...level,
      role: level.owner_id === userId
        ? "owner"
        : permissions?.find(permission => permission.level_id === level.id && permission.user_id === userId)?.role || "viewer",
      ownerProfile: profiles.find(profile => profile.user_id === level.owner_id) || null,
      permissions: (permissions || []).filter(permission => permission.level_id === level.id).map(permission => ({
        ...permission, profile: profiles.find(profile => profile.user_id === permission.user_id) || null
      })),
      publication: (publications || []).find(publication => publication.level_id === level.id) || null
    }));
  }

  async function loadPublicProfiles(userIds) {
    if (!userIds?.length) return [];
    const { data, error } = await requireClient().from("player_profiles")
      .select("user_id,display_name,username").in("user_id", [...new Set(userIds)]);
    if (error) throw error;
    return data || [];
  }

  async function loadCustomLevelDraft(levelId) {
    const { data, error } = await requireClient().from("custom_levels")
      .select("id,owner_id,title,level_data,created_at,updated_at").eq("id", levelId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function createCustomLevel(userId, levelData) {
    const { data, error } = await requireClient().from("custom_levels")
      .insert({ owner_id: userId, title: levelData.name, level_data: levelData })
      .select("id,owner_id,title,level_data,created_at,updated_at")
      .single();
    if (error) throw error;
    return data;
  }

  async function updateCustomLevel(levelId, levelData, expectedUpdatedAt, overwrite = false) {
    let query = requireClient().from("custom_levels")
      .update({ title: levelData.name, level_data: levelData })
      .eq("id", levelId);
    if (!overwrite && expectedUpdatedAt) query = query.eq("updated_at", expectedUpdatedAt);
    const { data, error } = await query.select("id,owner_id,title,level_data,created_at,updated_at").maybeSingle();
    if (error) throw error;
    if (!data) { const conflict = new Error("This level changed elsewhere."); conflict.code = "POTP_CONFLICT"; throw conflict; }
    return data;
  }

  async function deleteCustomLevel(levelId) {
    const { error } = await requireClient().from("custom_levels").delete().eq("id", levelId);
    if (error) throw error;
  }

  async function grantCustomLevelAccess(levelId, username, role) {
    const { data, error } = await requireClient().rpc("grant_custom_level_access", {
      p_level_id: levelId,
      p_username: cleanUsername(username),
      p_role: role
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    const [profile] = row ? await loadPublicProfiles([row.user_id]) : [];
    return row ? { ...row, profile: profile || null } : row;
  }

  async function removeCustomLevelAccess(levelId, userId) {
    const { error } = await requireClient().rpc("remove_custom_level_access", { p_level_id: levelId, p_user_id: userId });
    if (error) throw error;
  }

  async function leaveCustomLevel(levelId) {
    const { error } = await requireClient().rpc("leave_custom_level", { p_level_id: levelId });
    if (error) throw error;
  }

  async function publishCustomLevel(levelId) {
    const { data, error } = await requireClient().rpc("publish_custom_level", { p_level_id: levelId });
    if (error) throw error;
    return data;
  }

  async function unpublishCustomLevel(levelId) {
    const { error } = await requireClient().rpc("unpublish_custom_level", { p_level_id: levelId });
    if (error) throw error;
  }

  async function loadPublishedCustomLevel(levelId) {
    const { data, error } = await requireClient().rpc("get_published_custom_level", { p_level_id: levelId });
    if (error) throw error;
    return Array.isArray(data) ? data[0] || null : data;
  }

  async function loadPublishedCustomLevelVersion(levelId, version) {
    const { data, error } = await requireClient().from("published_custom_level_versions")
      .select("level_id,version,level_data,published_at")
      .eq("level_id", levelId).eq("version", version).maybeSingle();
    if (error) throw error;
    return data;
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
    loadCustomLevelWorkspace,
    loadCustomLevelDraft,
    loadPublicProfiles,
    createCustomLevel,
    updateCustomLevel,
    deleteCustomLevel,
    grantCustomLevelAccess,
    removeCustomLevelAccess,
    leaveCustomLevel,
    publishCustomLevel,
    unpublishCustomLevel,
    loadPublishedCustomLevel,
    loadPublishedCustomLevelVersion,
    accessToken,
    cleanDisplayName,
    cleanUsername,
    friendlyError,
    isAvailable: () => Boolean(client)
  };
})();

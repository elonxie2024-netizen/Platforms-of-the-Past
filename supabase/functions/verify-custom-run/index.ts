import "../_shared/replay-validator.js";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function acceptsPublishableKey(request: Request) {
  const supplied = request.headers.get("apikey") || "";
  if (!supplied) return false;
  try {
    const configured = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
    if (Object.values(configured).includes(supplied)) return true;
  } catch { /* Fall through to legacy local-development key. */ }
  return supplied === Deno.env.get("SUPABASE_ANON_KEY");
}

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response({ error: "Method not allowed" }, 405);
  if (!acceptsPublishableKey(request)) return response({ error: "A valid publishable key is required" }, 401);

  try {
    const body = await request.json();
    const runId = String(body?.runId || "");
    if (!/^[a-f0-9-]{36}$/i.test(runId)) return response({ error: "Invalid run ID" }, 400);

    const service = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data: claimed, error: claimError } = await service.rpc("claim_custom_level_run_verification", { p_run_id: runId });
    if (claimError) throw claimError;
    if (!claimed) return response({ error: "Run is unavailable or already processed" }, 409);

    const validator = globalThis.PlatformsReplayValidator;
    if (!validator) throw new Error("Trusted replay validator did not load");
    const validation = validator.validateReplay({
      evidence: claimed.replayData,
      levelData: claimed.levelData,
      levelId: claimed.levelId,
      levelVersion: claimed.levelVersion,
      runTicket: claimed.runTicket,
      issuedAtMs: Date.parse(claimed.issuedAt),
      receivedAtMs: Date.parse(claimed.receivedAt)
    });
    const result = validation.ok
      ? { accepted: true, ...(validation.result || {}) }
      : { accepted: false, reason: validation.reason, verifierVersion: validator.VERIFIER_VERSION };
    const { data: finalized, error: finalizeError } = await service.rpc("finalize_custom_level_run_verification", {
      p_run_id: runId,
      p_validation_result: result
    });
    if (finalizeError) throw finalizeError;
    return response({ run: Array.isArray(finalized) ? finalized[0] : finalized });
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : String(error || "Trusted verification failed") }, 500);
  }
});

declare global {
  // Loaded by the side-effect import above so the same pure validator can be browser-tested.
  // deno-lint-ignore no-var
  var PlatformsReplayValidator: {
    VERIFIER_VERSION: string;
    validateReplay(input: Record<string, unknown>): { ok: boolean; reason?: string; result?: Record<string, unknown> };
  } | undefined;
}

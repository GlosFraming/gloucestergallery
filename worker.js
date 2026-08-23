/* ============================================================
   GLOUCESTER GALLERY — BACKEND WORKER  (Step 1)
   ------------------------------------------------------------
   Sits in front of the existing static site and adds:
     • live content        — GET /content.js is served from KV
                              (falls back to the committed file until
                               the first save)
     • the hosted editor    — /admin.html (login gates all writes)
     • password login       — POST /api/login  → session cookie
     • save content         — POST /api/content (auth) → KV
     • image uploads        — POST /api/image   (auth) → R2
     • image serving        — GET /images/*  → R2 first, else the
                              committed images in the repo

   Nothing here can change the site unless the caller has logged in
   with the ADMIN_PASSWORD secret. Reading content is public (it is
   public on the site anyway); only writes are gated.

   Bindings expected (see wrangler.toml):
     ASSETS         static assets (the repo files)
     GG_KV          KV namespace (content + sessions + uploaded images)
   Secret expected:
     ADMIN_PASSWORD the editor password (set with `wrangler secret put`
                    or in the dashboard — never committed)
   ============================================================ */

const SESSION_COOKIE = "gg_session";
const SESSION_TTL = 60 * 60 * 12; // 12 hours

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (path === "/api/login" && method === "POST") return await login(request, env);
      if (path === "/api/logout" && method === "POST") return await logout(request, env);
      if (path === "/api/session" && method === "GET") return json({ authed: await isAuthed(request, env) });

      if (path === "/api/content" && method === "GET") return await getContent(env);
      if (path === "/api/content" && method === "POST") return await requireAuth(request, env, () => saveContent(request, env));
      if (path === "/api/image" && method === "POST") return await requireAuth(request, env, () => uploadImage(request, env));

      if (path === "/content.js") return await contentJs(request, env);
      if (path.startsWith("/images/")) return await imageOrAsset(request, env, path);

      // everything else → the static site
      return env.ASSETS.fetch(request);
    } catch (err) {
      return json({ error: String(err && err.message || err) }, 500);
    }
  }
};

/* ---------- helpers ---------- */
function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extraHeaders }
  });
}
function parseCookies(request) {
  const h = request.headers.get("cookie") || "";
  const out = {};
  h.split(";").forEach(p => { const i = p.indexOf("="); if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return out;
}
async function isAuthed(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return false;
  const v = await env.GG_KV.get("sess:" + token);
  return v === "1";
}
async function requireAuth(request, env, fn) {
  if (!(await isAuthed(request, env))) return json({ error: "Not logged in" }, 401);
  return fn();
}

/* ---------- auth ---------- */
async function login(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const pw = (body && body.password) || "";
  const expected = env.ADMIN_PASSWORD || "";
  // constant-ish time compare
  if (!expected || pw.length !== expected.length || !timingSafeEqual(pw, expected)) {
    return json({ error: "Wrong password" }, 401);
  }
  const token = crypto.randomUUID();
  await env.GG_KV.put("sess:" + token, "1", { expirationTtl: SESSION_TTL });
  const cookie = `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}`;
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
async function logout(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (token) await env.GG_KV.delete("sess:" + token);
  const cookie = `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
function timingSafeEqual(a, b) {
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/* ---------- content ---------- */
async function getContent(env) {
  const raw = await env.GG_KV.get("content");
  if (!raw) return json({ empty: true });
  return new Response(raw, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
async function saveContent(request, env) {
  let data;
  try { data = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!data || typeof data !== "object" || !Array.isArray(data.artists)) {
    return json({ error: "Content must be an object with an artists array" }, 400);
  }
  await env.GG_KV.put("content", JSON.stringify(data));
  return json({ ok: true, savedAt: new Date().toISOString() });
}
async function contentJs(request, env) {
  const raw = await env.GG_KV.get("content");
  if (raw) {
    return new Response("window.GALLERY = " + raw + ";\n", {
      headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" }
    });
  }
  // no saved content yet → serve the committed content.js so the site still works
  return env.ASSETS.fetch(new Request(new URL("/content.js", request.url), request));
}

/* ---------- images ---------- */
async function uploadImage(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const dataURL = body && body.dataURL;
  if (!dataURL || !/^data:image\//.test(dataURL)) return json({ error: "Not an image" }, 400);
  const m = dataURL.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!m) return json({ error: "Bad image data" }, 400);
  const contentType = m[1];
  const bytes = base64ToBytes(m[2]);
  if (bytes.length > 20 * 1024 * 1024) return json({ error: "Image too large (max 20MB)" }, 413);
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const base = (body.baseName || "img").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "img";
  const key = `images/${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  // stored in KV (keeps setup simple — no R2 / no card needed)
  await env.GG_KV.put(key, bytes, { metadata: { ct: contentType } });
  return json({ ok: true, path: key });
}
async function imageOrAsset(request, env, path) {
  const key = path.replace(/^\//, "");
  const { value, metadata } = await env.GG_KV.getWithMetadata(key, { type: "arrayBuffer" });
  if (value) {
    return new Response(value, {
      headers: { "content-type": (metadata && metadata.ct) || "image/jpeg", "cache-control": "public, max-age=3600" }
    });
  }
  return env.ASSETS.fetch(request); // fall back to committed images
}
function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

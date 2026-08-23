/* ============================================================
   GLOUCESTER GALLERY — BACKEND WORKER  (Step 1 + Step 2)
   ------------------------------------------------------------
   Step 1: live content in KV, hosted owner editor at /admin,
           password login, image uploads (stored in KV).
   Step 2: per-artist private edit links (/edit), each artist
           can edit ONLY their own page; automatic version
           backups on every save (owner can restore); daily
           edit tracking for a future digest email.

   Bindings (see wrangler.toml):
     ASSETS   static assets (the repo files)
     GG_KV    KV namespace (content, sessions, images, versions)
   Secret:
     ADMIN_PASSWORD   the owner editor password
   ============================================================ */

const SESSION_COOKIE = "gg_session";
const SESSION_TTL = 60 * 60 * 12;            // owner: 12 hours
const ARTIST_COOKIE = "gg_artist_session";
const ARTIST_TTL = 60 * 60 * 24 * 30;        // artist: 30 days
const MAX_VERSIONS = 30;

// fields an artist is allowed to change on their own page (never id/status)
const ARTIST_FIELDS = ["name", "discipline", "tagline", "bio", "portrait", "launchDate", "launchNote"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    try {
      // ---- owner (admin) auth ----
      if (path === "/api/login" && method === "POST") return await login(request, env);
      if (path === "/api/logout" && method === "POST") return await logout(request, env);
      if (path === "/api/session" && method === "GET") return json({ authed: await isAuthed(request, env) });

      // ---- content (owner) ----
      if (path === "/api/content" && method === "GET") return await getContent(env);
      if (path === "/api/content" && method === "POST") return await requireAuth(request, env, () => saveContent(request, env));

      // ---- images (owner OR artist) ----
      if (path === "/api/image" && method === "POST") return await uploadImage(request, env);

      // ---- artist link management (owner) ----
      if (path === "/api/artist-link" && method === "POST") return await requireAuth(request, env, () => makeArtistLink(request, env));
      if (path === "/api/artist-links" && method === "GET") return await requireAuth(request, env, () => listArtistLinks(env));
      if (path === "/api/artist-revoke" && method === "POST") return await requireAuth(request, env, () => revokeArtistLink(request, env));

      // ---- backups / versions (owner) ----
      if (path === "/api/versions" && method === "GET") return await requireAuth(request, env, () => listVersions(env));
      if (path === "/api/restore" && method === "POST") return await requireAuth(request, env, () => restoreVersion(request, env));
      if (path === "/api/edits" && method === "GET") return await requireAuth(request, env, () => listEdits(request, env));

      // ---- artist self-serve ----
      if (path === "/api/artist-login" && method === "POST") return await artistLogin(request, env);
      if (path === "/api/artist-logout" && method === "POST") return await artistLogout(request, env);
      if (path === "/api/artist-session" && method === "GET") return await artistSessionInfo(request, env);
      if (path === "/api/artist-content" && method === "GET") return await getArtistContent(request, env);
      if (path === "/api/artist-content" && method === "POST") return await saveArtistContent(request, env);

      // ---- live content + images + static site ----
      if (path === "/content.js") return await contentJs(request, env);
      if (path.startsWith("/images/")) return await imageOrAsset(request, env, path);
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
async function loadContent(env) {
  const raw = await env.GG_KV.get("content");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/* ---------- owner auth ---------- */
async function isAuthed(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return false;
  return (await env.GG_KV.get("sess:" + token)) === "1";
}
async function requireAuth(request, env, fn) {
  if (!(await isAuthed(request, env))) return json({ error: "Not logged in" }, 401);
  return fn();
}
async function login(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const pw = (body && body.password) || "";
  const expected = env.ADMIN_PASSWORD || "";
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
  return json({ ok: true }, 200, { "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });
}
function timingSafeEqual(a, b) {
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/* ---------- artist auth ---------- */
async function getArtistId(request, env) {
  const sid = parseCookies(request)[ARTIST_COOKIE];
  if (!sid) return null;
  return await env.GG_KV.get("asess:" + sid);   // artistId or null
}
async function artistLogin(request, env) {
  let b;
  try { b = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const tok = (b && b.token || "").trim();
  if (!tok) return json({ error: "Missing link" }, 400);
  const artistId = await env.GG_KV.get("artok:" + tok);
  if (!artistId) return json({ error: "This editing link is not valid or has been replaced." }, 401);
  const sid = crypto.randomUUID();
  await env.GG_KV.put("asess:" + sid, artistId, { expirationTtl: ARTIST_TTL });
  const cookie = `${ARTIST_COOKIE}=${sid}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${ARTIST_TTL}`;
  return json({ ok: true, artistId }, 200, { "Set-Cookie": cookie });
}
async function artistLogout(request, env) {
  const sid = parseCookies(request)[ARTIST_COOKIE];
  if (sid) await env.GG_KV.delete("asess:" + sid);
  return json({ ok: true }, 200, { "Set-Cookie": `${ARTIST_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });
}
async function artistSessionInfo(request, env) {
  const id = await getArtistId(request, env);
  if (!id) return json({ authed: false });
  const c = await loadContent(env);
  const a = c && (c.artists || []).find(x => x.id === id);
  return json({ authed: true, artistId: id, name: a ? a.name : "" });
}

/* ---------- content (owner) ---------- */
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
  await snapshot(env, "owner");
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
  return env.ASSETS.fetch(new Request(new URL("/content.js", request.url), request));
}

/* ---------- content (artist, scoped) ---------- */
async function getArtistContent(request, env) {
  const id = await getArtistId(request, env);
  if (!id) return json({ error: "Not logged in" }, 401);
  const c = await loadContent(env);
  const a = c && (c.artists || []).find(x => x.id === id);
  if (!a) return json({ error: "Your page was not found." }, 404);
  return json({ artist: a });
}
async function saveArtistContent(request, env) {
  const id = await getArtistId(request, env);
  if (!id) return json({ error: "Not logged in" }, 401);
  let b;
  try { b = await request.json(); } catch { return json({ error: "Invalid data" }, 400); }
  const sub = b && b.artist;
  if (!sub || typeof sub !== "object") return json({ error: "Invalid data" }, 400);
  const c = await loadContent(env);
  if (!c || !Array.isArray(c.artists)) return json({ error: "Content not ready" }, 500);
  const idx = c.artists.findIndex(x => x.id === id);
  if (idx < 0) return json({ error: "Your page was not found." }, 404);

  await snapshot(env, "artist:" + id);        // back up the pre-change state

  const cur = c.artists[idx];
  for (const k of ARTIST_FIELDS) { if (k in sub) cur[k] = "" + (sub[k] == null ? "" : sub[k]); }
  if (Array.isArray(sub.works)) {
    cur.works = sub.works.map(w => ({
      title: "" + (w.title || ""), medium: "" + (w.medium || ""), size: "" + (w.size || ""),
      price: Number(w.price) || 0, available: w.available !== false, src: "" + (w.src || "")
    }));
  }
  // id and status are intentionally NOT taken from the submission
  c.artists[idx] = cur;
  await env.GG_KV.put("content", JSON.stringify(c));
  await trackEdit(env, id, cur.name);
  return json({ ok: true, savedAt: new Date().toISOString() });
}

/* ---------- images (owner OR artist) ---------- */
async function uploadImage(request, env) {
  const isOwner = await isAuthed(request, env);
  const artistId = isOwner ? null : await getArtistId(request, env);
  if (!isOwner && !artistId) return json({ error: "Not logged in" }, 401);
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
  return env.ASSETS.fetch(request);
}
function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* ---------- artist links (owner manages) ---------- */
async function makeArtistLink(request, env) {
  let b;
  try { b = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const id = (b && b.artistId || "").trim();
  if (!id) return json({ error: "Missing artistId" }, 400);
  const c = await loadContent(env);
  if (c && Array.isArray(c.artists) && !c.artists.some(a => a.id === id)) {
    return json({ error: "No artist with that id — save the artist first." }, 404);
  }
  let token = await env.GG_KV.get("artlink:" + id);
  if (token && b.regenerate) { await env.GG_KV.delete("artok:" + token); token = null; }
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2, 8);
    await env.GG_KV.put("artok:" + token, id);
    await env.GG_KV.put("artlink:" + id, token);
  }
  return json({ ok: true, artistId: id, token, path: "/edit#" + token });
}
async function listArtistLinks(env) {
  const out = {};
  const l = await env.GG_KV.list({ prefix: "artlink:" });
  for (const k of l.keys) {
    const id = k.name.slice("artlink:".length);
    const tok = await env.GG_KV.get(k.name);
    if (tok) out[id] = { token: tok, path: "/edit#" + tok };
  }
  return json({ links: out });
}
async function revokeArtistLink(request, env) {
  let b;
  try { b = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const id = (b && b.artistId || "").trim();
  const tok = await env.GG_KV.get("artlink:" + id);
  if (tok) await env.GG_KV.delete("artok:" + tok);
  await env.GG_KV.delete("artlink:" + id);
  return json({ ok: true });
}

/* ---------- version backups ---------- */
async function snapshot(env, who) {
  const cur = await env.GG_KV.get("content");
  if (!cur) return;
  const ts = Date.now();
  await env.GG_KV.put("ver:" + ts, cur);
  let idx = [];
  try { idx = JSON.parse(await env.GG_KV.get("verindex") || "[]"); } catch {}
  idx.unshift({ ts, who: who || "owner", at: new Date(ts).toISOString() });
  while (idx.length > MAX_VERSIONS) { const rm = idx.pop(); await env.GG_KV.delete("ver:" + rm.ts); }
  await env.GG_KV.put("verindex", JSON.stringify(idx));
}
async function listVersions(env) {
  let idx = [];
  try { idx = JSON.parse(await env.GG_KV.get("verindex") || "[]"); } catch {}
  return json({ versions: idx });
}
async function restoreVersion(request, env) {
  let b;
  try { b = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const ts = b && b.ts;
  const snap = await env.GG_KV.get("ver:" + ts);
  if (!snap) return json({ error: "That backup was not found." }, 404);
  await snapshot(env, "before-restore");
  await env.GG_KV.put("content", snap);
  return json({ ok: true });
}

/* ---------- edit tracking (for daily digest, Step 2b) ---------- */
async function trackEdit(env, id, name) {
  const day = new Date().toISOString().slice(0, 10);
  const key = "edits:" + day;
  let list = [];
  try { list = JSON.parse(await env.GG_KV.get(key) || "[]"); } catch {}
  const at = new Date().toISOString();
  const e = list.find(x => x.id === id);
  if (e) { e.at = at; e.count = (e.count || 1) + 1; }
  else list.push({ id, name, at, count: 1 });
  await env.GG_KV.put(key, JSON.stringify(list), { expirationTtl: 60 * 60 * 24 * 40 });
}
async function listEdits(request, env) {
  const url = new URL(request.url);
  const day = url.searchParams.get("day") || new Date().toISOString().slice(0, 10);
  let list = [];
  try { list = JSON.parse(await env.GG_KV.get("edits:" + day) || "[]"); } catch {}
  return json({ day, edits: list });
}

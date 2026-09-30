const BASE = "http://127.0.0.1:8000";
const token = () => localStorage.getItem("token");

async function req(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const res = await fetch(BASE + path, { ...opts, headers });

  // token expire aana mattum login ku anuppum
  if (res.status === 401 && path !== "/auth/login") {
    const e = await res.clone().json().catch(() => ({}));
    if (/token|expired|authenticated/i.test(String(e.detail || ""))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  }
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    const d = e.detail;
    const err = new Error(typeof d === "string" ? d : Array.isArray(d) ? d.map(x => x.msg).join(", ") : "Request failed");
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const rid = r => r.reservation_id ?? r.id;

export const api = {
  register: b => req("/auth/register", json("POST", b)),
  login: (username, password) =>
    req("/auth/login", { method: "POST", body: new URLSearchParams({ username, password }) }),

  offers: () => req("/offers/"),
  myOffers: () => req("/offers/my-offers"),
  createOffer: b => req("/offers/", json("POST", b)),
  updateOffer: (id, b) => req(`/offers/${id}`, json("PUT", b)),
  deleteOffer: id => req(`/offers/${id}`, { method: "DELETE" }),

  reserve: (offer_id, quantity) => req("/reservations/", json("POST", { offer_id, quantity })),
  myReservations: () => req("/reservations/my-reservations"),
  cancel: id => req(`/reservations/${id}/cancel`, { method: "PATCH" }),
  collect: id => req(`/reservations/${id}/collect`, { method: "PATCH" }),

  importCsv: file => {
    const f = new FormData();
    f.append("file", file);
    return req("/csv/offers", { method: "POST", body: f });
  },
  report: name => req(`/reports/${name}`),

  adminSummary: () => req("/admin/summary"),
  adminUsers: () => req("/admin/users"),
  // status endpoint path/method Swagger la irukkura maathiri illa na next combination try pannum
  async toggleUser(id) {
    let last;
    for (const p of ["status", "toggle", "toggle-status"]) {
      for (const m of ["PATCH", "PUT"]) {
        try { return await req(`/admin/users/${id}/${p}`, { method: m }); }
        catch (e) { last = e; if (e.status !== 404 && e.status !== 405) throw e; }
      }
    }
    throw last;
  },
};

export async function download(path, filename) {
  const res = await fetch(BASE + path, { headers: { Authorization: `Bearer ${token()}` } });
  if (!res.ok) throw new Error("Download failed");
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
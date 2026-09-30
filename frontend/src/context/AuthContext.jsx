import { createContext, useContext, useState } from "react";
import { api } from "../api";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

// role ku eththa home page
export const homeFor = role =>
  role === "food_owner" ? "/dashboard" : role === "admin" ? "/admin" : "/offers";

function decode(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  async function login(username, password) {
    const data = await api.login(username, password);
    localStorage.setItem("token", data.access_token);
    const p = decode(data.access_token);                 // { sub, role, exp }
    const u = { username: p.sub || username, role: p.role };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return u;
  }

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}
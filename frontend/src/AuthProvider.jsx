import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./useAuth";
import { loginRequest, registerRequest, meRequest } from "./api/auth";
import { setUnauthorizedHandler } from "./api/client";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const loading = !!token && !user;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    if (!token || user) return;

    let cancelled = false;
    meRequest(token)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) logout();
      });

    return () => {
      cancelled = true;
    };
  }, [token, user, logout]);

  async function login(username, password) {
    const data = await loginRequest(username, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(username, password) {
    await registerRequest(username, password);
    await login(username, password);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./useAuth";
import { loginRequest, registerRequest, meRequest } from "./api/auth";
import { normalizeToken, setUnauthorizedHandler } from "./api/client";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => normalizeToken(localStorage.getItem("token")));
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
    if (!data.token || !data.userId) {
      throw new Error("The login response did not contain a valid user ID and token");
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser({ id: data.userId, userId: data.userId, username: data.username });
  }

  async function register(username, password) {
    await registerRequest(username, password);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

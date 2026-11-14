import { useState } from "react";
import { useAuth } from "../AuthContext";
import "./AuthForm.css";

function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) return setError("Nazwa musi mieć min. 3 znaki");
    if (password.length < 8) return setError("Hasło musi mieć min. 8 znaków");

    setLoading(true);
    try {
      if (mode === "login") await login(username.trim(), password);
      else await register(username.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Logowanie" : "Rejestracja"}</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nazwa użytkownika"
        autoComplete="username"
        maxLength={30}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        maxLength={100}
      />

      {error && <p className="authError">{error}</p>}

      <button type="submit" className="authSubmit" disabled={loading}>
        {loading ? "..." : mode === "login" ? "Zaloguj" : "Zarejestruj"}
      </button>

      <button type="button" className="authSwitch" onClick={switchMode}>
        {mode === "login" ? "Nie masz konta? Zarejestruj się" : "Masz konto? Zaloguj się"}
      </button>
    </form>
  );
}

export default AuthForm;

import { useState } from "react";
import { useAuth } from "../useAuth.js";
import "./AuthForm.css";

function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (username.trim().length < 3) return setError("Nazwa musi mieć min. 3 znaki");
    if (username.trim().length > 20) return setError("Nazwa może mieć maks. 20 znaków");
    if (password.length < 8) return setError("Hasło musi mieć min. 8 znaków");
    if (password.length > 64) return setError("Hasło może mieć maks. 64 znaki");

    setLoading(true);
    try {
      if (mode === "login") await login(username.trim(), password);
      else {
        await register(username.trim(), password);
        setMode("login");
        setPassword("");
        setSuccess("Rejestracja zakończona. Zaloguj się.");
      }
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
        maxLength={20}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        maxLength={64}
      />

      {success && <p className="authSuccess">{success}</p>}
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

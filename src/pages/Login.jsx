import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AuthForm from "../components/AuthForm";
import "./Home.css";
import "./Login.css";

function Login() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="loginPage">
      <h1 className="homeTitle">KittyClicker</h1>
      <AuthForm />
    </div>
  );
}

export default Login;

import { Navigate } from "react-router-dom";
import { useAuth } from "../useAuth.js";
import "../pages/Home.css"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="techMessage">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;

// ProtectedRoute.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "./app/contexts/AuthContext";

const ProtectedRoute: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;

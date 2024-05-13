// hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export const useAuthRedirect = (): void => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!isAuthenticated && !router.pathname.includes("/login")) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
};

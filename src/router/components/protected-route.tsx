import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserToken, useUserActions } from "@/store/userStore";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { accessToken, expiresAt } = useUserToken();
  const { clearUserInfoAndToken } = useUserActions();
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (redirectingRef.current) return;

    if (!accessToken) {
      redirectingRef.current = true;
      navigate("/login", { replace: true });
      return;
    }

    if (expiresAt) {
      const expired = new Date(expiresAt) < new Date();
      if (expired) {
        redirectingRef.current = true;
        clearUserInfoAndToken();
        navigate("/login", { replace: true });
      }
    }
  }, [accessToken, expiresAt, clearUserInfoAndToken, navigate]);

  if (!accessToken) return null;
  return <>{children}</>;
}

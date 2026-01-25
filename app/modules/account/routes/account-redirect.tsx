// redirect to /is/account/general
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AccountRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/is/account/general", { replace: true });
  }, [navigate]);

  return null; // or a loading spinner if desired
}
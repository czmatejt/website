// redirect to /is/account/general
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function TrainerRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/is/trainer/overview", { replace: true });
  }, [navigate]);

  return null;
}
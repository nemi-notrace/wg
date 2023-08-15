import { useEffect } from "react";
import { useNavigate, useRouteLoaderData } from "@remix-run/react";

export default function Index() {
  const { user, hasHousehold } = useRouteLoaderData("root");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user", user);
    console.log("hasHousehold", hasHousehold);
    // Redirect based on conditions
    if (user && !hasHousehold) {
      navigate("/households", { replace: true }); // Replace with the correct route path
    } else if (!user) {
      navigate("/login", { replace: true }); // Replace with the correct route path
    } else if (user && hasHousehold) {
      navigate("/transactions", { replace: true }); // Replace with the correct route path
    }
  }, [user, hasHousehold, navigate]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {/* The components will be rendered based on the route now */}
    </div>
  );
}

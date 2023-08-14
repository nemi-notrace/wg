import { useEffect } from "react";
import { useNavigate, useRouteLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { user, hasHousehold } = useRouteLoaderData("root");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on conditions
    if (user && hasHousehold) {
      navigate("/households"); // Replace with the correct route path
    } else if (!user) {
      navigate("/login"); // Replace with the correct route path
    } else if (user && !hasHousehold) {
      navigate("/transactions"); // Replace with the correct route path
    }
  }, [user, hasHousehold, navigate]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {/* The components will be rendered based on the route now */}
    </div>
  );
}

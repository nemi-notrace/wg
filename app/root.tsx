import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { getUser } from "~/session.server";
import { userHasHousehold } from "~/models/userHousholds.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];
export const loader = async ({ request }: LoaderArgs) => {
  try {
    const user = await getUser(request);
    if (!user) {
      return json({ user: null, hasHousehold: false });
    }
    const hasHousehold = await userHasHousehold("user.id");

    return json({ user, hasHousehold });
  } catch (error) {
    console.error("Error fetching user:", error);
    return json({ user: null, hasHousehold: false });
  }
};
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

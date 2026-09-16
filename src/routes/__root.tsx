import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/site/Navbar";
import { Footer } from "../components/site/Footer";

function NotFoundComponent() {
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm"><div className="kicker justify-center">Air Arabia Virtual</div><h1 className="mt-5 text-6xl font-black tracking-tight">404</h1><h2 className="mt-3 text-xl font-bold">Page not found</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p><Link to="/" className="mt-6 inline-flex rounded-lg brand-gradient px-5 py-3 text-sm font-extrabold text-white">Back home</Link></div></div>;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm"><div className="kicker justify-center">Air Arabia Virtual</div><h1 className="mt-5 text-2xl font-black tracking-tight">This page didn't load</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Something went wrong. Try again or head back home.</p><div className="mt-6 flex justify-center gap-2"><button onClick={() => { router.invalidate(); reset(); }} className="rounded-lg brand-gradient px-5 py-3 text-sm font-extrabold text-white">Try again</button><a href="/" className="rounded-lg border border-border bg-white px-5 py-3 text-sm font-extrabold">Go home</a></div></div></div>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Air Arabia Virtual — Infinite Flight Virtual Airline" },
      { name: "description", content: "Air Arabia Virtual is an Infinite Flight virtual airline flying the Air Arabia network." },
      { property: "og:title", content: "Air Arabia Virtual" },
      { property: "og:description", content: "Fly the Air Arabia network in Infinite Flight." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><div className="flex min-h-screen flex-col"><Navbar /><main className="site-main flex-1"><Outlet /></main><Footer /></div></QueryClientProvider>;
}

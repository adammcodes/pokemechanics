import "@/styles/globals.css";
import Client from "app/Client";
import { cookies } from "next/headers";

export const metadata = {
  title: "Pokémechanics",
  description: "A Pokémon resource for the video game series",
  favicon: "/favicon.ico",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const game = cookieStore.get("game")?.value || "red-blue"; // Add game cookie

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
        ></script>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Pokémechanics" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Client initialGame={game}>{children}</Client>
      </body>
    </html>
  );
}

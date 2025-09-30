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
      <body>
        <Client initialGame={game}>{children}</Client>
      </body>
    </html>
  );
}

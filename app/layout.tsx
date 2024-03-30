import "@/styles/globals.css";
import Client from "app/Client";

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
  return (
    <html lang="en">
      <head>
        <script src="/set-theme.js" defer />
      </head>
      <body>
        <Client>{children}</Client>
      </body>
    </html>
  );
}

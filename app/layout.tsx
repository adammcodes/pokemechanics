import "@/styles/globals.css";
import Client from "app/Client";
import { cookies } from 'next/headers';

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
  const theme = cookieStore.get('theme')?.value || 'light'; // Default to 'light' if not set
  return (
    <html lang="en" data-theme={theme}>
      <body>
        <Client>{children}</Client>
      </body>
    </html>
  );
}

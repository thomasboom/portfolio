import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thomas Boom",
  description: "Developer - Building mobile apps & web tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "App donation",
  description: "Generated by appncy",
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="dark">
        {children}
      </body>
    </html>
  );
}

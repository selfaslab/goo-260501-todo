import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo",
  description: "Todo app — inbox, today, upcoming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full min-h-0 antialiased">
        <div className="flex h-full min-h-0 flex-col">{children}</div>
      </body>
    </html>
  );
}

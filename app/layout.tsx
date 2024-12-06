import type { Metadata } from "next";
import AuthProvider from "./contexts/AuthContext";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uni-Connect Ethiopia",
  description: "A social media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} flex flex-col min-h-[100vh] bg-[#262729]`}
      >
        <Toaster richColors />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

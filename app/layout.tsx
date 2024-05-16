import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
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
      <body className={`${inter.className} flex flex-col min-h-[100vh]`}>
        <div className="fixed top-0 left-0 right-0 z-50">
         <NavBar />
        </div>
        <main>{children}</main>
      
      </body>
    </html>
  );
}

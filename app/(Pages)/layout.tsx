import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../Components/Footer/Footer";
import NavBar from "../Components/NavBar/NavBar";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}> <NavBar/>
        {children}  <Footer /></body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/lib/providers";
import { AuthProvider } from "@/provider/AuthProvider";
import { Toaster } from "react-hot-toast";
import { Toaster as Sonner } from "sonner";
import "./globals.css";
import { RedirectComponent } from "./redirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elizabeth BD",
  description: "E-Commerce management admin website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Providers>
            <RedirectComponent>{children}</RedirectComponent>
          </Providers>
        </AuthProvider>
        <Toaster position="top-right" />
        <Sonner position="top-right" />
      </body>
    </html>
  );
}

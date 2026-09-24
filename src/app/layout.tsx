import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "Doctor Tracker — Admin Portal",
  description: "Secure administrative web portal to manage doctors and corresponding patients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-brand-softWhite text-brand-jetBlack">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "./components/reusables/Navbar";
import Footer from "./components/reusables/Footer";
import AuthNotifications from "./components/auth-notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NutriSync AI - Your AI-Powered Nutrition Assistant",
  description:
    "Track your meals, exercises, and health metrics with personalized AI insights. Achieve your fitness goals with NutriSync AI.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster position="top-right" richColors />
          <AuthNotifications />
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

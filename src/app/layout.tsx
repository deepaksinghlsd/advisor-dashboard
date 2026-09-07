import type { Metadata } from "next";
import { Fraunces, Geist, IBM_Plex_Mono } from "next/font/google";
import { Sidebar } from "@/components/dashboard/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Advisor Dashboard",
  description: "Advisor dashboard for tracking clients, AUM, and portfolio performance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${plexMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-screen w-full bg-[#f4f1ea]">
          <Sidebar />
          <main className="flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-5">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

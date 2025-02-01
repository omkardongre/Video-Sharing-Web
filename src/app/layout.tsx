import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import ReactQueryProvider from "@/react-query";
import { ReduxProvider } from "@/redux/provider";
import ThemeProviders from "@/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VS",
  description: "Share AI powered videos with your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProviders>
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
                <Toaster />
                {/* TODO : Remove this in production */}
                <ReactQueryDevtools initialIsOpen={false} />
              </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
